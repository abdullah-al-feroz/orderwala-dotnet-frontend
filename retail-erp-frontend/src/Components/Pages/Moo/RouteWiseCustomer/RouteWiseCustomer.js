import React, { useEffect, useRef, useState } from "react";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";
import { Oval } from "react-loader-spinner";
import { DataTable } from "primereact/datatable";
import { Column } from "jspdf-autotable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";// Replace with your actual HTTP client
import { usePaginationState } from "../../../Common/Pagination/AdvancedPaginationPerPage";

const RouteWiseCustomer = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [owCustomer, setOwCustomer] = useState();
  const [towCustomer, setTowCustomer] = useState();
  const [totalCustomer, setTotalCustomer] = useState();
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [random, setRandom] = useState(1);
  const [form, setFrom] = useState();
  const [to, setTo] = useState();
  // Get the first and last dates of the current month
  const { firstDay, lastDay } = getCurrentMonthDateRange();

  const [inputs, setInputs] = useState({
    start_date: firstDay,
    end_date: lastDay,
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


  const cols = [
    { field: "zone.name", header: "Zone" },
    { field: "region.name", header: "Region" },
    { field: "area.name", header: "Area" },
    { field: "base.name", header: "Base" },
    { field: "name", header: "Route" },
    {
      header: "Days",
      accessor: (rowData) => {
        const sequenceNumber = rowData.route_has_plan ? rowData.route_has_plan.sequence_number : null;
        return sequenceNumber && daysOfWeek[sequenceNumber] ? daysOfWeek[sequenceNumber] : 'N/A';
      }
    },
    {
      header: "Ow Acquisition",
      accessor: (rowData) => {
        return Array.isArray(rowData.ow_total_store) ? rowData.ow_total_store.length : 0;
      }
    },
    {
      header: "TOW Acquisition",
      accessor: (rowData) => {
        return Array.isArray(rowData.tom_total_store) ? rowData.tom_total_store.length : 0;
      }
    },
    {
      header: "Total Customer",
      accessor: (rowData) => {
        return Array.isArray(rowData.total_store) ? rowData.total_store.length : 0;
      }
    }
  ];
  const [url, setUrl] = useState('');
  const [footer, setFooter] = useState('');

  const {
    pagination,
    setPagination,
    AdvancePagination,
    handleExportCSV,
    handleSearch,
    searchTemplate
  } = usePaginationState(50, url, cols, `moo/route-wise-acquisition-summary`);

  const fetchData = async (page = pagination.current_page, customLimit = pagination.per_page) => {
    if (page == 1) setIsLoading(true) // Start loading state
    setLoading(true);
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      // const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      // setRegion(region.data);

      const ordersResponse = await Http.get(`/moo/route-wise-acquisition-summary?page=${page}&limit=${customLimit}`);
      setUrl(`moo/route-wise-acquisition-summary?page=${page}&limit=${customLimit}`)
      // console.log(ordersResponse.data.workPlaceRoute)
      const { data, current_page, per_page, total } = ordersResponse.data.workPlaceRoute;
      setPagination({ current_page, per_page, total });
      setReceiveData(ordersResponse.data.workPlaceRoute.data);
      let footer = `Displaying ${ordersResponse.data.workPlaceRoute.data?.length} ${total > 0 ? `of ${total} total entries` : "entries"
        }`;
      setFooter(footer);
      setRows(ordersResponse.data.workPlaceRoute.per_page);
      setFrom(ordersResponse.data.workPlaceRoute.from)
      setTo(ordersResponse.data.workPlaceRoute.to)
      setTotalRecords(ordersResponse.data.workPlaceRoute.total);
      setOwCustomer(ordersResponse.data.countOwCustomer);
      setTowCustomer(ordersResponse.data.countTowCustomer);
      setTotalCustomer(ordersResponse.data.countTotalCustomer);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      if (page == 1) setIsLoading(false) // Stop loading state
    }
  };



  useEffect(() => {
    fetchData();
  }, [page]);

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

  const formSubmit = async (page = pagination.current_page, customLimit = pagination.per_page) => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
      type: submissionInputs.type,
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
      const ordersResponse = await Http.get(
        `/moo/route-wise-acquisition-summary?${queryParams.toString()}&page=${page}&limit=${customLimit}`
      );
      const { data, current_page, per_page, total } = ordersResponse.data.workPlaceRoute;
      setPagination({ current_page, per_page, total });
      let footer = `Displaying ${ordersResponse.data.workPlaceRoute.data?.length} ${total > 0 ? `of ${total} total entries` : "entries"}`;
      setFooter(footer);
      setReceiveData(ordersResponse.data.workPlaceRoute.data);
      setRows(ordersResponse.data.workPlaceRoute.per_page);
      setFrom(ordersResponse.data.workPlaceRoute.from)
      setTo(ordersResponse.data.workPlaceRoute.to)
      setTotalRecords(ordersResponse.data.workPlaceRoute.total);
      setOwCustomer(ordersResponse.data.countOwCustomer);
      setTowCustomer(ordersResponse.data.countTowCustomer);
      setTotalCustomer(ordersResponse.data.countTotalCustomer);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };




  const daysOfWeek = {
    1: 'Saturday',
    2: 'Sunday',
    3: 'Monday',
    4: 'Tuesday',
    5: 'Wednesday',
    6: 'Thursday',
    7: 'Friday'
  };


  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [statusFilter2, setStatusFilter2] = useState(null);

  // Dropdown options
  const [statuses] = useState(["active", "inactive"]);
  const statuses2 = ["active", "approved", "recommended", "pending", "submitted", "damage"];
  const dt = useRef(null);

  // const filters = {
  //   global: { value: null, matchMode: "contains" },
  //   status: { value: null, matchMode: "equals" },
  // };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: "contains" },
  });

  // const onGlobalFilterChange = (e) => {
  //   const value = e.target.value;
  //   filters.global.value = value;
  //   setGlobalFilterValue(value);
  // };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));


  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        doc.setFontSize(10);

        // Prepare data for PDF
        const exportData = receiveData.map((rowData) => ({
          Zone: rowData.zone?.name || "N/A",
          Region: rowData.region?.name || "N/A",
          Area: rowData.area?.name || "N/A",
          Base: rowData.base?.name || "N/A",
          Name: rowData.name || "N/A",
          Days:
            rowData.route_has_plan && rowData.route_has_plan.sequence_number
              ? daysOfWeek[rowData.route_has_plan.sequence_number] || "N/A"
              : "N/A",
          "Ow Acquisition": Array.isArray(rowData.ow_total_store)
            ? rowData.ow_total_store.length
            : 0,
          "Tow Acquisition": Array.isArray(rowData.tom_total_store)
            ? rowData.tom_total_store.length
            : 0,
          "Total Customer": Array.isArray(rowData.total_store)
            ? rowData.total_store.length
            : 0,
        }));

        // Define table columns
        const exportColumns = Object.keys(exportData[0] || {}).map((key) => ({
          title: key,
          dataKey: key,
        }));

        // Generate PDF table
        doc.autoTable({
          head: [exportColumns.map((col) => col.title)],
          body: exportData.map((data) => Object.values(data)),
          styles: { halign: "center", valign: "middle" },
        });

        doc.save("route-wise-summary.pdf");
      });
    });
  };
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const getSeverityAndIcon = (status) => {
    switch (status) {
      case "inactive":
        return { severity: "danger", icon: "pi pi-times" };
      case "active":
        return { severity: "success", icon: "pi pi-check" };
      default:
        return { severity: null, icon: null };
    }
  };

  const getSeverityAndIcon2 = (status2) => {
    switch (status2) {
      case "active":
        return { severity: "secondary", icon: "pi pi-verified", style: { backgroundColor: "green" } };
      case "approved":
        return { severity: "success", icon: "pi pi-check-circle" };
      case "recommended":
        return { severity: "info", icon: "pi pi-check" };
      case "pending":
        return { severity: "warning", icon: "pi pi-clock" };
      case "submitted":
        return { severity: "warning", icon: "pi pi-circle", style: { backgroundColor: "blue" } };
      case "damage":
        return { severity: "warning", icon: "pi pi-info-circle", style: { backgroundColor: "#ff1919" } };
      default:
        return { severity: null, icon: null };
    }
  };

  const statusBodyTemplate = (rowData) => (
    <Tag {...getSeverityAndIcon(rowData.status)} value={rowData.status} />
  );

  const statusBodyTemplate2 = (rowData) => (
    <Tag {...getSeverityAndIcon2(rowData.status)} value={rowData.status} />
  );

  const statusItemTemplate = (option) => (
    <Tag {...getSeverityAndIcon(option)} value={option} />
  );

  const statusItemTemplate2 = (option) => (
    <Tag {...getSeverityAndIcon2(option)} value={option} />
  );

  const onPrevPage = () => {
    setPage(page - 1);
  }

  const onNextPage = () => {
    setPage(page + 1);
  }

  const header = (
    <div className="d-flex justify-content-between reactDataTable">
      <div className="headerIcons">
        <Button
          type="button"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        />
        <Button
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={exportPdf}
          data-pr-tooltip="PDF"
        />
      </div>
      <div>
        {cols.some((col) => col.header === "Status") && (
          <Dropdown
            value={statusFilter}
            options={statuses}
            onChange={(e) => {
              setStatusFilter(e.value);
              dt.current.filter(e.value, "status", "equals");
            }}
            itemTemplate={statusItemTemplate}
            placeholder="Select Status"
            className="p-column-filter"
            showClear
          />
        )}
        {cols.some((col) => col.header === "Status") && (
          <Dropdown
            value={statusFilter2}
            options={statuses2}
            onChange={(e) => {
              setStatusFilter2(e.value);
              dt.current.filter(e.value, "status", "equals");
            }}
            itemTemplate={statusItemTemplate2}
            placeholder="Select Status 2"
            className="p-column-filter"
            showClear
          />
        )}
      </div>
      <div className="searching">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search"
        />
      </div>
    </div>
  );

  const paginatorTemplate = {
    layout: 'PrevPageLink PageLinks NextPageLink',
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={onPrevPage}
          disabled={options.disabled}
        >
          Previous {form} -
        </button>
      );
    },

    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={onNextPage}
          disabled={options.disabled}
        >
          {to}  Next
        </button>
      );
    },
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
      console.log(searchResults, 'searchResults')
      setReceiveData(searchResults);
      setLoading(false);
    } catch (error) {
      console.error("Search failed:", error);
    }

  }

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Route Wise Customer Acquisition </h5>
          </div>
          <div className="am-pagebody" >
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
                    defaultValue={area[0]}
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
                    defaultvalue={inputs.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    defaultvalue={inputs.end_date}
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

                {isLoading ? (
                  <>
                    <h2
                      className="mg-b-5 tx-inverse tx-lato"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Oval
                        height={80}
                        width={80}
                        color="#00BFFF"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="#4fa94d"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                      />
                    </h2>
                  </>
                ) : (
                  <>
                    <table className="table mb-0">
                      <tr>
                        <th>Total OW Acquisition: {owCustomer}</th>
                        <th>
                          Total TOW Acquisition: {towCustomer}
                        </th>
                        <th>
                          Total Customer: {totalCustomer}
                        </th>
                      </tr>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="am-pagebody" id="RouteWiseCustomer">
            <div className="card pd-20 pd-sm-40">
              {searchTemplate(handleSearchChange)} {/* 👈 Show search + CSV button */}
              {/* <ReactDataTable
                paginator 
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
              /> */}

              <DataTable
                value={receiveData}
                paginator
                rows={rows}
                totalRecords={totalRecords}
                footer={footer}
                // header={header}
                filters={filters}
                globalFilterFields={["zone.name", "region.name", "area.name", "base.name", "name"]}
                resizableColumns
                stripedRows
                showGridlines
                lazy
                first={form - 1}
                last={to} scrollable
                loading={loading}
                scrollHeight="400px"
                PrevPageLink={() => setPage(page - 1)}
                // rowsPerPageOptions={[5, 10, 25, 50]}
                // paginatorTemplate={paginatorTemplate}
                ref={dt}>
                <Column field="zone.name" header="Zone" style={{ width: '25%' }}></Column>
                <Column field="region.name" header="Region" style={{ width: '25%' }}></Column>
                <Column field="area.name" header="Area" style={{ width: '25%' }}></Column>
                <Column field="base.name" header="Base" style={{ width: '25%' }}></Column>
                <Column field="name" header="name" style={{ width: '25%' }}></Column>
                <Column field={(rowData) => {
                  const sequenceNumber = rowData.route_has_plan ? rowData.route_has_plan.sequence_number : null;
                  return sequenceNumber && daysOfWeek[sequenceNumber] ? daysOfWeek[sequenceNumber] : 'N/A';
                }} header="Days"></Column>
                <Column field={(rowData) => {
                  return Array.isArray(rowData.ow_total_store) ? rowData.ow_total_store.length : 0;
                }} header="Ow Acquisition"></Column>
                <Column field={(rowData) => {
                  return Array.isArray(rowData.tom_total_store) ? rowData.tom_total_store.length : 0;
                }} header="Tow Acquisition"></Column>
                <Column field={(rowData) => {
                  return Array.isArray(rowData.total_store) ? rowData.total_store.length : 0;
                }} header="Tow Customer"></Column>
              </DataTable>

            </div>
            <AdvancePagination
              onPageChange={(page) => fetchData(page, pagination.per_page)}
              onLimitChange={(newLimit) => fetchData(1, newLimit)}
              showPerPage={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteWiseCustomer;
