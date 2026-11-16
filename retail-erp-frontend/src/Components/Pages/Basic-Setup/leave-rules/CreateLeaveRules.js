import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const CreateLeaveRules = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [department, setDepartment] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["earn_eligable_date"]: shortDate }));
  };

  // Default Load
  const fetchData = () => {
    // Http.get("/department").then((res) => {
    //   setDepartment(res.data);
    // });
    Http.get("/department2").then((res) => {
      setDepartment(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);
  // End Default Load

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.post("/leave-rules", inputs)
        .then((res) => {
          navigate("/leave-rules", {
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
          <h5 className="am-title">Create Leave Rules</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Leave Rules Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Department <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={department[0]}
                  name="department_id"
                  options={department}
                  onChange={selectHandleChange}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="casual">Casual</option>
                </select>
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="casual_total_days"
                  value={inputs.casual_total_days || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="sick">Sick</option>
                </select>
              </div>

              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="sick_total_days"
                  value={inputs.sick_total_days || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="others_total_days"
                  value={inputs.others_total_days || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="earn">Earn</option>
                </select>
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">Eligable Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Start Date"
                  name="earn_eligable_date"
                  value={inputs.earn_eligable_date || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="earn_total_days"
                  value={inputs.earn_total_days || ""}
                  onChange={handleChange}
                  data-required
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

export default CreateLeaveRules;
