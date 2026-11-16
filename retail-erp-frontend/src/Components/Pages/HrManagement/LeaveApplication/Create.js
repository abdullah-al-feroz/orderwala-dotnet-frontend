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
  const [inputs, setInputs] = useState({});
  const [leaveRule, setLeaveRule] = useState({});
  const [authData, setAuthData] = useState([]);
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  const { checkRequiredFields } = useRequiredFields();

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["application_date"]: shortDate }));
    setInputs((values) => ({ ...values, ["start_date"]: shortDate }));
    setInputs((values) => ({ ...values, ["end_date"]: shortDate }));
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    Http.get("/staff-leave-rule/" + value).then((res) => {
      setLeaveRule(res.data);
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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

    // const loaderData = async () => {
    //   setIsLoading(true);
    //   await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a 2-second delay
    //   setIsLoading(false);
    // };

    // loaderData();
  }, []);
  // End Default Load

  const formSubmit = () => {
    if (checkRequiredFields()) {
      if (authData.user_type === "staff") {
        inputs.hr_staff_basic_info_id = authData.id;
      }
      Http.post("/leave-application", inputs)
        .then((res) => {
          navigate("/leave-application", {
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
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Leave Application</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Leave Application Form
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
                    Staff <i class="fa fa-star required"></i>
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
                  Applicaiton Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="application_date"
                  value={inputs.application_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Start Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={inputs.start_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  End Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={inputs.end_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Total Days <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="total_days"
                  value={inputs.total_days || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Leave Type <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="leave_type"
                  onChange={handleChange}
                >
                  <option value="">Select Leave Type</option>
                  <option value="casual">Casual</option>
                  <option value="sick">Sick</option>
                  <option value="earn">Earn</option>
                  {/* <option value="anual">Anual</option>
                  <option value="others">Others</option>
                  <option value="special">Special</option>
                  <option value="unpaid">Unpaid</option> */}
                </select>
              </div>
              <div className="col-lg">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-lg">
                <label htmlFor="">
                  Leave Rule <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="hr_leave_rule_id"
                  onChange={handleChange}
                >
                  <option value="">Select Leave Rule</option>
                  {Array.from(leaveRule).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name + " - " + item.total_days}
                    </option>
                  ))}
                </select>
              </div> */}
              {/* <div className="col-lg">
                <label>
                  Status <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div> */}
              {/* <div className="col-lg">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                  placeholder="Remarks"
                />
              </div> */}
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
