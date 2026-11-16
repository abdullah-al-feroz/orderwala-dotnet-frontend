import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

import ReactDataTable from "../../../Common/ReactDataTable";
import { usePaginationState } from "../../../Common/Pagination/AdvancedPagination";
const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(null);
  const cols = [
    // { field: "serialNumber", header: "S/N" },
    { field: "code", header: "Code" },
    { field: "shop_name", header: "Name" },
    { field: "route.name", header: "Route" },
    { field: "place.name", header: "Place" },
    { field: "thana.name", header: "Thana" },
    { field: "district.name", header: "District" },
    { field: "division.name", header: "Division" },
    { field: "distributor.name", header: "Distributor" },
    { field: "route.base.so.name", header: "So" },
    { field: "route.base.dsr.name", header: "DSR" },
    { field: "phone", header: "Phone" },
    { field: "address", header: "Address" },
    { field: "status", header: " Status " },
    { field: "total_order_amount", header: "Total Order" },
    { field: "total_paid_amount", header: "Total Payment" },
    { field: "total_due_amount", header: "Total Balance" },
    { field: "verified_by.name", header: "Verified By" },
  ];
  const [inputs, setInputs] = useState({
    status: "active",
    start_date: "",   // Default start date (30 days ago)
    end_date: "",
  });

  const {
    pagination,
    setPagination,
    AdvancePagination,
    handleExportCSV,
    handleSearch,
    searchTemplate
  } = usePaginationState(50, `customer?status=${inputs.status}`, cols, `customer?status=${inputs.status}&returnItems=1`);



  const [exporting, setExporting] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const fetchData = async (page = pagination.current_page, customLimit = pagination.per_page) => {
    try {
      setLoading(true); // Start loader
      const customerResponse = await Http.get(
        `/customer?status=${inputs.status}&page=${page}&limit=${customLimit}&returnItems=1`
        // `/customer-list?status=${inputs.status}`
      );
      setReceiveData(customerResponse.data.data);
      const { data, current_page, per_page, total } = customerResponse.data;
      setPagination({ current_page, per_page, total });

      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const roleResponse = await Http.get("/staff-type-check");
      setRole(roleResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Format dates as 'YYYY-MM-DD' (required for `<input type="date">`)
  const formatDate = (date) => date.toISOString().split('T')[0];

  useEffect(() => {
    DatatableFunc();
    fetchData(pagination.current_page, pagination.per_page);
    setInputs({
      status: 'active',
      start_date: formatDate(thirtyDaysAgo),
      end_date: formatDate(today),
    });
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

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "work_place_zone_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + value
      ).then((res) => {
        setRegion(res.data);
      });
    }
    if (name === "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => {
        setArea(res.data);
      });
    }
    if (name === "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
      ).then((res) => {
        setBase(res.data);
      });
    }
    if (name === "work_place_base_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRoute/id,name/work_place_base_id:" + value
      ).then((res) => {
        setRoute(res.data);
      });
    }
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

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
  const statusChange = (id, url, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are goin to change Status of Customer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change Status!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.get("/" + url + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire(
            "Status Chnage!",
            "Customer Status has been Changed.",
            "success"
          );
        });
      }
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  console.log(inputs, 'inputs')
  const formSubmit = () => {
    Http.get("/customer?status=" + inputs.status).then((res) => {
      setReceiveData(res.data);
      DatatableFunc(); // Initialize a new instance
    });
  };

  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   Http.post(`/customer/search`, {
  //     search: value,
  //   }).then((res) => {
  //     console.log('value', value)
  //     setReceiveData(res.data)
  //   });
  // }

  const resetFilters = () => {
    setInputs({
      status: "active",
      start_date: formatDate(thirtyDaysAgo),
      end_date: formatDate(today)
    });
    setZone([]);
    setRegion([]);
    setArea([]);
    setBase([]);
    setInputs((prev) => ({
      ...prev,
      work_place_zone_id: null,
      work_place_region_id: null,
      work_place_area_id: null,
      work_place_base_id: null,
      work_place_route_id: null,
    }));


    fetchData(); // Fetch data for the first page
  };

  const FilterFormSubmit = async (page = pagination.current_page, customLimit = pagination.per_page) => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    setIsFilterApplied(true); // Set filter applied state

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
      page: 1, // Always start from page 1 when filters are applied
      limit: customLimit, // Set limit for pagination
    });

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
    if (Number.isInteger(submissionInputs.work_place_route_id)) {
      queryParams.append("route", submissionInputs.work_place_route_id);
    }

    try {
      const response = await Http.get(
        `/customer?status=${inputs.status}&${queryParams.toString()}&returnItems=1`
      );
      setReceiveData(response.data.data); // Update with paginated data
      const { data, current_page, per_page, total } = response.data;
      setPagination({ current_page, per_page, total });
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  }

  const handleSearchChange = async (e) => {
    setLoading(true);
    const value = e.target.value;
    if (value.trim() === "") {
      // If search is empty, fetch original data
      fetchData();
      return;
    }

    try {
      const searchResults = await handleSearch(value);
      console.log(searchResults, 'searchResults')
      setReceiveData(searchResults);
      setLoading(false);
    } catch (error) {
      console.error("Search failed:", error);
    }

  }
  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Shops</h5>
            {/*<Link to="/create-shop" className="btn btn-primary">
                        <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>*/}
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />

          </div>
          <div className="am-pagebody" id="AllDistributorStockReportForStaff">
            <Alert alert={alert} />
            <div className="card SearchHide">
              <div className="card pd-sm-40">
                <div className="row">
                  <div className="col-lg">
                    <label htmlFor="">Select Zone</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={
                        zone.find((z) => z.value === inputs.work_place_zone_id) ||
                        null
                      }
                      name="work_place_zone_id"
                      options={zone}
                      onChange={selectHandleChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Select Region</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={
                        region.find(
                          (r) => r.value === inputs.work_place_region_id
                        ) || null
                      }
                      name="work_place_region_id"
                      options={region}
                      onChange={selectHandleChange}
                      styles={{
                        select__menu: (provided) => ({
                          ...provided,
                          zIndex: 9999999999999,
                        }),
                      }}
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Select Area</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={
                        area.find((a) => a.value === inputs.work_place_area_id) ||
                        null
                      }
                      name="work_place_area_id"
                      options={area}
                      onChange={selectHandleChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Select Base</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={
                        base.find((b) => b.value === inputs.work_place_base_id) ||
                        null
                      }
                      name="work_place_base_id"
                      options={base}
                      onChange={selectHandleChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Select Route</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={
                        route.find((b) => b.value === inputs.work_place_route_id) ||
                        null
                      }
                      name="work_place_route_id"
                      options={route}
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
                  <div className="col-lg" >
                    <label htmlFor="">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={inputs.status}
                      onChange={handleChange}
                    >
                      <option selected disabled>Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>
                  <div className="col-lg mt-4 d-flex gap-1">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={FilterFormSubmit}
                    >
                      <i className="fa fa-send mg-r-10"></i> Search
                    </button>
                    <button
                      className="btn btn-secondary btn-block py-1"
                      onClick={resetFilters}
                    >
                      <span> Reset Filters </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
              </div>
              {searchTemplate(handleSearchChange)} {/* 👈 Show search + CSV button */}
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                exportCsvOrPdf={false}
                // imageBodyTemplate={imageBodyTemplate}
                actionTemplate={actionTemplate}
                totalNumber={pagination.total}
                deleteData={deleteData}
                statusChange={statusChange}
                isLoading={loading}
                role={role}
              />
            </div>
            <AdvancePagination
              onPageChange={(page) => fetchData(page, pagination.per_page)}
              onLimitChange={(newLimit) => fetchData(1, newLimit)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData, statusChange, role) => {
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{ pathname: "/shop-details/" + rowData.id }}
        className="btn btn-info btn-sm mr-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>

      {rowData.orders.length == 0 ? (
        <button
          className="btn btn-danger btn-sm ms-1"
          onClick={() => deleteData(rowData.id, "customer", "shop")}
          title="Detele"
        >
          <i className="fa fa-trash"></i>
        </button>
      ) : (
        ""
      )}

      {role != "moo" ? (
        <button
          className="btn btn-primary btn-sm ms-1"
          onClick={() => statusChange(rowData.id, "shop-status", "shop")}
          title="Active Inactive"
        >
          <i className="fa fa-link"></i>
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default List;
