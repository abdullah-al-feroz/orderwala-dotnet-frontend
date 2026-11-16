import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const FinishedGoodStock = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [visibleDetail, setVisibleDetail] = useState(null);

  const fetchData = () => {
    Http.get("/app/dsr/dsr-receive-amount-ledger").then((res) => {
      setReceiveData(res.data.list);
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

  // Function to toggle detail row
  const toggleDetail = (index) => {
    setVisibleDetail(visibleDetail === index ? null : index);
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel" style={{ marginTop: "50px" }}>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <h6 className="card-body-title mg-sm-b-30 text-center">
                DSR & Distributor Receive Amount
              </h6>
              <hr />
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 _datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          DSR Received Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Distributor Received Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiveData.map((item, index) => (
                        <>
                          <tr
                            key={item.date}
                            onClick={() => toggleDetail(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <th>
                              <FontAwesomeIcon
                                icon={
                                  visibleDetail === index ? faMinus : faPlus
                                }
                              />{" "}
                              {item.date}
                            </th>
                            <td className="text-xs text-right">
                              {item.dsr_received_amount.toFixed(2)}
                            </td>
                            <td className="text-xs text-right">
                              {item.distributor_received_amount.toFixed(2)}
                            </td>
                          </tr>
                          {visibleDetail === index && (
                            <tr>
                              <td colSpan="3">
                                <table className="table table-sm ">
                                  <thead>
                                    <tr>
                                      <th>Code</th>
                                      <th>Shop/Customer Name</th>
                                      <th>Received By</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.payments.map(
                                      (payment, paymentIndex) => (
                                        <>
                                          <tr key={paymentIndex}>
                                            <td>{payment.code}</td>
                                            <td>
                                              {payment.customers
                                                ? payment.customers.owner_name
                                                : ""}
                                            </td>
                                            <th>
                                              {payment.dsr
                                                ? payment.dsr.name
                                                : ""}
                                            </th>
                                            <th className="text-right">
                                              {payment.amount}
                                            </th>
                                          </tr>
                                        </>
                                      )
                                    )}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan={3} className="text-right">
                                        Total Payments for {item.date}:
                                      </td>
                                      <td className="text-right">
                                        {item.payments
                                          .reduce(
                                            (acc, payment) =>
                                              acc + parseFloat(payment.amount),
                                            0
                                          )
                                          .toFixed(2)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </td>
                            </tr>
                          )}
                        </>
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

export default FinishedGoodStock;
