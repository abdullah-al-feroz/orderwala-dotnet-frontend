import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import IsLogin from "../../../../Common/IsLogin";
import ReactDataTable from "../../../../Common/ReactPaginateDataTable";
import useDeleteData from "../../../../../hooks/useDeleteSupplyChainData";
import useDebounce from "../../../../../Utils/useDebounce";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");

  const cols = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "divisionname", header: "Division" },
    { field: "status", header: "Status" },
  ];

  const fetchData = async (page = 1, size = 10, status = null, filter = "", showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      let url = `/District/paginated?Page=${page}&PageSize=${size}`;

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
        status: item?.status === 1 ? "Active" : "Inactive",
        divisionname: item?.division?.name,
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

  const deleteData = useDeleteData(() => fetchData(currentPage, pageSize, statusFilter, searchFilter));

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
            <h5 className="am-title">All Districts</h5>
            <Link to="/create-district" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                actionTemplate={actionTemplate}
                isLoading={loading}
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
          pathname: "/edit-district/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "District/Delete", "district")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button>
    </div>
  );
};

export default List;