import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [role, setRole] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/direct-purchase").then((res) => {
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
            <h5 className="am-title">All Direct Purchase </h5>
            <Link to="/create-direct-purchase" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> New
            </Link>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
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
                          Receipt No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Vendor
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Factory
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Description
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created By
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Receive
                        </th>
                        <th
                          width="13%"
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.receipt_no}</td>
                          <td className="text-xs">
                            {item.vendor ? item.vendor.name : ""}
                          </td>
                          <td className="text-xs">
                            {item.factory ? item.factory.name : ""}
                          </td>
                          <td className="text-xs">
                            {parseFloat(item.total_amount).toFixed(2)}
                          </td>
                          <td className="text-xs">{item.description}</td>
                          <td className="text-xs">
                            {item.created_by ? item.created_by.name : ""}
                          </td>
                          <td className="text-xs">
                            {item.status != "completed" && role == "depot" ? (
                              <Link
                                className="btn btn-primary btn-sm ms-1"
                                to={{
                                  pathname: "/create-grn/" + item.id + "/dp",
                                }}
                              >
                                <i className="fa fa-send"></i> Receive
                              </Link>
                            ) : (
                              <>
                                <b> {item.status}</b>
                              </>
                            )}
                          </td>

                          <td className="text-xs">
                            <Link
                              to={{
                                pathname: "/show-direct-purchase/" + item.id,
                              }}
                              className="btn btn-info btn-sm ms-1"
                              title="Show"
                            >
                              <i
                                className="fa fa-list ms-1"
                                aria-hidden="true"
                              ></i>
                            </Link>
                            {(role === "admin" || role == "supply_chain") && (
                              <>
                                {item.grn.length == 0 ? (
                                  <Link
                                    to={{
                                      pathname:
                                        "/edit-direct-purchase/" + item.id,
                                    }}
                                    className="btn btn-primary btn-sm ms-1"
                                    title="Edit"
                                  >
                                    <i
                                      className="fa fa-pencil"
                                      aria-hidden="true"
                                    ></i>
                                  </Link>
                                ) : (
                                  ""
                                )}

                                {item.grn.length == 0 ? (
                                  <button
                                    title="Delete"
                                    className="btn btn-danger btn-sm ms-1"
                                    onClick={() =>
                                      deleteData(
                                        item.id,
                                        "direct-purchase",
                                        "direct-purchase"
                                      )
                                    }
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                ) : (
                                  ""
                                )}
                              </>
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
