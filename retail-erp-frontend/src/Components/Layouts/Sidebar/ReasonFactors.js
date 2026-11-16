import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReasonFactors = () => {
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
          <span>Reason Factors</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/reason-factors/reason-type-list"
              className={`nav-link ${
                active === "reason-list" ? "active" : ""
              }`}
              onClick={() => setActive("reason-list")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Reason Types
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="reason-factors/reason-list"
              className={`nav-link ${
                active === "reason-factors" ? "active" : ""
              }`}
              onClick={() => setActive("reason-factors")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Reason Factors
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link
              to="/reason-factors/reason-create"
              className={`nav-link ${
                active === "reason-create" ? "active" : ""
              }`}
              onClick={() => setActive("reason-create")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Reason Create
            </Link>
          </li> */}

          {/* <li className="nav-item">
            <Link
              to="reason-factors/reason-edit"
              className={`nav-link ${
                active === "reason-edit" ? "active" : ""
              }`}
              onClick={() => setActive("reason-edit")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Reason Edit
            </Link>
          </li> */}
          
        </ul>
      </li>
            
        </>
    );
};

export default ReasonFactors;