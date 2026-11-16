import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [department, setDepartment] = useState({});
  const [designation, setDesignation] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  // Default Load
  const fetchData = () => {
    // Http.get("/department").then((res) => {
    //   setDepartment(res.data);
    // });
    // Http.get("/designation").then((res) => {
    //   setDesignation(res.data);
    // });

    Http.get("/department2").then((res) => {
      setDepartment(res.data);
    });

    Http.get("/designationSelect2").then((res) => {
      setDesignation(res.data);
    });
  };
  useEffect(() => {
    fetchData();
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
      inputs.created_by = 1;
      Http.post("/requisition", inputs)
        .then((res) => {
          navigate("/requisition", {
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
          <h5 className="am-title">Create Requisition</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Requisition Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Vacancy <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="vacancy"
                  value={inputs.vacancy || ""}
                  onChange={handleChange}
                  placeholder="Input Vacancy"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Experience Requirements{" "}
                  <i className="fa fa-star required"></i>
                </label>
                <textarea
                  className="form-control"
                  name="experience_requirements"
                  value={inputs.experience_requirements || ""}
                  onChange={handleChange}
                  placeholder="Experience Requirements"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Job Title<i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="job_title"
                  value={inputs.job_title || ""}
                  onChange={handleChange}
                  placeholder="Input Job Title"
                  data-required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Job Context<i className="fa fa-star required"></i>
                </label>
                <textarea
                  className="form-control"
                  name="job_context"
                  value={inputs.job_context || ""}
                  onChange={handleChange}
                  placeholder="Enter Job Context"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Job Description<i className="fa fa-star required"></i>
                </label>
                <textarea
                  className="form-control"
                  name="job_description"
                  value={inputs.job_description || ""}
                  onChange={handleChange}
                  placeholder="Enter Job Description"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>Employment Status</label>
                <textarea
                  className="form-control"
                  name="employment_status"
                  value={inputs.employment_status || ""}
                  onChange={handleChange}
                  placeholder="Enter Employment Status"
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Last Date of Application</label>
                <input
                  type="date"
                  className="form-control"
                  name="last_date_of_application"
                  value={inputs.last_date_of_application || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Department<i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={department[0]}
                  name="department_id"
                  options={department}
                  onChange={selectHandleChange}
                />

                {/* <select
                  className="form-control"
                  name="department_id"
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {Array.from(department).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Designation<i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={designation[0]}
                  name="designation_id"
                  options={designation}
                  onChange={selectHandleChange}
                />

                {/* <select
                  className="form-control"
                  name="designation_id"
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {Array.from(designation).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Salary Range<i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="salary_range"
                  value={inputs.salary_range || ""}
                  onChange={handleChange}
                  placeholder="Input Salary Range"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Key Skills<i className="fa fa-star required"></i>
                </label>
                <textarea
                  className="form-control"
                  name="key_skills"
                  value={inputs.key_skills || ""}
                  onChange={handleChange}
                  placeholder="Input Key Skills"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Candidate Need to be join Date
                  <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="candidate_need_to_be_join_date"
                  value={inputs.candidate_need_to_be_join_date || ""}
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

export default Create;
