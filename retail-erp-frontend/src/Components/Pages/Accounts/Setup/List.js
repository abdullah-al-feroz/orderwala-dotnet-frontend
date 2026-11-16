import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const navigate = useNavigate();
  const [coa, setCoa] = useState({});
  const [ledger, setLedger] = useState({});
  const [error, setError] = useState({});
  const [list, setList] = useState([]);
  const [inputs, setInputs] = useState({
    section_status: false,
    section_status_1: false,
    section_status_2: false,
    section_status_3: false,
    section_status_4: false,
    section_status_5: false,
    section_status_6: false,
    section_status_7: false,
    section_status_8: false,
    section_status_9: false,
    section_status_10: false,
    section_status_11: false,
    section_status_12: false,
  });

  const [selectedAssetPurchaseDr, setSelectedAssetPurchaseDr] = useState(null);
  const [selectedAssetPurchaseCr, setSelectedAssetPurchaseCr] = useState(null);
  const [selectedSalaryPaymentDr, setSelectedSalaryPaymentDr] = useState(null);
  const [selectedSalaryPaymentCr, setSelectedSalaryPaymentCr] = useState(null);
  const [selectedSalaryPaymentLedger, setSelectedSalaryPaymentLedger] =
    useState(null);
  const [selectedIssueReceiveDr, setSelectedIssueReceiveDr] = useState(null);
  const [selectedIssueReceiveCr, setSelectedIssueReceiveCr] = useState(null);
  const [selectedProductionReceiveDr, setSelectedProductionReceiveDr] =
    useState(null);
  const [selectedProductionReceiveCr, setSelectedProductionReceiveCr] =
    useState(null);

  const [selectedPhoneBillPaymentDr, setSelectedPhoneBillPaymentDr] =
    useState(null);
  const [selectedPhoneBillPaymentCr, setSelectedPhoneBillPaymentCr] =
    useState(null);
  const [selectedPhoneBillPaymentLedger, setSelectedPhoneBillPaymentLedger] =
    useState(null);

  const [
    selectedProductionReceiveProfitDr,
    setSelectedProductionReceiveProfitDr,
  ] = useState(null);
  const [
    selectedProductionReceiveProfitCr,
    setSelectedProductionReceiveProfitCr,
  ] = useState(null);

  const [selectedProductionReceiveLossDr, setSelectedProductionReceiveLossDr] =
    useState(null);
  const [selectedProductionReceiveLossCr, setSelectedProductionReceiveLossCr] =
    useState(null);

  const [selectedIncentivePaymentDr, setSelectedIncentivePaymentDr] =
    useState(null);
  const [selectedIncentivePaymentCr, setSelectedIncentivePaymentCr] =
    useState(null);
  const [selectedIncentivePaymentLedger, setSelectedIncentivePaymentLedger] =
    useState(null);

  const [selectedSalesInvoiceDr, setSelectedSalesInvoiceDr] = useState(null);
  const [selectedSalesInvoiceCr, setSelectedSalesInvoiceCr] = useState(null);
  const [selectedSalesReceiveCr, setSelectedSalesReceiveCr] = useState(null);

  const fetchData = () => {
    Http.get("/auto-journal-setup").then((res) => {
      console.log(res.data);

      setInputs({
        section_status_1: res.data.jv_salary.status
          ? res.data.jv_salary.status == 1
            ? true
            : false
          : false,
        section_status_2: res.data.asset_purchase.status == 1 ? true : false,
        section_status_3: res.data.payment_salary.status == 1 ? true : false,
        section_status_4: res.data.issue_receive.status == 1 ? true : false,
        section_status_5: res.data.phone_bill_jv
          ? res.data.phone_bill_jv.status == 1
            ? true
            : false
          : false,
        section_status_6:
          res.data.production_receive.status == 1 ? true : false,
        section_status_7: res.data.phone_bill_payment
          ? res.data.phone_bill_payment.status == 1
            ? true
            : false
          : false,
        section_status_8: res.data.production_receive_profit_loss
          ? res.data.production_receive_profit_loss.status == 1
            ? true
            : false
          : false,
        section_status_9: res.data.incentive_jv
          ? res.data.incentive_jv.status == 1
            ? true
            : false
          : false,
        section_status_10: res.data.incentive_payment
          ? res.data.incentive_payment.status == 1
            ? true
            : false
          : false,
        section_status_11: res.data.sales_invoice
          ? res.data.sales_invoice.status == 1
            ? true
            : false
          : false,
        section_status_12: res.data.sales_receive
          ? res.data.sales_receive.status == 1
            ? true
            : false
          : false,
      });

      setSelectedAssetPurchaseDr({
        label: res.data.selected_asset_purchase_dr_name,
        value: res.data.selected_asset_purchase_dr_id,
      });

      setSelectedAssetPurchaseCr({
        label: res.data.selected_asset_purchase_cr_name,
        value: res.data.selected_asset_purchase_cr_id,
      });

      setSelectedSalaryPaymentDr({
        label: res.data.selected_salary_payment_dr_name,
        value: res.data.selected_salary_payment_dr_id,
      });

      setSelectedSalaryPaymentCr({
        label: res.data.selected_salary_payment_cr_name,
        value: res.data.selected_salary_payment_cr_id,
      });

      setSelectedSalaryPaymentLedger({
        label: res.data.selected_salary_payment_ledger_name,
        value: res.data.selected_salary_payment_ledger_id,
      });

      setSelectedIssueReceiveDr({
        label: res.data.selected_issue_receive_dr_name,
        value: res.data.selected_issue_receive_dr_id,
      });

      setSelectedIssueReceiveCr({
        label: res.data.selected_issue_receive_cr_name,
        value: res.data.selected_issue_receive_cr_id,
      });

      setSelectedProductionReceiveDr({
        label: res.data.selected_production_receive_dr_name,
        value: res.data.selected_production_receive_dr_id,
      });

      setSelectedProductionReceiveCr({
        label: res.data.selected_production_receive_cr_name,
        value: res.data.selected_production_receive_cr_id,
      });

      setSelectedPhoneBillPaymentDr({
        label: res.data.selected_phone_bill_payment_dr_name,
        value: res.data.selected_phone_bill_payment_dr_id,
      });

      setSelectedPhoneBillPaymentCr({
        label: res.data.selected_phone_bill_payment_cr_name,
        value: res.data.selected_phone_bill_payment_cr_id,
      });

      setSelectedPhoneBillPaymentLedger({
        label: res.data.selected_phone_bill_payment_ledger_name,
        value: res.data.selected_phone_bill_payment_ledger_id,
      });

      setSelectedProductionReceiveProfitDr({
        label: res.data.selected_production_receive_profit_dr_name,
        value: res.data.selected_production_receive_profit_dr_id,
      });

      setSelectedProductionReceiveProfitCr({
        label: res.data.selected_production_receive_profit_cr_name,
        value: res.data.selected_production_receive_profit_cr_id,
      });

      setSelectedProductionReceiveLossDr({
        label: res.data.selected_production_receive_loss_dr_name,
        value: res.data.selected_production_receive_loss_dr_id,
      });

      setSelectedProductionReceiveLossCr({
        label: res.data.selected_production_receive_loss_cr_name,
        value: res.data.selected_production_receive_loss_cr_id,
      });

      setSelectedIncentivePaymentDr({
        label: res.data.selected_incentive_payment_dr_name,
        value: res.data.selected_incentive_payment_dr_id,
      });

      setSelectedIncentivePaymentCr({
        label: res.data.selected_incentive_payment_cr_name,
        value: res.data.selected_incentive_payment_cr_id,
      });

      setSelectedIncentivePaymentLedger({
        label: res.data.selected_incentive_payment_ledger_name,
        value: res.data.selected_incentive_payment_ledger_id,
      });

      setSelectedSalesInvoiceDr({
        label: res.data.selected_sales_invoice_dr_name,
        value: res.data.selected_sales_invoice_dr_id,
      });

      setSelectedSalesInvoiceCr({
        label: res.data.selected_sales_invoice_cr_name,
        value: res.data.selected_sales_invoice_cr_id,
      });

      setSelectedSalesReceiveCr({
        label: res.data.selected_sales_receive_cr_name,
        value: res.data.selected_sales_receive_cr_id,
      });
    });

    Http.get("/coa").then((res) => {
      setCoa(res.data);
    });

    Http.get("/ledger").then((res) => {
      setLedger(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const [toggleSwitches, setToggleSwitches] = useState({
  //   section_status_1: false,
  //   section_status_2: false,
  //   section_status_3: false,
  // });

  // const handleToggle = (e) => {
  //   console.log(e.target.name);
  //   const name = e.target.name; // Chanages Input Name
  //   // const value = !e.target.value; // Changes Input Value

  //   // const inputName = name.target.name;
  //   setToggleSwitches((prevSwitches) => ({
  //     ...prevSwitches,
  //     [name]: !prevSwitches[name],
  //   }));

  //   setInputs((values) => ({ ...values, [name]: !values[name] }));
  // };

  const toggleChange = (e) => {
    const name = e.target.name; // Chanages Input Name
    const value = !e.target.value; // Changes Input Value
    setInputs((values) => ({ ...values, [name]: value })); // Set Input With Value and Name in State
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;

    setInputs((values) => ({ ...values, [name]: value }));

    if (name === "asset_purchase_dr") {
      setSelectedAssetPurchaseDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "asset_purchase_cr") {
      setSelectedAssetPurchaseCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "salary_payment_dr") {
      setSelectedSalaryPaymentDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "salary_payment_cr") {
      setSelectedSalaryPaymentCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "salary_payment_ledger") {
      setSelectedSalaryPaymentLedger({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "issue_receive_dr") {
      setSelectedIssueReceiveDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "issue_receive_cr") {
      setSelectedIssueReceiveCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "production_receive_dr") {
      setSelectedProductionReceiveDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "production_receive_cr") {
      setSelectedProductionReceiveCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "phone_bill_payment_dr") {
      setSelectedPhoneBillPaymentDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "phone_bill_payment_cr") {
      setSelectedPhoneBillPaymentCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "phone_bill_payment_ledger") {
      setSelectedPhoneBillPaymentLedger({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "production_receive_profit_dr") {
      setSelectedProductionReceiveProfitDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "production_receive_profit_cr") {
      setSelectedProductionReceiveProfitCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "production_receive_loss_dr") {
      setSelectedProductionReceiveLossDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "production_receive_loss_cr") {
      setSelectedProductionReceiveLossCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "incentive_payment_dr") {
      setSelectedIncentivePaymentDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "incentive_payment_cr") {
      setSelectedIncentivePaymentCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "incentive_payment_ledger") {
      setSelectedIncentivePaymentLedger({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "sales_invoice_dr") {
      setSelectedSalesInvoiceDr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name === "sales_invoice_cr") {
      setSelectedSalesInvoiceCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (name === "sales_receive_cr") {
      setSelectedSalesReceiveCr({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    setList((prevCoa) => {
      const updatedCoa = [...prevCoa];
      const coaIndex = updatedCoa.findIndex((item) => item.name === name);

      if (coaIndex !== -1) {
        updatedCoa[coaIndex] = { name, value };
      } else {
        updatedCoa.push({ name, value });
      }

      return updatedCoa;
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleForm1Submit = (e) => {
    e.preventDefault();
    // Form 1 submission logic...
    inputs.section_type = "jv_salary";
    inputs.section_status = inputs.section_status_1;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm2Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "asset_purchase";
    inputs.section_status = inputs.section_status_2;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm3Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "payment_salary";
    inputs.section_status = inputs.section_status_3;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm4Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "issue_receive";
    inputs.section_status = inputs.section_status_4;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm5Submit = (e) => {
    e.preventDefault();

    inputs.section_type = "phone_bill_jv";
    inputs.section_status = inputs.section_status_5;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm6Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "production_receive";
    inputs.section_status = inputs.section_status_6;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm7Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "phone_bill_payment";
    inputs.section_status = inputs.section_status_7;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm8Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "production_receive_profit_loss";
    inputs.section_status = inputs.section_status_8;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm9Submit = (e) => {
    e.preventDefault();

    inputs.section_type = "incentive_jv";
    inputs.section_status = inputs.section_status_9;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm10Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "incentive_payment";
    inputs.section_status = inputs.section_status_10;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const handleForm11Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "sales_invoice";
    inputs.section_status = inputs.section_status_11;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const handleForm12Submit = (e) => {
    e.preventDefault();

    inputs.list = list;
    inputs.section_type = "sales_receive";
    inputs.section_status = inputs.section_status_12;

    Http.post("/auto-journal-setup", inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Setting Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Account Setup</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row mb-5">
                <div className="col-md-6">
                  <form onSubmit={handleForm1Submit}>
                    <div className="card">
                      <div className="card-header card-header-default justify-content-between bg-gray-400">
                        <h6 className="mg-b-0 tx-14 tx-inverse">
                          Process JV Salary
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_1"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch1"
                              value={inputs.section_status_1 || ""}
                              checked={inputs.section_status_1}
                              onChange={toggleChange}
                              // checked={toggleSwitches.section_status_1}
                              // onChange={() => handleToggle("section_status_1")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <div className="row">
                          <div className="col-12">
                            <p className="text-danger text-center jvSalaryMsg"></p>
                          </div>
                        </div>
                        <p className="text-center">
                          Salary JV Process Module On Human Resources -
                          Transactions List Connect
                        </p>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="jv_salary"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm2Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Asset Purchase
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_2"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_2 || ""}
                              checked={inputs.section_status_2}
                              onChange={toggleChange}
                              // checked={toggleSwitches.section_status_2}
                              // onChange={() => handleToggle("section_status_2")}
                              // onChange={handleToggle}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedAssetPurchaseDr}
                                  value={selectedAssetPurchaseDr}
                                  // defaultValue={coa[0]}
                                  name="asset_purchase_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedAssetPurchaseCr}
                                  value={selectedAssetPurchaseCr}
                                  //defaultValue={coa[0]}
                                  name="asset_purchase_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="asset_purchase"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm3Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Process Payment Salary
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_3"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_3 || ""}
                              checked={inputs.section_status_3}
                              onChange={toggleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedSalaryPaymentDr}
                                  value={selectedSalaryPaymentDr}
                                  // defaultValue={coa[0]}
                                  name="salary_payment_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedSalaryPaymentCr}
                                  value={selectedSalaryPaymentCr}
                                  // defaultValue={coa[0]}
                                  name="salary_payment_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>SubCategory Ledger</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedSalaryPaymentLedger}
                                  value={selectedSalaryPaymentLedger}
                                  // defaultValue={ledger[0]}
                                  name="salary_payment_ledger"
                                  options={ledger}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="payment_salary"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm4Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Issue Receive
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_4"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_4 || ""}
                              checked={inputs.section_status_4}
                              onChange={toggleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedIssueReceiveDr}
                                  value={selectedIssueReceiveDr}
                                  // defaultValue={coa[0]}
                                  name="issue_receive_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedIssueReceiveCr}
                                  value={selectedIssueReceiveCr}
                                  // defaultValue={coa[0]}
                                  name="issue_receive_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="issue_receive"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm5Submit}>
                    <div className="card">
                      <div className="card-header card-header-default justify-content-between bg-gray-400">
                        <h6 className="mg-b-0 tx-14 tx-inverse">
                          Process Phone Bill JV
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_5"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch1"
                              value={inputs.section_status_5 || ""}
                              checked={inputs.section_status_5}
                              onChange={toggleChange}
                              // checked={toggleSwitches.section_status_1}
                              // onChange={() => handleToggle("section_status_1")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <div className="row">
                          <div className="col-12">
                            <p className="text-danger text-center jvSalaryMsg"></p>
                          </div>
                        </div>
                        <p className="text-center">
                          Phone Bill JV Process Module On Human Resources -
                          Transactions List Connect
                        </p>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="phone_bill_jv"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm6Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Production Receive
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_6"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_6 || ""}
                              checked={inputs.section_status_6}
                              onChange={toggleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedProductionReceiveDr}
                                  value={selectedProductionReceiveDr}
                                  // defaultValue={coa[0]}
                                  name="production_receive_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedProductionReceiveCr}
                                  value={selectedProductionReceiveCr}
                                  // defaultValue={coa[0]}
                                  name="production_receive_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="production_receive"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm7Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Process Phone Bill Payment
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_7"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_7 || ""}
                              checked={inputs.section_status_7}
                              onChange={toggleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedPhoneBillPaymentDr}
                                  value={selectedPhoneBillPaymentDr}
                                  // defaultValue={coa[0]}
                                  name="phone_bill_payment_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedPhoneBillPaymentCr}
                                  value={selectedPhoneBillPaymentCr}
                                  // defaultValue={coa[0]}
                                  name="phone_bill_payment_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>SubCategory Ledger</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedPhoneBillPaymentLedger}
                                  value={selectedPhoneBillPaymentLedger}
                                  // defaultValue={ledger[0]}
                                  name="phone_bill_payment_ledger"
                                  options={ledger}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="phone_bill_payment"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm8Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Production Receive Profit & Loss
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_8"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_8 || ""}
                              checked={inputs.section_status_8}
                              onChange={toggleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Profit Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={
                                    selectedProductionReceiveProfitDr
                                  }
                                  value={selectedProductionReceiveProfitDr}
                                  // defaultValue={coa[0]}
                                  name="production_receive_profit_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Profit Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={
                                    selectedProductionReceiveProfitCr
                                  }
                                  value={selectedProductionReceiveProfitCr}
                                  // defaultValue={coa[0]}
                                  name="production_receive_profit_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Loss Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedProductionReceiveLossDr}
                                  value={selectedProductionReceiveLossDr}
                                  // defaultValue={coa[0]}
                                  name="production_receive_loss_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Loss Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedProductionReceiveLossCr}
                                  value={selectedProductionReceiveLossCr}
                                  // defaultValue={coa[0]}
                                  name="production_receive_loss_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="production_receive_profit_loss"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-6">
                  <form onSubmit={handleForm9Submit}>
                    <div className="card">
                      <div className="card-header card-header-default justify-content-between bg-gray-400">
                        <h6 className="mg-b-0 tx-14 tx-inverse">
                          Process Incentive JV
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_9"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch1"
                              value={inputs.section_status_9 || ""}
                              checked={inputs.section_status_9}
                              onChange={toggleChange}
                              // checked={toggleSwitches.section_status_1}
                              // onChange={() => handleToggle("section_status_1")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <div className="row">
                          <div className="col-12">
                            <p className="text-danger text-center jvSalaryMsg"></p>
                          </div>
                        </div>
                        <p className="text-center">
                          Salary JV Process Module On Human Resources -
                          Transactions List Connect
                        </p>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="incentive_jv"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm10Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Process Incentive Payment
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_10"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_10 || ""}
                              checked={inputs.section_status_10}
                              onChange={toggleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedIncentivePaymentDr}
                                  value={selectedIncentivePaymentDr}
                                  // defaultValue={coa[0]}
                                  name="incentive_payment_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedIncentivePaymentCr}
                                  value={selectedIncentivePaymentCr}
                                  // defaultValue={coa[0]}
                                  name="incentive_payment_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>SubCategory Ledger</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedIncentivePaymentLedger}
                                  value={selectedIncentivePaymentLedger}
                                  // defaultValue={ledger[0]}
                                  name="incentive_payment_ledger"
                                  options={ledger}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="phone_bill_payment"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm11Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Sales Invoice
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_11"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_11 || ""}
                              checked={inputs.section_status_11}
                              onChange={toggleChange}
                              // checked={toggleSwitches.section_status_2}
                              // onChange={() => handleToggle("section_status_2")}
                              // onChange={handleToggle}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedSalesInvoiceDr}
                                  value={selectedSalesInvoiceDr}
                                  // defaultValue={coa[0]}
                                  name="sales_invoice_dr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedSalesInvoiceCr}
                                  value={selectedSalesInvoiceCr}
                                  // defaultValue={coa[0]}
                                  name="sales_invoice_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="sales_invoice"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-6 mg-t-30 mg-md-t-0">
                  <form onSubmit={handleForm12Submit}>
                    <div className="card bd-0">
                      <div className="card-header card-header-default justify-content-between">
                        <h6 className="mg-b-0 tx-14 tx-white tx-normal">
                          Payment Receive(Sales)
                        </h6>
                        <div className="card-option tx-24">
                          <div className="form-check form-switch">
                            <input
                              name="section_status_12"
                              className="form-check-input"
                              type="checkbox"
                              id="toggleSwitch2"
                              value={inputs.section_status_12 || ""}
                              checked={inputs.section_status_12}
                              onChange={toggleChange}
                              // checked={toggleSwitches.section_status_2}
                              // onChange={() => handleToggle("section_status_2")}
                              // onChange={handleToggle}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card-body bg-gray-200">
                        <table
                          id="orderTable"
                          className="table table-bordered table-sm"
                        >
                          <thead>
                            <tr>
                              <th>Type </th>
                              <th>#</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dr</td>
                              <td>
                                <p className="text-bold">
                                  Select While Receive Payment
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td>Cr</td>
                              <td>
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  defaultValue={selectedSalesReceiveCr}
                                  value={selectedSalesReceiveCr}
                                  // defaultValue={coa[0]}
                                  name="sales_receive_cr"
                                  options={coa}
                                  onChange={selectHandleChange}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="card-footer tx-right bg-gray-300">
                        <input
                          type="hidden"
                          name="section_type"
                          value="sales_receive"
                          onChange={handleChange}
                        />
                        <button type="submit" className="btn btn-info">
                          Save
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
    </div>
  );
};

export default List;
