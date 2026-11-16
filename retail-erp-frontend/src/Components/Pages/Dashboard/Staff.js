import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../Common/Http";
import FormValidation from "../../Common/FormValidation";
import Info from "../HrManagement/Staff/Profile/Info";
import Salary from "../HrManagement/Staff/Profile/Salary";
import Apa from "../HrManagement/Staff/Profile/Apa";
import Attendance from "../HrManagement/Staff/Profile/Attendance";
import BillSubmission from "../HrManagement/Staff/Profile/BillSubmission";
import LeaveApplication from "../HrManagement/Staff/Profile/LeaveApplication";
import MovementSlip from "../HrManagement/Staff/Profile/MovementSlip";
import Transactions from "../HrManagement/Staff/Profile/Transactions";
import { LoaderComponent } from "../../Common/LoaderComponent";

const Staff = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [apa, setApa] = useState({});
  const [transactions, setTransactions] = useState({});
  const [attendance, setAttendance] = useState({});
  const [billSubmission, setBillSubmission] = useState({});
  const [leaveApplication, setLeaveApplication] = useState({});
  const [movementSlip, setMovementSlip] = useState({});
  const [salary, setSalary] = useState({});
  const [error, setError] = useState({});
  const [receiveData, setReceiveData] = useState({});
  const [id, setId] = useState({});

  const fetchData = () => {
    Http.get("/login-staff-detail").then((res) => {
      setId(res.data.id);
      const id = res.data.id;

      Http.get("/staff/" + id + "/edit").then((res) => {
        setReceiveData(res.data);
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const salaryLoad = () => {
    Http.get("/salary-staff-info/" + id).then((res) => {
      setSalary(res.data);
    });
  };
  const apaLoad = () => {
    Http.get("/apa-staff-info/" + id).then((res) => {
      setApa(res.data);
    });
  };
  const leaveApplicaitonLoad = () => {
    Http.get("/leave-application-staff-info/" + id).then((res) => {
      setLeaveApplication(res.data);
    });
  };
  const movmentSlipLoad = () => {
    Http.get("/movment-slip-staff-info/" + id).then((res) => {
      setMovementSlip(res.data);
    });
  };
  const billSubmissionLoad = () => {
    Http.get("/bill-submission-staff-info/" + id).then((res) => {
      setBillSubmission(res.data);
    });
  };
  const attendanceLoad = () => {
    Http.get("/attendance-staff-info/" + id).then((res) => {
      setAttendance(res.data);
    });
  };
  const transactionsLoad = () => {
    Http.get("/transactions-staff-info/" + id).then((res) => {
      setTransactions(res.data);
    });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">{receiveData.name}</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Profile</h6>
            {/* <div className="row">
                <div className="col-lg">
                  <FormValidation error={error} />
                </div>
              </div> */}
            <div className="row row-sm">
              <div className="col-lg-12 mb-5">
                <div className="card" style={{ backgroundColor: "#D0D0D0" }}>
                  <div className="wd-100p">
                    <div className="pd-x-20 pd-20">
                      <section className="content">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="box box-primary">
                              <div className="box-body box-profile">
                                <img
                                  className="profile-user-img img-responsive img-circle img-thumbnail"
                                  style={{ margin: "0 auto" }}
                                  src="assets/img/default_user.png"
                                  alt="User profile picture"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="box box-primary">
                              <div className="box-body box-profile text-center">
                                <ul className="list-group list-group-unbordered">
                                  <li className="list-group-item text-left pt-3">
                                    <h3 className="profile-username text-center">
                                      {receiveData.name}
                                    </h3>
                                  </li>
                                  <li className="list-group-item text-left pt-2">
                                    <b>Department</b>{" "}
                                    <span className="pull-right">
                                      {receiveData.department
                                        ? receiveData.department.name
                                        : ""}
                                    </span>
                                  </li>
                                  <li className="list-group-item text-left">
                                    <b>Card No</b>{" "}
                                    <a className="pull-right">
                                      {receiveData.card_no}
                                    </a>
                                  </li>
                                  <li className="list-group-item text-left">
                                    <b>Type</b>{" "}
                                    <a className="pull-right">
                                      {receiveData.type}
                                    </a>
                                  </li>
                                  <li className="list-group-item text-left pb-3">
                                    <b>Status</b>{" "}
                                    <a className="pull-right">
                                      {receiveData.status}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#home"
                      type="button"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      Home
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="salary-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#salary"
                      type="button"
                      role="tab"
                      aria-controls="salary"
                      aria-selected="false"
                      onClick={salaryLoad}
                    >
                      Salary
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="apa-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#apa"
                      type="button"
                      role="tab"
                      aria-controls="apa"
                      aria-selected="false"
                      onClick={apaLoad}
                    >
                      APA
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="leave_application-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#leave_application"
                      type="button"
                      role="tab"
                      aria-controls="leave_application"
                      aria-selected="false"
                      onClick={leaveApplicaitonLoad}
                    >
                      Leave
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="movement_slip-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#movement_slip"
                      type="button"
                      role="tab"
                      aria-controls="movement_slip"
                      aria-selected="false"
                      onClick={movmentSlipLoad}
                    >
                      Movement Slip
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="bill_submission-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#bill_submission"
                      type="button"
                      role="tab"
                      aria-controls="bill_submission"
                      aria-selected="false"
                      onClick={billSubmissionLoad}
                    >
                      Bill Submission
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="attendance-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#attendance"
                      type="button"
                      role="tab"
                      aria-controls="attendance"
                      aria-selected="false"
                      onClick={attendanceLoad}
                    >
                      Attendance
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="transactions-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#transactions"
                      type="button"
                      role="tab"
                      aria-controls="transactions"
                      aria-selected="false"
                      onClick={transactionsLoad}
                    >
                      Transactions
                    </button>
                  </li>
                </ul>
                <div className="tab-content mt-4" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <Info data={receiveData} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="salary"
                    role="tabpanel"
                    aria-labelledby="salary-tab"
                  >
                    <Salary data={salary} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="apa"
                    role="tabpanel"
                    aria-labelledby="apa-tab"
                  >
                    <Apa data={apa} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="leave_application"
                    role="tabpanel"
                    aria-labelledby="leave_application-tab"
                  >
                    <LeaveApplication data={leaveApplication} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="movement_slip"
                    role="tabpanel"
                    aria-labelledby="movement_slip-tab"
                  >
                    <MovementSlip data={movementSlip} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="bill_submission"
                    role="tabpanel"
                    aria-labelledby="bill_submission-tab"
                  >
                    <BillSubmission data={billSubmission} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="attendance"
                    role="tabpanel"
                    aria-labelledby="attendance-tab"
                  >
                    <Attendance data={attendance} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="transactions"
                    role="tabpanel"
                    aria-labelledby="transactions-tab"
                  >
                    <Transactions data={transactions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Staff;
