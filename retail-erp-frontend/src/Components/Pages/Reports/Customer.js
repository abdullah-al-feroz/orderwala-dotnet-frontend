import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../Common/Alert";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";
import ReactDataTable from "../../Common/ReactDataTable";
import { usePaginationState } from "../../Common/Pagination/AdvancedPagination";
const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({ status: "active" });
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(null);
  const [pageSize, setPageSize] = useState(3);

  const cols = [
    { field: "code", header: "Code" },
    {
      header: "Last Activity",
      field: (rowData) => (
        <span
          className={`badge badge-sm ${rowData.is_today_active ? "badge-success" : "badge-warning"
            }`}
        >
          {rowData.last_activity}
        </span>
      ),
    },
    {
      field: (rowData) => (
        <Link
          //   to={{ pathname: "/shop-details/" + item.id }}
          to={{
            pathname: "/shop-details/" + rowData.id,
          }}
          title="Customer Details"
        >
          <i className="fa fa-id-card" aria-hidden="true"></i>
        </Link>
      ),
      header: "",
    },
    { field: "shop_name", header: "Total Order" },
    { field: "total_order_amount", header: "Total Order" },
    { field: "total_return_amount", header: "Total Return Order" },
    { field: "total_paid_amount", header: "Total payment" },
    { field: "total_due_amount", header: "Total balance" },
    { field: "route.region.name", header: "Region" },
    { field: "route.area.name", header: "Area" },
    { field: "route.base.name", header: "Base" },
    { field: "route.name", header: "Route" },
    { field: "place.name", header: "Place" },
    { field: "thana.name", header: "Thana" },
    { field: "district.name", header: "District" },
    { field: "division.name", header: "Division" },
    { field: "distributor.name", header: "Distributor" },
    { field: "route.base.so.name", header: "SO" },
    { field: "route.base.dsr.name", header: "Dsr" },
    { field: "phone", header: "Phone" },
    { field: "address", header: "Address" },
    { field: "status", header: "Status" },
    { field: "verified_by.name", header: "Verified By" },
    { field: "verified_date", header: "Date of Verification" },
  ];

  const CUSTOMER_SEARCH_CONFIG = {
    page: 'report',
    model: 'App\\Models\\Secondary\\Customer',
    searchColumns: ['code', 'shop_name', 'phone', 'address', 'status'],
  };
  const {
    pagination,
    setPagination,
    AdvancePagination,
    handleExportCSV,
    handleSearch,
  } = usePaginationState(50, `customer-ledger`, cols, `/customer/search`, CUSTOMER_SEARCH_CONFIG);



  //Pagination End

  // const fetchData = (page = 1, limit = 50) => {
  //   // const offset = (currentPage - 1) * pageSize;
  //   Http.get(`/customer-ledger`).then((res) => {
  //     setReceiveData(res.data.list);
  //     // const { data, current_page, per_page, total } = res.data.list;
  //     // setPagination({ current_page, per_page, total });
  //   });
  // };

  //Pagination Start
  const fetchData = async (page = pagination.current_page, customLimit = pagination.per_page) => {
    // const offset = (currentPage - 1) * pageSize;
    Http.get(`/customer-ledger?page=${page}&limit=${customLimit}&returnItems=1`).then((res) => {
      setReceiveData(res.data.list.data);
      const { data, current_page, per_page, total } = res.data.list
      setPagination({ current_page, per_page, total });
    });
  };
  //Pagination End

  useEffect(() => {
    DatatableFunc();
    fetchData(pagination.current_page, pagination.per_page);
  }, [inputs.status]);

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
  const formSubmit = () => {
    Http.get("/customer?status=" + inputs.status).then((res) => {
      setReceiveData(res.data.list);
      DatatableFunc(); // Initialize a new instance
    });
  };



  const handleSearchChange = async (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      // If search is empty, fetch original data
      fetchData();
      return;
    }

    try {
      const searchResults = await handleSearch(value);
      setReceiveData(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
    }

  }

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Customer Ledger</h5>
            {/*<Link to="/create-shop" className="btn btn-primary">
                        <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>*/}
          </div>
          {/* <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="row">
                    <div className="col-lg">
                      <select
                        className="form-control"
                        name="status"
                        value={inputs.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">InActive</option>
                        <option value="unverified">Unverified</option>
                      </select>
                    </div>
                    <div className="col-lg">
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
            </div>
          </div> */}
          <div className="am-pagebody" id="AllDistributorStockReportForStaff">

            <Alert alert={alert} />

            <div className="card SearchHide">
              <div className="row justify-content-between align-items-center">
                <div className="col-lg-6 px-0 mb-3 ">
                  <div className="col-lg-auto">
                    <button
                      className="btn btn-success"
                      onClick={handleExportCSV}
                      disabled={exporting}
                    >
                      {exporting ? (
                        <i className="fa fa-spinner fa-spin mg-r-6"></i>
                      ) : (
                        <i className="fa fa-file-excel-o mg-r-6"></i>
                      )}
                      CSV
                    </button>
                  </div>
                </div>
                <div className="col-lg-4  mb-3 text-align-right" style={{ textAlign: "end" }}>
                  <label>Search</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ zIndex: 99999 }}
                    name="search"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                exportCsvOrPdf={false}
                totalNumber={pagination.total}
                // actionTemplate={actionTemplate}
                isLoading={loading}
                deleteData={deleteData}
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

export default List;
