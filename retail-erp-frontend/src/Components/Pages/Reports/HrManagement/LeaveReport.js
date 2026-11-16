import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const LeaveReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/report-leave-report").then((res) => {
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Salary Structure</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 _datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center"
                          colSpan={4}
                        >
                          Leave Allowanced
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center"
                          colSpan={4}
                        >
                          Leave Taken
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center"
                          colSpan={4}
                        >
                          Leave Closing Balance
                        </th>
                      </tr>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Casual
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sick
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Earn
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Others
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Casual
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sick
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Earn
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Others
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Casual
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sick
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Earn
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Others
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData &&
                        receiveData.map((item, index) => (
                          <>
                            <tr key={item.id}>
                              <td className="text-xs">{index + 1}</td>
                              <td className="text-xs" colSpan={13}>
                                <b>{item.dept_name}</b>
                              </td>
                            </tr>
                            {item.staff.map((item2, index2) => (
                              <tr key={item2.id}>
                                <td className="text-xs"></td>
                                <td className="text-xs">{item2.name}</td>
                                <td className="text-xs">{item.casual}</td>
                                <td className="text-xs">{item.sick}</td>
                                <td className="text-xs">{item.earn}</td>
                                <td className="text-xs">{item.others}</td>
                                <td className="text-xs">{item2.casual}</td>
                                <td className="text-xs">{item2.sick}</td>
                                <td className="text-xs">{item2.earn}</td>
                                <td className="text-xs">{item2.others}</td>
                                <td className="text-xs">
                                  {item.casual > 0
                                    ? item.casual
                                    : 0 - item2.casual
                                    ? item2.casual
                                    : 0}
                                </td>
                                <td className="text-xs">
                                  {item.sick > 0
                                    ? item.sick
                                    : 0 - item2.sick > 0
                                    ? item2.sick
                                    : 0}
                                </td>
                                <td className="text-xs">
                                  {item.earn > 0
                                    ? item.earn
                                    : 0 - item2.earn > 0
                                    ? item2.earn
                                    : 0}
                                </td>
                                <td className="text-xs">
                                  {item.others > 0
                                    ? item.others
                                    : 0 - item2.others > 0
                                    ? item2.others
                                    : 0}
                                </td>
                              </tr>
                            ))}
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

export default LeaveReport;
