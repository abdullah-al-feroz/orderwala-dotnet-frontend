import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/requisition-production").then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/staff-type-check").then((res) => {
      setRole(res.data);
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

  const deleteData = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Requisition Production</h5>
            <Link
              to="/create-requisition-production"
              className="btn btn-primary"
            >
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

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
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Time
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Finished Good
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Batch Size
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Expected Production Date
                        </th>
                        {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Detail
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created by
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
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.time}</td>
                          <td className="text-xs">
                            {item.product ? item.product.name : ""}
                          </td>
                          <td className="text-xs">{item.batch_size}</td>
                          <td className="text-xs">
                            {item.expected_production_date}
                          </td>
                          {/* <td className="text-xs">
                            {Array.from(item.items).map((list, index) =>
                              list.product ? list.product.name : "" - list.qty
                            )}
                          </td> */}
                          <td className="text-xs">
                            {item.created_by ? item.created_by.name : ""}
                          </td>
                          {role === "admin" && (
                            <td className="text-xs">
                              {item.issue == null ? (
                                <Link
                                  to={{
                                    pathname: "/create-issue/" + item.id,
                                  }}
                                  className="btn btn-primary btn-sm"
                                >
                                  <i
                                    className="fa fa-plus"
                                    aria-hidden="true"
                                  ></i>
                                </Link>
                              ) : (
                                ""
                              )}
                              <Link
                                to={{
                                  pathname:
                                    "/requisition-production-view/" + item.id,
                                }}
                                className="btn btn-info btn-sm ms-1"
                              >
                                <i
                                  className="fa fa-list"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                              {item.issue == null ? (
                                <Link
                                  to={{
                                    pathname:
                                      "/edit-requisition-production/" + item.id,
                                  }}
                                  className="btn btn-secondary btn-sm ms-1"
                                >
                                  <i
                                    className="fa fa-pencil"
                                    aria-hidden="true"
                                  ></i>
                                </Link>
                              ) : (
                                ""
                              )}
                              {item.issue == null ? (
                                <button
                                  className="btn btn-danger btn-sm ms-1"
                                  onClick={() =>
                                    deleteData(
                                      item.id,
                                      "requisition-production",
                                      "Requisition Production"
                                    )
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          )}
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
