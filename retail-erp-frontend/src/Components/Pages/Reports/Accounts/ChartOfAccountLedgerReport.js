import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const ChartOfAccountLedgerReport = () => {
  const location = useLocation();
  const [openingBalance, setOpeningBalance] = useState([]);
  const [totalDebit, setTotalDebit] = useState([]);
  const [totalCredit, setTotalCredit] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [chartOfAccount, setChartOfAccount] = useState({});
  const [inputs, setInputs] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    status: "active",
  });
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    // Http.post("/salary-payment-report/", inputs).then((res) => {
    //   setReceiveData(res.data);
    // });

    Http.get("/chartOfAccountSelect2").then((res) => {
      setChartOfAccount(res.data);
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

  const formSubmit = () => {
    Http.post("/chart-of-account-report/", inputs).then((res) => {
      setOpeningBalance(res.data.opening);
      setTotalDebit(res.data.totalDebit);
      setTotalCredit(res.data.totalCredit);
      setReceiveData(res.data.info);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Chart Of Account Report</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={chartOfAccount[0]}
                    name="chart_of_account_id"
                    options={chartOfAccount}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>
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
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Voucher Type
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Type
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Subsidiary
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Dr. Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Cr. Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Balance
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.length > 0 ? (
                        <tr>
                          <td className="text-xs" colSpan={8}>
                            Opening Balance
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(openingBalance).toFixed(2)}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                      {receiveData.length > 0
                        ? receiveData.map((item, index) => (
                            <>
                              <tr key={item.id}>
                                <td className="text-xs">
                                  <b>{item.date}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{item.chart_of_account.code}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{item.journal_voucher.serial_number}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{item.type}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{item.debit ? "D" : "C"}</b>
                                </td>
                                <td className="text-xs">
                                  <b>
                                    {item.hr
                                      ? item.hr.card_no + " - " + item.hr.name
                                      : ""}
                                    {item.asset
                                      ? item.asset.code +
                                        " - " +
                                        item.asset.name
                                      : ""}
                                    {item.supplier
                                      ? item.supplier.code +
                                        " - " +
                                        item.supplier.name
                                      : ""}
                                  </b>
                                </td>
                                <td className="text-xs text-end">
                                  <b>
                                    {item.debit
                                      ? parseFloat(item.debit).toFixed(2)
                                      : 0.0}
                                  </b>
                                </td>
                                <td className="text-xs text-end">
                                  <b>
                                    {item.credit
                                      ? parseFloat(item.credit).toFixed(2)
                                      : 0.0}
                                  </b>
                                </td>
                                <td className="text-xs text-end">
                                  <b>
                                    {item.balance
                                      ? parseFloat(item.balance).toFixed(2)
                                      : 0.0}
                                  </b>
                                </td>
                              </tr>

                              {/* <tr>
                                <td className="text-xs"></td>
                                <td className="text-xs">Cost Center Total :</td>
                                <td className="text-xs"></td>
                                <td className="text-xs text-right">
                                  {item.totalAmount
                                    ? parseFloat(item.totalAmount).toFixed(2)
                                    : 0.0}
                                </td>
                                <td className="text-xs"></td>
                              </tr> */}
                            </>
                          ))
                        : ""}
                      {receiveData.length > 0 ? (
                        <tr>
                          <td className="text-xs" colSpan={6}>
                            Grand Total Amount (Taka) :
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(totalDebit).toFixed(2)}
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(totalCredit).toFixed(2)}
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(totalCredit - totalDebit).toFixed(2)}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
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

export default ChartOfAccountLedgerReport;
