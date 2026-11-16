import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import useRequiredFields from "../../../hooks/useRequiredFields";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [remarks, setRemarks] = useState("");
  const [type, setType] = useState([]);
  const [reason, setReason] = useState([]);
  const [startedAt, setStartedAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const { checkRequiredFields } = useRequiredFields();
  const [error, setError] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your submission logic here (e.g., sending data to a backend)
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    // Http.get("/so-track/reason-type").then((res) => {
    //   // Get All Designation Info
    //   setType(res.data); // Set Designation State
    //   console.log(res.data);
    // });

    Http.get("/select2/ReasonType/id,name/parent:0").then((res) => {
      setType(res.data);
    });
    console.log(reason);

    DatatableFunc();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name === "type_id") {
      Http.get("/select2/ReasonType/id,name/parent:" + value).then((res) => {
        setReason(res.data);
      });
    }
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.post("/so-track/reasons", inputs)
        .then((res) => {
          navigate("/reason-factors/reason-list", {
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
      <div>
        <div className="bg-dark py-3">
          <h3 className="text-white text-center">Simple CRUD</h3>
        </div>
        <div className="container">
          <div className="row justify-content-center mt-4">
            <div className="col-md-10 d-flex justify-content-end">
              {/* <button className="btn btn-dark" onClick={() => Implement back navigation}>Back</button> */}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-10">
              <div className="card border-0 shadow-lg my-4">
                <div className="card-header bg-dark text-white">
                  <h3>Create Reasons</h3>
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label h5">Type</label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={type[0]}
                        value={type.find(
                          (opt) => opt.value === inputs.reason_type_id
                        )}
                        name="type_id"
                        options={type}
                        onChange={selectHandleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label h5">Reason</label>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={reason[0]}
                        name="reason_type_id"
                        options={reason}
                        onChange={selectHandleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label h5">Started At</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        value={inputs.start_date}
                        onChange={handleChange}
                        name="start_date"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label h5">End At</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        value={inputs.end_date}
                        onChange={handleChange}
                        name="end_date"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label h5">Remarks</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Enter remarks"
                        value={inputs.remarks}
                        onChange={handleChange}
                        name="remarks"
                      ></textarea>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-primary btn-block mg-b-10"
                        onClick={formSubmit}
                      >
                        <i className="fa fa-send mg-r-10"></i> Create
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
