import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    status: "active",
  });
  const [salaryProcessMsg, setSalaryProcessMsg] = useState(null);
  const [salaryProcess, setSalaryProcess] = useState(null);
  const [voucherStatus, setVoucherStatus] = useState(null);
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.post("/salary/", inputs).then((res) => {
      setReceiveData(res.data.result);
      if (res.data.salaryChk == 0) {
        setSalaryProcessMsg("Salary Not Processed. Please Process Salary ");
        setSalaryProcess(0);
      } else {
        setSalaryProcessMsg("");
        setSalaryProcess(1);
      }
      if (res.data.voucherStatus == 0) {
        setVoucherStatus(0);
      } else {
        setVoucherStatus(1);
      }
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };
  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    Http.post("/salary", inputs).then((res) => {
      setReceiveData(res.data.result);
      if (res.data.salaryChk == 0) {
        setSalaryProcessMsg("Salary Not Processed. Please Process Salary ");
        setSalaryProcess(0);
      } else {
        setSalaryProcessMsg("");
        setSalaryProcess(1);
      }
      if (res.data.voucherStatus == 0) {
        setVoucherStatus(0);
      } else {
        setVoucherStatus(1);
      }
    });
  };

  const processVoucher = () => {
    Http.post("/process-voucher/", inputs)
      .then((res) => {
        navigate("/salary", {
          state: { message: res.data.message, type: "success" },
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
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Salary Information</h5>
            {salaryProcess == 0 ? (
              <Link to="/create-salary" className="btn btn-primary">
                <i className="fa fa-plus-square mg-r-6"></i>Process Salary
              </Link>
            ) : voucherStatus == 0 ? (
              <button className="btn btn-primary" onClick={processVoucher}>
                <i className="fa fa-plus-square mg-r-6"></i>Process Voucher
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="am-pagebody">
            <FormValidation error={error} />
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <select
                    className="form-control"
                    name="year"
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    <option
                      value="2022"
                      selected={inputs.year === 2022 ? true : false}
                    >
                      2022
                    </option>
                    <option
                      value="2023"
                      selected={inputs.year === 2023 ? true : false}
                    >
                      2023
                    </option>
                    <option
                      value="2024"
                      selected={inputs.year === 2024 ? true : false}
                    >
                      2024
                    </option>
                    <option
                      value="2025"
                      selected={inputs.year === 2025 ? true : false}
                    >
                      2025
                    </option>
                    <option
                      value="2026"
                      selected={inputs.year === 2026 ? true : false}
                    >
                      2026
                    </option>
                    <option
                      value="2027"
                      selected={inputs.year === 2027 ? true : false}
                    >
                      2027
                    </option>
                    <option
                      value="2028"
                      selected={inputs.year === 2028 ? true : false}
                    >
                      2028
                    </option>
                    <option
                      value="2029"
                      selected={inputs.year === 2029 ? true : false}
                    >
                      2029
                    </option>
                    <option
                      value="2030"
                      selected={inputs.year === 2030 ? true : false}
                    >
                      2030
                    </option>
                  </select>
                </div>
                <div className="col-lg">
                  <select
                    className="form-control"
                    name="month"
                    onChange={handleChange}
                  >
                    <option
                      value="01"
                      selected={
                        inputs.month === "01" || inputs.month === 1
                          ? true
                          : false
                      }
                    >
                      January
                    </option>
                    <option
                      value="02"
                      selected={
                        inputs.month === "02" || inputs.month === 2
                          ? true
                          : false
                      }
                    >
                      February
                    </option>
                    <option
                      value="03"
                      selected={
                        inputs.month === "03" || inputs.month === 3
                          ? true
                          : false
                      }
                    >
                      March
                    </option>
                    <option
                      value="04"
                      selected={
                        inputs.month === "04" || inputs.month === 4
                          ? true
                          : false
                      }
                    >
                      April
                    </option>
                    <option
                      value="05"
                      selected={
                        inputs.month === "05" || inputs.month === 5
                          ? true
                          : false
                      }
                    >
                      May
                    </option>
                    <option
                      value="06"
                      selected={
                        inputs.month === "06" || inputs.month === 6
                          ? true
                          : false
                      }
                    >
                      June
                    </option>
                    <option
                      value="07"
                      selected={
                        inputs.month === "07" || inputs.month === 7
                          ? true
                          : false
                      }
                    >
                      July
                    </option>
                    <option
                      value="08"
                      selected={
                        inputs.month === "08" || inputs.month === 8
                          ? true
                          : false
                      }
                    >
                      August
                    </option>
                    <option
                      value="09"
                      selected={
                        inputs.month === "09" || inputs.month === 9
                          ? true
                          : false
                      }
                    >
                      September
                    </option>
                    <option
                      value="10"
                      selected={
                        inputs.month === "10" || inputs.month === 10
                          ? true
                          : false
                      }
                    >
                      October
                    </option>
                    <option
                      value="11"
                      selected={
                        inputs.month === "11" || inputs.month === 11
                          ? true
                          : false
                      }
                    >
                      November
                    </option>
                    <option
                      value="12"
                      selected={
                        inputs.month === "12" || inputs.month === 12
                          ? true
                          : false
                      }
                    >
                      December
                    </option>
                  </select>
                </div>
                {/* <div className="col-lg">
                  <select className="form-control" name="status" onChange={handleChange}>
                    <option value="active" selected={inputs.status === 'active' ? true : false}>Active</option>
                    <option value="inactive" selected={inputs.status === 'inactive' ? true : false}>Inactive</option>
                    <option value="held_up" selected={inputs.status === 'held_up' ? true : false}>Held Up</option>
                  </select>
                </div> */}
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <div className="col-lg">
                    <p className="text-center" style={{ color: "red" }}>
                      {salaryProcessMsg}
                    </p>
                  </div>
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Card No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Designation
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Joining Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Inactive Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Basic
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          House Rent
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Medical
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Conveyence
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Entertainment
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Other Allowance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Declared Gross Salary
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                          title="(Gross * Number of Working Days) / Total Number of Days Month"
                        >
                          Gross Salary (If Inactive User)
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                          title="Calculate Attendance,Leave Application,Late & Movement Slip"
                        >
                          Salary Deduction For Not Present
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Arrear
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Overtime
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Holiday Allowance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Night Hold
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          TADA
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Salary Advance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Canteen
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Phone Bill Extra
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Income Tax
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Deduction
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Bonus
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Salary
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.card_no}</td>
                          <td className="text-xs">{item.name}</td>
                          <td className="text-xs">{item.designation.name}</td>
                          <td className="text-xs">{item.joining_date}</td>
                          <td className="text-xs">{item.inactive_date}</td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.basic}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.house_rent}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.medical}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.conveyence}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.entertainment}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.other_allowance}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_structure_latest.gross}
                          </td>
                          <td className="text-xs" align="right">
                            {
                              item.final_gross_after_inactive_date_salary_calculation
                            }
                          </td>
                          <td className="text-xs" align="right">
                            {item.salaryDeductionForNotPresent}
                          </td>
                          <td className="text-xs" align="right">
                            {item.arrear}
                          </td>
                          <td className="text-xs" align="right">
                            {item.overtime}
                          </td>
                          <td className="text-xs" align="right">
                            {item.holiday}
                          </td>
                          <td className="text-xs" align="right">
                            {item.night_hold}
                          </td>
                          <td className="text-xs" align="right">
                            {item.tada}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary_advance}
                          </td>
                          <td className="text-xs" align="right">
                            {item.canteen}
                          </td>
                          <td className="text-xs" align="right">
                            {item.phone_bill_extra}
                          </td>
                          <td className="text-xs" align="right">
                            {item.income_tax}
                          </td>
                          <td className="text-xs" align="right">
                            {item.deduction}
                          </td>
                          <td className="text-xs" align="right">
                            {item.bonus}
                          </td>
                          <td className="text-xs" align="right">
                            {item.salary}
                          </td>
                          <td className="text-xs">
                            {salaryProcess == 0 ? (
                              <button type="button" className="btn btn-danger">
                                Held Up
                              </button>
                            ) : (
                              <Link
                                to={{ pathname: "/pay-slip/" + item.salary_id }}
                                className="btn btn-primary btn-sm"
                              >
                                Pay Slip
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
