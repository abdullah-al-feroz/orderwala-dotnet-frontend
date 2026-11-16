import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import ReactDataTable from "../../../../Common/ReactPaginateDataTable";
import useDebounce from "../../../../../Utils/useDebounce";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState(1); // 1 = Active (initial load)
  const [searchFilter, setSearchFilter] = useState("");

  const cols = [
    { field: "channelName", header: "Channel" },
    { field: "name", header: "Name" },
    { field: "remarks", header: "Remarks" },
    { field: "status", header: "Status" },
  ];

  const fetchData = async (page = 1, size = 10, status = null, filter = "", showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      let url = `/Zone/paginated?Page=${page}&PageSize=${size}`;
      // Add status parameter if it's not null (null means show all)
      if (status !== null && status !== undefined) {
        url += `&Status=${status}`;
      }
      // Add filter parameter if search filter is provided
      if (filter) {
        url += `&Filter=${encodeURIComponent(filter)}`;
      }
      const res = await HttpSupplyChain.get(url);
      const responseData = res?.data?.data?.map(item => ({
        id: item?.id,
        channelName: item?.channel?.name,
        name: item?.name,
        remarks: item?.remarks,
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
    DatatableFunc();
  }, []);

  useEffect(() => {
    const isSearchChange = searchFilter !== "";
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
        HttpSupplyChain.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1);
    setPageSize(event.rows);
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
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All zones</h5>
            <Link to="/createzone" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>zone
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
          pathname: "/editzone/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "zone", "zone")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button>*/}
    </div>
  );
};

export default List;