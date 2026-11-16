import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const SubcategoryLedgerReport = (props) => {
  const location = useLocation();
  const { id } = useParams();
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
    Http.post("/subcategory-ledger-report/" + id).then((res) => {
      setOpeningBalance(res.data.opening);
      setTotalDebit(res.data.totalDebit);
      setTotalCredit(res.data.totalCredit);
      setReceiveData(res.data.info);
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
            <h5 className="am-title">Subcategory Ledger Report</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg"></div>
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
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Opening Balance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Debit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Credit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Balance
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.length > 0
                        ? receiveData.map((item, index) => (
                            <>
                              <tr key={item.id}>
                                <td className="text-xs">{index + 1}</td>
                                <td className="text-xs">
                                  <b>
                                    {item.hr ? item.hr.card_no : ""}
                                    {item.asset ? item.asset.code : ""}
                                    {item.supplier ? item.supplier.code : ""}
                                  </b>
                                </td>
                                <td className="text-xs">
                                  <b>
                                    {item.hr ? item.hr.name : ""}
                                    {item.asset ? item.asset.name : ""}
                                    {item.supplier ? item.supplier.name : ""}
                                  </b>
                                </td>
                                <td className="text-xs text-end">
                                  {parseFloat(openingBalance).toFixed(2)}
                                </td>
                              </tr>
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

export default SubcategoryLedgerReport;
