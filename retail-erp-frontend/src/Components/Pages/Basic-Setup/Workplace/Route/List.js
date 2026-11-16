import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import useAlertFromLocation from "../../../../../hooks/useAlertFromLocation";
import useDeleteData from "../../../../../hooks/useDeleteData";
import ReactDataTable from "../../../../Common/ReactPaginateDataTable";
import useDebounce from "../../../../../Utils/useDebounce";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [inputs, setInputs] = useState({});
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState(1); // 1 = Active (initial load)

  // columns for the datatable
  const cols = [
    { field: "name", header: "Name" },
    { field: "placeNames", header: "Places" },
    { field: "base", header: "Base" },
    { field: "area", header: "Area" },
    { field: "region", header: "Region" },
    { field: "startedFrom", header: "Started From" },
    { field: "remarks", header: "Remarks" },
    { field: "status", header: "Status" },
  ];

  const fetchData = async (filter = "", page = 1, size = 10, status = null, overrides = {}, showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      const params = [];
      if (filter) params.push(`Filter=${encodeURIComponent(filter)}`);
      const regionId = overrides.regionId ?? inputs.work_place_region_id;
      const areaId = overrides.areaId ?? inputs.work_place_area_id;
      const baseId = overrides.baseId ?? inputs.work_place_base_id;
      if (regionId) params.push(`RegionId=${encodeURIComponent(regionId)}`);
      if (areaId) params.push(`AreaId=${encodeURIComponent(areaId)}`);
      if (baseId) params.push(`WorkplaceBaseId=${encodeURIComponent(baseId)}`);
      // Add status parameter if it's not null (null means show all)
      if (status !== null && status !== undefined) {
        params.push(`Status=${status}`);
      }

      params.push(`Page=${page}`, `PageSize=${size}`);
      const routeUrl = `/Route/paginated?${params.join("&")}`;

      const [routeRes, regionRes] = await Promise.all([
        HttpSupplyChain.get(routeUrl),
        HttpSupplyChain.get(`/Region/paginated?Page=1&PageSize=10`),
      ]);
      
      const responseData = routeRes?.data?.data?.map((item) => ({
        id: item?.id,
        name: item?.name,
        placeNames: item?.workplaceRoutesPlaces
          ?.map((rp) => rp?.place?.name)
          ?.join(" || ") ?? "",
        regionId: item?.regionId ?? item?.region?.id,
        areaId: item?.areaId ?? item?.area?.id,
        baseId: item?.workplaceBaseId ?? item?.workPlaceBaseId ?? item?.workPlaceBase?.id ?? item?.workplaceBase?.id,
        region: item?.region?.name ?? "",
        area: item?.area?.name ?? "",
        base: item?.workplaceBase?.name ?? item?.workPlaceBase?.name ?? "",
        startedFrom: item?.startedFrom ? item.startedFrom.split("T")[0] : "",
        remarks: item?.remarks ?? "",
        status: item?.status === 1 ? "Active" : "Inactive",
        
      }));

      setReceiveData(responseData || []);
      setTotalRecords(routeRes?.data?.totalRecords || 0);
      setCurrentPage(routeRes?.data?.currentPage || page);
      setPageSize(routeRes?.data?.pageSize || size);
      setRegion(regionRes.data.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDebouncedSearch = useDebounce((value) => {
    setSearchFilter(value);
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    handleDebouncedSearch(value);
  };

  useEffect(() => {
    const isSearchChange = searchFilter !== "";
    fetchData(searchFilter, currentPage, pageSize, statusFilter, {}, !isSearchChange);
  }, [currentPage, pageSize, statusFilter, searchFilter]);

  // Sync searchInput when searchFilter changes externally (e.g. from ReactDataTable search)
  useEffect(() => {
    setSearchInput(searchFilter);
  }, [searchFilter]);

  // Area Load Region Change Wise
  const areaRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value, work_place_area_id: "", work_place_base_id: "" }));
    setArea([]);
    setBase([]);

    if (value) {
      HttpSupplyChain.get(`/Area/paginated?Page=1&PageSize=10&RegionId=${value}`).then((res) => {
        setArea(res.data.data || []);
        fetchData(searchFilter, 1, pageSize, statusFilter, { regionId: value });
      });
    } else {
      fetchData(searchFilter, 1, pageSize, statusFilter, { regionId: null });
    }
  };

  // Base Load Area Change Wise
  const baseAreaWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value, work_place_base_id: "" }));
    setBase([]);

    if (value) {
      HttpSupplyChain.get(`/WorkplaceBase/paginated?Page=1&PageSize=10&AreaId=${value}`).then((res) => {
        setBase(res.data.data || []);
        fetchData(searchFilter, 1, pageSize, statusFilter, { areaId: value });
      });
    } else {
      fetchData(searchFilter, 1, pageSize, statusFilter, { areaId: null });
    }
  };

  //  Set Input Value with state
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name === "work_place_base_id") {
      fetchData(searchFilter, 1, pageSize, statusFilter, { baseId: value });
    }
  };

  const deleteData = useDeleteData(() => fetchData(searchFilter, currentPage, pageSize, statusFilter));
  const alert = useAlertFromLocation();

  const onPageChange = (event) => {
    const newPage = event.page + 1;
    const newSize = event.rows;
    setCurrentPage(newPage);
    setPageSize(newSize);
  };

  const handleStatusChange = (value) => {
    setCurrentPage(1);
    if (value === "active") {
      setStatusFilter(1); // 1 = Active
    } else if (value === "inactive") {
      setStatusFilter(0); // 0 = Inactive
    } else {
      setStatusFilter(null); // null = All data (when cross is clicked)
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Route</h5>
            <Link to="/createroute" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Route
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label className="font-weight-bold">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search routes..."
                    value={searchInput}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="col-lg">
                  <label className="font-weight-bold">Region</label>
                  <select className="form-control" name="work_place_region_id" onChange={areaRegionWise}>
                    <option value="">Select Region</option>
                    {Array.isArray(region) && region.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg">
                  <label className="font-weight-bold">Area</label>
                  <select className="form-control" name="work_place_area_id" onChange={baseAreaWise}>
                    <option value="">Select Area</option>
                    {Array.isArray(area) && area.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg">
                  <label className="font-weight-bold">Base</label>
                  <select className="form-control" name="work_place_base_id" onChange={handleChange}>
                    <option value="">Select Base</option>
                    {Array.isArray(base) && base.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <ReactDataTable cols={cols}
                  receiveData={receiveData}
                  isLoading={loading}
                  actionTemplate={actionTemplate}
                  deleteData={deleteData}
                  totalRecords={totalRecords}
                  currentPage={currentPage - 1}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                  lazy={true}
                  statusFilter={statusFilter}
                  onSearch={handleDebouncedSearch}
                  statusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData) => {
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{
          pathname: "/editroute/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button className="btn btn-danger btn-sm ms-1" onClick={() => deleteData(rowData.id, "Region/Delete", "Route")} title="Delete">
        <i className="fa fa-trash"></i>
      </button> */}
      <Link
        to={{
          pathname: "/shop-list-based-on-route-id/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-info btn-sm ms-1"
        title="Edit"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
    </div>
  );
};

export default List;