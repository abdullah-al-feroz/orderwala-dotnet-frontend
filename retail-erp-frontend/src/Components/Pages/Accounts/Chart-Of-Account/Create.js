import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [parents, setParents] = useState({});
  const [lastCode, SetLastCode] = useState();
  const [error, setError] = useState({});
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

    Http.get("/chart-of-account-code-last-code/" + value).then((res) => {
      SetLastCode(res.data);
    });
  };
  // Default Load
  const fetchData = () => {
    Http.get("/chart-of-account-code-2").then((res) => {
      setParents(res.data);
    });
    Http.get("/chart-of-account-code-last-code/0").then((res) => {
      SetLastCode(res.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // End Default Load

  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.code = lastCode;
      Http.post("/chart-of-account-code", inputs)
        .then((res) => {
          navigate("/chart-of-account", {
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
          <h5 className="am-title">Create Chart Of Account</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Chart Of Account
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Parent</label>
                {/* <select
                  className="form-control"
                  name="parent_id"
                  onChange={chkLastCode}
                >
                  <option value="">Select Chart Of Account</option>
                  {parents.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      {item.code + " - " + item.name}
                    </option>
                  ))}
                </select> */}
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={parents[0]}
                  name="parent_id"
                  options={parents}
                  onChange={selectHandleChange}
                />
              </div>
              <div className="col-lg">
                <label>
                  Code <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={lastCode || ""}
                  onChange={handleChange}
                  data-required
                />
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
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Opening Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="opening_amount"
                  value={inputs.opening_amount || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Trial Balance Type</label>
                <select
                  className="form-control"
                  name="trial_balance_dr_cr"
                  onChange={handleChange}
                >
                  <option value="">Select a Option</option>
                  <option value="dr">Dr</option>
                  <option value="cr">Cr</option>
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">Trial Opening Balance</label>
                <select
                  className="form-control"
                  name="trial_opening_balance"
                  onChange={handleChange}
                >
                  <option value="">Select a Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <textarea
                  className="form-control"
                  name="description"
                  value={inputs.description || ""}
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

export default Create;
