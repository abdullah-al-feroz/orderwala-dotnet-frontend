import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import SubCategoryComponent from "./SubCategory";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";
import Swal from "sweetalert2";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [chartOfAccount, setChartOfAccount] = useState({});
  const [budgetPlan, setBudgetPlan] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [journalNo, setJournalNo] = useState({});
  const [error, setError] = useState({});
  const [debitSum, setDebitSum] = useState(0);
  const [creditSum, setCreditSum] = useState(0);
  const [journalCode, setJournalCode] = useState(0);
  const { checkRequiredFields } = useRequiredFields();
  const [selectedOption, setSelectedOption] = useState(null);

  const listState = [
    {
      chart_of_account_id: "",
      debit: "",
      credit: "",
      sub_category: "",
      budget_id: "",
      bill_no: "",
      bill_date: "",
      mature_day: "",
    },
    {
      chart_of_account_id: "",
      debit: "",
      credit: "",
      sub_category: "",
      budget_id: "",
      bill_no: "",
      bill_date: "",
      mature_day: "",
    },
  ];
  const [list, setList] = useState(listState);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
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
  /*const handleCOAChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable
    inputInfo[index][name] = value;

    Http.get(
      "/subsidiary-ledger-search-by-chart-of-account/" + value + "/" + index
    ).then((res) => {
      setSubCategory((values) => ({ ...values, [index]: res.data }));
    });

    setList(inputInfo);
  };*/
  const selectHandleCOAChange = (value, index) => {
    setSelectedOption({ value: value, index: index });
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable
    inputInfo[index]["chart_of_account_id"] = value;

    Http.get(
      "/subsidiary-ledger-search-by-chart-of-account/" + value + "/" + index
    ).then((res) => {
      setSubCategory((values) => ({ ...values, [index]: res.data }));
    });

    setList(inputInfo);
  };

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };

  // Default Load
  const fetchData = () => {
    Http.get("/chart-of-account-code-2").then((res) => {
      setChartOfAccount(res.data);
    });
    // Http.get("/journal-no").then((res) => {
    //   setJournalNo(res.data);
    // });
    // Http.get("/journal-code").then((res) => {
    //   setJournalCode(res.data);
    // });

    Http.get("/journalCodeSelect2").then((res) => {
      setJournalCode(res.data);
    });

    Http.get(
      "/last-code-increment-by-one/acc_journal_voucher/serial_number"
    ).then((res) => {
      setJournalNo(res.data);
    });

    setInputs({ type: "journal" });

    // Budget Setup
    const dateObj = new Date();
    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;
    inputs.date = shortDate;
    Http.post("/budget-plan-search", inputs)
      .then((res) => {
        setBudgetPlan(res.data);
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
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
        budget_id: "",
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
    checkRequiredFields();
    inputs.serial_number = journalNo;

    // Validation Check
    const listArr = [];
    let debit = 0;
    let credit = 0;
    let errorShow = [];
    let warning = false;
    Object.keys(list).forEach((key) => {
      if (list[key]["chart_of_account_id"] > 0) {
        if (list[key]["debit"] < 1 && list[key]["credit"] < 1) {
          errorShow = [["error", ["Debit or Credit Balance Must be filled "]]];
          setError(Object.fromEntries(errorShow));
          return false;
        } else {
          if (list[key]["debit"] > 0)
            debit = parseFloat(debit) + parseFloat(list[key]["debit"]);
          if (list[key]["credit"])
            credit = parseFloat(credit) + parseFloat(list[key]["credit"]);

          listArr.push(list[key]);

          if (list[key]["sub_category"] == "") {
            if (Object.keys(subCategory[key]).length > 0) warning = true;
          }
        }
      }
    });

    if (debit == 0 || credit == 0 || debit == "" || credit == "") {
      errorShow = [
        ["error", ["You must fill out at least two detail lines.."]],
      ];
      setError(Object.fromEntries(errorShow));
      return false;
    } else if (debit != credit) {
      errorShow = [
        ["error", ["Amount Not Match. Please balance debits and credits"]],
      ];
      setError(Object.fromEntries(errorShow));
      return false;
    } else {
      setError({});
    }

    if (error && Object.keys(error).length == 0) {
      inputs.items = listArr;
      inputs.total_amount = debit;

      if (warning) {
        Swal.fire({
          title: "Are you sure?",
          text: "Are you sure want to Submit this Without selecting Sub Category!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Submit Form!",
        }).then((result) => {
          if (result.isConfirmed) {
            Http.post("/journal-voucher", inputs)
              .then((res) => {
                navigate("/journal-voucher", {
                  state: { message: res.data.message, type: "success" },
                });
              })
              .catch(function (e) {
                setError(e.response.data.errors);
              });
          }
        });
      } else {
        Http.post("/journal-voucher", inputs)
          .then((res) => {
            navigate("/journal-voucher", {
              state: { message: res.data.message, type: "success" },
            });
          })
          .catch(function (e) {
            setError(e.response.data.errors);
          });
      }
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Journal Voucher</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Journal Voucher
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleDateChange}
                  data-required
                />
                {displayError("date")}
              </div>
              <div className="col-lg">
                <label htmlFor="">Journal Code</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={journalCode[0]}
                  name="journal_code"
                  options={journalCode}
                  onChange={selectHandleChange}
                />
                {/* <select
                  className="form-control"
                  name="journal_code"
                  onChange={handleChange}
                >
                  <option value="">Select Journal Code</option>
                  {Array.from(journalCode).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.code + " - " + item.name}
                    </option>
                  ))}
                </select> */}

                {displayError("journal_code")}
              </div>
              <div className="col-lg">
                <label>Journal No.</label>
                <input
                  type="text"
                  className="form-control"
                  name="journal_no"
                  value={journalNo || ""}
                  onChange={handleChange}
                  readOnly
                  data-required
                />

                {displayError("journal_no")}
              </div>
              <div className="col-lg">
                <label htmlFor="">Journal Type</label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                  data-required
                >
                  <option value="journal">JV</option>
                  <option value="payment">Payment</option>
                  <option value="receipt">Receipt</option>
                  <option value="contra">Contra</option>
                </select>

                {displayError("type")}
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

                {displayError("remarks")}
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
                    <th className="text-uppercase text-darktext-sm font-weight-bolder ps-2">
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
                          {/* <select
                            className="form-control"
                            name="chart_of_account_id"
                            onChange={(e) => handleCOAChange(e, i)}
                          >
                            <option value="">Select Chart of Account</option>
                            {Array.from(chartOfAccount).map((item, index) => (
                              <option value={item.id} key={item.id}>
                                {item.code + " - " + item.name}
                              </option>
                            ))}
                          </select> */}
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="chart_of_account_id"
                            options={chartOfAccount}
                            onChange={(selectedOption) => {
                              // Extract the value and index from the selected option
                              const { value } = selectedOption;
                              selectHandleCOAChange(value, i);
                            }}
                            data-required
                          />

                          {displayError("chart_of_account_id")}
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
                        {displayError("debit")}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="credit"
                          value={x.credit || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                        {displayError("credit")}
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="budget_id"
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <option value="">Select Budget Plan</option>
                          {Array.from(budgetPlan).map((item, index) => (
                            <option value={item.id} key={item.id}>
                              {item.purpose}
                            </option>
                          ))}
                        </select>
                        {displayError("budget_id")}
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="sub_category"
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <SubCategoryComponent
                            data={subCategory[i]}
                            selected=""
                          />
                        </select>
                        {displayError("sub_category")}
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="bill_no"
                          value={x.bill_no || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                        {displayError("bill_no")}
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          name="bill_date"
                          value={x.bill_date || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                        {displayError("bill_date")}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          name="mature_day"
                          value={x.mature_day || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                        {displayError("mature_day")}
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
