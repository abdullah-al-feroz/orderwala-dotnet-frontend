import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Production = ({ role }) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "receipe" ||
            active === "receipe-factory" ||
            active === "machineries" ||
            active === "factory-machineries" ||
            active === "requisition-production" ||
            active === "issue" ||
            active === "production" ||
            active === "depo-transfer" ||
            active === "factory-transfer"
              ? "active show-sub"
              : ""
          }`}
        >
          <i className="fa fa-briefcase" aria-hidden="true"></i>
          <span>Production</span>
        </Link>
        <ul className="nav-sub">
          {role === "admin" ||
            (role === "supply_chain" && (
              <>
                {/* <li className="nav-item">
                  <Link
                    to="/machineries"
                    className={`nav-link ${
                      active === "machineries" ? "active" : ""
                    }`}
                    onClick={() => setActive("machineries")}
                  >
                    <i className="fa fa-clone" aria-hidden="true"></i>
                    &nbsp;&nbsp; Machineries
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/factory-machineries"
                    className={`nav-link ${
                      active === "factory-machineries" ? "active" : ""
                    }`}
                    onClick={() => setActive("factory-machineries")}
                  >
                    <i className="fa fa-clone" aria-hidden="true"></i>
                    &nbsp;&nbsp; Factories Machineries
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link
                    to="/receipe"
                    className={`nav-link ${
                      active === "receipe" ? "active" : ""
                    }`}
                    onClick={() => setActive("receipe")}
                  >
                    <i className="fa fa-clone" aria-hidden="true"></i>
                    &nbsp;&nbsp; Receipe
                  </Link>
                </li>
              </>
            ))}
          <li className="nav-item">
            <Link
              to="/requisition-production"
              className={`nav-link ${
                active === "requisition-production" ? "active" : ""
              }`}
              onClick={() => setActive("requisition-production")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Requisition Production
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/issue"
              className={`nav-link ${active === "issue" ? "active" : ""}`}
              onClick={() => setActive("issue")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Issue
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/production"
              className={`nav-link ${active === "production" ? "active" : ""}`}
              onClick={() => setActive("production")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Production
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default Production;
