import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SoTrack = (props) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "so-track" ? "active show-sub" : ""
          }`}
        >
          <i className="fa fa-briefcase" aria-hidden="true"></i>
          <span>SO Track</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/so-track/attendance-list"
              className={`nav-link ${
                active === "attendance-list" ? "active" : ""
              }`}
              onClick={() => setActive("attendance-list")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; attendance-list
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/so-track/overview"
              className={`nav-link ${
                active === "overview" ? "active" : ""
              }`}
              onClick={() => setActive("overview")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; overview
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/so-track/mdo-sales"
              className={`nav-link ${
                active === "mdo-sales" ? "active" : ""
              }`}
              onClick={() => setActive("mdo-sales")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; mdo-sales
            </Link>
          </li>

          {/* <li className="nav-item">
            <Link
              to="/so-track/mdo-sales-view"
              className={`nav-link ${
                active === "mdo-sales-view" ? "active" : ""
              }`}
              onClick={() => setActive("mdo-sales-view")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; mdo-sales-view
            </Link>
          </li> */}
          
          <li className="nav-item">
            <Link
              to="/so-track/store-check-in"
              className={`nav-link ${
                active === "store-check-in" ? "active" : ""
              }`}
              onClick={() => setActive("store-check-in")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; store-check-in
            </Link>
          </li>
          
        </ul>
      </li>
    </>
  );
};

export default SoTrack;
