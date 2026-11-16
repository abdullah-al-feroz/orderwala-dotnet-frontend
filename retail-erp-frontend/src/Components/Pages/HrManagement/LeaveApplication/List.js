import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState({});
  const [staff, setStaff] = useState({});
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const [inputs, setInputs] = useState({
    month: ("0" + (date.getMonth() + 1)).slice(-2),
    year: year,
    status: "active",
    from: "",
    to: "",
    hr_staff_basic_info_id: "",
  });

  const fetchData = () => {
    Http.get("/leave-application").then((res) => {
      setReceiveData(res.data);
    });

    Http.get("/login-staff-detail").then((res) => {
      setAuthData(res.data);
    });

    Http.get("/staff2").then((res) => {
      setStaff(res.data);
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

  const leaveApproved = (id) => {
    Http.get("/leave-approved/" + id)
      .then((res) => {
        navigate("/leave-application", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/leave-application").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const leaveHrApproved = (id) => {
    Http.get("/leave-hr-approved/" + id)
      .then((res) => {
        navigate("/leave-application", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/leave-application").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const leaveRecommended = (id) => {
    Http.get("/leave-recommended/" + id)
      .then((res) => {
        navigate("/leave-application", {
          state: { message: res.data.message, type: "success" },
        });
        Http.get("/leave-application").then((res) => {
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
          Http.get("/leave-application").then((res) => {
            setReceiveData(res.data);
          });
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

  const formSubmit = () => {
    Http.get("/leave-application?from=" + inputs.from + "&to=" + inputs.to + "&staff=" + inputs.hr_staff_basic_info_id).then((res) => {
      setReceiveData(res.data);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Leave Application</h5>

            <Link to="/create-leave-application" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Leave Application
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                {(authData.user_type === "admin" || authData.user_type === "hr" || authData.approved_by > 0) && (
                  <div className="col-lg">
                    <Select className="basic-single" classNamePrefix="select" name="hr_staff_basic_info_id" options={staff} onChange={selectHandleChange} />
                  </div>
                )}
                <div className="col-lg">
                  <input type="date" className="form-control" name="from" value={inputs.from || ""} onChange={handleChange} placeholder="From Date" />
                </div>
                <div className="col-lg">
                  <input type="date" className="form-control" name="to" value={inputs.to || ""} onChange={handleChange} placeholder="To Date" />
                </div>
                <div className="col-lg">
                  <button className="btn btn-primary btn-block mg-b-10" onClick={formSubmit}>
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
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Name</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Leave Available</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Leave Taken</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Applied at</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">From</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">To</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Total</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Type</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Status</th>

                        {/* {authData.department_head > 0 ||
                          (authData.user_type === "admin" && ( */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2" width="10%">
                          Action
                        </th>
                        {/* ))} */}
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">
                            <Link to={{ pathname: "/profile/" + item.hr_staff_basic_info_id }}>{item.staff ? item.staff.name : ""}</Link>
                          </td>
                          <td className="text-xs">
                            <ul className="mb-0">
                              {Object.entries(item.available)
                                .filter(([key, value]) => value)
                                .map(([key, value]) => (
                                  <li key={key}>{`${key} = ${value}`}</li>
                                ))}
                            </ul>
                          </td>

                          <td className="text-xs">
                            <ul>
                              {item.casual > 0 && <li>casual = {item.casual}</li>}
                              {item.sick > 0 && <li>sick = {item.sick}</li>}
                              {item.earn > 0 && <li>earn = {item.earn}</li>}
                              {item.others > 0 && <li>others = {item.others}</li>}
                              {item.anual > 0 && <li>anual = {item.anual}</li>}
                              {item.special > 0 && <li>special = {item.special}</li>}
                            </ul>
                          </td>
                          <td className="text-xs">{item.application_date}</td>
                          <td className="text-xs">{item.start_date}</td>
                          <td className="text-xs">{item.end_date}</td>
                          <td className="text-xs">{item.total_days}</td>
                          <td className="text-xs">{item.leave_type}</td>
                          <td className="text-xs">{item.status}</td>
                          <td className="text-xs" style={{ textWrap: "nowrap" }}>
                            {(authData.user_type === "admin" || authData.department_head > 0) && item.recommened_by < 1 && item.approved_by < 1 && authData.department_id === item.staff.department_id && (
                              <>
                                <button className="btn btn-info btn-sm ms-1" title="Recommend" onClick={() => leaveRecommended(item.id)}>
                                  <i className="fa fa-thumbs-up"></i>
                                </button>
                              </>
                            )}
                            {(authData.user_type === "admin" || authData.approved_by > 0) && item.approved_by < 1 && (
                              <>
                                <button className="btn btn-primary btn-sm ms-1" title="Approve" onClick={() => leaveApproved(item.id)}>
                                  <i className="fa fa-check"></i>
                                </button>
                              </>
                            )}
                            {(authData.user_type === "admin" || authData.user_type === "hr") && item.approved_by > 1 && item.hr_approved_by < 1 && (
                              <>
                                <button className="btn btn-primary btn-sm ms-1" title="Approve" onClick={() => leaveHrApproved(item.id)}>
                                  <i className="fa fa-check"></i>
                                </button>
                              </>
                            )}
                            {(authData.user_type === "admin" || authData.user_type === "hr") && item.hr_approved_by < 1 && (
                              <>
                                <button className="btn btn-danger btn-sm ms-1" onClick={() => deleteData(item.id, "leave-application", "Leave Application")}>
                                  <i className="fa fa-trash"></i>
                                </button>
                              </>
                            )}
                            <Link to={{ pathname: "/leave-application-view/" + item.id }} className="btn btn-info btn-sm ms-1">
                              <i className="fa fa-list" aria-hidden="true"></i>
                            </Link>
                          </td>
                          {/* ))} */}
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
