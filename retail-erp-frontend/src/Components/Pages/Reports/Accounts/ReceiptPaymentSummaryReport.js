import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const ReceiptPaymentSummaryReport = () => {
  var firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const location = useLocation();
  const [paymentData, setPaymentData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [openingData, setOpeningData] = useState([]);
  const [totalReceiptData, setTotalReceiptData] = useState([]);
  const [totalPaymentData, setTotalPaymentData] = useState([]);
  const [fromDateData, setFromDateData] = useState([]);
  const [toDateData, setToDateData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({});

  const fetchData = () => {
    Http.post("/receipt-payment-summary-report").then((res) => {
      setFromDateData(res.data.from);
      setToDateData(res.data.to);
      setPaymentData(res.data.payment);
      setReceiptData(res.data.receipt);
      setOpeningData(res.data.opening);
      setTotalReceiptData(res.data.totalReceipt);
      setTotalPaymentData(res.data.totalPayment);
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
    Http.post("/receipt-payment-summary-report/", inputs).then((res) => {
      setFromDateData(res.data.from);
      setToDateData(res.data.to);
      setPaymentData(res.data.payment);
      setReceiptData(res.data.receipt);
      setOpeningData(res.data.opening);
      setTotalReceiptData(res.data.totalReceipt);
      setTotalPaymentData(res.data.totalPayment);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Receipts and Payments Accounts</h5>
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
                    value={fromDateData || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={toDateData || ""}
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
                        <th></th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Acc-Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Head Of Accounts
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td></td>
                        <td></td>
                        <td>Opening Balance</td>
                        <td className="text-end">
                          {openingData
                            ? parseFloat(openingData).toFixed(2)
                            : 0.0}
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>Receipts From</td>
                        <td></td>
                        <td></td>
                      </tr>
                      {receiptData.length > 0
                        ? receiptData.map((receiptItem, index1) => (
                            <>
                              <tr key={receiptItem.parent_id}>
                                <td></td>
                                <td className="text-xs">
                                  <b>{receiptItem.parent_code}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{receiptItem.parent_name}</b>
                                </td>
                                <td className="text-xs text-end">
                                  <b>
                                    {receiptItem.parent_amount
                                      ? parseFloat(
                                          receiptItem.parent_amount
                                        ).toFixed(2)
                                      : 0.0}
                                  </b>
                                </td>
                              </tr>
                              {receiptItem.child.map(
                                (receiptChildItem, index2) => (
                                  <tr key={receiptChildItem.child_id}>
                                    <td></td>
                                    <td className="text-xs">
                                      {receiptChildItem.child_code}
                                    </td>
                                    <td className="text-xs">
                                      {receiptChildItem.child_name}
                                    </td>
                                    <td className="text-xs text-end">
                                      {receiptChildItem.receipt_balance
                                        ? parseFloat(
                                            receiptChildItem.receipt_balance
                                          ).toFixed(2)
                                        : 0.0}
                                    </td>
                                  </tr>
                                )
                              )}
                            </>
                          ))
                        : ""}
                      <tr>
                        <td></td>
                        <td>Payments To</td>
                        <td></td>
                        <td></td>
                      </tr>

                      {paymentData.length > 0
                        ? paymentData.map((item, index3) => (
                            <>
                              <tr key={item.parent_id}>
                                <td></td>
                                <td className="text-xs">
                                  <b>{item.parent_code}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{item.parent_name}</b>
                                </td>
                                <td className="text-xs text-end">
                                  <b>
                                    {item.parent_amount
                                      ? parseFloat(item.parent_amount).toFixed(
                                          2
                                        )
                                      : 0.0}
                                  </b>
                                </td>
                              </tr>
                              {item.payment_child.map((item2, index4) => (
                                <tr key={item2.child_id}>
                                  <td></td>
                                  <td className="text-xs">
                                    {item2.child_code}
                                  </td>
                                  <td className="text-xs">
                                    {item2.child_name}
                                  </td>
                                  <td className="text-xs text-end">
                                    {item2.payment_balance
                                      ? parseFloat(
                                          item2.payment_balance
                                        ).toFixed(2)
                                      : 0.0}
                                  </td>
                                </tr>
                              ))}
                            </>
                          ))
                        : ""}
                      <tr>
                        <td></td>
                        <td></td>
                        <td>Closing Balance</td>
                        <td className="text-end">
                          {parseFloat(
                            openingData + totalReceiptData - totalPaymentData
                          ).toFixed(2)}
                        </td>
                      </tr>
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

export default ReceiptPaymentSummaryReport;
