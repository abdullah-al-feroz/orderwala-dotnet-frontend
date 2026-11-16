import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sales = ({ role }) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "sales" ? "active show-sub" : ""
          }`}
        >
          <i className="fa fa-briefcase" aria-hidden="true"></i>
          <span>Sales</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/primary-sales"
              className={`nav-link ${
                active === "primary-sales" ? "active" : ""
              }`}
              onClick={() => setActive("primary-sales")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Primary Sales
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/distributor/retailer-order"
              className={`nav-link ${
                active === "distributor/retailer-order" ? "active" : ""
              }`}
              onClick={() => setActive("distributor/retailer-order")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Secondary Sales
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/payment-receive-from-distributor"
              className={`nav-link ${
                active === "payment-receive-from-distributor" ? "active" : ""
              }`}
              onClick={() => setActive("payment-receive-from-distributor")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Receive Amount From Distributor
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default Sales;
