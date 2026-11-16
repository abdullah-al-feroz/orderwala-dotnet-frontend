import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const APA = (props) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "designation" ||
            active === "grade" ||
            active === "department" ||
            active === "companylocation" ||
            active === "leave-rules" ||
            active === "weekly-off-day" ||
            active === "special-late-facility" ||
            active === "setting" ||
            active === "holiday-list" ||
            active === "roaster-holiday-list"
              ? "active show-sub"
              : ""
          }`}
        >
          <i className="fa fa-map-signs" aria-hidden="true"></i>
          <span>Hr Basic Setup</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/designation"
              className={`nav-link ${active === "designation" ? "active" : ""}`}
              onClick={() => setActive("designation")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Designation</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/grade"
              className={`nav-link ${active === "grade" ? "active" : ""}`}
              onClick={() => setActive("grade")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Grade</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/department"
              className={`nav-link ${active === "department" ? "active" : ""}`}
              onClick={() => setActive("department")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Department</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/companylocation"
              className={`nav-link ${
                active === "companylocation" ? "active" : ""
              }`}
              onClick={() => setActive("companylocation")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Location</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/leave-rules"
              className={`nav-link ${active === "leave-rules" ? "active" : ""}`}
              onClick={() => setActive("leave-rules")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Leave Rules</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/holiday-list"
              className={`nav-link ${
                active === "holiday-list" ? "active" : ""
              }`}
              onClick={() => setActive("holiday-list")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Holiday List</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/roaster-holiday-list"
              className={`nav-link ${
                active === "roaster-holiday-list" ? "active" : ""
              }`}
              onClick={() => setActive("roaster-holiday-list")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Roaster Holiday List</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/weekly-off-day"
              className={`nav-link ${
                active === "weekly-off-day" ? "active" : ""
              }`}
              onClick={() => setActive("weekly-off-day")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Weekly Off Day</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/setting"
              className={`nav-link ${active === "setting" ? "active" : ""}`}
              onClick={() => setActive("setting")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Settings</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/special-late-facility"
              className={`nav-link ${
                active === "special-late-facility" ? "active" : ""
              }`}
              onClick={() => setActive("special-late-facility")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp;
              <span>Special Late Facility</span>
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default APA;
