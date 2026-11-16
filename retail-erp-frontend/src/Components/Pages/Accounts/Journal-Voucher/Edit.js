import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import IsLogin from "../../../Common/IsLogin";
import SubCategoryComponent from "./SubCategory";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [chartOfAccount, setChartOfAccount] = useState({});
  const [budgetPlan, setBudgetPlan] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [subCategorySelected, setSubCategorySelected] = useState({});
  const [journalCode, setJournalCode] = useState(0);
  const [journalNo, setJournalNo] = useState({});
  const [error, setError] = useState({});
  const [debitSum, setDebitSum] = useState(0);
  const [creditSum, setCreditSum] = useState(0);
  const { id } = useParams();
  const [list, setList] = useState({});

  const [selectedJCodeOption, setSelectedJCodeOption] = useState(null);

  const selectHandleChange = (selectedOption, actionMeta) => {
    if (actionMeta.name === "journal_code") {
      setSelectedJCodeOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleDateChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    inputs.date = value;
    Http.post("/budget-plan-search", inputs)
      .then((res) => {
        setBudgetPlan(res.data);
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  // Set Experience State
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable
    let debit = 0;
    let credit = 0;

    inputInfo[index][name] = value;
    if (name == "debit") inputInfo[index]["credit"] = "";
    else if (name == "credit") inputInfo[index]["debit"] = "";

    list.forEach((item, itemIndex) => {
      // if(itemIndex <= index){
      debit += item.debit > 0 ? parseFloat(item.debit) : 0;
      credit += item.credit > 0 ? parseFloat(item.credit) : 0;
      // }
    });

    setDebitSum(debit);
    setCreditSum(credit);
    setList(inputInfo);
  };

  // Chart of Account
  const handleCOAChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable
    inputInfo[index][name] = value;

    Http.get(
      "/subsidiary-ledger-search-by-chart-of-account/" + value + "/" + index
    ).then((res) => {
      setSubCategory((values) => ({ ...values, [index]: res.data }));
    });

    setList(inputInfo);
  };

  // Default Load
  const fetchData = () => {
    Http.get("/chart-of-account-code").then((res) => {
      setChartOfAccount(res.data.chart_of_accounts);
    });
    Http.get("/journal-no").then((res) => {
      setJournalNo(res.data);
    });

    Http.get("/journalCodeSelect2").then((res) => {
      setJournalCode(res.data);
    });

    Http.get("/journal-voucher/" + id + "/edit").then((res) => {
      // Budget plan
      inputs.date = res.data.date;
      Http.post("/budget-plan-search", inputs)
        .then((res) => {
          setBudgetPlan(res.data);
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });

      setInputs({
        date: res.data.date,
        serial_number: res.data.serial_number,
        type: res.data.type,
        remarks: res.data.remarks,
      });
      // setList(res.data.items);
      setDebitSum(res.data.total_amount);
      setCreditSum(res.data.total_amount);

      // setSelectedJCodeOption({
      //   label: selectedOption.label,
      //   value: selectedOption.value,
      // });

      const inputInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        let subCategoryValue = "";
        if (res.data.items[key]["chart_of_account_id"] > 0) {
          Http.get(
            "/subsidiary-ledger-search-by-chart-of-account/" +
              res.data.items[key]["chart_of_account_id"] +
              "/" +
              key
          ).then((response) => {
            setSubCategory((values) => ({ ...values, [key]: response.data }));

            if (res.data.items[key]["subcategory_type"] != null) {
              if (res.data.items[key]["subcategory_type"] == "hr") {
                subCategoryValue =
                  "hr_" +
                  res.data.items[key]["subcategory_ledger_id"] +
                  "_" +
                  res.data.items[key]["hr_id"];
                setSubCategorySelected((values) => ({
                  ...values,
                  [key]: subCategoryValue,
                }));
              } else if (res.data.items[key]["subcategory_type"] == "vendor") {
                subCategoryValue =
                  "vendor_" +
                  res.data.items[key]["subcategory_ledger_id"] +
                  "_" +
                  res.data.items[key]["supplier_id"];
                setSubCategorySelected((values) => ({
                  ...values,
                  [key]: subCategoryValue,
                }));
              } else if (
                res.data.items[key]["subcategory_type"] == "distributor"
              ) {
                subCategoryValue =
                  "distributor_" +
                  res.data.items[key]["subcategory_ledger_id"] +
                  "_" +
                  res.data.items[key]["distributor_id"];
                setSubCategorySelected((values) => ({
                  ...values,
                  [key]: subCategoryValue,
                }));
              } else if (
                res.data.items[key]["subcategory_type"] == "customer"
              ) {
                subCategoryValue =
                  "customer_" +
                  res.data.items[key]["subcategory_ledger_id"] +
                  "_" +
                  res.data.items[key]["customer_id"];
                setSubCategorySelected((values) => ({
                  ...values,
                  [key]: subCategoryValue,
                }));
              } else if (res.data.items[key]["subcategory_type"] == "asset") {
                subCategoryValue =
                  "asset_" +
                  res.data.items[key]["subcategory_ledger_id"] +
                  "_" +
                  res.data.items[key]["asset_id"];
                setSubCategorySelected((values) => ({
                  ...values,
                  [key]: subCategoryValue,
                }));
              } else {
                subCategoryValue =
                  "subsidiary_" + res.data.items[key]["subcategory_ledger_id"];
                setSubCategorySelected((values) => ({
                  ...values,
                  [key]: subCategoryValue,
                }));
              }
            }
          });
        }

        if (res.data.items[key]["subcategory_type"] != null) {
          /*if (res.data.items[key]["subcategory_type"] == "hr") {
            subCategoryValue =
              "hr_" +
              res.data.items[key]["subcategory_ledger_id"] +
              "_" +
              res.data.items[key]["hr_id"];
          } else {
            subCategoryValue =
              "subsidiary_" + res.data.items[key]["subcategory_ledger_id"];
          }*/

          if (res.data.items[key]["subcategory_type"] == "hr") {
            subCategoryValue =
              "hr_" +
              res.data.items[key]["subcategory_ledger_id"] +
              "_" +
              res.data.items[key]["hr_id"];
          } else if (res.data.items[key]["subcategory_type"] == "vendor") {
            subCategoryValue =
              "vendor_" +
              res.data.items[key]["subcategory_ledger_id"] +
              "_" +
              res.data.items[key]["supplier_id"];
          } else if (res.data.items[key]["subcategory_type"] == "distributor") {
            subCategoryValue =
              "distributor_" +
              res.data.items[key]["subcategory_ledger_id"] +
              "_" +
              res.data.items[key]["distributor_id"];
          } else if (res.data.items[key]["subcategory_type"] == "customer") {
            subCategoryValue =
              "customer_" +
              res.data.items[key]["subcategory_ledger_id"] +
              "_" +
              res.data.items[key]["customer_id"];
          } else if (res.data.items[key]["subcategory_type"] == "asset") {
            subCategoryValue =
              "asset_" +
              res.data.items[key]["subcategory_ledger_id"] +
              "_" +
              res.data.items[key]["asset_id"];
          } else if (res.data.items[key]["subcategory_type"] == "subsidiary") {
            subCategoryValue =
              "subsidiary_" + res.data.items[key]["subcategory_ledger_id"];
          }
        }

        inputInfo.push({
          chart_of_account_id: res.data.items[key]["chart_of_account_id"],
          debit: res.data.items[key]["debit"],
          credit: res.data.items[key]["credit"],
          budget_id: res.data.items[key]["budget_plan_item_id"],
          subcategory_ledger_id: res.data.items[key]["subcategory_ledger_id"],
          subcategory_type: res.data.items[key]["subcategory_type"],
          hr_id: res.data.items[key]["hr_id"],
          asset_id: res.data.items[key]["asset_id"],
          supplier_id: res.data.items[key]["supplier_id"],
          customer_id: res.data.items[key]["customer_id"],
          distributor_id: res.data.items[key]["distributor_id"],
          expense_id: res.data.items[key]["expense_id"],
          sub_category: subCategoryValue,
          bill_no: res.data.items[key]["bill_number"],
          bill_date: res.data.items[key]["bill_date"],
          mature_day: res.data.items[key]["mature_day"],
        });

        setList(inputInfo);
      });
    });

    setInputs({ type: "journal" });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // End Default Load

  // Add More List
  const addMoreList = () => {
    setList([
      ...list,
      {
        chart_of_account_id: "",
        debit: "",
        credit: "",
        sub_category: "",
        bill_no: "",
        bill_date: "",
        mature_day: "",
      },
    ]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
    const inputInfo = [...list]; // Load All Existing experience State Data
    inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
    setList(inputInfo); // Replace Existing experience into State
  };

  const formSubmit = () => {
    inputs.serial_number = journalNo;

    // Validation Check
    const listArr = [];
    let debit = 0;
    let credit = 0;
    let errorShow = [];
    Object.keys(list).forEach((key) => {
      if (list[key]["chart_of_account_id"] > 0) {
        if (list[key]["debit"] > 0)
          debit = parseFloat(debit) + parseFloat(list[key]["debit"]);
        if (list[key]["credit"])
          credit = parseFloat(credit) + parseFloat(list[key]["credit"]);

        listArr.push(list[key]);
      }
    });

    if (debit == 0 || credit == 0) {
      errorShow = [
        ["error", ["You must fill out at least two detail lines.."]],
      ];
      setError(Object.fromEntries(errorShow));
    } else if (debit != credit) {
      errorShow = [
        ["error", ["Amount Not Match. Please balance debits and credits"]],
      ];
      setError(Object.fromEntries(errorShow));
    } else {
      setError({});
    }

    if (error && Object.keys(error).length == 0) {
      inputs.items = listArr;
      inputs.total_amount = debit;
      // console.log(inputs);
      Http.put("/journal-voucher/" + id, inputs)
        .then((res) => {
          navigate("/journal-voucher", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Journal Voucher Form</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Journal Voucher Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleDateChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Journal Code</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedJCodeOption}
                  value={selectedJCodeOption}
                  onChange={selectHandleChange}
                  name="journal_code"
                  options={journalCode}
                />
                {/* <select
                  className="form-control"
                  name="journal_code"
                  onChange={handleChange}
                >
                  <option value="">Select Journal Code</option>
                </select> */}
              </div>
              <div className="col-lg">
                <label>Journal No.</label>
                <input
                  type="text"
                  className="form-control"
                  name="journal_no"
                  value={inputs.serial_number || ""}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Journal Type</label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                >
                  <option
                    value="journal"
                    selected={inputs.type === "journal" ? true : false}
                  >
                    JV
                  </option>
                  <option
                    value="payment"
                    selected={inputs.type === "payment" ? true : false}
                  >
                    Payment
                  </option>
                  <option
                    value="receipt"
                    selected={inputs.type === "receipt" ? true : false}
                  >
                    Receipt
                  </option>
                  <option
                    value="contra"
                    selected={inputs.type === "contra" ? true : false}
                  >
                    Contra
                  </option>
                </select>
              </div>
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
              <table className="table table-sm align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Account
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Debit
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Credit
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Budget
                    </th>
                    <th className="text-uppercase text-darktext-sm font-weight-bolder ps-2">
                      Sub Category
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Bill No
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Bill Date
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Mature Day
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(list).map((x, i) => (
                    <tr>
                      <td>
                        <div className="col-lg">
                          <select
                            className="form-control"
                            name="chart_of_account_id"
                            onChange={(e) => handleCOAChange(e, i)}
                            onLoad={(e) => alert()}
                          >
                            <option value="">Select Chart of Account</option>
                            {Array.from(chartOfAccount).map((item, index) => (
                              <option
                                value={item.id}
                                key={item.id}
                                selected={
                                  x.chart_of_account_id === item.id
                                    ? true
                                    : false
                                }
                              >
                                {item.code + " - " + item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="debit"
                          value={x.debit || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="credit"
                          value={x.credit || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="budget_id"
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <option value="">Select Budget Plan</option>
                          {Array.from(budgetPlan).map((item, index) => (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={x.budget_id === item.id ? true : false}
                            >
                              {item.purpose}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="sub_category"
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <SubCategoryComponent
                            data={subCategory[i]}
                            selected={subCategorySelected[i]}
                          />
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bill_no"
                          value={x.bill_number || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          name="bill_date"
                          value={x.bill_date || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          name="mature_day"
                          value={x.mature_day || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        {list.length > 2 ? (
                          <button
                            className="btn btn-danger btn-block"
                            onClick={() => removeList(i)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th>{debitSum}</th>
                    <th>{creditSum}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="row mt-3">
              <div className="col-6"></div>
              <div className="col-3">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
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
