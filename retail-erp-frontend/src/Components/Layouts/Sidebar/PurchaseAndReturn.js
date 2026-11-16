import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PurchaseAndReturn = ({ role }) => {
  const [active, setActive] = useState(window.location.pathname);

  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "vendors" ||
            active === "product" ||
            active === "circular-rfq" ||
            active === "final-quotation" ||
            active === "purchase-order" ||
            active === "work-order" ||
            active === "grn" ||
            active === "others-receive" ||
            active === "factory-transfer" ||
            active === "damage-return" ||
            active === "purchase-order-return"
              ? "active show-sub"
              : ""
          }`}
        >
          <i className="fa fa-briefcase" aria-hidden="true"></i>
          <span>Purchase &amp; Return</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/direct-purchase"
              className={`nav-link ${
                active === "direct-purchase" ? "active" : ""
              }`}
              onClick={() => setActive("direct-purchase")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Direct Purchase
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link
              to="/circular-rfq"
              className={`nav-link ${
                active === "circular-rfq" ? "active" : ""
              }`}
              onClick={() => setActive("circular-rfq")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Circular RFQ
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/final-quotation"
              className={`nav-link ${
                active === "final-quotation" ? "active" : ""
              }`}
              onClick={() => setActive("final-quotation")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Final Quotation
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/purchase-order"
              className={`nav-link ${
                active === "purchase-order" ? "active" : ""
              }`}
              onClick={() => setActive("purchase-order")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Purchase Order
            </Link>
          </li> */}
          <li className="nav-item">
            <Link
              to="/grn"
              className={`nav-link ${active === "grn" ? "active" : ""}`}
              onClick={() => setActive("grn")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; GRN
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/purchase-order-return"
              className={`nav-link ${
                active === "purchase-order-return" ? "active" : ""
              }`}
              onClick={() => setActive("purchase-order-return")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Purchase Order Return
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/others-receive"
              className={`nav-link ${
                active === "others-receive" ? "active" : ""
              }`}
              onClick={() => setActive("others-receive")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Others Receive
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/factory-transfer"
              className={`nav-link ${
                active === "factory-transfer" ? "active" : ""
              }`}
              onClick={() => setActive("factory-transfer")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Factory Transfer
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/damage-return"
              className={`nav-link ${
                active === "damage-return" ? "active" : ""
              }`}
              onClick={() => setActive("damage-return")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Damage Return
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/return-from-distributor"
              className={`nav-link ${
                active === "return-from-distributor" ? "active" : ""
              }`}
              onClick={() => setActive("return-from-distributor")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Return From Distributor
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default PurchaseAndReturn;
