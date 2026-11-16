import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../../../Common/Alert";
import HttpHR from "../../../Common/HttpHR";
import IsLogin from "../../../Common/IsLogin";
import useAlertFromLocation from "../../../../hooks/useAlertFromLocation";
import useDeleteData from "../../../../hooks/useDeleteData";
import ReactDataTable from "../../../Common/ReactPaginateDataTable";
import useDebounce from "../../../../Utils/useDebounce";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");

  // columns for the datatable
  const cols = [
    { field: "name", header: "Name" },
    { field: "basicSalary", header: "Basic" },
    { field: "houseRent", header: "House Rent" },
    { field: "medicalAllowance", header: "Medical All." },
    { field: "entertainmentAllowance", header: "Ent" },
    { field: "tadaAllowance", header: "Ta/Da" },
    { field: "incomeTax", header: "Tax" },
    { field: "incrementRate", header: "Incr." },
    { field: "holidayRate", header: "Holiday R." },
    { field: "phoneBillLimit", header: "Phn Lmt." },
    { field: "canteenBill", header: "Canteen" },
    { field: "otherAllowance", header: "Others" },
    { field: "grossSalary", header: "Gross Salary" }
  ];

  const fetchData = async (page = 1, size = 10, filter = "", showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      const url = filter
        ? `/Grades/paginated?Filter=${encodeURIComponent(filter)}&Page=${page}&PageSize=${size}`
        : `/Grades/paginated?Page=${page}&PageSize=${size}`;
      const res = await HttpHR.get(url);
      const responseData = res?.data;
      setReceiveData(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setCurrentPage(responseData?.currentPage || page);
      setPageSize(responseData?.pageSize || size);
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
    fetchData(currentPage, pageSize, searchFilter, !isSearchChange);
  }, [currentPage, pageSize, searchFilter]);

  const deleteData = useDeleteData(() => fetchData(currentPage, pageSize, searchFilter));
  const alert = useAlertFromLocation();

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1);
    setPageSize(event.rows);
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Grades</h5>
            <Link to="/creategrade" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> Grade
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-20 pd-sm-40">
              <div className="row">
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
                  onSearch={handleDebouncedSearch}
                  lazy={true}
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
          pathname: "/editgrade/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <button className="btn btn-danger btn-sm ms-1" onClick={() => deleteData(rowData.id, "Grades/Delete", "Grade")} title="Delete">
        <i className="fa fa-trash"></i>
      </button>
    </div>
  );
};

export default List;