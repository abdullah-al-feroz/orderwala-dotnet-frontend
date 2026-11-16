import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const AddRoute = (props) => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [inputs, setInputs] = useState({});
  const [route, setRoute] = useState({});
  const [error, setError] = useState({});
  const [planType, setPlanType] = useState("");
  const [list, setList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]); // State for selected options

  const fetchData = () => {
    Http.get("/staff-route-plan-on-base/" + id + "?type=" + type)
      .then((res) => {
        if (res.data && Object.keys(res.data).length !== 0) {
          setPlanType(res.data.type);

          setInputs({
            type: res.data.type,
          });

          // Map the fetched routes to the format required by Select
          const fetchedRoutes = res.data.routes.map((route) => ({
            value: route.id,
            label: route.name,
          }));
          setSelectedOptions(fetchedRoutes);

          // Update list state with the route IDs
          const routeIds = res.data.routes.map((route) => route.id);
          setList(routeIds);
        } else {
          // Set default or empty values if no data is returned
          setPlanType("");
          setSelectedOptions([]);
          setList([]);
        }
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error fetching route plan data:", error);
        setPlanType("");
        setSelectedOptions([]);
        setList([]);
      });

    // Fetch other data as required
    Http.get("/get-route-user-on-base/" + id)
      .then((res) => {
        setRoute(res.data || []); // Fallback to an empty array if no data
      })
      .catch((error) => {
        // Handle errors for this request
        console.error("Error fetching route user data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const selectHandleRouteChange = (selectedOption, index) => {
    // Update both the list and selectedOptions states
    const inputInfo = [...list];
    const updatedSelectedOptions = [...selectedOptions];

    inputInfo[index] = selectedOption.value;
    updatedSelectedOptions[index] = selectedOption;

    setList(inputInfo);
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((values) => ({ ...values, [name]: value }));

    if (name === "type") {
      setPlanType(value);
    }
  };

  const formSubmit = () => {
    const count = planType === "weekly" ? 7 : planType === "cyclic" ? 30 : 0;
    inputs.base_id = id;
    inputs.number_of_days = count;
    inputs.items = list;
    inputs.type_for = type;

    Http.post("/staff-route-plan-on-base", inputs)
      .then((res) => {
        navigate("/base", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const renderRoutes = () => {
    const count = planType === "weekly" ? 7 : planType === "cyclic" ? 30 : 0;
    return Array.from({ length: count }, (_, index) => (
      <div key={index} className="col-lg-6 mb-3">
        <label>
          Route - {index + 1} <i className="fa fa-star required"></i>
        </label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="route_id"
          options={route}
          value={selectedOptions[index]}
          onChange={(option) => selectHandleRouteChange(option, index)}
        />
      </div>
    ));
  };

  return (
    <div>
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
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="">
                  Plan Type <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                >
                  <option value="">Plan Type</option>
                  <option
                    value="weekly"
                    selected={planType === "weekly" ? true : false}
                  >
                    Weekly
                  </option>
                  <option
                    value="cyclic"
                    selected={planType === "cyclic" ? true : false}
                  >
                    Monthly
                  </option>
                </select>
              </div>
              {/* <div className="col-lg-6">
                <label htmlFor="">
                  Plan For <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="for"
                  onChange={handleChange}
                >
                  <option value="">Plan For</option>
                  <option
                    value="mdo"
                    selected={planFor === "mdo" ? true : false}
                  >
                    MDO
                  </option>
                  <option
                    value="dsr"
                    selected={planFor === "dsr" ? true : false}
                  >
                    DSR
                  </option>
                </select>
              </div> */}
            </div>
            <div className="row mt-5">
              <div className="col-lg-12">
                <h6 className="card-body-title mg-sm-b-10 text-center">
                  Route
                </h6>
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
                >
                  <i className="fa fa-send mg-r-10"></i> Update
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

export default AddRoute;
