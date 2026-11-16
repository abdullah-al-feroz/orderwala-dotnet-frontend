import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";
import ReportList from "./Distributor/ReportList";

const Reports = () => {
  // const [active, setActive] = useState(window.location.pathname);
  const [receiveData, setReceiveData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/login") {
      fetchData();
    }
  }, [location.pathname]);

  const fetchData = () => {
    Http.get("/staff-type-check").then((res) => {
      setReceiveData(res.data);
    });
  };

  if (location.pathname === "/" || location.pathname === "/login") return null;

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Reports</h5>
        </div>
        {/* am-pagetitle */}
        <div className="am-pagebody" style={{ minHeight: "80vh" }}>
          <div className="row row-sm mg-t-15 mg-sm-t-20">
            {/* col-6 */}

            {(receiveData === "depot" ||
              receiveData === "supply_chain" ||
              receiveData === "moo" ||
              receiveData === "cluster" ||
              receiveData === "admin") && (
              <div className="col-md-6">
                <div className="card bd-0">
                  <div className="card-header card-header-default bg-primary">
                    Reports
                  </div>
                  <div className="card-body bd bd-t-0 rounded-bottom">
                    <div className="report_style">
                      {(receiveData === "admin" ||
                        receiveData === "moo" ||
                        receiveData === "cluster") && (
                        <>
                          <div className="report-item">
                            <Link to="/report/hr-incentive-report">
                              <i className="fa fa-globe" aria-hidden="true"></i>
                              <span>Hr Report</span>
                            </Link>
                          </div>
                        </>
                      )}
                      {(receiveData === "supply_chain" ||
                        receiveData === "admin" ||
                        receiveData === "moo" ||
                        receiveData === "cluster") && (
                        <>
                          <div className="report-item">
                            <Link to="/report/depo-wise-product-stock">
                              <i className="fa fa-globe" aria-hidden="true"></i>
                              <span>Product Stock</span>
                            </Link>
                          </div>
                          {/* <div className="report-item">
                                <Link to="/report/dsr-delivery-report">
                                  <i className="fa fa-globe" aria-hidden="true"></i>
                                  <span>DSR Delivery Reports</span>
                                </Link>
                              </div> */}
                        </>
                      )}
                      {receiveData === "depot" && (
                        <div className="report-item">
                          <Link to="/report/product-stock">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Product Stock</span>
                          </Link>
                        </div>
                      )}
                      <div className="report-item">
                        <Link to="/report/distributor">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Distributors</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/report/all-distributor-stock-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>All Distributor Stock Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/report/customer">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Retailers</span>
                        </Link>
                      </div>

                      <div className="report-item">
                        <Link to="/report/duplicate-customers">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Duplicate Customers</span>
                        </Link>
                      </div>

                      <div className="report-item">
                        <Link to="/sku-wise-item-summary">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Sku Wise Item Summary</span>
                        </Link>
                      </div>

                      <div className="report-item">
                        <Link to="/tracking-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Tracking Report</span>
                        </Link>
                      </div>

                      <div className="report-item">
                        <Link to="/route-wise-customer-acquisition">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Route Wise Customer Acquisition</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/staff-target-achievement">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Staff Target Achievement</span>
                        </Link>
                      </div>

                      <div className="report-item">
                        <Link to="/change-customer-route">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Change Customer Route</span>
                        </Link>
                      </div>

                      {receiveData === "admin" && (
                        <>
                          <div className="report-item">
                            <Link to="/sales-vs-stock-quantity-analysis-report">
                              <i className="fa fa-globe" aria-hidden="true"></i>
                              <span>
                                Sales vs. Stock Quantity Analysis Report
                              </span>
                            </Link>
                          </div>
                        </>
                      )}

                      {/* <div className="report-item">
                          <Link to="#">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Stock Breakdown</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="#">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Distributor Outstanding Summary</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="#">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Transfer History</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="#">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Return History</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="#">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Damage Return</span>
                          </Link>
                        </div> */}
                    </div>
                  </div>
                </div>
                {/* card */}
              </div>
            )}

            {/* New Report */}

            {(receiveData === "depot" ||
              receiveData === "supply_chain" ||
              receiveData === "moo" ||
              receiveData === "cluster" ||
              receiveData === "admin") && (
              <div className="col-md-6">
                <div className="card bd-0">
                  <div className="card-header card-header-default bg-primary">
                    Offer Reports
                  </div>
                  <div className="card-body bd bd-t-0 rounded-bottom">
                    <div className="report_style">
                      {/* {(receiveData === "supply_chain" ||
                        receiveData === "admin" ||
                        receiveData === "moo" || receiveData === 'cluster') && (
                        <>
                          <div className="report-item">
                            <Link to="/report/retailer-offer-report">
                              <i className="fa fa-globe" aria-hidden="true"></i>
                              <span>Welcome Offer Report</span>
                            </Link>
                          </div>
                        </>
                      )} */}
                      <div className="report-item">
                        <Link to="/report/offer-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Offer Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/report/stock-wise-trade-offer-with-discount-offer-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Stock Wise Trade Offer With Discount Offer (Rakib
                            Bhai Special)
                          </span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/report/trade-offer-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Product Wise Discount Offer Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/report/date-wise-stock">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Date Wise Stock</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/category-wise-percentage-offer-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Category Wise Percentage Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/base-wise-sales-report-499">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Base wise sales report more than 499 tk</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/base-wise-sales-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Base wise sales report more than 799 tk</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/coupon-generate-lists">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Coupon Generate Lists</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/base-wise-order-delivery-range-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Base wise order & delivery qty (range-wise)
                          </span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/base-wise-order-delivery-range-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Base wise order & delivery qty (range-wise)
                          </span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/product-wise-sales-delivery-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Product wise sales & delivery</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/campaign-offer">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Campaign Offer (6000 tk Purchase 150tk Discount)
                          </span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/campaign-offer-product-wise">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Campaign Offer Product Wise (6000 tk Purchase 150tk
                            Discount)
                          </span>
                        </Link>
                      </div>
                      {receiveData === "admin" && (
                        <>
                          <div className="report-item">
                            <Link to="/discount-offer-details">
                              <i className="fa fa-globe" aria-hidden="true"></i>
                              <span>Discount Offer (April 18 to 29) </span>
                            </Link>
                          </div>
                          <div className="report-item">
                            <Link to="/specific-offer-details">
                              <i className="fa fa-globe" aria-hidden="true"></i>
                              <span>
                                Specfic Discount Offer (April 18 to 29)
                              </span>
                            </Link>
                          </div>
                        </>
                      )}

                      {/* <div className="report-item">
                        <Link to="/report/one-percent-offer-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>One Percent Offer Report</span>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* card */}
              </div>
            )}
            {(receiveData === "moo" ||
              receiveData === "cluster" ||
              receiveData === "admin") && (
              <>
                <div className="col-md-6">
                  <div className="card bd-0">
                    <div className="card-header card-header-default bg-primary">
                      Tracking Reports
                    </div>
                    <div className="card-body bd bd-t-0 rounded-bottom">
                      <div className="report_style">
                        <div className="report-item">
                          <Link to="/so-track/attendance-list">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>All Attendance</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/tracking-reports/attendance-reports/cdm">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>CDM Attendance Report</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/tracking-reports/mdo-created-stores-reports/rsm">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>MDO Created Stores</span>
                          </Link>
                        </div>

                        <div className="report-item">
                          <Link to="/tracking-reports/mdo-visited-area-reports/rsm">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>MDO Visited Areas</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/tracking-reports/dsr-delivery-reports/rsm">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>DSR Delivery</span>
                          </Link>
                        </div>

                        <div className="report-item">
                          <Link to="/tracking-reports/ow-total-verified-stores-reports/rsm">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Orderwala Total Verified Stores</span>
                          </Link>
                        </div>

                        <div className="report-item">
                          <Link to="/tracking-reports/target-vs-achievement">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Target VS Achivement</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* card */}
                </div>
                <div className="col-md-6">
                  <div className="card bd-0">
                    <div className="card-header card-header-default bg-primary">
                      Brand Promoter Reports
                    </div>
                    <div className="card-body bd bd-t-0 rounded-bottom">
                      <div className="report_style">
                        {/* <div className="report-item">
                        <Link to="/survey-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Brand Promoter Survey</span>
                        </Link>
                      </div> */}
                        <div className="report-item">
                          <Link to="/bp-tracking-report">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Brand Promoter Tracking Report </span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/survey-report-pagination">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Brand Promoter Survey </span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/fake-customer-report">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Fake Customer List</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/category-wise-order-report">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Category Wise Order Report</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* card */}
                </div>
              </>
            )}

            {/* New Report */}

            {receiveData === "supply_chain" && (
              <div className="col-md-6">
                <div className="card bd-0">
                  <div className="card-header card-header-default bg-primary">
                    Sales Report
                  </div>
                  <div className="card-body bd bd-t-0 rounded-bottom">
                    <div className="report_style">
                      <div className="report-item">
                        <Link to="#">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Monthly End SKU wise Sales (Payment Date Wise)
                          </span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="#">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>
                            Monthly End SKU wise Sales (Delivery Date Wise)
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* card */}
              </div>
            )}
            {receiveData === "distributor" && <ReportList />}

            {(receiveData === "admin" || receiveData === "hr") && (
              <div className="col-md-6">
                <div className="card bd-0">
                  <div className="card-header card-header-default bg-primary">
                    Hr Managment Report
                  </div>
                  <div className="card-body bd bd-t-0 rounded-bottom">
                    <div className="report_style">
                      <div className="report-item">
                        <Link to="/hr-salary-structure">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Salary Structure</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/hr-leave-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Leave Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/monthly-salary-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Monthly Salary Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/attendance-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Attendance Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/salary-payment-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Paid Salary Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/apa-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>APA Report</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* card */}
              </div>
            )}

            {(receiveData === "admin" || receiveData === "accounts") && (
              <div className="col-md-6">
                <div className="card bd-0">
                  <div className="card-header card-header-default bg-primary">
                    Accounts
                  </div>
                  <div className="card-body bd bd-t-0 rounded-bottom">
                    <div className="report_style">
                      <div className="report-item">
                        <Link to="/chart-of-account-ledger-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Chart Of Account Ledger Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/sub-category-list">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Subcategory Ledger Report</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/vendor-supplier-payable-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Vendor/Supplier Payable</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/distributor-payable-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Distributor Payable</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/receipt-payment-summary-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Receipts & Payments Summary</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/vendor-supplier-receivable-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Vendor/Supplier Receivable</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/distributor-receivable-report">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Distributor Receivable</span>
                        </Link>
                      </div>
                      <div className="report-item">
                        <Link to="/trial-balance">
                          <i className="fa fa-globe" aria-hidden="true"></i>
                          <span>Trial Balance</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(receiveData === "supply_chain" ||
              receiveData === "admin" ||
              receiveData === "moo" ||
              receiveData === "cluster") && (
              <>
                <div className="col-md-6">
                  <div className="card bd-0">
                    <div className="card-header card-header-default bg-primary">
                      Order Reports
                    </div>
                    <div className="card-body bd bd-t-0 rounded-bottom">
                      <div className="report_style">
                        <div className="report-item">
                          <Link to="/duplicate-order-check">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Duplicate order check</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/distributor/retailer-order-return">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Retailer Order Return</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/distributor/retailer-order-return-item-wise">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Retailer Order Return Item Wise</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/distributor/retailer-order">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Retailers Order</span>
                          </Link>
                        </div>
                         <div className="report-item">
                          <Link to="/distributor/retailer-basket-order">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Retailers Basket Order</span>
                          </Link>
                        </div>
                         <div className="report-item">
                          <Link to="/tracking-reports/category-wise-memo-report">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>Category Wise Memo Report</span>
                          </Link>
                        </div>
                        <div className="report-item">
                          <Link to="/report/dsr-delivery-report">
                            <i className="fa fa-globe" aria-hidden="true"></i>
                            <span>DSR Delivery Reports</span>
                          </Link>
                        </div>
                        {(receiveData === "moo" ||
                          receiveData === "cluster" ||
                          receiveData === "admin") && (
                          <>
                            <div className="report-item">
                              <Link to="/tracking-reports/mdo-sales-reports/rsm">
                                <i
                                  className="fa fa-globe"
                                  aria-hidden="true"
                                ></i>
                                <span>MDO Sales</span>
                              </Link>
                            </div>
                            <div className="report-item">
                              <Link to="/tracking-reports/ow-orders-reports/rsm">
                                <i
                                  className="fa fa-globe"
                                  aria-hidden="true"
                                ></i>
                                <span>Orderwala Orders</span>
                              </Link>
                            </div>
                            <div className="report-item">
                              <Link to="/tracking-reports/ow-undeliver-reports/rsm">
                                <i
                                  className="fa fa-globe"
                                  aria-hidden="true"
                                ></i>
                                <span>Orderwala Undelivered Orders</span>
                              </Link>
                            </div>
                            <div className="report-item">
                              <Link to="/tracking-reports/mdo-undeliver-reports/rsm">
                                <i
                                  className="fa fa-globe"
                                  aria-hidden="true"
                                ></i>
                                <span>MDO Undelivered Orders</span>
                              </Link>
                            </div>
                            <div className="report-item">
                              <Link to="/tracking-reports/basket-order-item-wise">
                                <i
                                  className="fa fa-globe"
                                  aria-hidden="true"
                                ></i>
                                <span>Basket Order (Item Wise)</span>
                              </Link>
                            </div>
                          </>
                        )}
                        {receiveData === "moo" ||
                          (receiveData === "cluster" && (
                            <>
                              <div className="report-item">
                                <Link to="/return-product">
                                  <i
                                    className="fa fa-globe"
                                    aria-hidden="true"
                                  ></i>
                                  <span>Return / Damage</span>
                                </Link>
                              </div>
                            </>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* row */}
        </div>
      </div>
      {/* am-mainpanel */}
    </div>
  );
};

export default Reports;
