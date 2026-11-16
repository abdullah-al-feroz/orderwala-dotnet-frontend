import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import { format } from "date-fns";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authData, setAuthData] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
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
    Http.get("/movement-slip").then((res) => {
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

  const approved = (id) => {
    Http.get("/movement-slip-approved/" + id)
      .then((res) => {
        navigate("/movement-slip", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/movement-slip").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const recommended = (id) => {
    Http.get("/movement-slip-recommended/" + id)
      .then((res) => {
        navigate("/movement-slip", {
          state: { message: res.data.message, type: "success" },
        });
        Http.get("/movement-slip").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const slipApproved = (id) => {
    Http.get("/movement-slip-hr-approved/" + id + "/1")
      .then((res) => {
        navigate("/movement-slip", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/movement-slip").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const slipReject = (id) => {
    Http.get("/movement-slip-hr-approved/" + id + "/0")
      .then((res) => {
        navigate("/movement-slip", {
          state: { message: res.data.message, type: "success" },
        });

        Http.get("/movement-slip").then((res) => {
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
    Http.get("/movement-slip?from=" + inputs.from + "&to=" + inputs.to + "&staff=" + inputs.hr_staff_basic_info_id).then((res) => {
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
            <h5 className="am-title">All Movement Slips</h5>
            <Link to="/create-movement-slip" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Movement Slip
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
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Type</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Date</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Start Time</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">End Time</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Remarks</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Status</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">Created At</th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2" width="10%">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{item.staff.name}</td>
                          <td className="text-xs">{item.type}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.start_time}</td>
                          <td className="text-xs">{item.end_time}</td>
                          <td className="text-xs">{item.remarks}</td>
                          <td className="text-xs">{item.status}</td>
                          <td className="text-xs">{format(new Date(item.created_at), "MM/dd/yyyy")}</td>
                          <td className="text-xs" style={{ textWrap: "nowrap" }}>
                            {(authData.user_type === "admin" || authData.department_head > 0) && item.recommened_by < 1 && item.approved_by < 1 && authData.department_id === item.staff.department_id && (
                              <>
                                <button className="btn btn-info btn-sm ms-1" title="Recommend" onClick={() => recommended(item.id)}>
                                  <i className="fa fa-thumbs-up"></i>
                                </button>
                              </>
                            )}
                            {(authData.user_type === "admin" || authData.approved_by > 0) && item.approved_by < 1 && item.recommened_by > 0 && (
                              <>
                                <button className="btn btn-primary btn-sm ms-1" title="Approve" onClick={() => approved(item.id)}>
                                  <i className="fa fa-check"></i>
                                </button>
                              </>
                            )}

                            {(authData.user_type === "admin" || authData.user_type === "hr") && item.approved_by > 0 && item.hr_approved_by < 1 && (
                              <button className="btn btn-primary btn-sm ms-1" onClick={() => slipApproved(item.id)}>
                                <i className="fa fa-check"></i>
                              </button>
                            )}
                            {(authData.user_type === "admin" || authData.user_type === "hr") && item.approved_by == 0 && item.hr_approved_by == 0 && (
                              <button className="btn btn-info btn-sm ms-1" onClick={() => slipReject(item.id)}>
                                <i className="fa fa-minus"></i>
                              </button>
                            )}
                            {(authData.user_type === "admin" || authData.user_type === "hr") && item.hr_approved_by < 1 && (
                              <button className="btn btn-danger btn-sm ms-1" onClick={() => deleteData(item.id, "movement-slip", "Movement Slip")}>
                                <i className="fa fa-trash"></i>
                              </button>
                            )}

                            <Link to={{ pathname: "/movement-slip-view/" + item.id }} className="btn btn-primary btn-sm ms-1">
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
