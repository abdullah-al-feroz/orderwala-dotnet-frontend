import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const DistributorStock = (props) => {
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
          <span>Distributor Stock</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/distributor-stock/distributor-list"
              className={`nav-link ${
                active === "distributor-list" ? "active" : ""
              }`}
              onClick={() => setActive("distributor-list")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; distributor-list
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default DistributorStock;
