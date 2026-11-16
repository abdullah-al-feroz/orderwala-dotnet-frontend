import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";

// Import your data-table component
import ReactDataTable from "../../../Common/ReactDataTable";

const OnePercentOfferReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // For date inputs, default from the 2nd day of this month to "today"
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  )
    .toISOString()
    .substr(0, 10);

  const [inputs, setInputs] = useState({
    from: firstDayOfMonth,
    to: new Date().toISOString().substr(0, 10),
    discount_offer_id: "",
  });

  // Show alerts for 4 seconds
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    if (!location.state) return;
    showAlert(location.state.message, location.state.type);
  }, [location]);

  // columns for ReactDataTable
  // We'll add a custom "render" function to detect if a row is a distributor row
  const cols = [
    {
      field: "distributor",
      header: "Distributor / Product",
      // If it's a distributor row, show the distributor's name. Otherwise, show product name.
      render: (row) =>
        row.isDistributorRow ? row.distributor + row.code : row.productName,
    },
    {
      field: "code",
      header: "Code",
    },
    {
      field: "no_of_customers",
      header: "No. of Customers",
      render: (row) => (!row.isDistributorRow ? row.no_of_customers : ""),
    },
    /*{
      field: "actual_product_amount",
      header: "Actual Product Amount",
      render: (row) => (!row.isDistributorRow ? row.actual_product_amount : ""),
    },
    {
      field: "delivery_amount",
      header: "Delivery Amount",
      render: (row) => (!row.isDistributorRow ? row.delivery_amount : ""),
    },*/
    {
      field: "total_invoice_qty",
      header: "Total Invoice Qty",
      render: (row) => (!row.isDistributorRow ? row.total_invoice_qty : ""),
    },
    {
      field: "total_trade_offer_qty",
      header: "Total Trade Offer Qty",
      render: (row) => (!row.isDistributorRow ? row.total_trade_offer_qty : ""),
    },
  ];

  // Convert your nested structure into a flat array of rows
  const transformData = (data) => {
    const rows = [];

    data.forEach((dist) => {
      // 1) The "distributor row" - used as a header row
      rows.push({
        isDistributorRow: true,
        distributor: dist.info?.name || "",
        code: dist.info?.code || "",
        no_of_customers: "",
        actual_product_amount: "",
        delivery_amount: "",
        discount_amount: "",
        total_invoice_qty: "",
        total_trade_offer_qty: "",
      });

      // 2) Now each product row for that distributor
      dist.items?.forEach((item) => {
        rows.push({
          isDistributorRow: false,
          distributor: item.name || "",
          no_of_customers: item.no_of_customers || 0,
          actual_product_amount: item.actual_product_amount || 0,
          delivery_amount: item.delivery_amount || 0,
          discount_amount: item.discount_amount || 0,
          total_invoice_qty: item.total_invoice_qty || 0,
          total_trade_offer_qty: item.total_trade_offer_qty || 0,
        });
      });
    });

    return rows;
  };

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // submit form to the server & transform result
  const formSubmit = async () => {
    try {
      setLoading(true);
      const res = await Http.post(
        "/stock-wise-trade-offer-with-discount-offer-report",
        inputs
      );
      // transform nested [ {info, items}, {info, items}, ... ] into rows
      const flattened = transformData(res.data || []);
      setReceiveData(flattened);
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("Error loading data", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <IsLogin />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Product Rate Wise Discount Offer Report</h5>
        </div>

        <div className="am-pagebody">
          <Alert alert={alert} />

          {/* Date range & offer selection */}
          <div className="card pd-sm-40">
            <div className="row">
              <div className="col-lg">
                <label>Offer</label>
                <select
                  className="form-control"
                  name="discount_offer_id"
                  onChange={handleChange}
                >
                  <option value="">Select Offer</option>
                  <option value="1">
                    Offer (2025 1st March to 2025 13th March)
                  </option>
                  <option value="2">
                    Offer (2025 14th March to 2025 20th March)
                  </option>
                  <option value="3">
                    Offer (2025 21th March to 2025 28th March)
                  </option>
                  <option value="4">
                    Offer (2025 18th April to 2025 29th April)
                  </option>
                  <option value="5">
                    Offer (2025 30th April to 2025 22th May)
                  </option>
                  <option value="6">
                    Offer (2025 23rd May to 2025 29th May)
                  </option>
                  <option value="7">
                    Offer (2025 30th May to 2025 5th June)
                  </option>
                  <option value="8">
                    Offer (2025 12th June to 2025 19th June)
                  </option>
                  <option value="9">
                    Offer (2025 20th June to 2025 30th June)
                  </option>
                  <option value="10">
                    Offer (2025 1st July to 2025 17th July)
                  </option>
                  <option value="11">
                    Offer (2025 18th July to 2025 28th July)
                  </option>
                  <option value="12">
                    Offer (2025 12th August to 2025 26th August)
                  </option>
                </select>
              </div>

              <div className="col-lg">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="from"
                  value={inputs.from || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="to"
                  value={inputs.to || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg">
                <button
                  className="btn btn-primary btn-block mg-b-10 mt-4"
                  onClick={formSubmit}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Search"}
                </button>
              </div>
            </div>
          </div>

          {/* Render the flattened data in a single ReactDataTable */}
          <div className="card">
            <ReactDataTable
              cols={cols}
              isLoading={loading}
              receiveData={receiveData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnePercentOfferReport;
