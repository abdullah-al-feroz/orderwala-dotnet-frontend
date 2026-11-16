import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
  const timerRef = useRef(null);
  const [division, setDivision] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const { checkRequiredFields } = useRequiredFields();

  const divisionOptions = division.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchDivisions = (filter = "") => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Division/paginated?Page=1&PageSize=10&Status=1${filterParam}`)
      .then((res) => {
        setDivision(res?.data?.data || []);
      })
      .catch(function (e) {
        setError(e?.response?.data?.message || "Failed to load divisions");
      });
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const handleDivisionInputChange = (inputValue, actionMeta) => {
    if (actionMeta && actionMeta.action !== "input-change") return;
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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const formSubmit = () => {
    if (checkRequiredFields()) {

      const payload = {
        divisionId: parseInt(inputs?.division_id),
        name: inputs?.name || "",
        createdAt: new Date().toISOString(),
        status: 1
      };

      HttpSupplyChain.post("/District/Create", payload)
        .then((res) => {
          navigate("/district", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setApiError(e?.response?.data?.message || "Save failed. Please try again.");
        });
    }
  };
  
  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create District</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create District Form</h6>
            {apiError && (
              <div className="alert alert-danger mg-b-20">
                <i className="fa fa-exclamation-triangle mg-r-10"></i>
                {apiError}
              </div>
            )}
            <div className="row">
              <div className="col-lg">
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
                  data-required
                />
                {displayError("name")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Create
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

export default Create;