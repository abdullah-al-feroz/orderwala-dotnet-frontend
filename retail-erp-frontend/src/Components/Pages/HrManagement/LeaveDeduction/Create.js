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
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const getCurrentDateInput = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();

    setInputs((values) => ({ ...values, ["year"]: year }));
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
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);
  // End Default Load

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.post("/leave-deduction", inputs)
        .then((res) => {
          navigate("/leave-deduction", {
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
          <h5 className="am-title">Create Leave Deduction</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Leave Deduction Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
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
              <div className="col-lg">
                <label>
                  Year <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="year"
                  value={inputs.year || ""}
                  onChange={handleChange}
                  data-required
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
                  name="casual"
                  value={inputs.casual || ""}
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
                  name="sick"
                  value={inputs.sick || ""}
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
                  name="others"
                  value={inputs.others || ""}
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
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="earn"
                  value={inputs.earn || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Remarks <i className="fa fa-star required"></i>
                </label>
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
