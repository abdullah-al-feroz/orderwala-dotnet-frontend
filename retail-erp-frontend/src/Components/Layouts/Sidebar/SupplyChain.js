import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SupplyChain = ({ role }) => {
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
          <span>Supply Chain</span>
        </Link>
        <ul className="nav-sub">
          {(role === "admin" ||
            role === "supply_chain" ||
            role === "moo" ||
            role === "hmo") && (
            <>
              <li className="nav-item">
                <Link
                  to="/shop"
                  className={`nav-link ${active === "shop" ? "active" : ""}`}
                  onClick={() => setActive("shop")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Shop/Customer
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/shop-customer-password-modify"
                  className={`nav-link ${
                    active === "shop-customer-password-modify" ? "active" : ""
                  }`}
                  onClick={() => setActive("shop-customer-password-modify")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Shop/Customer Password Modify
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/distributors"
                  className={`nav-link ${
                    active === "distributors" ? "active" : ""
                  }`}
                  onClick={() => setActive("distributors")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Distributors
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/distributors-stock"
                  className={`nav-link ${
                    active === "distributors-stock" ? "active" : ""
                  }`}
                  onClick={() => setActive("distributors-stock")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Distributor Stock
                </Link>
              </li>
              {role != "moo" && role != "hmo" ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/vendors"
                      className={`nav-link ${
                        active === "vendors" ? "active" : ""
                      }`}
                      onClick={() => setActive("vendors")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Company
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/product"
                      className={`nav-link ${
                        active === "product" ? "active" : ""
                      }`}
                      onClick={() => setActive("product")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Product
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to="/trade-offer"
                      className={`nav-link ${
                        active === "trade-offer" ? "active" : ""
                      }`}
                      onClick={() => setActive("trade-offer")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Product Trade Offer
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/retailer-offer"
                      className={`nav-link ${
                        active === "retailer-offer" ? "active" : ""
                      }`}
                      onClick={() => setActive("retailer-offer")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Retailer Trade Offer
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/coupon-offer"
                      className={`nav-link ${
                        active === "coupon-offer" ? "active" : ""
                      }`}
                      onClick={() => setActive("coupon-offer")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Coupon Offer
                    </Link>
                  </li>
                   <li className="nav-item">
                    <Link
                      to="/basket-offer"
                      className={`nav-link ${
                        active === "basket-offer" ? "active" : ""
                      }`}
                      onClick={() => setActive("basket-offer")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Basket Offer
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
            </>
          )}
        </ul>
      </li>
    </>
  );
};

export default SupplyChain;
