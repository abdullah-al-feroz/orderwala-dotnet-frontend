import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({});
  const [chartOfAccount, setChartOfAccount] = useState({});
  const [error, setError] = useState({});
  const [visible, setVisible] = useState(false);

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
    Http.get("/sub-category/" + id + "/edit").then((res) => {
      setInputs({
        acc_chart_of_account_id: res.data.acc_chart_of_account_id,
        name: res.data.name,
        new_name: res.data.new_name,
        code: res.data.code,
        opening_balance: res.data.opening_balance,
        effective_date: res.data.effective_date,
        remarks: res.data.remarks,
      });

      setSelectedCOAOption({
        label: res.data.chart_of_account.name,
        value: res.data.chart_of_account.id,
      });

      if (res.data.name == "new") {
        setVisible(true);
      }
    });
    // Http.get("/chart-of-account-code").then((res) => {
    //   setChartOfAccount(res.data.chart_of_accounts);
    // });
    Http.get("/chart-of-account-code-2").then((res) => {
      setChartOfAccount(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCustomChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (value == "new") setVisible(true);
    else setVisible(false);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };
  const formSubmit = () => {
    Http.put("/sub-category/" + id, inputs)
      .then((res) => {
        navigate("/sub-category", {
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
          <h5 className="am-title">Edit Sub Category </h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Sub Category Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Chart of Account <i class="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedCOAOption}
                  value={selectedCOAOption}
                  onChange={selectHandleChange}
                  name="acc_chart_of_account_id"
                  options={chartOfAccount}
                />
                {/* <select
                  className="form-control"
                  name="acc_chart_of_account_id"
                  onChange={handleChange}
                >
                  <option value="">Select Chart of Account</option>
                  {Array.from(chartOfAccount).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.acc_chart_of_account_id === item.id
                          ? true
                          : false
                      }
                    >
                      {item.code + " - " + item.name}
                    </option>
                  ))}
                </select> */}

                {displayError("acc_chart_of_account_id")}
              </div>
              <div className="col-lg">
                <label>
                  Name <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="name"
                  onChange={handleCustomChange}
                >
                  <option value="">Select Name</option>
                  <option
                    value="hr"
                    selected={inputs.name === "hr" ? true : false}
                  >
                    HR
                  </option>
                  <option
                    value="assets"
                    selected={inputs.name === "assets" ? true : false}
                  >
                    Assets
                  </option>
                  <option
                    value="supplier"
                    selected={inputs.name === "supplier" ? true : false}
                  >
                    Supplier
                  </option>
                  <option
                    value="distributor"
                    selected={inputs.name === "distributor" ? true : false}
                  >
                    Distributor
                  </option>
                  <option
                    value="customer"
                    selected={inputs.name === "customer" ? true : false}
                  >
                    Customer
                  </option>
                  <option
                    value="expense"
                    selected={inputs.name === "expense" ? true : false}
                  >
                    Expense
                  </option>
                  <option
                    value="new"
                    selected={inputs.name === "new" ? true : false}
                  >
                    New
                  </option>
                </select>

                {displayError("name")}
              </div>
              <div
                className="col-lg"
                style={{ display: visible ? "block" : "none" }}
              >
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="new_name"
                  value={inputs.new_name || ""}
                  onChange={handleChange}
                />
                {displayError("new_name")}
              </div>
              <div
                className="col-lg"
                style={{ display: visible ? "block" : "none" }}
              >
                <label>Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={inputs.code || ""}
                  onChange={handleChange}
                />

                {displayError("code")}
              </div>
              <div className="col-lg">
                <label>Effective Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="effective_date"
                  value={inputs.effective_date || ""}
                  onChange={handleChange}
                />

                {displayError("effective_date")}
              </div>
              <div className="col-lg">
                <label>Opening Balance</label>
                <input
                  type="text"
                  className="form-control"
                  name="opening_balance"
                  value={inputs.opening_balance || 0}
                  onChange={handleChange}
                />

                {displayError("opening_balance")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
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
