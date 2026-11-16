import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  const [dsr, setDsr] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState([]);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setSelectedDsr({
      label: selectedOption.label,
      value: selectedOption.value,
    });
  };
  const fetchData = () => {
    Http.get("/distributor/receive-amount/" + id + "/edit").then((res) => {
      setInputs({
        date: res.data.date,
        amount: res.data.amount,
        remarks: res.data.remarks,
      });
      setSelectedDsr({
        label: res.data.dsr.name,
        value: res.data.dsr_id,
      });
    });

    Http.get("/distributor/dsr-list").then((res) => {
      setDsr(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    console.log(inputs);
    Http.put("/distributor/receive-amount/" + id, inputs)
      .then((res) => {
        navigate("/distributor/receive-amount", {
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
          <h5 className="am-title">Edit Receive Amount</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
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
                  placeholder="Input Received date"
                  data-required
                />
                {displayError("amount")}
              </div>

              <div className="col-lg">
                <label>
                  DSR <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedDsr}
                  value={selectedDsr}
                  onChange={selectHandleChange}
                  name="dsr_id"
                  options={dsr}
                />
                {displayError("dsr_id")}
              </div>
              <div className="col-lg">
                <label>
                  Amount <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  value={inputs.amount || ""}
                  onChange={handleChange}
                  placeholder="Input Received Amount"
                  data-required
                />
                {displayError("amount")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                  placeholder="Remarks"
                />
                {displayError("remarks")}
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

export default Edit;
