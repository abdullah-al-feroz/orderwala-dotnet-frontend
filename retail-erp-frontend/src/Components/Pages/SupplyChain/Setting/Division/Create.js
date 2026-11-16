import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import useRequiredFields from "../../../../../hooks/useRequiredFields";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
  const { checkRequiredFields } = useRequiredFields();

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

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        name: inputs.name || "",
        createdAt: new Date().toISOString(),
        status: 1
      };

      HttpSupplyChain.post("/Division/Create", payload)
        .then((res) => {
          navigate("/division", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setApiError(e?.response?.data?.message || "Save failed. Please try again.");
        });
    }
  };
console.log("Inputs", inputs)
  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Division</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Division Form</h6>
            {apiError && (
              <div className="alert alert-danger mg-b-20">
                <i className="fa fa-exclamation-triangle mg-r-10"></i>
                {apiError}
              </div>
            )}
            <div className="row">
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
        </div>
      </div>
    </div>
  );
};

export default Create;