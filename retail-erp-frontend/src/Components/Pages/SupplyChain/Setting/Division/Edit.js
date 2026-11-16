import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import FormValidation from "../../../../Common/FormValidation";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const divisionId = parseInt(id);
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");

  const fetchData = () => {
    HttpSupplyChain.get("/Division/GetById/" + divisionId).then((res) => {
      setInputs({
        name: res.data.data.name,
        status: res.data.data.status === 1 ? "active" : "inactive",
        code: res.data.data.code
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    const payload = {
      id: divisionId,
      name: inputs.name,
      status: inputs.status === "active" ? 1 : 0,
      code: inputs.code
    };

    HttpSupplyChain.put("/Division/Update/" + divisionId, payload)
      .then((res) => {
        navigate("/division", {
          state: { message: res.data.message, type: "success" }
        });
      })
      .catch(function (e) {
        setApiError(e?.response?.data?.message || "Update failed. Please try again.");
      });
  };

  console.log("inputs", inputs)

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Division</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Division Form</h6>
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