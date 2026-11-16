import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Http from "../../../Common/Http";
import ReactDataTable from "../../../Common/ReactDataTable";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [inputs, setInputs] = useState({
    start_date: getCurrentDate(),
    end_date: getCurrentDate(),
  });
  function getCurrentDate() {
    const dateObj = new Date();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  }
  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const ordersResponse = await Http.get(
        "/distributor/retailer-order-return-item-wise"
      );
      setReceiveData(ordersResponse.data);
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
    if (name == "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => {
        setArea(res.data);
      });
    }
    if (name == "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
      ).then((res) => {
        setBase(res.data);
      });
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = {
      ...inputs,
    };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      from: submissionInputs.start_date,
      to: submissionInputs.end_date,
      type: submissionInputs.type,
    });

    // Conditionally add region, area, and base if they are integers
    if (Number.isInteger(submissionInputs.work_place_zone_id)) {
      queryParams.append("zone", submissionInputs.work_place_zone_id);
    }
    if (Number.isInteger(submissionInputs.work_place_region_id)) {
      queryParams.append("region", submissionInputs.work_place_region_id);
    }
    if (Number.isInteger(submissionInputs.work_place_area_id)) {
      queryParams.append("area", submissionInputs.work_place_area_id);
    }
    if (Number.isInteger(submissionInputs.work_place_base_id)) {
      queryParams.append("base", submissionInputs.work_place_base_id);
    }

    try {
      const response = await Http.get(
        `/distributor/retailer-order-return-item-wise?${queryParams.toString()}`
      );
      setReceiveData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const cols = [
    { field: "date", header: "Order Date" },
    { field: "receipt_no", header: "Invoice No" },
    { field: "zone.name", header: "Zone" },
    { field: "region.name", header: "Region" },
    { field: "area.name", header: "Area" },
    { field: "base.name", header: "Base" },
    { field: "route.name", header: "Route" },
    {
      field: (rowData) => (rowData.mdo_id > 0 ? "MDO" : "Orderwala"),
      header: "Type",
    },
    {
      field: "customer.phone",
      header: "Customer Phone",
      template: (rowData) => rowData.customer?.phone || "",
    },
    {
      field: "customer.shop_name",
      header: "Shop Name",
      template: (rowData) => rowData.customer?.shop_name || "",
    },
    {
      field: "distributor.name",
      header: "Distributor Name",
      template: (rowData) => rowData.distributor?.name || "",
    },
    {
      field: "distributor.code",
      header: "Distributor Code",
      template: (rowData) => rowData.distributor?.code || "",
    },
    {
      field: "product_name",
      header: "Product Name",
      template: (rowData) => rowData.product_name || "",
    },
    {
      field: "qty",
      header: "Quantity",
      template: (rowData) => rowData.qty || "",
    },
    { field: "actual_amount", header: "Invoice Total" },
    {
      field: (rowData) => (rowData.distributor_recieved > 0 ? "Received" : ""),
      header: "Distributor Received Status",
    },
    {
      field: (rowData) =>
        rowData.customer_care_recieved > 0 ? "Received" : "",
      header: "Customer Care Received Status",
    },
  ];

  const actionTemplate = (rowData, deleteData) => {
    return (
      <div className="text-xs text-nowrap">
        <Link
          to={{
            pathname: "/distributor/retailer-order-return/" + rowData.id,
          }}
          className="btn btn-info btn-sm"
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </Link>
      </div>
    );
  };
  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Retailer Order Return Item Wise</h5>
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
                  <label htmlFor="">Region</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={region[0]}
                    name="work_place_region_id"
                    options={region}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Area</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={area[0]}
                    name="work_place_area_id"
                    options={area}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Base</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={base[0]}
                    name="work_place_base_id"
                    options={base}
                    onChange={selectHandleChange}
                  />
                </div>
              </div>
              <div className="row mt-4">
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
                // actionTemplate={actionTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
