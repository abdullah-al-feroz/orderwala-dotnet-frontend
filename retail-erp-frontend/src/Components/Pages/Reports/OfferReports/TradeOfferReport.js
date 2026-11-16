import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import Select from "react-select";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
//New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
//New Data table Code End

const OnePercentOfferReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [discountOffer, setDiscountOffer] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  )
    .toISOString()
    .substr(0, 10);
  console.log(firstDayOfMonth);

  const [inputs, setInputs] = useState({
    from: firstDayOfMonth,
    to: new Date().toISOString().substr(0, 10),
  });

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading indicator
      const tradeOfferList = await Http.get("/trade-offer-list");
      setDiscountOffer(tradeOfferList.data);
      const res = await Http.post("/trade-offer-report", inputs); // Await the HTTP request
      setReceiveData(res.data); // Set the received data
    } catch (error) {
      console.error("Error submitting form:", error); // Log errors
      // Optionally handle errors (e.g., show a toast or alert)
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const cols = [
    { field: "zone", header: "Zone" },
    { field: "region", header: "Region" },
    { field: "area", header: "Area" },
    { field: "base", header: "Base" },
    { field: "distributor", header: "Distributor" },
    { field: "distributor_code", header: "Distributor Id" },
    { field: "no_of_customers", header: "No. Of Customer " },
    {
      field: "actual_product_amount",
      header: "Actual Product Without Discount Amount",
    },
    { field: "delivery_amount", header: " Delivery After Discount Amount" },
    { field: "discount_amount", header: "Total Discount Given" },
    // { field: "fixed_percentage", header: "Fixed Percentage" },
    /*{
      field: "minus_amount",
      header: "Minus Amount",
      computed: (row) =>
        row.actual_product_amount - (row.delivery_amount + row.discount_amount),
    },
    {
      field: "minus_amount",
      header: "Minus Amount",
      computed: (row) => row.discount_amount - row.fixed_percentage,
    },*/
  ];

  //Date range start
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = async () => {
    try {
      setLoading(true); // Start loading indicator

      const res = await Http.post("/trade-offer-report", inputs); // Await the HTTP request
      setReceiveData(res.data); // Set the received data
    } catch (error) {
      console.error("Error submitting form:", error); // Log errors
      // Optionally handle errors (e.g., show a toast or alert)
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  //Date range end
  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">
              Product Rate Wise Discount Offer Report
            </h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            {/* Date range start */}
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Offer</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={discountOffer[0]}
                    name="discount_offer_id"
                    options={discountOffer}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To Date</label>
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
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
            {/* Date range end */}

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
    </div>
  );
};

export default OnePercentOfferReport;
