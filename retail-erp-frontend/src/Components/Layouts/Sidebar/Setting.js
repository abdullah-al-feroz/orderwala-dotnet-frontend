import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Setting = ({ role }) => {
  const [active, setActive] = useState(window.location.pathname);

  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "factory" ||
            active === "zone" ||
            active === "region" ||
            active === "area" ||
            active === "base" ||
            active === "route" ||
            active === "division" ||
            active === "district" ||
            active === "thana" ||
            active === "place" ||
            active === "brand" ||
            active === "tag" ||
            active === "unit" ||
            active === "product-category"
              ? "active show-sub"
              : ""
          }`}
        >
          <i className="fa fa-briefcase" aria-hidden="true"></i>
          <span>SupplyChain Setting</span>
        </Link>
        <ul className="nav-sub">
          {(role === "admin" ||
            role === "supply_chain" ||
            role === "moo" ||
            role === "hmo") && (
            <>
              <li className="nav-item">
                <Link
                  to="/zone"
                  className={`nav-link ${active === "zone" ? "active" : ""}`}
                  onClick={() => setActive("zone")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Zone
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/region"
                  className={`nav-link ${active === "region" ? "active" : ""}`}
                  onClick={() => setActive("region")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Region
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/area"
                  className={`nav-link ${active === "area" ? "active" : ""}`}
                  onClick={() => setActive("area")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Area
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/base"
                  className={`nav-link ${active === "base" ? "active" : ""}`}
                  onClick={() => setActive("base")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Base
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/route"
                  className={`nav-link ${active === "route" ? "active" : ""}`}
                  onClick={() => setActive("route")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Route
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/division"
                  className={`nav-link ${
                    active === "division" ? "active" : ""
                  }`}
                  onClick={() => setActive("division")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Division
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/district"
                  className={`nav-link ${
                    active === "district" ? "active" : ""
                  }`}
                  onClick={() => setActive("district")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; District
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/thana"
                  className={`nav-link ${active === "thana" ? "active" : ""}`}
                  onClick={() => setActive("thana")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Thana
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/place"
                  className={`nav-link ${active === "place" ? "active" : ""}`}
                  onClick={() => setActive("place")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Place
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/treeview"
                  className={`nav-link ${
                    active === "treeview" ? "active" : ""
                  }`}
                  onClick={() => setActive("treeview")}
                >
                  <i className="fa fa-clone" aria-hidden="true"></i>
                  &nbsp;&nbsp; Treeview
                </Link>
              </li>
              {role != "moo" && role != "hmo" ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/factory"
                      className={`nav-link ${
                        active === "factory" ? "active" : ""
                      }`}
                      onClick={() => setActive("factory")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp;
                      <span>Depo</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/brand"
                      className={`nav-link ${
                        active === "brand" ? "active" : ""
                      }`}
                      onClick={() => setActive("brand")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Brand
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/tag"
                      className={`nav-link ${active === "tag" ? "active" : ""}`}
                      onClick={() => setActive("tag")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Tag
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/unit"
                      className={`nav-link ${
                        active === "unit" ? "active" : ""
                      }`}
                      onClick={() => setActive("unit")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Unit
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/product-category"
                      className={`nav-link ${
                        active === "product-category" ? "active" : ""
                      }`}
                      onClick={() => setActive("product-category")}
                    >
                      <i className="fa fa-clone" aria-hidden="true"></i>
                      &nbsp;&nbsp; Product Category
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

export default Setting;
