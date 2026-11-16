import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/bill-submission").then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/login-staff-detail").then((res) => {
      setAuthData(res.data);
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

  const slipApproved = (id) => {
    Http.get("/bill-submission-approved/" + id + "/1")
      .then((res) => {
        navigate("/billsubmission", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/bill-submission").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const slipReject = (id) => {
    Http.get("/bill-submission-approved/" + id + "/0")
      .then((res) => {
        navigate("/billsubmission", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/bill-submission").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

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
            <h5 className="am-title">All Bill Submissions</h5>
            <Link to="/create-bill-submission" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Bill Submission
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
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Submitted Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Remarks
                        </th>
                        {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Recommended
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Approved
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Status
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
                          <td className="text-xs">
                            {item.staff ? item.staff.name : ""}
                          </td>
                          <td className="text-xs">{item.submitted_date}</td>
                          <td className="text-xs">{item.total_amount}</td>
                          <td className="text-xs">{item.remarks}</td>
                          {/* <td className="text-xs">
                            {item.recommended != null
                              ? item.recommended.name
                              : ""}
                          </td> */}
                          <td className="text-xs">
                            {item.approved != null ? item.approved.name : ""}
                          </td>
                          <td className="text-xs">{item.status}</td>
                          <td className="text-xs">
                            {(authData.user_type === "admin" ||
                              authData.approved_by > 0) &&
                              item.approved_by < 1 && (
                                <button
                                  className="btn btn-primary btn-sm ms-1"
                                  onClick={() => slipApproved(item.id)}
                                >
                                  <i className="fa fa-check"></i>
                                </button>
                              )}
                            {(authData.user_type === "admin" ||
                              authData.approved_by > 0) &&
                              item.approved_by > 0 && (
                                <button
                                  className="btn btn-info btn-sm ms-1"
                                  onClick={() => slipReject(item.id)}
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              )}
                            {(authData.user_type === "admin" ||
                              authData.user_type === "hr") &&
                              item.approved_by < 1 && (
                                <button
                                  className="btn btn-danger btn-sm ms-1"
                                  onClick={() =>
                                    deleteData(
                                      item.id,
                                      "bill-submission",
                                      "Bill Submission"
                                    )
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              )}
                            <Link
                              to={{
                                pathname: "/bill-submission-view/" + item.id,
                              }}
                              className="btn btn-info btn-sm ms-1"
                            >
                              <i className="fa fa-list" aria-hidden="true"></i>
                            </Link>
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
