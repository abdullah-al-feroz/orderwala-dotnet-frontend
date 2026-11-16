import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import IsLogin from "../../../../Common/IsLogin";
import ReactDataTable from "../../../../Common/ReactPaginateDataTable";
import useAlertFromLocation from "../../../../../hooks/useAlertFromLocation";
import useDeleteData from "../../../../../hooks/useDeleteData";
import useDebounce from "../../../../../Utils/useDebounce";

const cols = [
  { field: "code", header: "Code" },
  { field: "name", header: "Name" },
  { field: "thanaName", header: "Thana" },
  { field: "districtName", header: "District" },
  { field: "divisionName", header: "Division" },
  { field: "postalCode", header: "Postal Code" },
  { field: "status", header: "Status" },
];

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");

  const fetchData = async (page = 1, size = 10, status = null, filter = "", showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      let url = `/Place/paginated?Page=${page}&PageSize=${size}`;

      if (status !== null && status !== undefined) {
        url += `&Status=${status}`;
      }

      if (filter) {
        url += `&Filter=${encodeURIComponent(filter)}`;
      }

      const res = await HttpSupplyChain.get(url);
      const responseData = res?.data?.data?.map(item => ({
        id: item?.id,
        name: item?.name,
        code: item?.code,
        districtName: item?.district?.name,
        divisionName: item?.division?.name,
        thanaName: item?.thana?.name,
        postalCode: item?.postalCode,
        status: item?.status === 1 ? "Active" : "Inactive"
      }));
      setReceiveData(responseData || []);
      setTotalRecords(res?.data?.totalRecords || 0);
      setCurrentPage(res?.data?.currentPage || page);
      setPageSize(res?.data?.pageSize || size);
    } catch (error) {
      console.error("Fetch error:", error);
      setReceiveData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDebouncedSearch = useDebounce((value) => {
    setSearchFilter(value);
    setCurrentPage(1);
  }, 500);

  useEffect(() => {
    const isSearchChange = searchFilter !== "";
    DatatableFunc();
    fetchData(currentPage, pageSize, statusFilter, searchFilter, !isSearchChange);
  }, [currentPage, pageSize, statusFilter, searchFilter]);

  const deleteData = useDeleteData(() => fetchData(currentPage, pageSize, statusFilter, searchFilter));
  const alert = useAlertFromLocation();

  // Pagination change handler
  const onPageChange = (event) => {
    setCurrentPage(event.page + 1);
    setPageSize(event.rows);
  };

  const handleStatusChange = (value) => {
    setCurrentPage(1);
    if (value === "active") {
      setStatusFilter(1);
    } else if (value === "inactive") {
      setStatusFilter(0);
    } else {
      setStatusFilter(null);
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All places</h5>
            <Link to="/create-place" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card">
              <ReactDataTable
                cols={cols}
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
  );
};

const actionTemplate = (rowData, deleteData) => {
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{
          pathname: "/edit-place/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "place", "place")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button> */}
    </div>
  );
};
export default List;