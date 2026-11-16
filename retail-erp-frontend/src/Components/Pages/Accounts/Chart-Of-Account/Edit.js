import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [parents, setParents] = useState([]);

  const [selectedCOAOption, setSelectedCOAOption] = useState(null);

  const selectHandleChange = (selectedOption, actionMeta) => {
    setSelectedCOAOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = () => {
    Http.get("/chart-of-account-code/" + id + "/edit").then((res) => {
      setInputs({
        parent_id: res.data.parent_id,
        code: res.data.code,
        name: res.data.name,
        opening_amount: res.data.opening_amount,
        trial_balance_dr_cr: res.data.trial_balance_dr_cr,
        trial_opening_balance: res.data.trial_opening_balance,
        description: res.data.description,
      });

      setSelectedCOAOption({
        label: res.data.parent.name,
        value: res.data.parent.id,
      });
    });
    // Http.get("/chart-of-account-code").then((res) => {
    //   setParents(res.data.chart_of_accounts);
    // });

    Http.get("/chart-of-account-code-2").then((res) => {
      setParents(res.data);
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
    inputs.type = "arrear";
    Http.put("/chart-of-account-code/" + id, inputs)
      .then((res) => {
        navigate("/chart-of-account", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Chart Of Account Form</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Chart Of Account Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Parent</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedCOAOption}
                  value={selectedCOAOption}
                  onChange={selectHandleChange}
                  name="parent_id"
                  options={parents}
                />
                {/* <select
                  className="form-control"
                  name="parent_id"
                  onChange={handleChange}
                >
                  <option value="">Select Chart Of Account</option>
                  {parents.map((item, index) => (
                    <option
                      key={item.id}
                      value={item.id}
                      selected={inputs.parent_id === item.id ? true : false}
                    >
                      {item.code + " - " + item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label>
                  Code <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={inputs.code || ""}
                  onChange={handleChange}
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
                  <option
                    value="dr"
                    selected={
                      inputs.trial_balance_dr_cr === "dr" ? true : false
                    }
                  >
                    Dr
                  </option>
                  <option
                    value="cr"
                    selected={
                      inputs.trial_balance_dr_cr === "cr" ? true : false
                    }
                  >
                    Cr
                  </option>
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
                  <option
                    value="yes"
                    selected={
                      inputs.trial_opening_balance === "yes" ? true : false
                    }
                  >
                    Yes
                  </option>
                  <option
                    value="no"
                    selected={
                      inputs.trial_opening_balance === "no" ? true : false
                    }
                  >
                    No
                  </option>
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
                  placeholder="Description"
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

export default Edit;
