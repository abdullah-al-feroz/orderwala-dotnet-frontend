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
  const [offers, setOffers] = useState([]);

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
    distributor_id: "",
    date: "",
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

  useEffect(() => {
    // Fetch offers from the API
    const fetchOffers = async () => {
      try {
        const response = await Http.get("/distributor");
        setOffers(response.data || []); // Set offers data
      } catch (error) {
        console.error("Error fetching offers:", error);
        showAlert("Error loading offers", "danger");
      }
    };

    fetchOffers(); // Call the function to fetch offers
  }, []); // Empty dependency array to run once on mount

  // columns for ReactDataTable
  // We'll add a custom "render" function to detect if a row is a distributor row
  

  // Convert your nested structure into a flat array of rows
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
        `/distributor-sotck-datewise/${inputs.distributor_id}`,
        { ...inputs, date: inputs.date }
      );
      // transform nested [ {info, items}, {info, items}, ... ] into rows
      const flattened = res?.data?.product_stock;
      setReceiveData(flattened);
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("Error loading data", "danger");
    } finally {
      setLoading(false);
    }
  };

  const cols = [
    // { field: "id", header: "ID" },
    { field: "code", header: "Code" },
    { field: "name_en", header: "Name" },
    // { field: "name", header: "Name (Bangla)" },
    // { field: "unit.name", header: "Unit" },
    // { field: "category.name", header: "Category" },
    { field: "disOpeningStockQty", header: "Opening" },
    { field: "tStockQty", header: "Stock" },
    
    // { field: "status", header: " Status " },
    // { field: "action", header: "Action" },
  ];

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
                  name="distributor_id"
                  onChange={handleChange}
                >
                  <option value="">Select Offer</option>
                  {offers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="col-lg">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="to"
                  value={inputs.to || ""}
                  onChange={handleChange}
                />
              </div> */}

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
