import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import useRequiredFields from "../../../hooks/useRequiredFields";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({});
  const [type, setType] = useState([]);
  const [reason, setReason] = useState([]);
  const { checkRequiredFields } = useRequiredFields();
  const [error, setError] = useState({});

  useEffect(() => {
    // Fetch reason types
    Http.get("/select2/ReasonType/id,name/parent:0").then((res) => {
      setType(res.data);
    });

    // Fetch initial form data
    Http.get(`/so-track/reasons/${id}`).then((response) => {
      const data = response.data;
      setInputs({
        reason_type_id: data.reason_type_id,
        start_date: data.start_date,
        end_date: data.end_date,
        remarks: data.remarks,
      });

      // Fetch reasons based on the type_id
      Http.get(`/select2/ReasonType/id,name/parent:${data.reason_type_id}`).then((res) => {
        setReason(res.data);
      });
    });

    // Initialize datatable and other static components
    DatatableFunc();
  }, [id]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs(values => ({ ...values, [name]: value }));

    if (name === "type_id") {
      Http.get(`/select2/ReasonType/id,name/parent:${value}`).then((res) => {
        setReason(res.data);
      });
    }
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.put("/so-track/reasons/" +id , inputs)
        .then(res => {
          navigate("/reason-factors/reason-list", {
            state: { message: res.data.message, type: "success" }
          });
        })
        .catch(e => {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-10">
            <div className="card border-0 shadow-lg my-4">
              <div className="card-header bg-dark text-white">
                <h3>Edit Reasons</h3>
              </div>
              <form onSubmit={formSubmit} encType="multipart/form-data">
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label h5">Type</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={type[0]}
                      value={type.find(opt => opt.value === inputs.type_id)}
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
                    <button type="submit" className="btn btn-primary btn-block mg-b-10">
                      <i className="fa fa-send mg-r-10"></i> Edit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
