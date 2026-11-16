import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Http from "../Common/Http";
import BasicSetup from "./Sidebar/BasicSetup";
import StaffManagement from "./Sidebar/StaffManagement";
import Payroll from "./Sidebar/Payroll";
import SupplyChain from "./Sidebar/SupplyChain";
import PurchaseAndReturn from "./Sidebar/PurchaseAndReturn";
import Production from "./Sidebar/Production";
import Sales from "./Sidebar/Sales";
import SecondarySales from "./Sidebar/SecondarySales";
import SoTrack from "./Sidebar/SoTrack";
import Setting from "./Sidebar/Setting";
import $ from "jquery";
import ReasonFactors from "./Sidebar/ReasonFactors";
import CompanyPanel from "./Sidebar/CompanyPanel";

const Sidebar = () => {
  const [active, setActive] = useState(window.location.pathname);
  const [receiveData, setReceiveData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const location = useLocation();

  const fetchData = () => {
    // Http.get("/staff-type-check").then((res) => {
    //   setReceiveData(res.data);
    // });
    Http.get("/me").then((res) => {
      setProfileData(res.data.data);
      setReceiveData(res.data.data.user_type);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Initialize the Bootstrap collapse plugin for the newly added elements
    $(".show-sub + .nav-sub").slideDown();

    $(".with-sub").on("click", function (e) {
      e.preventDefault();
      $(this).next().slideToggle();
      $(this).toggleClass("show-sub");
    });
  }, [receiveData]);

  if (location.pathname === "/" || location.pathname === "/login") return null;

  return (
    <div>
      <div className="am-sideleft">
        <ul className="nav am-sideleft-tab">
          <li className="nav-item">
            <a href="#mainMenu" className="nav-link active">
              <i className="icon ion-ios-home-outline tx-24" />
            </a>
          </li>
          <li className="nav-item">
            <a href="#emailMenu" className="nav-link">
              <i className="icon ion-ios-email-outline tx-24" />
            </a>
          </li>
          <li className="nav-item">
            <a href="#chatMenu" className="nav-link">
              <i className="icon ion-ios-chatboxes-outline tx-24" />
            </a>
          </li>
          <li className="nav-item">
            <a href="#settingMenu" className="nav-link">
              <i className="icon ion-ios-gear-outline tx-24" />
            </a>
          </li>
        </ul>
        <div className="tab-content">
          <div id="mainMenu" className="tab-pane active">
            {/* {sidebarComponent} */}
            <ul className="nav am-sideleft-menu">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link ${
                    active === "/dashboard" ? "active" : ""
                  }`}
                  onClick={() => setActive("/dashboard")}
                >
                  <i className="fa fa-tachometer" aria-hidden="true"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/priority-retailers"
                  className={`nav-link ${
                    active === "/priority-retailers" ? "active" : ""
                  }`}
                  onClick={() => setActive("/priority-retailers")}
                >
                  <i className="fa fa-tachometer" aria-hidden="true"></i>
                  <span>Priority Retailers</span>
                </Link>
              </li>
              {receiveData !== "other-company" && (
                <li className="nav-item">
                  <Link
                    to="/orderwala-analysis"
                    className={`nav-link ${
                      active === "/orderwala-analysis" ? "active" : ""
                    }`}
                    onClick={() => setActive("/orderwala-analysis")}
                  >
                    <i className="fa fa-list" aria-hidden="true"></i>
                    <span>Orderwala Analysis</span>
                  </Link>
                </li>
              )}
              {receiveData !== "other-company" && receiveData != "cluster" && (
                <li className="nav-item">
                  <Link
                    to="/data-analysis"
                    className={`nav-link ${
                      active === "/data-analysis" ? "active" : ""
                    }`}
                    onClick={() => setActive("/data-analysis")}
                  >
                    <i className="fa fa-list" aria-hidden="true"></i>
                    <span>Analysis</span>
                  </Link>
                </li>
              )}

              {/* Basic Setup */}
              {(receiveData === "admin" || receiveData === "hr") && (
                <BasicSetup />
              )}
              {(receiveData === "admin" ||
                receiveData === "hr" ||
                receiveData === "moo" ||
                receiveData === "staff") && <StaffManagement />}

              {/* Payroll */}
              {(receiveData === "admin" || receiveData === "hr") && <Payroll />}

              {/* Secondary Sales */}
              {(receiveData === "admin" ||
                receiveData === "hr" ||
                receiveData === "moo" ||
                receiveData === "supply_chain") && (
                <Setting role={receiveData} />
              )}
              {/* Supply Chain */}
              {(receiveData === "admin" ||
                receiveData === "supply_chain" ||
                receiveData === "moo") && <SupplyChain role={receiveData} />}

              {(receiveData === "admin" ||
                receiveData === "supply_chain" ||
                receiveData === "depot") && (
                <PurchaseAndReturn role={receiveData} />
              )}

              {/* Sales */}
              {(receiveData === "admin" || receiveData === "depot") && (
                <Sales role={receiveData} />
              )}

              {/* Secondary Sales */}
              {(receiveData === "admin" || receiveData === "moo") && (
                <SecondarySales />
              )}

              {(receiveData === "admin" || receiveData === "moo") && (
                <SoTrack />
              )}
              {(receiveData === "admin" || receiveData === "moo") && (
                <ReasonFactors />
              )}

              {receiveData === "distributor" && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/distributor/order"
                      className={`nav-link ${
                        active === "/distributor/order" ? "active" : ""
                      }`}
                      onClick={() => setActive("/distributor/order")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Purchase Order</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/distributor/order-return"
                      className={`nav-link ${
                        active === "/distributor/order-return" ? "active" : ""
                      }`}
                      onClick={() => setActive("/distributor/order-return")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Purchase Order Return to Depot</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      to="/distributor/receive-amount"
                      className={`nav-link ${
                        active === "/distributor/receive-amount" ? "active" : ""
                      }`}
                      onClick={() => setActive("/distributor/receive-amount")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Receive Amount</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/distributor/sales"
                      className={`nav-link ${
                        active === "/distributor/sales" ? "active" : ""
                      }`}
                      onClick={() => setActive("/distributor/sales")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Sales</span>
                    </Link>
                  </li>
                </>
              )}
              {receiveData === "customer-care" && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/call-center/retailers"
                      className={`nav-link ${
                        active === "/call-center/retailers" ? "active" : ""
                      }`}
                      onClick={() => setActive("/call-center/retailers")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailers</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/call-center/retailers-no-order"
                      className={`nav-link ${
                        active === "/call-center/retailers-no-order"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActive("/call-center/retailers-no-order")
                      }
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailers (No Order)</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/call-center/retailers-with-one-order"
                      className={`nav-link ${
                        active === "/call-center/retailers-with-one-order"
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActive("/call-center/retailers-with-one-order")
                      }
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailers (One Order)</span>
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link
                      to="/call-center/retailer-order"
                      className={`nav-link ${active === "/call-center/retailer-order" ? "active" : ""
                        }`}
                      onClick={() => setActive("/call-center/retailer-order")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailers Order</span>
                    </Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link
                      to="/distributor/retailer-order-return"
                      className={`nav-link ${active === "/distributor/retailer-order-return"
                        ? "active"
                        : ""
                        }`}
                      onClick={() =>
                        setActive("/distributor/retailer-order-return")
                      }
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailer Order Return</span>
                    </Link>
                  </li> */}
                </>
              )}

              {/* <li className="nav-item">
                <Link
                  to="/duplicate-order-check"
                  className={`nav-link ${active === "/duplicate-order-check" ? "active" : ""
                    }`}
                  onClick={() => setActive("/duplicate-order-check")}
                >
                  <i className="fa fa-tachometer" aria-hidden="true"></i>
                  <span>Duplicate Order Check <span className="badge text-bg-success">12</span> </span>
                </Link>
              </li> */}

              {(receiveData === "distributor" || receiveData === "moo") && (
                <>
                  {/* <li className="nav-item">
                    <Link
                      to="/distributor/retailer-order"
                      className={`nav-link ${active === "/distributor/retailer-order" ? "active" : ""
                        }`}
                      onClick={() => setActive("/distributor/retailer-order")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailer Order</span>
                    </Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link
                      to="/distributor/retailer-order-return"
                      className={`nav-link ${active === "/distributor/retailer-order-return"
                        ? "active"
                        : ""
                        }`}
                      onClick={() =>
                        setActive("/distributor/retailer-order-return")
                      }
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Retailer Order Return</span>
                    </Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link
                      to="/sku-wise-item-summary"
                      className={`nav-link ${active === "/sku-wise-item-summary" ? "active" : ""
                        }`}
                      onClick={() => setActive("/sku-wise-item-summary")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Sku Wise Item Summary</span>
                    </Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link
                      to="/tracking-report"
                      className={`nav-link ${active === "/tracking-report" ? "active" : ""
                        }`}
                      onClick={() => setActive("/tracking-report")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Tracking Report</span>
                    </Link> */}
                  {/* </li> */}
                  {/* <li className="nav-item">
                    <Link
                      to="/route-wise-customer-acquisition"
                      className={`nav-link ${active === "/route-wise-customer-acquisition"
                        ? "active"
                        : ""
                        }`}
                      onClick={() =>
                        setActive("/route-wise-customer-acquisition")
                      }
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Route Wise Customer Acquisition</span>
                    </Link>
                  </li> */}
                  {/* <li className="nav-item">
                    <Link
                      to="/staff-target-achievement"
                      className={`nav-link ${active === "/staff-target-achievement" ? "active" : ""
                        }`}
                      onClick={() => setActive("/staff-target-achievement")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Staff Target Achievement</span>
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link
                      to="/change-customer-route"
                      className={`nav-link ${
                        active === "/change-customer-route" ? "active" : ""
                      }`}
                      onClick={() => setActive("/change-customer-route")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Change Customer Route</span>
                    </Link>
                  </li>
                </>
              )}

              {/* Reports */}
              {receiveData !== "other-company" && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/reports"
                      className={`nav-link ${
                        active === "/reports" ? "active" : ""
                      }`}
                      onClick={() => setActive("/reports")}
                    >
                      <i className="fa fa-tachometer" aria-hidden="true"></i>
                      <span>Reports</span>
                    </Link>
                  </li>
                </>
              )}

              {/* Company panel */}
              {receiveData === "other-company" && (
                <CompanyPanel role={receiveData} />
              )}
            </ul>
          </div>
          {/* #mainMenu */}
        </div>
        {/* tab-content */}
      </div>
      {/* am-sideleft */}
    </div>
  );
};

export default Sidebar;
