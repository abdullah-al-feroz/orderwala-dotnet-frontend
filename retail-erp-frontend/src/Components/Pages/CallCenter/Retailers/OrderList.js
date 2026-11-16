import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

// New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
// New Data table Code End

const List = () => {
  const [receiveData, setReceiveData] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    from_date: today,
    to_date: today,
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const fetchInitialData = async () => {
    try {
      const res1 = await Http.get("/customer-care/retailer-order-list");
      const dataWithFormattedDate = res1.data.map((item) => ({
        ...item,
        order_delivery_date: formatDateTime(item.delivery_date),
        order_date: formatDateTime(item.date),
      }));
      setReceiveData(dataWithFormattedDate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const cols = [
    { field: "order_delivery_date", header: "D.Date" },
    { field: "order_date", header: "O.Date" },
    { field: "receipt_no", header: "Invoice No" },
    { field: "shop_name", header: "Shop Name" },
    { field: "phone", header: "Phone" },
    { field: "distributor", header: "Distributor Name" },
    { field: "total_price", header: "Inv. Total" },
    { field: "payment_amount", header: "Received" },
  ];

  const deleteData = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };

  const formSubmit = async () => {
    try {
      const res = await Http.get("/customer-care/retailer-order-list", {
        params: filters,
      });
      const dataWithFormattedDate = res.data.map((item) => ({
        ...item,
        order_delivery_date: formatDateTime(item.delivery_date),
        order_date: formatDateTime(item.date),
      }));
      setReceiveData(dataWithFormattedDate);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <div>
      <IsLogin />
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">All Retailer Order</h5>
        </div>
        <div className="card pd-sm-40">
          <div className="row">
            <div className="col-lg">
              <label htmlFor="from_date">From Date:</label>
              <input
                type="date"
                id="from_date"
                name="from_date"
                className="form-control"
                value={filters.from_date}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg">
              <label htmlFor="to_date">To Date:</label>
              <input
                type="date"
                id="to_date"
                name="to_date"
                className="form-control"
                value={filters.to_date}
                onChange={handleChange}
              />
            </div>

            <div className="col-lg">
              <label htmlFor="type">Type:</label>
              <select
                className="form-control"
                name="type"
                onChange={handleChange}
              >
                <option value="order_date">Search By Order Date</option>
                <option value="delivery_date">Search By Delivery Date</option>
                <option value="payment_receive_date">
                  Search By Payment Receive Date
                </option>
                <option value="payment_yet_to_receive">
                  Search By Payment Yet to Receive
                </option>
                <option value="todays_delivery">
                  Search By Todays Delivery
                </option>
              </select>
            </div>

            <div className="col-lg">
              <label htmlFor="base_id">&nbsp;</label>
              <button
                className="btn btn-primary btn-block mg-b-10"
                onClick={formSubmit}
              >
                <i className="fa fa-send mg-r-10"></i> Search
              </button>
            </div>
          </div>
        </div>
        <div className="am-pagebody">
          <div className="card">
            <ReactDataTable
              cols={cols}
              receiveData={receiveData}
              actionTemplate={actionTemplate}
              deleteData={deleteData}
            />
          </div>
        </div>
        {/* am-pagebody */}
        <div className="am-footer">
          <span>
            Copyright ©. All Rights Reserved.{" "}
            <a href="http://limerickbd.com/">Limerick Resources Limited</a>
          </span>
        </div>
        {/* am-footer */}
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData, statusChange) => {
  return (
    rowData.id && (
      <div className="text-xs text-nowrap">
        <Link
          to={{
            pathname: "/call-center/retailer-order-details/" + rowData.id,
          }}
          className="btn btn-info btn-sm mx-1"
          title="View"
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </Link>
      </div>
    )
  );
};

export default List;
