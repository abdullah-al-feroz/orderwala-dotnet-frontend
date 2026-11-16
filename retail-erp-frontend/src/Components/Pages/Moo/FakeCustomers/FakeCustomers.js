import React, { useEffect, useState } from "react";
import Http from "../../../Common/Http";
import ReactDataTable from "../../../Common/ReactDataTable";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Get today's date for initial load
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  // Define firstDay and lastDay for the current month
  const { firstDay, lastDay } = getCurrentMonthDateRange();

  const [inputs, setInputs] = useState({
    start_date: formattedToday, // Set today's date as start date
    end_date: formattedToday, // Set today's date as end date
  });

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

  const fetchData = async (page = 1, filters = {}) => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const queryParams = new URLSearchParams({
        page: page,
        limit: 200,
        ...filters, // Include any additional filters
      });

      const response = await Http.get(
        `/report/fake-customers?${queryParams.toString()}`
      );
      setReceiveData(response.data.data); // Update with paginated data
      setTotalPages(response.data.last_page); // Update total pages
      setCurrentPage(page); // Update current page
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    const filters = {};
    if (inputs.work_place_zone_id) {
      filters.zone = inputs.work_place_zone_id;
    }
    if (inputs.work_place_region_id) {
      filters.region = inputs.work_place_region_id;
    }
    if (inputs.work_place_area_id) {
      filters.area = inputs.work_place_area_id;
    }
    if (inputs.work_place_base_id) {
      filters.base = inputs.work_place_base_id;
    }
    filters.start_date = inputs.start_date;
    filters.end_date = inputs.end_date;

    // Call fetchData on initial load and when currentPage or filters change
    fetchData(currentPage, filters);
  }, [currentPage]); // Depend on currentPage and inputs

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

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
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Ensure the selected date falls within the current month range
    if (
      new Date(value) >= new Date(firstDay) &&
      new Date(value) <= new Date(lastDay)
    ) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    } else {
      console.error("Selected date is out of range for the current month.");
    }
  };

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Reset current page to 1 when filters are applied
    setCurrentPage(1);
    setIsFilterApplied(true); // Set filter applied state

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
      type: submissionInputs.type,
      page: 1, // Always start from page 1 when filters are applied
      limit: 200, // Set limit for pagination
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

    try {
      const response = await Http.get(
        `/report/fake-customers?${queryParams.toString()}`
      );
      setReceiveData(response.data.data); // Update with paginated data
      setTotalPages(response.data.last_page); // Update total pages
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setInputs({
      start_date: firstDay,
      end_date: lastDay,
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
    }));

    setCurrentPage(1); // Reset to page 1 when filters are reset

    fetchData(); // Fetch data for the first page
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const filters = {};
      if (inputs.work_place_zone_id) {
        filters.zone = inputs.work_place_zone_id;
      }
      if (inputs.work_place_region_id) {
        filters.region = inputs.work_place_region_id;
      }
      if (inputs.work_place_area_id) {
        filters.area = inputs.work_place_area_id;
      }
      if (inputs.work_place_base_id) {
        filters.base = inputs.work_place_base_id;
      }
      filters.start_date = inputs.start_date;
      filters.end_date = inputs.end_date;

      fetchData(currentPage + 1, filters); // Fetch data for the next page with current filters
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const filters = {};
      if (inputs.work_place_zone_id) {
        filters.zone = inputs.work_place_zone_id;
      }
      if (inputs.work_place_region_id) {
        filters.region = inputs.work_place_region_id;
      }
      if (inputs.work_place_area_id) {
        filters.area = inputs.work_place_area_id;
      }
      if (inputs.work_place_base_id) {
        filters.base = inputs.work_place_base_id;
      }
      filters.start_date = inputs.start_date;
      filters.end_date = inputs.end_date;

      fetchData(currentPage - 1, filters); // Fetch data for the previous page with current filters
    }
  };

  const cols = [
    { field: "customer_name", header: "Customer Name" },
    { field: "bp_name", header: "BP Name" },
    { field: "date", header: "Date" },
    { field: "time", header: "Time" },
    { field: "zone_name", header: "Zone Name" },
    { field: "region_name", header: "Region Name" },
    { field: "area_name", header: "Area Name" },
    { field: "base_name", header: "Base Name" },
    { field: "route_name", header: "Route Name" },
  ];

  const actionTemplate = (rowData) => {
    const showSurveyDetail = async () => {
      try {
        const response = await Http.get(
          `/report/bp-surveys-web-detail/${rowData.id}`
        );
        const surveyDetail = response.data;

        // Prepare reasons and remarks table
        const reasonsAndRemarksHtml = surveyDetail.reasons_and_remarks
          .map((item) => {
            return `
            <tr class="text-left">
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.reason ?? "N/A"
              }</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                item.remarks
              }</td>
            </tr>
          `;
          })
          .join("");

        // Prepare the main details in a grid layout
        const detailsHtml = `
          <div style="display: flex; justify-content: space-between;">
            <div class="text-left">
              <div><strong>Customer:</strong> ${surveyDetail.customer_name}</div>
              <div><strong>BP:</strong> ${surveyDetail.bp_name}</div>
              <div><strong>Date:</strong> ${surveyDetail.date}</div>
              <div><strong>Time:</strong> ${surveyDetail.time}</div>
           </div>
          
           <div class="text-right">
              <div><strong>Zone:</strong> ${surveyDetail.zone_name}</div>
              <div><strong>Region:</strong> ${surveyDetail.region_name}</div>
              <div><strong>Area:</strong> ${surveyDetail.area_name}</div>
              <div><strong>Base:</strong> ${surveyDetail.base_name}</div>
              <div><strong>Route:</strong> ${surveyDetail.route_name}</div>
           </div>
          </div>
        `;

        Swal.fire({
          title: "Survey Detail",
          html: `
            ${detailsHtml}
            <hr />
            <h5>Reasons and Remarks:</h5>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;">Reason</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${reasonsAndRemarksHtml}
              </tbody>
            </table>
          `,
          showCloseButton: true,
          confirmButtonText: "Close",
          width: "80%",
          padding: "5px",
        });
      } catch (error) {
        console.error("Error fetching survey detail:", error);
        Swal.fire({
          title: "Error",
          text: "Could not fetch survey details. Please try again later.",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    };

    return (
      <div className="text-xs text-nowrap">
        <button
          className="btn btn-info btn-sm"
          onClick={showSurveyDetail}
          title="View Details"
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </button>
        {/* <button
          className="btn btn-danger btn-sm ms-1"
          onClick={() => deleteData(rowData.id, "deleteDepartment", "Department")}
          title="Delete"
        >
          <i className="fa fa-trash"></i>
        </button> */}
      </div>
    );
  };

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">BP Survey Report</h5>
          </div>
          <div className="am-pagebody">
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
              </div>
              <div className="row mt-4">
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    min={firstDay}
                    max={lastDay}
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
                    min={firstDay}
                    max={lastDay}
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
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={resetFilters}
                  >
                    Reset Filters
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
                actionTemplate={actionTemplate}
              />
            </div>
            <div className="d-flex justify-content-center">
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </button>
              <span> &nbsp; {currentPage} / {totalPages} &nbsp; </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
