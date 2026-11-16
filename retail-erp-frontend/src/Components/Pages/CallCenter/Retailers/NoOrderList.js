import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

// New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
// New Data table Code End

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [route, setRoute] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    region_id: "",
    area_id: "",
    base_id: "",
    route_id: "",
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
      const res1 = await Http.get("/customer-care/retailer-without-orders");
      const dataWithFormattedDate = res1.data.map((item) => ({
        ...item,
        store_created_date: formatDateTime(item.created_at),
        region_name: item.route?.region?.name || "",
        area_name: item.route?.area?.name || "",
        base_name: item.route?.base?.name || "",
        route_name: item.route?.name || "",
      }));
      setReceiveData(dataWithFormattedDate);

      const res2 = await Http.get("/region");
      setRegion(res2.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const areaRegionWise = async (e) => {
    const name = e.target.name;
    const value = e.target.value;

    try {
      const res = await Http.get(`/region-wise-area/${value}`);
      setArea(res.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }

    setFilters((values) => ({ ...values, [name]: value }));
  };

  const baseRegionWise = async (e) => {
    const name = e.target.name;
    const value = e.target.value;

    try {
      const res = await Http.get(`/area-wise-base/${value}`);
      setBase(res.data);
    } catch (error) {
      console.error("Error fetching bases:", error);
    }

    setFilters((values) => ({ ...values, [name]: value }));
  };

  const routeBaseWise = async (e) => {
    const name = e.target.name;
    const value = e.target.value;

    try {
      const res = await Http.get(`/base-wise-route/${value}`);
      setRoute(res.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }

    setFilters((values) => ({ ...values, [name]: value }));
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
    { field: "shop_name", header: "Shop Name" },
    { field: "phone", header: "Phone" },
    { field: "region_name", header: "Region" },
    { field: "area_name", header: "Area" },
    { field: "base_name", header: "Base" },
    { field: "route_name", header: "Route" },
    { field: "store_created_date", header: "Created Date" },
  ];

  const formSubmit = async () => {
    try {
      const res = await Http.get("/customer-care/retailer-without-orders", {
        params: filters,
      });
      const dataWithFormattedDate = res.data.map((item) => ({
        ...item,
        store_created_date: formatDateTime(item.created_at),
        region_name: item.route?.region?.name || "",
        area_name: item.route?.area?.name || "",
        base_name: item.route?.base?.name || "",
        route_name: item.route?.name || "",
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
          <h5 className="am-title">Retailer Without Order</h5>
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
              <label htmlFor="region_id">Region:</label>
              <select
                className="form-control"
                name="region_id"
                onChange={areaRegionWise}
              >
                <option value="">Select Region</option>
                {region.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg">
              <label htmlFor="area_id">Area:</label>
              <select
                className="form-control"
                name="area_id"
                onChange={baseRegionWise}
              >
                <option value="">Select Area</option>
                {area.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg">
              <label htmlFor="base_id">Base:</label>
              <select
                className="form-control"
                name="base_id"
                onChange={routeBaseWise}
              >
                <option value="">Select Base</option>
                {base.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg">
              <label htmlFor="route_id">Route:</label>
              <select
                className="form-control"
                name="route_id"
                onChange={handleChange}
              >
                <option value="">Select Route</option>
                {route.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
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
            pathname: "/tracking-reports/attendance-reports/am/" + rowData.id,
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
