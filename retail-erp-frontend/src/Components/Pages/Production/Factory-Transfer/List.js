import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState({});
  const [authData, setAuthData] = useState([]);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/pro-factory-transfer").then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/login-staff-detail").then((res) => {
      setAuthData(res.data);
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

  const received = (id) => {
    Http.get("/transfer-received/" + id)
      .then((res) => {
        navigate("/factory-transfer", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/pro-factory-transfer").then((res) => {
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
            <h5 className="am-title">All Factory Transfer</h5>
            <Link to="/create-factory-transfer" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New Transfer
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
                          Receipt no
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Depot Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Price
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Receive Status
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
                          <td className="text-xs">{item.receipt_no}</td>
                          <td className="text-xs">
                            {item.factory ? item.factory.name : ""}
                          </td>
                          <td className="text-xs text-right">
                            {parseFloat(item.total_price).toFixed(2)}
                          </td>
                          <td className="text-xs">
                            {item.receive_status == 1 ? "Received" : "Pending"}
                          </td>

                          <td className="text-xs">
                            <Link
                              to={{
                                pathname: "/show-transfer/" + item.id,
                              }}
                              className="btn btn-primary btn-sm ms-1"
                              title="Show"
                            >
                              <i
                                className="fa fa-list ms-1"
                                aria-hidden="true"
                              ></i>
                            </Link>
                            {authData.user_type === "depot" &&
                              item.receive_status < 1 && (
                                <button
                                  className="btn btn-primary btn-sm ms-1"
                                  title="Approve"
                                  onClick={() => received(item.id)}
                                >
                                  <i className="fa fa-check"></i>
                                </button>
                              )}
                            {(authData.user_type === "admin" ||
                              authData.user_type === "supply_chain") &&
                              item.receive_status < 1 && (
                                <>
                                  <Link
                                    to={{
                                      pathname:
                                        "/edit-factory-transfer/" + item.id,
                                    }}
                                    className="btn btn-info btn-sm ml-1"
                                  >
                                    <i
                                      className="fa fa-pencil"
                                      aria-hidden="true"
                                    ></i>
                                  </Link>
                                  <button
                                    className="btn btn-danger btn-sm ms-1"
                                    onClick={() =>
                                      deleteData(
                                        item.id,
                                        "factory-transfer",
                                        "factory-transfer"
                                      )
                                    }
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
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
