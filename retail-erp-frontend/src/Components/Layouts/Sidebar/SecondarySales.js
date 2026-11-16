import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SecondarySales = (props) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "secondary-sales" ? "active show-sub" : ""
          }`}
        >
          <i className="fa fa-briefcase" aria-hidden="true"></i>
          <span>Secondary Sales</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/monthly-target"
              className={`nav-link ${
                active === "monthly-target" ? "active" : ""
              }`}
              onClick={() => setActive("monthly-target")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Monthly Target
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/create-target"
              className={`nav-link ${
                active === "create-target" ? "active" : ""
              }`}
              onClick={() => setActive("create-target")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Create Target
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/monthly-target-view"
              className={`nav-link ${
                active === "monthly-target-view" ? "active" : ""
              }`}
              onClick={() => setActive("monthly-target-view")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; View Monthly Target
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/summary-report"
              className={`nav-link ${
                active === "summary-report" ? "active" : ""
              }`}
              onClick={() => setActive("summary-report")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Summary Report
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/daily-report"
              className={`nav-link ${
                active === "daily-report" ? "active" : ""
              }`}
              onClick={() => setActive("daily-report")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Daily Report
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/create-opening-stock"
              className={`nav-link ${
                active === "create-opening-stock" ? "active" : ""
              }`}
              onClick={() => setActive("create-opening-stock")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Create Distributor OS
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/opening-stock-view"
              className={`nav-link ${
                active === "view-opening-stock" ? "active" : ""
              }`}
              onClick={() => setActive("view-opening-stock")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; View Distributor OS
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default SecondarySales;
