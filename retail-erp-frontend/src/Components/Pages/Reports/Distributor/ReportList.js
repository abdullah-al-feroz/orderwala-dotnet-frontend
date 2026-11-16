import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const List = () => {
  return (
    <div>
      <div className="col-md-6">
        <div className="card bd-0">
          <div className="card-header card-header-default bg-primary">
            Report
          </div>
          <div className="card-body bd bd-t-0 rounded-bottom">
            <div className="report_style">
              <div className="report-item">
                <Link to="/distributor/order">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>Purchase From Depo</span>
                </Link>
              </div>
              <div className="report-item">
                <Link to="/distributor/order-return">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>Purchase Order Return to Depo</span>
                </Link>
              </div>
              <div className="report-item">
                <Link to="/report/distributor-product-stock">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>Product Stock</span>
                </Link>
              </div>

              <div className="report-item">
                <Link to="/report/distributor-new-product-stock">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>New Product Stock</span>
                </Link>
              </div>

              <div className="report-item">
                <Link to="/report/customer">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>Customers</span>
                </Link>
              </div>
              <div className="report-item">
                <Link to="/report/dsr-receive-amount">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>DSR & Distributor Receive Amount Ledger</span>
                </Link>
              </div>
              <div className="report-item">
                <Link to="/distributor/retailer-order">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>Customer Orders</span>
                </Link>
              </div>
              <div className="report-item">
                <Link to="/distributor/retailer-order-return">
                  <i className="fa fa-globe" aria-hidden="true"></i>
                  <span>Customer Order Returns</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
