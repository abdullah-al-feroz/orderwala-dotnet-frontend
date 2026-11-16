import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/issue").then((res) => {
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
            <h5 className="am-title">All Issues</h5>
            {/* <Link to="/create-issue" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link> */}
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
                          Referrence No
                        </th>

                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Finished Goods
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Batch No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          RMPM Receive
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Produce
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Batch Size
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Production
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Receipe Type
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
                          <td className="text-xs">{item.product.name}</td>
                          <td className="text-xs">{item.reference_no}</td>
                          <td className="text-xs">{item.batch_no}</td>
                          <td className="text-xs">
                            {item.rmpm_receive_status != 1 ? (
                              <Link
                                to={{ pathname: "/rmpm-receive/" + item.id }}
                                className="btn btn-info btn-sm"
                              >
                                RMPM Receive
                              </Link>
                            ) : (
                              <p className="btn btn-success btn-sm">
                                <i className="fa fa-check"></i>
                              </p>
                            )}
                          </td>
                          <td className="text-xs">
                            {item.rmpm_receive_status == 1 ? (
                              item.production_status != 1 ? (
                                <Link
                                  to={{
                                    pathname: "/production-generate/" + item.id,
                                  }}
                                  className="btn btn-info btn-sm"
                                >
                                  Receive
                                </Link>
                              ) : (
                                <p className="btn btn-success btn-sm">
                                  <i className="fa fa-check"></i>
                                </p>
                              )
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="text-xs">{item.batch_size}</td>
                          <td className="text-xs">{item.batch_size}</td>
                          <td className="text-xs">{item.receipe_type}</td>
                          {role === "admin" && (
                            <td className="text-xs">
                              <Link
                                to={{
                                  pathname: "/issue-view/" + item.id,
                                }}
                                className="btn btn-primary btn-sm"
                              >
                                <i
                                  className="fa fa-list"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                              {item.rmpm_receive_status < 1 ? (
                                <Link
                                  to={{
                                    pathname:
                                      "/edit-issue/" +
                                      item.requisition_production_id +
                                      "/" +
                                      item.id,
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
                              <button
                                className="btn btn-danger btn-sm ms-1"
                                onClick={() =>
                                  deleteData(item.id, "unit", "unit")
                                }
                              >
                                <i className="fa fa-trash"></i>
                              </button>
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
