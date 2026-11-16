import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HttpUser from "../../../../Common/HttpUser";
import Apa from "./Apa";
import Attendance from "./Attendance";
import BillSubmission from "./BillSubmission";
import Info from "./Info";
import LeaveApplication from "./LeaveApplication";
import MovementSlip from "./MovementSlip";
import Salary from "./Salary";
import Transactions from "./Transactions";

const EmployeeType = [
{ value: 1, label: "Permanent" },
{ value: 2, label: "Contractual" },
{ value: 3, label: "Internship" },
{ value: 4, label: "Casual" }
];

const Edit = (props) => {
  const { id } = useParams();
  const staffId = parseInt(id);
  const [receiveData, setReceiveData] = useState({});

  const fetchData = () => {
    HttpUser.get("/GetById/" + staffId).then((res) => {
      setReceiveData(res.data.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, [staffId]);

  return (
    <div>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">{receiveData.name}</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Profile</h6>
            <div className="row row-sm">
              <div className="col-lg-12 mb-5">
                <div className="card" style={{ backgroundColor: "#D0D0D0" }}>
                  <div className="wd-100p">
                    <div className="pd-x-20 pd-20">
                      <section className="content">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="box box-primary">
                              <div className="box-body box-profile">
                                <img
                                  className="profile-user-img img-responsive img-circle"
                                  style={{ margin: "0 auto" }}
                                  // src="https://members.familycentre.online/assets/images/default_user.png"
                                  alt="User profile picture"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <div className="box box-primary">
                              <div className="box-body box-profile text-center">
                                <ul className="list-group list-group-unbordered">
                                  <li className="list-group-item text-left pt-3">
                                    <h3 className="profile-username text-center">{receiveData.name}</h3>
                                  </li>
                                  <li className="list-group-item text-left pt-2">
                                    <b>Department</b> <span className="pull-right">{receiveData.department ? receiveData.department.name : ""}</span>
                                  </li>
                                  <li className="list-group-item text-left">
                                    <b>Card No</b> <a className="pull-right">{receiveData.cardNo}</a>
                                  </li>
                                  <li className="list-group-item text-left">
                                    <b>Type</b> <a className="pull-right">{EmployeeType.find(type => type.value === receiveData.type)?.label}</a>
                                  </li>
                                  <li className="list-group-item text-left pb-3">
                                    <b>Status</b> <a className="pull-right">{receiveData.status===1 ? "Active" : "Inactive"}</a>
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
                    >
                      Leave Application
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
                    >
                      Transactions
                    </button>
                  </li>
                </ul>
                <div className="tab-content mt-4" id="myTabContent">
                  <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <Info data={receiveData} />
                  </div>
                  <div className="tab-pane fade show" id="salary" role="tabpanel" aria-labelledby="salary-tab">
                    {/* <Salary staffId={staffId} /> */}
                  </div>
                  <div className="tab-pane fade show" id="apa" role="tabpanel" aria-labelledby="apa-tab">
                    {/* <Apa staffId={staffId} /> */}
                  </div>
                  <div className="tab-pane fade show" id="leave_application" role="tabpanel" aria-labelledby="leave_application-tab">
                    {/* <LeaveApplication staffId={staffId} /> */}
                  </div>
                  <div className="tab-pane fade show" id="movement_slip" role="tabpanel" aria-labelledby="movement_slip-tab">
                    {/* <MovementSlip staffId={staffId} /> */}
                  </div>
                  <div className="tab-pane fade show" id="bill_submission" role="tabpanel" aria-labelledby="bill_submission-tab">
                    {/* <BillSubmission staffId={staffId} /> */}
                  </div>
                  <div className="tab-pane fade show" id="attendance" role="tabpanel" aria-labelledby="attendance-tab">
                    {/* <Attendance staffId={staffId} /> */}
                  </div>
                  <div className="tab-pane fade show" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">
                    {/* <Transactions staffId={staffId} /> */}
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

export default Edit;