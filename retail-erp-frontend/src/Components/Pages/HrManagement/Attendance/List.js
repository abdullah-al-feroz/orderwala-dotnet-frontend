import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";
import moment from "moment";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [staff, setStaff] = useState({});
  const [authData, setAuthData] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [chcekedStaff, setCheckedStaff] = useState([]);
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();

  const [inputs, setInputs] = useState({
    month: ("0" + (date.getMonth() + 1)).slice(-2),
    year: year,
    status: "active",
    from: "",
    to: "",
    hr_staff_basic_info_id: "",
  });

  const [checkedState, setCheckedState] = useState({});
  const [error, setError] = useState({});

  const fetchData = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const date = `${year}-${month}-${day}`;
    const dateTo = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["from"]: date }));
    setInputs((values) => ({ ...values, ["to"]: dateTo }));

    Http.get("/attendance?from=" + date + "&to=" + dateTo).then((res) => {
      setReceiveData(res.data);

      var arr = [];
      res.data.map((item, index) =>
        item.late == 1 && item.salary == 0 ? (arr[item.id] = false) : ""
      );

      setCheckedState(arr);
    });

    Http.get("/staff2").then((res) => {
      setStaff(res.data);
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

  const rejectLate = (id, status, msg) => {
    Http.get(
      "/late_attendance_reject/" +
        status +
        "/" +
        id +
        "/" +
        inputs.month +
        "/" +
        inputs.year
    ).then((res) => {
      setReceiveData(res.data);
      Swal.fire(
        "Late Attendance " + msg + "!",
        "Late Attendance has been " + msg,
        "success"
      );
    });
  };
  const approveDistance = (id, status) => {
    Http.get(
      "/attendance_approve_distance/" +
        status +
        "/" +
        id +
        "/" +
        inputs.month +
        "/" +
        inputs.year
    ).then((res) => {
      setReceiveData(res.data);
      Swal.fire(
        "Attendance Distance Accepted!",
        "Attendance Distance has been Accepted.",
        "success"
      );
    });
  };
  const rejectDistance = (id, status) => {
    Http.get(
      "/attendance_approve_distance/" +
        status +
        "/" +
        id +
        "/" +
        inputs.month +
        "/" +
        inputs.year
    ).then((res) => {
      setReceiveData(res.data);
      Swal.fire(
        "Attendance Distance Rejected!",
        "Attendance Distance has been Rejected.",
        "success"
      );
    });
  };
  const formSubmit = () => {
    Http.get(
      "/attendance?from=" +
        inputs.from +
        "&to=" +
        inputs.to +
        "&staff=" +
        inputs.hr_staff_basic_info_id
    ).then((res) => {
      setReceiveData(res.data);

      var arr = [];
      res.data.map((item, index) =>
        item.late == 1 && item.salary == 0 ? (arr[item.id] = false) : ""
      );

      setCheckedState(arr);
    });
  };

  const checkedAccept = () => {
    inputs.staffList = checkedState;
    console.log(inputs);
    Http.post("/late_attendance_reject_multiple", inputs)
      .then((res) => {
        setReceiveData(res.data);
        Swal.fire(
          "Late Attendance Accepted!",
          "Late Attendance has been Accepted.",
          "success"
        );
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const checked = () => {
    setCheckedAll(true);

    const staffList = [];
    receiveData.map((item, index) =>
      item.late == 1 && item.salary == 0 ? (staffList[item.id] = true) : false
    );
    setCheckedState(staffList);
  };
  const unChecked = () => {
    setCheckedAll(false);

    const staffList = [];
    setCheckedState(staffList);
  };
  const checkedSingleChkBox = (e, position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? e.target.checked : item
    );
    setCheckedState(updatedCheckedState);
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Attendances</h5>
            {(authData.user_type === "admin" ||
              authData.user_type === "hr" ||
              authData.approved_by > 0) && (
              <div>
                {/* <Link to="/create-attendance" className="btn btn-primary">
                  <i className="fa fa-plus-square mg-r-6"></i>Attendance
                </Link> */}
                &nbsp; &nbsp;
                <Link to="/import-attendance" className="btn btn-primary">
                  <i className="fa fa-upload mg-r-6"></i>Import Attendance
                </Link>
              </div>
            )}
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                {(authData.user_type === "admin" ||
                  authData.user_type === "hr" ||
                  authData.approved_by > 0) && (
                  <div className="col-lg">
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="hr_staff_basic_info_id"
                      options={staff}
                      onChange={selectHandleChange}
                    />
                  </div>
                )}
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                    placeholder="From Date"
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                    placeholder="To Date"
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
                      {/* {checkedState.length > 1 ? (
                        <tr>
                          <th colSpan="13">
                            <button className="btn btn-info" onClick={checked}>
                              Checked All
                            </button>{" "}
                            &nbsp;
                            <button
                              className="btn btn-info"
                              onClick={unChecked}
                            >
                              UnChecked All
                            </button>{" "}
                            &nbsp;
                            <button
                              className="btn btn-primary"
                              onClick={checkedAccept}
                            >
                              <i className="fa fa-send mg-r-10"></i> Accept
                            </button>
                          </th>
                        </tr>
                      ) : (
                        ""
                      )} */}
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        {/* <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                          onClick={checked}
                        >
                          #
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Checkin Distance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Checkout Distance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Checkin
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Checkout
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Remarks
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                          width="7%"
                          title="Movement Slip"
                        >
                          Movement
                        </th>
                        <th
                          className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                          width="13%"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          {/* <td className="text-xs">
                            {item.late == 1 && item.salary == 0 ? (
                              <input
                                type="checkbox"
                                checked={checkedState[item.id]}
                                onChange={(e) =>
                                  checkedSingleChkBox(e, item.id)
                                }
                                name="staff_id"
                                value={item.staff.id}
                              />
                            ) : (
                              ""
                            )}
                          </td> */}
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">
                            {item.staff ? item.staff.name : ""}
                          </td>
                          <td className="text-xs">
                            {item.checkin_distance < 1
                              ? (item.checkin_distance * 1000).toFixed(3) +
                                " Meter"
                              : (item.checkin_distance * 1).toFixed(3) + " KM"}
                          </td>
                          <td className="text-xs">
                            {item.checkout_distance < 1
                              ? (item.checkout_distance * 1000).toFixed(3) +
                                " Meter"
                              : (item.checkout_distance * 1).toFixed(3) + " KM"}
                          </td>
                          <td className="text-xs">
                            {new Date(
                              `2000-01-01T${item.start_time}`
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="text-xs">
                            {item.end_time != null
                              ? new Date(
                                  `2000-01-01T${item.end_time}`
                                ).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : ""}
                          </td>
                          <td className="text-xs">{item.remarks}</td>
                          <td className="text-xs">
                            {item.movement_slip.length > 0
                              ? item.movement_slip.map((data, index) => (
                                  <Link
                                    to={{
                                      pathname:
                                        "/movement-slip-view/" + data.id,
                                    }}
                                    className="btn btn-info btn-sm ms-1"
                                    target="_blank"
                                  >
                                    <i
                                      className="fa fa-list"
                                      aria-hidden="true"
                                    ></i>
                                  </Link>
                                ))
                              : ""}
                          </td>
                          <td className="text-xs">
                            {(authData.user_type === "admin" ||
                              authData.user_type === "hr") &&
                            item.late == 1 &&
                            item.salary == 0 ? (
                              <button
                                className="btn btn-info btn-sm ms-1"
                                onClick={() =>
                                  rejectLate(item.id, 1, "Approved")
                                }
                                title="Approve Late Attendance"
                              >
                                <i className="fa fa-check"></i>
                              </button>
                            ) : (
                              ""
                            )}
                            {(authData.user_type === "admin" ||
                              authData.user_type === "hr") &&
                            item.late == 0 &&
                            item.salary == 0 &&
                            item.reject_late_attendance == 1 ? (
                              <button
                                className="btn btn-danger btn-sm ms-1"
                                title="Reject Late Attendance"
                                onClick={() =>
                                  rejectLate(item.id, 0, "Rejected")
                                }
                              >
                                <i className="fa fa-minus"></i>
                              </button>
                            ) : (
                              ""
                            )}
                            {authData.user_type === "admin" ||
                            authData.user_type === "hr" ? (
                              item.approve_distance == 0 && item.salary == 0 ? (
                                <button
                                  className="btn btn-primary btn-sm ms-1"
                                  onClick={() => approveDistance(item.id, 1)}
                                  title="Approve distance"
                                >
                                  <i className="fa fa-check"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-danger btn-sm ms-1"
                                  onClick={() => rejectDistance(item.id, 0)}
                                  title="Reject distance"
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              )
                            ) : (
                              ""
                            )}
                            {(authData.user_type === "admin" ||
                              authData.user_type === "hr") &&
                            item.salary == 0 ? (
                              <button
                                className="btn btn-danger btn-sm ms-1"
                                onClick={() =>
                                  deleteData(item.id, "region", "Region")
                                }
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            ) : (
                              ""
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
