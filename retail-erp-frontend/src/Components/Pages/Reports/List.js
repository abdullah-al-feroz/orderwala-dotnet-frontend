import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";
import ReportList from "./Distributor/ReportList";
import "./List.css";

// Role groups reused across sections
const MANAGEMENT = ["moo", "cluster", "admin"];
const OPERATIONS = ["depot", "supply_chain", ...MANAGEMENT];
const SUPPLY_MANAGEMENT = ["supply_chain", ...MANAGEMENT];

// `roles` on a section controls the card; `roles` on an item narrows it further.
const SECTIONS = [
  {
    key: "general",
    title: "General Reports",
    description: "Stock, distributors, retailers and field activity",
    icon: "fa-bar-chart",
    roles: OPERATIONS,
    items: [
      { label: "HR Report", to: "/report/hr-incentive-report", roles: MANAGEMENT },
      { label: "Product Stock", to: "/report/depo-wise-product-stock", roles: SUPPLY_MANAGEMENT },
      { label: "Product Stock", to: "/report/product-stock", roles: ["depot"] },
      { label: "Distributors", to: "/report/distributor" },
      { label: "All Distributor Stock Report", to: "/report/all-distributor-stock-report" },
      { label: "Retailers", to: "/report/customer" },
      { label: "Duplicate Customers", to: "/report/duplicate-customers" },
      { label: "SKU Wise Item Summary", to: "/sku-wise-item-summary" },
      { label: "Tracking Report", to: "/tracking-report" },
      { label: "Route Wise Customer Acquisition", to: "/route-wise-customer-acquisition" },
      { label: "Staff Target Achievement", to: "/staff-target-achievement" },
      { label: "Change Customer Route", to: "/change-customer-route" },
      {
        label: "Sales vs. Stock Quantity Analysis Report",
        to: "/sales-vs-stock-quantity-analysis-report",
        roles: ["admin"],
      },
    ],
  },
  {
    key: "offer",
    title: "Offer Reports",
    description: "Trade offers, discounts, coupons and campaigns",
    icon: "fa-tags",
    roles: OPERATIONS,
    items: [
      { label: "Offer Report", to: "/report/offer-report" },
      {
        label: "Stock Wise Trade Offer With Discount Offer (Rakib Bhai Special)",
        to: "/report/stock-wise-trade-offer-with-discount-offer-report",
      },
      { label: "Product Wise Discount Offer Report", to: "/report/trade-offer-report" },
      { label: "Date Wise Stock", to: "/report/date-wise-stock" },
      { label: "Category Wise Percentage Report", to: "/category-wise-percentage-offer-report" },
      { label: "Base Wise Sales Report (more than 499 tk)", to: "/base-wise-sales-report-499" },
      { label: "Base Wise Sales Report (more than 799 tk)", to: "/base-wise-sales-report" },
      { label: "Coupon Generate Lists", to: "/coupon-generate-lists" },
      {
        label: "Base Wise Order & Delivery Qty (Range-wise)",
        to: "/base-wise-order-delivery-range-report",
      },
      { label: "Product Wise Sales & Delivery", to: "/product-wise-sales-delivery-report" },
      { label: "Campaign Offer (6000 tk Purchase 150 tk Discount)", to: "/campaign-offer" },
      {
        label: "Campaign Offer Product Wise (6000 tk Purchase 150 tk Discount)",
        to: "/campaign-offer-product-wise",
      },
      { label: "Discount Offer (April 18 to 29)", to: "/discount-offer-details", roles: ["admin"] },
      {
        label: "Specific Discount Offer (April 18 to 29)",
        to: "/specific-offer-details",
        roles: ["admin"],
      },
    ],
  },
  {
    key: "tracking",
    title: "Tracking Reports",
    description: "Attendance, store coverage and delivery tracking",
    icon: "fa-map-marker",
    roles: MANAGEMENT,
    items: [
      { label: "All Attendance", to: "/so-track/attendance-list" },
      { label: "CDM Attendance Report", to: "/tracking-reports/attendance-reports/cdm" },
      {
        label: "Developer Mode On Attendance Report",
        to: "/tracking-reports/attendance-reports/developer-mode",
      },
      { label: "MDO Created Stores", to: "/tracking-reports/mdo-created-stores-reports/rsm" },
      { label: "MDO Visited Areas", to: "/tracking-reports/mdo-visited-area-reports/rsm" },
      { label: "DSR Delivery", to: "/tracking-reports/dsr-delivery-reports/rsm" },
      {
        label: "Orderwala Total Verified Stores",
        to: "/tracking-reports/ow-total-verified-stores-reports/rsm",
      },
      { label: "Target vs Achievement", to: "/tracking-reports/target-vs-achievement" },
    ],
  },
  {
    key: "brand-promoter",
    title: "Brand Promoter Reports",
    description: "Promoter tracking, surveys and verification",
    icon: "fa-bullhorn",
    roles: MANAGEMENT,
    items: [
      { label: "Brand Promoter Tracking Report", to: "/bp-tracking-report" },
      { label: "Brand Promoter Survey", to: "/survey-report-pagination" },
      { label: "Fake Customer List", to: "/fake-customer-report" },
      { label: "Category Wise Order Report", to: "/category-wise-order-report" },
    ],
  },
  {
    key: "sales",
    title: "Sales Reports",
    description: "Month-end SKU sales summaries",
    icon: "fa-line-chart",
    roles: ["supply_chain"],
    items: [
      { label: "Monthly End SKU Wise Sales (Payment Date Wise)", to: "#" },
      { label: "Monthly End SKU Wise Sales (Delivery Date Wise)", to: "#" },
    ],
  },
  {
    key: "hr",
    title: "HR Management Reports",
    description: "Salary, leave, attendance and appraisal",
    icon: "fa-users",
    roles: ["admin", "hr"],
    items: [
      { label: "Salary Structure", to: "/hr-salary-structure" },
      { label: "Leave Report", to: "/hr-leave-report" },
      { label: "Monthly Salary Report", to: "/monthly-salary-report" },
      { label: "Attendance Report", to: "/attendance-report" },
      { label: "Paid Salary Report", to: "/salary-payment-report" },
      { label: "APA Report", to: "/apa-report" },
    ],
  },
  {
    key: "accounts",
    title: "Accounts",
    description: "Ledgers, payables, receivables and balances",
    icon: "fa-calculator",
    roles: ["admin", "accounts"],
    items: [
      { label: "Chart of Account Ledger Report", to: "/chart-of-account-ledger-report" },
      { label: "Subcategory Ledger Report", to: "/sub-category-list" },
      { label: "Vendor/Supplier Payable", to: "/vendor-supplier-payable-report" },
      { label: "Distributor Payable", to: "/distributor-payable-report" },
      { label: "Receipts & Payments Summary", to: "/receipt-payment-summary-report" },
      { label: "Vendor/Supplier Receivable", to: "/vendor-supplier-receivable-report" },
      { label: "Distributor Receivable", to: "/distributor-receivable-report" },
      { label: "Trial Balance", to: "/trial-balance" },
    ],
  },
  {
    key: "order",
    title: "Order Reports",
    description: "Retailer orders, returns and deliveries",
    icon: "fa-shopping-cart",
    roles: SUPPLY_MANAGEMENT,
    items: [
      { label: "Duplicate Order Check", to: "/duplicate-order-check" },
      { label: "Retailer Order Return", to: "/distributor/retailer-order-return" },
      {
        label: "Retailer Order Return Item Wise",
        to: "/distributor/retailer-order-return-item-wise",
      },
      { label: "Retailers Order", to: "/distributor/retailer-order" },
      { label: "Retailers Basket Order", to: "/distributor/retailer-basket-order" },
      { label: "Category Wise Memo Report", to: "/tracking-reports/category-wise-memo-report" },
      { label: "DSR Delivery Reports", to: "/report/dsr-delivery-report" },
      { label: "MDO Sales", to: "/tracking-reports/mdo-sales-reports/rsm", roles: MANAGEMENT },
      { label: "Orderwala Orders", to: "/tracking-reports/ow-orders-reports/rsm", roles: MANAGEMENT },
      {
        label: "Orderwala Undelivered Orders",
        to: "/tracking-reports/ow-undeliver-reports/rsm",
        roles: MANAGEMENT,
      },
      {
        label: "MDO Undelivered Orders",
        to: "/tracking-reports/mdo-undeliver-reports/rsm",
        roles: MANAGEMENT,
      },
      {
        label: "Basket Order (Item Wise)",
        to: "/tracking-reports/basket-order-item-wise",
        roles: MANAGEMENT,
      },
      // Previously rendered for cluster only (operator-precedence quirk); kept as-is.
      { label: "Return / Damage", to: "/return-product", roles: ["cluster"] },
    ],
  },
];

