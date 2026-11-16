import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const CreateRegion = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [requisition, setRequisition] = useState({});
  const [error, setError] = useState({});
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
  };
  // Default Load
  const fetchData = () => {
    Http.get("/requisition").then((res) => {
      setRequisition(res.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // End Default Load

  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.status = "applied";
      inputs.file = selectedFile;
      inputs.created_by = 1;
      Http.post("/candidate", inputs)
        .then((res) => {
          navigate("/candidate", {
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
          <h5 className="am-title">Create Candidate</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Candidate Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Requisition <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="hr_requisition_id"
                  onChange={handleChange}
                >
                  <option value="">Select Requisition</option>
                  {Array.from(requisition).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.job_title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label>
                  Name <i class="fa fa-star required"></i>
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
              </div>
              <div className="col-lg">
                <label>
                  Email <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  placeholder="Input email"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Mobile <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={inputs.mobile || ""}
                  onChange={handleChange}
                  placeholder="Input mobile"
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Experience</label>
                <input
                  type="text"
                  className="form-control"
                  name="experience"
                  value={inputs.experience || ""}
                  onChange={handleChange}
                  placeholder="Input experience"
                />
              </div>
              <div className="col-lg">
                <label>Skills</label>
                <input
                  type="text"
                  className="form-control"
                  name="skills"
                  value={inputs.skills || ""}
                  onChange={handleChange}
                  placeholder="Input skills"
                />
              </div>
              <div className="col-lg">
                <label>Expected Salary</label>
                <input
                  type="text"
                  className="form-control"
                  name="expected_salary"
                  value={inputs.expected_salary || ""}
                  onChange={handleChange}
                  placeholder="Input Expected Salary"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Expected Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expected_joining_date"
                  value={inputs.expected_joining_date || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Reference</label>
                <input
                  type="text"
                  className="form-control"
                  name="reference_name"
                  value={inputs.reference_name || ""}
                  onChange={handleChange}
                  placeholder="Input Expected Salary"
                />
              </div>
              <div className="col-lg">
                <label>Cv</label>
                <input
                  type="file"
                  className="form-control"
                  name="cv"
                  onChange={handleFileChange}
                />
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
                  placeholder="Remarks"
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
