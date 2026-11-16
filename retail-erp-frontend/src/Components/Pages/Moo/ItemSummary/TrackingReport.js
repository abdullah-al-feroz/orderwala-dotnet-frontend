import React, { useEffect, useState } from "react";
import Http from "../../../Common/Http";
import ReactDataTable from "../../../Common/ReactDataTable";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState([]);

  // Get the first and last dates of the current month
  const { firstDay, lastDay } = getCurrentMonthDateRange();

  const [inputs, setInputs] = useState({
    start_date: firstDay,
    end_date: lastDay,
  });

  function getCurrentMonthDateRange() {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    // First day of the current month
    const firstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;

    // Last day of the current month
    const lastDay = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(
      year,
      month + 1,
      0
    ).getDate()}`;

    return { firstDay, lastDay };
  }

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);
      //   const ordersResponse = await Http.get("/moo/tracking-report");
      //   setReceiveData(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Ensure the selected date falls within the current month range
    // if (
    //   new Date(value) >= new Date(firstDay) &&
    //   new Date(value) <= new Date(lastDay)
    // ) {
    setInputs((prev) => ({ ...prev, [name]: value }));
    // } else {
    //   console.error("Selected date is out of range for the current month.");
    // }
  };

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      from: submissionInputs.start_date,
      to: submissionInputs.end_date,
    });

    if (Number.isInteger(submissionInputs.work_place_zone_id)) {
      queryParams.append("zone", submissionInputs.work_place_zone_id);
    }
    try {
      const response = await Http.get(
        `/app/moo/base-wise-order-delivery-range?${queryParams.toString()}`
      );
      setReceiveData(response.data.list || []);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const cols = [
    { field: "zone.name", header: "Zone" },
    { field: "region.name", header: "Region" },
    { field: "area.name", header: "Area" },
    { field: "name", header: "Base" },
    { field: "below_500_order_qty", header: "Below 500 tk order qty" },
    { field: "below_500_delivery_qty", header: "Below 500 tk delivery Qty" },
    { field: "range_500_999_order_qty", header: "500 tk to 999 tk order qty" },
    {
      field: "range_500_999_delivery_qty",
      header: "500 tk to 999 tk delivery qty",
    },
    {
      field: "range_1000_1499_order_qty",
      header: "1000 tk to 1499 tk order qty",
    },
    {
      field: "range_1000_1499_delivery_qty",
      header: "1000 tk to 1499 tk delivery qty",
    },
    {
      field: "range_1500_1999_order_qty",
      header: "1500 tk to 1999 tk order qty",
    },
    {
      field: "range_1500_1999_delivery_qty",
      header: "1500 tk to 1999 tk delivery qty",
    },
    {
      field: "range_2000_plus_order_qty",
      header: "2000 tk & above order Qty",
    },
    {
      field: "range_2000_plus_delivery_qty",
      header: "2000 tk & above delivery Qty",
    },
    { field: "total_order_qty", header: "Total Order Qty" },
    { field: "total_delivery_qty", header: "Total Delivery Qty" },
  ];

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Tracking Report</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Zone</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={zone[0]}
                    name="work_place_zone_id"
                    options={zone}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={inputs.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    value={inputs.end_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg mt-4">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