const canSee = (roles, role) => !roles || roles.includes(role);

const Reports = () => {
  const [receiveData, setReceiveData] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [activeKey, setActiveKey] = useState("all");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/" && location.pathname !== "/login") {
      fetchData();
    }
  }, [location.pathname]);

  const fetchData = () => {
    Http.get("/staff-type-check")
      .then((res) => {
        setReceiveData(res.data);
      })
      .finally(() => setLoaded(true));
  };

  // Sections and items this role is allowed to see
  const allowedSections = useMemo(
    () =>
      SECTIONS.filter((section) => canSee(section.roles, receiveData))
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => canSee(item.roles, receiveData)),
        }))
        .filter((section) => section.items.length > 0),
    [receiveData]
  );

  // Narrowed by the sidebar category and the search box
  const visibleSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allowedSections
      .filter((section) => activeKey === "all" || section.key === activeKey)
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => !query || item.label.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [allowedSections, activeKey, search]);

  const totalAllowed = allowedSections.reduce((sum, s) => sum + s.items.length, 0);
  const totalVisible = visibleSections.reduce((sum, s) => sum + s.items.length, 0);
  const isDistributor = receiveData === "distributor";
  const isFiltered = search.trim() !== "" || activeKey !== "all";

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
        <div className="am-pagebody rpt" style={{ minHeight: "80vh" }}>
          {isDistributor ? (
            <div className="row row-sm">
              <ReportList />
            </div>
          ) : (
            <>
              <div className="rpt-toolbar">
                <div>
                  <h4 className="rpt-toolbar__title">Report Library</h4>
                  <p className="rpt-toolbar__meta">
                    {loaded
                      ? isFiltered
                        ? `Showing ${totalVisible} of ${totalAllowed} reports`
                        : `${totalAllowed} reports in ${allowedSections.length} categories`
                      : "Loading available reports…"}
                  </p>
                </div>
                <div className="rpt-search">
                  <i className="fa fa-search" aria-hidden="true"></i>
                  <input
                    type="search"
                    placeholder="Search reports"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search reports"
                    disabled={!loaded}
                  />
                </div>
              </div>

              <div className="rpt-layout">
                <aside className="rpt-nav">
                  <div className="rpt-nav__label">Categories</div>
                  {!loaded ? (
                    [0, 1, 2, 3, 4].map((i) => <div className="rpt-skel rpt-skel--nav" key={i} />)
                  ) : (
                    <ul>
                      <li>
                        <button
                          type="button"
                          className={`rpt-nav__item${activeKey === "all" ? " is-active" : ""}`}
                          onClick={() => setActiveKey("all")}
                        >
                          <i className="fa fa-th-large" aria-hidden="true"></i>
                          <span>All reports</span>
                          <em>{totalAllowed}</em>
                        </button>
                      </li>
                      {allowedSections.map((section) => (
                        <li key={section.key}>
                          <button
                            type="button"
                            className={`rpt-nav__item${
                              activeKey === section.key ? " is-active" : ""
                            }`}
                            onClick={() => setActiveKey(section.key)}
                          >
                            <i className={`fa ${section.icon}`} aria-hidden="true"></i>
                            <span>{section.title}</span>
                            <em>{section.items.length}</em>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </aside>

                <div className="rpt-content">
                  {!loaded &&
                    [0, 1].map((i) => (
                      <div className="rpt-panel" key={i}>
                        <div className="rpt-panel__head">
                          <div className="rpt-skel rpt-skel--title" />
                        </div>
                        <div className="rpt-panel__body">
                          {[0, 1, 2, 3].map((j) => (
                            <div className="rpt-skel rpt-skel--row" key={j} />
                          ))}
                        </div>
                      </div>
                    ))}

                  {loaded &&
                    visibleSections.map((section) => (
                      <section className="rpt-panel" key={section.key}>
                        <header className="rpt-panel__head">
                          <div>
                            <h6 className="rpt-panel__title">{section.title}</h6>
                            <p className="rpt-panel__desc">{section.description}</p>
                          </div>
                          <span className="rpt-panel__count">
                            {section.items.length}{" "}
                            {section.items.length === 1 ? "report" : "reports"}
                          </span>
                        </header>
                        <ul className="rpt-panel__body">
                          {section.items.map((item) => {
                            const pending = item.to === "#";
                            return (
                              <li key={item.to + item.label}>
                                <Link
                                  to={item.to}
                                  className={`rpt-row${pending ? " is-pending" : ""}`}
                                >
                                  <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                  <span className="rpt-row__label">{item.label}</span>
                                  {pending ? (
                                    <span className="rpt-row__tag">Coming soon</span>
                                  ) : (
                                    <i
                                      className="fa fa-chevron-right rpt-row__go"
                                      aria-hidden="true"
                                    ></i>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ))}

                  {loaded && visibleSections.length === 0 && (
                    <div className="rpt-panel rpt-empty">
                      <i className="fa fa-search" aria-hidden="true"></i>
                      <h6>{isFiltered ? "No reports found" : "No reports available"}</h6>
                      <p>
                        {isFiltered
                          ? "No report matches your search in this category."
                          : "Your account does not have access to any reports."}
                      </p>
                      {isFiltered && (
                        <button
                          type="button"
                          className="rpt-btn"
                          onClick={() => {
                            setSearch("");
                            setActiveKey("all");
                          }}
                        >
                          Reset filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* am-mainpanel */}
    </div>
  );
};

export default Reports;
