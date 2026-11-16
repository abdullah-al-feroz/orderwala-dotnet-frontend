import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const View = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const [authData, setAuthData] = useState([]);
  const [listInput, setListInput] = useState([{ amount: "" }]);

  const fetchData = () => {
    Http.get("/movement-slip/" + id).then((res) => {
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
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...listInput]; // Defined Experience State All Information into List Variable

    inputInfo[index] = value;
    setListInput(inputInfo);
  };
  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const recommended = (id) => {
    inputs.id = id;
    Http.post("/movement-slip-recommended", inputs)
      .then((res) => {
        navigate("/movement-slip", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const approve = (id) => {
    inputs.id = id;
    Http.post("/movement-slip-approved", inputs)
      .then((res) => {
        navigate("/movement-slip", {
          state: { message: res.data.message, type: "success" },
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
    inputs.id = id;
    Http.post("/movement-slip-hr-approved/" + id + "/0")
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
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Movement Slip Detail</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Movement Slip Detail:</h5>
                        <div>Date : {receiveData.date}</div>
                        <div>
                          Name :
                          {receiveData.staff ? receiveData.staff.name : ""}
                        </div>
                        <div>Start Time : {receiveData.start_time}</div>
                        <div>End Time : {receiveData.end_time}</div>
                        <div>Remarks : {receiveData.remarks}</div>
                        <div>Status : {receiveData.status}</div>

                        <div>
                          Recommended By :
                          {receiveData.recommened
                            ? receiveData.recommened.name +
                              " - " +
                              receiveData.recommened_remarks
                            : ""}
                        </div>
                        <div>
                          Approved By :
                          {receiveData.approved
                            ? receiveData.approved.name +
                              " - " +
                              receiveData.approved_remarks
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 mb-4">
                        {(authData.user_type === "admin" ||
                          authData.department_head > 0) &&
                          receiveData.recommened_by < 1 &&
                          receiveData.approved_by < 1 &&
                          authData.department_id ===
                            receiveData.staff.department_id && (
                            <>
                              <div className="col-lg mb-4 pl-0">
                                <label>Remarks</label>
                                <textarea
                                  className="form-control"
                                  name="remarks"
                                  value={inputs.remarks || ""}
                                  onChange={handleChange}
                                />
                              </div>

                              <button
                                className="btn btn-info btn-sm ms-1"
                                title="Recommend"
                                onClick={() => recommended(receiveData.id)}
                              >
                                <i className="fa fa-thumbs-up"></i> Recommended
                              </button>

                              <button
                                className="btn btn-danger btn-sm ms-1"
                                onClick={() => slipReject(receiveData.id)}
                              >
                                <i className="fa fa-minus"></i> Reject
                              </button>
                            </>
                          )}
                        {(authData.user_type === "admin" ||
                          authData.approved_by > 0) &&
                          receiveData.approved_by < 1 &&
                          receiveData.recommened_by > 0 && (
                            <>
                              <div className="col-lg mb-4 pl-0">
                                <label>Remarks</label>
                                <textarea
                                  className="form-control"
                                  name="remarks"
                                  value={inputs.remarks || ""}
                                  onChange={handleChange}
                                />
                              </div>

                              <button
                                className="btn btn-primary btn-sm ms-1"
                                title="Approve"
                                onClick={() => approve(receiveData.id)}
                              >
                                <i className="fa fa-check"></i> Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm ms-1"
                                onClick={() => slipReject(receiveData.id)}
                              >
                                <i className="fa fa-minus"></i> Reject
                              </button>
                            </>
                          )}
                        {(authData.user_type === "admin" ||
                          authData.user_type === "hr") &&
                          receiveData.approved_by > 0 &&
                          receiveData.hr_approved_by < 1 && (
                            <>
                              <div className="col-lg mb-4 pl-0">
                                <label>Remarks</label>
                                <textarea
                                  className="form-control"
                                  name="remarks"
                                  value={inputs.remarks || ""}
                                  onChange={handleChange}
                                />
                              </div>
                              <button
                                className="btn btn-primary btn-sm ms-1"
                                onClick={() => slipApproved(receiveData.id)}
                              >
                                <i className="fa fa-check"></i> Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm ms-1"
                                onClick={() => slipReject(receiveData.id)}
                              >
                                <i className="fa fa-minus"></i> Reject
                              </button>
                            </>
                          )}
                        {(authData.user_type === "admin" ||
                          authData.user_type === "hr") &&
                          receiveData.hr_approved_by < 1 && (
                            <button
                              className="btn btn-danger btn-sm ms-1"
                              onClick={() =>
                                deleteData(
                                  receiveData.id,
                                  "movement-slip",
                                  "Movement Slip"
                                )
                              }
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
