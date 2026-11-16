import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Http from "../../Common/Http";

const StaffManagement = (props) => {
  const [active, setActive] = useState(window.location.pathname);
  const [receiveData, setReceiveData] = useState([]);
  const [authDetail, setAuthDetail] = useState([]);
  const fetchData = () => {
    Http.get("/staff-type-check").then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/login-staff-detail").then((res) => {
      setAuthDetail(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "staff" ||
            active === "requisition" ||
            active === "candidate" ||
            active === "leave-deduction" ||
            active === "leave-aplication" ||
            active === "bill-submission" ||
            active === "attendance" ||
            active === "movement-slip"
              ? "active show-sub"
              : ""
          }`}
        >
          <i className="fa fa-university" aria-hidden="true"></i>
          <span>Staff Management</span>
        </Link>
        <ul className="nav-sub">
          {(receiveData === "admin" ||
            receiveData === "hr" ||
            receiveData === "moo" ||
            receiveData === "hmo") && (
            <li className="nav-item">
              <Link
                to="/staff"
                className={`nav-link ${active === "/staff" ? "active" : ""}`}
                onClick={() => setActive("/staff")}
              >
                <i className="fa fa-clone" aria-hidden="true"></i>
                &nbsp;&nbsp;
                <span>Staff</span>
              </Link>
            </li>
          )}

          {(receiveData === "admin" ||
            receiveData === "hr" ||
            authDetail.department_head === 1) && (
            <li className="nav-item">
              <Link
                to="/requisition"
                className={`nav-link ${
                  active === "/requisition" ? "active" : ""
                }`}
                onClick={() => setActive("/requisition")}
              >
                <i className="fa fa-clone" aria-hidden="true"></i>
                &nbsp;&nbsp;
                <span>Requisition</span>
              </Link>
            </li>
          )}
          {(receiveData === "admin" || receiveData === "hr") && (
            <>
              <li className="nav-item">
                <Link
                  to="/candidate"
                  className={`nav-link ${
                    active === "/candidate" ? "active" : ""
                  }`}
                  onClick={() => setActive("/candidate")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp;
                  <span>Candidate</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/leave-deduction"
                  className={`nav-link ${
                    active === "/leave-deduction" ? "active" : ""
                  }`}
                  onClick={() => setActive("/leave-deduction")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp;
                  <span>Leave Deduction</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/leave-application"
                  className={`nav-link ${
                    active === "/leave-application" ? "active" : ""
                  }`}
                  onClick={() => setActive("/leave-application")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp;
                  <span>Leave Application</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/billsubmission"
                  className={`nav-link ${
                    active === "billsubmission" ? "active" : ""
                  }`}
                  onClick={() => setActive("billsubmission")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Bill Submission
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/movement-slip"
                  className={`nav-link ${
                    active === "movement-slip" ? "active" : ""
                  }`}
                  onClick={() => setActive("movement-slip")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Movement Slip
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/attendance"
                  className={`nav-link ${
                    active === "attendance" ? "active" : ""
                  }`}
                  onClick={() => setActive("attendance")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Attendance
                </Link>
              </li>
            </>
          )}
        </ul>
      </li>
    </>
  );
};

export default StaffManagement;
