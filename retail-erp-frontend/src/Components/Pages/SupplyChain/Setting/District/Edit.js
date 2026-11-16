import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const districtId = parseInt(id);
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [search, setSearch] = useState("");
  const timerRef = useRef(null);
  const { checkRequiredFields } = useRequiredFields();

  const divisionOptions = divisions.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const fetchData = () => {
    HttpSupplyChain.get("/District/GetById/" + districtId).then((res) => {
      const d = res?.data?.data || {};
      setInputs({
        division_id: String(d.divisionId || ""),
        name: d.name,
        status: d.status === 1 ? "active" : "inactive",
        code: d.code
      });
      if (d.division && d.division.id) {
        setSelectedDivision({
          value: String(d.division.id),
          label: d.division.name,
        });
      }
    });
    fetchDivisions("");
  };

  const fetchDivisions = (filter) => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Division/paginated?Page=1&PageSize=1000&Status=1${filterParam}`)
      .then((res) => {
        setDivisions(res?.data?.data || []);
      })
      .catch((e) => {
        setError(e?.response?.data?.message || "Failed to load divisions");
      });
  };

  const handleDivisionInputChange = (inputValue, actionMeta) => {
    if (actionMeta && actionMeta.action !== "input-change") return;
    setSearch(inputValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchDivisions(inputValue);
    }, 300);
  };

  const handleDivisionChange = (selected) => {
    const val = selected ? String(selected.value) : "";
    setInputs((values) => ({ ...values, division_id: val }));
    setSelectedDivision(selected);
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        divisionId: parseInt(inputs.division_id),
        name: inputs.name || "",
        code: inputs.code || "",
        status: typeof inputs.status === "number" ? inputs.status : inputs.status === "active" ? 1 : 0,
        id: districtId,
        updatedAt: new Date().toISOString(),
      };

      HttpSupplyChain.put("/District/Update/" + districtId, payload)
        .then((res) => {
          navigate("/district", {
            state: { message: res?.data?.message, type: "success" },
          });
        })
        .catch(function (e) {
          setApiError(e?.response?.data?.message || "Update failed. Please try again.");
        });
    }
  };

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create District</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit District Form</h6>
            {apiError && (
              <div className="alert alert-danger mg-b-20">
                <i className="fa fa-exclamation-triangle mg-r-10"></i>
                {apiError}
              </div>
            )}
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Division <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="division_id"
                  placeholder="Search and select division..."
                  isClearable
                  isSearchable
                  onInputChange={handleDivisionInputChange}
                  onChange={handleDivisionChange}
                  options={divisionOptions}
                  value={selectedDivision}
                />
              </div>
              <div className="col-lg">
                <label>
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Status <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  onChange={handleChange}
                >
                  <option
                    value="active"
                    selected={inputs.status === "active" ? true : false}
                  >
                    Active
                  </option>
                  <option
                    value="inactive"
                    selected={inputs.status === "inactive" ? true : false}
                  >
                    Inactive
                  </option>
                </select>
              </div>
            </div>

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
        </div>
      </div>
    </div>
  );
};

export default Edit;