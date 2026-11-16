import React, { useEffect, useState } from "react";
import Http from "../../../Common/Http";
import ReactDataTable from "../../../Common/ReactDataTable";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";
import { usePaginationState } from "../../../Common/Pagination/AdvancedPaginationPerPage";
const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);

  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);

  // Get the first and last dates of the current month
  const { firstDay, lastDay } = getCurrentMonthDateRange();
  const cols = [
    { field: "zone", header: "Channel Name" },
    { field: "region", header: "Region Name" },
    { field: "area", header: "Area Name" },
    { field: "base", header: "Base" },
    { field: "name", header: "Staff Name" },
    { field: "designation.name", header: "Designation" },
    { field: "card_no", header: "Staff Id" },
    { field: "check_in", header: "Check In" },
    { field: "check_out", header: "Check Out" },
    {
      field: "check_in_check_out",
      header: "Actual Total Check In & Check Out",
    },
    { field: "late_check_in", header: "Late Check In" },
    { field: "total_ow_order_amount", header: "Total OW Order Amount" },
    { field: "total_ow_ims_amount", header: "Total OW Ims Amount" },
    { field: "total_ow_order_qty", header: "Total OW Order Memo Qty" },
    { field: "total_ow_ims_qty", header: "Total OW Delivery Memo Qty" },
    { field: "total_tow_order_amount", header: "Total TOW Order Amount" },
    { field: "total_tow_ims_amount", header: "Total TOW Ims Amount" },
    { field: "total_tow_order_qty", header: "Total TOW Order Memo Qty" },
    { field: "total_tow_ims_qty", header: "Total TOW Delivery Memo Qty" },
    { field: "total_assigned_ow", header: "Total Assigned OW" },
    { field: "total_assigned_tow", header: "Total Assigned TOW" },
    { field: "total_ow_visited", header: "Total OW Visited Retailes" },
    { field: "total_tow_visited", header: "Total TOW Visited Retails" },
  ];

  const [url, setUrl] = useState('');

  const [inputs, setInputs] = useState({
    start_date: firstDay,
    end_date: lastDay,
  });

  const {
    pagination,
    setPagination,
    AdvancePagination,
    handleExportCSV,
    handleSearch,
    searchTemplate,
  } = usePaginationState(
    50,
    url,
    cols,
    `moo/hr-incentive-report?returnItems=1`
  );

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

  const fetchData = async (
    page = pagination.current_page,
    customLimit = pagination.per_page
  ) => {
    setPagination(prev => ({ ...prev, current_page: page, per_page: customLimit }));
    
    setLoading(true);
    try {
      const staffInfo = await Http.get(
        // "/select2/Hr.HrStaffBasicInfo/id,name/status:active"
        "/staff-with-types"
      );
      setStaff(staffInfo.data);

      const ordersResponse = await Http.get(
        `/moo/hr-incentive-report?start_date=${inputs.start_date}&end_date=${inputs.end_date}&page=${page}&limit=${customLimit}`
      );
      setUrl(`moo/hr-incentive-report?start_date=${inputs.start_date}&end_date=${inputs.end_date}`)
      setReceiveData(ordersResponse.data.data);
      const { current_page, per_page, total } = ordersResponse.data;
      setPagination({ current_page, per_page, total });
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

  const formSubmit = async (
    page = pagination.current_page,
    customLimit = pagination.per_page
  ) => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
      staff_id: inputs.staff_id,
    });

    try {
      const response = await Http.get(
        `/moo/hr-incentive-report?${queryParams.toString()}`
      );
      setReceiveData(response.data.data); // Update with paginated data
      const { data, current_page, per_page, total } = response.data;
      setPagination({ current_page, per_page, total });
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

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
      console.log(searchResults, "searchResults");
      setReceiveData(searchResults);
      setLoading(false);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Hr Report</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Staff</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="staff_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div>

                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    // min={firstDay}
                    // max={lastDay}
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
                    // min={firstDay}
                    // max={lastDay}
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
          <div className="am-pagebody" id="RouteWiseCustomer">
            <div className="card pd-20 pd-sm-40 SearchHide">
              {searchTemplate(handleSearchChange)}
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
                exportCsvOrPdf={false}
                totalNumber={pagination.total}
              />
            </div>
            <AdvancePagination
              onPageChange={(page) => {
                // Update pagination state immediately
                setPagination(prev => ({ ...prev, current_page: page }));
                fetchData(page, pagination.per_page);
              }}
              onLimitChange={(newLimit) => {
                // Update pagination state immediately
                setPagination(prev => ({ ...prev, per_page: newLimit, current_page: 1 }));
                fetchData(1, newLimit);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
