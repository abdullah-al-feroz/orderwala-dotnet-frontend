import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import HttpSupplyChain from "../../../Common/HttpSupplyChain";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
// import { useAuth } from "../../../Common/AuthContext";

// RoutePlanType enum on the .NET side (RoutePlanType.Weekly = 1, Cyclic = 2).
// The API has no JsonStringEnumConverter, so the numeric value has to be posted.
const PLAN_TYPE = {
  WEEKLY: 1,
  CYCLIC: 2,
};

// Weekly shows 7 slots, Monthly (cyclic) shows 31.
// The PHP page rendered 31 slots but posted number_of_days = 30; both are 31 here
// so the submitted day count always matches what is on screen.
const SLOT_COUNT = {
  [PLAN_TYPE.WEEKLY]: 7,
  [PLAN_TYPE.CYCLIC]: 31,
};

const PLAN_TYPE_OPTIONS = [
  { value: PLAN_TYPE.WEEKLY, label: "Weekly" },
  { value: PLAN_TYPE.CYCLIC, label: "Monthly" },
];

const CreateRoutePlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { me } = useAuth();

  const [planType, setPlanType] = useState("");
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [me, setMe] = useState(null);

  // The API requires CreatedBy, which comes from the signed-in user, so the form stays
  // inert until /me has resolved.
  const createdBy = Number(me?.id) || 0;

  const slotCount = planType ? SLOT_COUNT[planType] : 0;

  // Route_Has_Route_Plans is unique on (RouteId, RoutePlanId) in both databases, so the
  // same route cannot sit in two slots of one plan. Already-used routes are hidden from
  // the other slots to stop that at the source.
  // const optionsForSlot = (index) =>
  //   routeOptions.filter(
  //     (option) =>
  //       !selectedOptions.some(
  //         (selected, i) => i !== index && selected && selected.value === option.value
  //       )
  //   );

  const fetchData = () => {

    Http.get("/me")
      .then((res) => {
        setMe(res.data?.data ?? null);
      })
      .catch((error) => {
        console.error("Error fetching signed-in user:", error);
        setMe(null);
      });

    // Route options come from the staff member's workplace via the gRPC staff lookup.
    HttpSupplyChain.get(`/RoutePlan/GetRouteUser/${id}`)
      .then((res) => setRouteOptions(res.data?.data || []))
      .catch((e) => {
        console.error("Error fetching route options:", e);
        setError(e.response?.data?.message || "Could not load routes for this staff member.");
      });

    // 404 simply means the staff has no plan yet, which is the normal first-run case.
    HttpSupplyChain.get(`/RoutePlan/GetByUserId/${id}`)
      .then((res) => {
        const plan = res.data?.data;
        if (!plan) return;

        setPlanType(plan.type);

        const existing = [...(plan.routeHasRoutePlans || [])]
          .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
          .map((rhrp) => ({
            value: rhrp.routeId,
            label: rhrp.route?.name || `Route #${rhrp.routeId}`,
          }));

        setSelectedOptions(existing);
      })
      .catch((e) => {
        if (e.response?.status !== 404) {
          console.error("Error fetching route plan:", e);
          setError(e.response?.data?.message || "Could not load the existing route plan.");
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRouteChange = (selectedOption, index) => {
    setError(null);
    setSelectedOptions((prev) => {
      const next = [...prev];
      // Clearing a slot has to null the entry rather than leave a hole, otherwise the
      // positional mapping sent to the API would drift.
      next[index] = selectedOption || null;
      return next;
    });
  };

  const handlePlanTypeChange = (selectedOption) => {
    setError(null);
    const nextType = selectedOption ? selectedOption.value : "";
    setPlanType(nextType);

    // Slots are positional, so shrinking the plan has to drop the routes that no
    // longer fit rather than leave stale entries behind.
    const nextCount = nextType ? SLOT_COUNT[nextType] : 0;
    setSelectedOptions((prev) => prev.slice(0, nextCount).map((slot) => slot ?? null));
  };

  const formSubmit = () => {
    if (!planType) {
      setError("Plan Type is required.");
      return;
    }

    if (!createdBy) {
      setError("Signed-in user could not be resolved. Please reload the page.");
      return;
    }

    const items = selectedOptions.slice(0, slotCount);

    if (items.length !== slotCount || items.some((option) => !option)) {
      setError(`Please select a route for all ${slotCount} slots.`);
      return;
    }

    // const routeIds = items.map((option) => option.value);

    // if (new Set(routeIds).size !== routeIds.length) {
    //   setError("The same route cannot be used in more than one slot.");
    //   return;
    // }
    const routeIds = items.map((option) => option.value);

    setSubmitting(true);
    setError(null);

    HttpSupplyChain.post("/RoutePlan/Create", {
      UserId: Number(id),
      Type: planType,
      NumberOfDays: slotCount,
      CreatedBy: createdBy,
      Items: routeIds,
    })
      .then((res) => {
        navigate("/staff", {
          state: { message: res.data?.message, type: "success" },
        });
      })
      .catch((e) => {
        setSubmitting(false);
        setError(e.response?.data?.message || "Route plan could not be saved.");
      });
  };

  const renderRoutes = () =>
    Array.from({ length: slotCount }, (_, index) => (
      <div key={index} className="col-lg-6 mb-3">
        <label>
          Route - {index + 1} <i className="fa fa-star required"></i>
        </label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="route_id"
          options={routeOptions}
          value={selectedOptions[index] || null}
          onChange={(option) => handleRouteChange(option, index)}
          isClearable
          placeholder="Select Route"
        />
      </div>
    ));

  return (
    <div>
      {/* <IsLogin /> */}
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Add Route Plan</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Add Route Plan</h6>
            <div className="row">
              <div className="col-lg">
                {/* FormValidation expects an object of message arrays; this page
                    keeps a single string (or null), so wrap it before passing. */}
                <FormValidation error={error ? { error: [error] } : {}} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <label htmlFor="">
                  Plan Type <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="type"
                  options={PLAN_TYPE_OPTIONS}
                  value={PLAN_TYPE_OPTIONS.find((o) => o.value === planType) || null}
                  onChange={handlePlanTypeChange}
                  placeholder="Plan Type"
                />
              </div>
              <div className="col-lg-8"></div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-12">
                <h6 className="card-body-title mg-sm-b-10 text-center">Route</h6>
              </div>
              <div className="col-lg-12">
                <hr></hr>
              </div>
            </div>
            <div className="row mt-5">{renderRoutes()}</div>

            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                  disabled={submitting || !createdBy}
                >
                  <i className="fa fa-send mg-r-10"></i> {submitting ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default CreateRoutePlan;