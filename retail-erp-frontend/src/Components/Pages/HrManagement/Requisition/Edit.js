import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";

const EditRegion = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [department, setDepartment] = useState({});
  const [designation, setDesignation] = useState({});
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/requisition/" + id + "/edit").then((res) => {
      setInputs({
        vacancy: res.data.vacancy,
        experience_requirements: res.data.experience_requirements,
        job_title: res.data.job_title,
        job_context: res.data.job_context,
        job_description: res.data.job_description,
        employment_status: res.data.employment_status,
        last_date_of_application: res.data.last_date_of_application,
        department_id: res.data.department_id,
        designation_id: res.data.designation_id,
        salary_range: res.data.salary_range,
        key_skills: res.data.key_skills,
        candidate_need_to_be_join_date: res.data.candidate_need_to_be_join_date,
      });
    });

    Http.get("/department").then((res) => {
      setDepartment(res.data);
    });
    Http.get("/designation").then((res) => {
      setDesignation(res.data);
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
    Http.put("/requisition/" + id, inputs)
      .then((res) => {
        navigate("/requisition", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Requisition</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Requisition Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>Vacancy</label>
                <input
                  type="text"
                  className="form-control"
                  name="vacancy"
                  value={inputs.vacancy || ""}
                  onChange={handleChange}
                  placeholder="Input Vacancy"
                />
              </div>
              <div className="col-lg">
                <label>Experience Requirements</label>
                <textarea
                  className="form-control"
                  name="experience_requirements"
                  value={inputs.experience_requirements || ""}
                  onChange={handleChange}
                  placeholder="experience_requirements"
                />
              </div>
              <div className="col-lg">
                <label>Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="job_title"
                  value={inputs.job_title || ""}
                  onChange={handleChange}
                  placeholder="Input Job Title"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>Job Context</label>
                <textarea
                  className="form-control"
                  name="job_context"
                  value={inputs.job_context || ""}
                  onChange={handleChange}
                  placeholder="Enter Job Context"
                />
              </div>
              <div className="col-lg">
                <label>Job Description</label>
                <textarea
                  className="form-control"
                  name="job_description"
                  value={inputs.job_description || ""}
                  onChange={handleChange}
                  placeholder="Enter Job Description"
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
                <label htmlFor="">Department</label>
                <select
                  className="form-control"
                  name="department_id"
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {Array.from(department).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={inputs.department_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">Designation</label>
                <select
                  className="form-control"
                  name="designation_id"
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {Array.from(designation).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.designation_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Salary Range</label>
                <input
                  type="text"
                  className="form-control"
                  name="salary_range"
                  value={inputs.salary_range || ""}
                  onChange={handleChange}
                  placeholder="Input Salary Range"
                />
              </div>
              <div className="col-lg">
                <label>Key Skills</label>
                <textarea
                  className="form-control"
                  name="key_skills"
                  value={inputs.key_skills || ""}
                  onChange={handleChange}
                  placeholder="Input Key Skills"
                />
              </div>
              <div className="col-lg">
                <label>Candidate Need to be join Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="candidate_need_to_be_join_date"
                  value={inputs.candidate_need_to_be_join_date || ""}
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
                  <i className="fa fa-send mg-r-10"></i> Update
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

export default EditRegion;
