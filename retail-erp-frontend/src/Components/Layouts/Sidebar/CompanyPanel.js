import React, { useState } from "react";
import { Link } from "react-router-dom";

const CompanyPanel = ({ role }) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to="/brand"
          className={`nav-link ${active === "brand" ? "active" : ""}`}
          onClick={() => setActive("brand")}
        >
          <i className="fa fa-clone" aria-hidden="true"></i>
          &nbsp;&nbsp; Brand
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/product"
          className={`nav-link ${active === "product" ? "active" : ""}`}
          onClick={() => setActive("product")}
        >
          <i className="fa fa-clone" aria-hidden="true"></i>
          &nbsp;&nbsp; Product
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/distributors"
          className={`nav-link ${active === "distributors" ? "active" : ""}`}
          onClick={() => setActive("distributors")}
        >
          <i className="fa fa-clone" aria-hidden="true"></i>
          &nbsp;&nbsp; Distributors
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/trade-offer"
          className={`nav-link ${active === "trade-offer" ? "active" : ""}`}
          onClick={() => setActive("trade-offer")}
        >
          <i className="fa fa-clone" aria-hidden="true"></i>
          &nbsp;&nbsp; Product Trade Offer
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/retailer-offer"
          className={`nav-link ${active === "retailer-offer" ? "active" : ""}`}
          onClick={() => setActive("retailer-offer")}
        >
          <i className="fa fa-clone" aria-hidden="true"></i>
          &nbsp;&nbsp; Retailer Trade Offer
        </Link>
      </li>
    </>
  );
};

export default CompanyPanel;
