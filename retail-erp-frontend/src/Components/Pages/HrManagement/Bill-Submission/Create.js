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
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});
  const [authData, setAuthData] = useState([]);
  const [list, setList] = useState([{ date: "", desc: "", amount: "" }]);
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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["submitted_date"]: shortDate }));
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

  // Add More List
  const addMoreList = () => {
    setList([...list, { date: "", desc: "", amount: "" }]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
    const inputInfo = [...list]; // Load All Existing experience State Data
    inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
    setList(inputInfo); // Replace Existing experience into State
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.items = list;
      if (authData.user_type === "staff") {
        inputs.hr_staff_basic_info_id = authData.id;
      }
      Http.post("/bill-submission", inputs)
        .then((res) => {
          navigate("/billsubmission", {
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
          <h5 className="am-title">Create Bill Submission</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Bill Submission Form
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
                  <label className="font-weight-bold" htmlFor="">
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
                <label className="font-weight-bold">
                  Submitted Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="submitted_date"
                  value={inputs.submitted_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            {Array.from(list).map((x, i) => (
              <div className="row mt-3">
                <div className="col-md-3">
                  <label className="font-weight-bold">
                    Visiting Date <i className="fa fa-star required"></i>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={x.date || ""}
                    onChange={(e) => handleInputChange(e, i)}
                    data-required
                  />
                </div>
                <div className="col-md-5">
                  <label className="font-weight-bold">
                    Description or Purpose
                  </label>
                  <textarea
                    className="form-control"
                    name="desc"
                    value={x.desc || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="font-weight-bold">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={x.amount || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-md-1">
                  {list.length > 1 ? (
                    <button
                      className="btn btn-danger btn-sm mt-4"
                      onClick={() => removeList(i)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
            <div className="row mt-3">
              <div className="col-7"></div>
              <div className="col-2">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
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
