import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const VendorSupplierPayableReport = () => {
  const location = useLocation();
  const [totalDebit, setTotalDebit] = useState([]);
  const [totalCredit, setTotalCredit] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/vendor-supplier-receivable-report").then((res) => {
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Vendor / Supplier Receivable</h5>
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
                          Sl
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Debit(Taka)
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Credit(Taka)
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Amount
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
                                  <b>{item.name}</b>
                                </td>
                                <td className="text-xs">
                                  <b>{item.code}</b>
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
                                      ? parseFloat(
                                          item.debit - item.credit
                                        ).toFixed(2)
                                      : 0.0}
                                  </b>
                                </td>
                              </tr>
                            </>
                          ))
                        : ""}
                      {receiveData.length > 0 ? (
                        <tr>
                          <td className="text-xs" colSpan={3}>
                            Grand Total Amount (Taka) :
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(totalDebit).toFixed(2)}
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(totalCredit).toFixed(2)}
                          </td>
                          <td className="text-xs text-end">
                            {parseFloat(totalDebit - totalCredit).toFixed(2)}
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

export default VendorSupplierPayableReport;
