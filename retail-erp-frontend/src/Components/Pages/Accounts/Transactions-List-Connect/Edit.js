import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [chartOfAccount, setChartOfAccount] = useState({});
  const [department, setDepartment] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [journalCode, setJournalCode] = useState({});
  const [subCategory, setSubCategory] = useState({});
  const [isRequired, setIsRequired] = useState(false);
  const [list, setList] = useState([{ dr_accounts: "", cost_center: "" }]);

  const { checkRequiredFields } = useRequiredFields();
  const array = ["1", "2", "3", "4", "5", "6", "12"];
  const idExists = array.includes(id);

  const fetchData = () => {
    Http.get("/transactions-list-connect/" + id + "/edit").then((res) => {
      setInputs({
        cr_chart_of_account: res.data.info.cost_center_wise_cr_account.id,
        acc_journal_code_id:
          res.data.info.transaction_code[0].acc_journal_code_id,
        acc_subcategory_ledger_id:
          res.data.info.transaction_code[0].acc_subcategory_ledger_id,
      });

      const listInfo = [];
      Object.keys(res.data.lists).forEach((key) => {
        const { dr_chart_of_account_id, department } = res.data.lists[key];
        const costCenters = department.map((dept) => ({
          label: dept.department_name,
          value: dept.department_id,
        }));
        listInfo.push({
          dr_accounts: dr_chart_of_account_id,
          cost_center: costCenters,
        });
      });

      setList(listInfo);
    });

    Http.get("/chart-of-account-code").then((res) => {
      setChartOfAccount(res.data.chart_of_accounts);
    });

    // Http.get("/chartOfAccountSelect2").then((res) => {
    //   setChartOfAccount(res.data);
    // });

    Http.get("/department3").then((res) => {
      // Get All Department Info
      setDepartment(res.data); // Set Department State
    });

    Http.get("/journal-code").then((res) => {
      setJournalCode(res.data);
    });

    Http.get("/sub-category").then((res) => {
      setSubCategory(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedValues) => {
    setChartOfAccount(selectedValues);
  };

  const handleListChange = (index, selectedValues) => {
    const updatedList = [...list];
    updatedList[index].cost_center = selectedValues;
    setList(updatedList);
  };

  // Chart of Account
  const handleCOAChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable
    inputInfo[index][name] = value;

    setList(inputInfo);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Add More List
  const addMoreList = () => {
    setList([...list, { dr_accounts: "", cost_center: "" }]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
    const inputInfo = [...list]; // Load All Existing experience State Data
    inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
    setList(inputInfo); // Replace Existing experience into State
  };

  const formSubmit = () => {
    inputs.list = list;

    Http.put("/transactions-list-connect/" + id, inputs)
      .then((res) => {
        navigate("/transactions-list-connect", {
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
          <h5 className="am-title">Transaction Connect</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit asset Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            {Array.from(list).map((x, i) => (
              <div className="row mb-3">
                <div className="col-lg-5">
                  {idExists ? (
                    <label htmlFor="">Dr Account:</label>
                  ) : (
                    <label htmlFor="">Cr Account:</label>
                  )}

                  <select
                    className="form-control"
                    name="dr_accounts"
                    onChange={(e) => handleCOAChange(e, i)}
                    onLoad={(e) => alert()}
                  >
                    <option value="">Select Chart of Account</option>
                    {Array.from(chartOfAccount).map((item, index) => (
                      <option
                        value={item.id}
                        key={item.id}
                        selected={x.dr_accounts === item.id ? true : false}
                      >
                        {item.code + " - " + item.name}
                      </option>
                    ))}
                  </select>

                  {/* <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={chartOfAccount[0]}
                    name="dr_accounts"
                    options={chartOfAccount}
                    onChange={selectHandleChange}
                  /> */}
                </div>
                <div className="col-lg-5">
                  <label htmlFor="">Cost Center:</label>
                  {/* <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={department[0]}
                    name="cost_center"
                    options={department}
                    text="Please select cost center."
                    isMulti="yes"
                    onChange={selectHandleChange}
                    {...(isRequired && {
                      styles: {
                        control: (base, { menuIsOpen, hasValue }) => {
                          const borderColor = hasValue
                            ? "#ccc"
                            : menuIsOpen
                            ? "#ccc"
                            : "red";
                          return { ...base, borderColor };
                        },
                      },
                    })}
                  /> */}
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={department[1]}
                    name="cost_center"
                    options={department}
                    placeholder="Please select cost center."
                    isMulti={true}
                    value={x.cost_center}
                    onChange={(selectedValues) =>
                      handleListChange(i, selectedValues)
                    }
                    {...(isRequired && {
                      styles: {
                        control: (base, { menuIsOpen, hasValue }) => {
                          const borderColor = hasValue
                            ? "#ccc"
                            : menuIsOpen
                            ? "#ccc"
                            : "red";
                          return { ...base, borderColor };
                        },
                      },
                    })}
                  />
                </div>
                <div className="col-lg-2">
                  {list.length > 1 ? (
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() => removeList(i)}
                      style={{ marginTop: "1.8rem" }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}

            <div className="row mt-3">
              <div className="col-10"></div>
              <div className="col-2">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12 mb-3">
                {idExists ? (
                  <label htmlFor="">Cr Account:</label>
                ) : (
                  <label htmlFor="">Dr Account:</label>
                )}

                <select
                  className="form-control"
                  name="cr_chart_of_account"
                  onChange={handleChange}
                >
                  <option value="">Select Cr Account</option>
                  {Array.from(chartOfAccount).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.cr_chart_of_account === item.id ? true : false
                      }
                    >
                      {item.code + " - " + item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-12 mb-3">
                <label htmlFor="">Journal Code:</label>
                <select
                  className="form-control"
                  name="acc_journal_code_id"
                  onChange={handleChange}
                >
                  <option value="">Select Journal Code</option>
                  {Array.from(journalCode).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.acc_journal_code_id === item.id ? true : false
                      }
                    >
                      {item.code + " - " + item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-12">
                <label htmlFor="">Subcategory Journal :</label>
                <select
                  className="form-control"
                  name="acc_subcategory_ledger_id"
                  onChange={handleChange}
                >
                  <option value="">Select Subcategory Journal</option>
                  {Array.from(subCategory).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.acc_subcategory_ledger_id === item.id
                          ? true
                          : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
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
