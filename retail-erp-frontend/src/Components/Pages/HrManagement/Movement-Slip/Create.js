import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const CreateRegion = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ type: "official" });
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});
  const [authData, setAuthData] = useState([]);
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };

  // Default Load
  const fetchData = () => {
    Http.get("/staff2").then((res) => {
      setStaff(res.data);
    });
    Http.get("/login-staff-detail").then((res) => {
      setAuthData(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);
  // End Default Load

  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.status = "active";
      if (authData.user_type === "staff") {
        inputs.hr_staff_basic_info_id = authData.id;
      }
      Http.post("/movement-slip", inputs)
        .then((res) => {
          navigate("/movement-slip", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Movement Slip</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Movement Slip Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              {(authData.user_type === "admin" ||
                authData.user_type === "hr") && (
                <div className="col-lg">
                  <label htmlFor="">
                    Staff <i className="fa fa-star required"></i>
                  </label>

                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="hr_staff_basic_info_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div>
              )}
              <div className="col-lg">
                <label>
                  Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Start Time <i className="fa fa-star required"></i>
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="start_time"
                  value={inputs.start_time || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  End Time <i className="fa fa-star required"></i>
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="end_time"
                  value={inputs.end_time || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Type</label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                >
                  <option
                    value="official"
                    selected={inputs.status === "official" ? true : false}
                  >
                    Official
                  </option>
                  <option
                    value="personal"
                    selected={inputs.status === "personal" ? true : false}
                  >
                    Personal
                  </option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                />
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

export default CreateRegion;
