import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const SalaryPaymentReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [inputs, setInputs] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    status: "active",
  });
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.post("/salary-payment-report/", inputs).then((res) => {
      setReceiveData(res.data);
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
    Http.post("/salary-payment-report/", inputs).then((res) => {
      setReceiveData(res.data);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Paid Salary Report</h5>
          </div>
          <div className="am-pagebody">
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
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Employee Id
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          A/C No.
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Amount (TK)
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Amount In Word
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.length > 0
                        ? receiveData.map((item, index) => (
                            <>
                              <tr key={item.id}>
                                <td className="text-xs" colSpan={4}>
                                  <b>{item.name}</b>
                                </td>
                                <td className="text-xs">
                                  <b>No Of Employee : {item.staff_count}</b>
                                </td>
                              </tr>
                              {item.staff.map((item2, index2) => (
                                <tr key={item2.id}>
                                  <td className="text-xs">{item2.card_no}</td>
                                  <td className="text-xs">{item2.name}</td>
                                  <td className="text-xs">
                                    {item2.bank_account}
                                  </td>
                                  <td className="text-xs text-right">
                                    {item2.final_amount
                                      ? parseFloat(item2.final_amount).toFixed(
                                          2
                                        )
                                      : 0.0}
                                  </td>
                                  <td className="text-xs">{item2.inWord}</td>
                                </tr>
                              ))}
                              <tr>
                                <td className="text-xs"></td>
                                <td className="text-xs">Cost Center Total :</td>
                                <td className="text-xs"></td>
                                <td className="text-xs text-right">
                                  {item.totalAmount
                                    ? parseFloat(item.totalAmount).toFixed(2)
                                    : 0.0}
                                </td>
                                <td className="text-xs"></td>
                              </tr>
                            </>
                          ))
                        : ""}
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

export default SalaryPaymentReport;
