import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import {
  Link,
  useLocation,
  useParams,
  createSearchParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../../Common/Alert";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import Select from "react-select";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { exportToCSV } from "../../../../Common/ExportUtils";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [loadingSummaryData, setLoadingSummaryData] = useState(false);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  useParams();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Params passed from the RSM/MDM list when drilling down into one region
  const urlParams = new URLSearchParams(location.search);
  const mdmName = urlParams.get("mdm_name");
  const regionName = urlParams.get("region_name");
  const today = new Date().toISOString().substr(0, 10);
  const initialDateRange = {
    from: urlParams.get("from_date") || today,
    to: urlParams.get("to_date") || today,
  };
  const [appliedDateRange, setAppliedDateRange] = useState(initialDateRange);

  const [inputs, setInputs] = useState({
    from: initialDateRange.from,
    to: initialDateRange.to,
    status: "active",
  });
  const getLocationQueryString = () => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};

    for (const [key, value] of searchParams.entries()) {
      if (value > 0) {
        params[key] = value;
      }
    }

    return new URLSearchParams(params).toString();
  };

  const fetchData = async (
    page = pagination.page,
    limit = pagination.limit,
    dateRange = null,
  ) => {
    setLoading(true);
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      // const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      // setRegion(region.data);

      const queryString = getLocationQueryString();

      const queryParams = new URLSearchParams({
        type: "mdc",
        page: String(page),
        limit: String(limit),
      });
      const submissionInputs = {
        ...inputs,
      };
      if (dateRange?.from) {
        queryParams.set("from_date", dateRange.from);
      }
      if (dateRange?.to) {
        queryParams.set("to_date", dateRange.to);
      }
      if (Number.isInteger(submissionInputs.work_place_zone_id)) {
        queryParams.append("zone", submissionInputs.work_place_zone_id);
      }
      if (Number.isInteger(submissionInputs.work_place_region_id)) {
        queryParams.append("region", submissionInputs.work_place_region_id);
      }
      if (Number.isInteger(submissionInputs.work_place_area_id)) {
        queryParams.append("area", submissionInputs.work_place_area_id);
      }

      if (queryString) {
        queryString.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          queryParams.append(key, value);
        });
      }

      // const url = `/app/moo/attendance-report?${queryParams.toString()}`;

      // const res = await Http.get(url);
      // const listPayload = res.data.list;

      const res = await Http.get(
        `/moo-panel/dashboard-section/am-table?${queryParams.toString()}`,
      );
      const listPayload = res.data.list;
      if (Array.isArray(listPayload)) {
        const totalFromResponse =
          res.data?.total ?? res.data?.list?.total ?? listPayload.length;
        setReceiveData(listPayload);
        setPagination((prev) => ({
          ...prev,
          page,
          limit,
          total: totalFromResponse ?? prev.total,
        }));
      } else if (listPayload?.data) {
        setReceiveData(listPayload.data);
        setPagination((prev) => ({
          ...prev,
          page: listPayload.current_page ?? page,
          limit: listPayload.per_page ?? limit,
          total: listPayload.total ?? prev.total,
        }));
      } else {
        setReceiveData([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSummaryData = async (filters) => {
    setLoadingSummaryData(true);
    try {
      const queryString = getLocationQueryString();

      const queryParams = new URLSearchParams({
        type: "mdc",
      });
      const submissionInputs = {
        ...inputs,
      };
      if (filters?.from) {
        queryParams.set("from_date", filters.from);
      }
      if (filters?.to) {
        queryParams.set("to_date", filters.to);
      }
      if (Number.isInteger(submissionInputs.work_place_zone_id)) {
        queryParams.append("zone", submissionInputs.work_place_zone_id);
      }
      if (Number.isInteger(submissionInputs.work_place_region_id)) {
        queryParams.append("region", submissionInputs.work_place_region_id);
      }
      if (Number.isInteger(submissionInputs.work_place_area_id)) {
        queryParams.append("area", submissionInputs.work_place_area_id);
      }

      if (queryString) {
        queryString.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          queryParams.append(key, value);
        });
      }

      const summaryRes = await Http.get(
        `/moo-panel/dashboard-section/am-summary?${queryParams.toString()}`,
      );
      const summaryPayload = summaryRes.data;
      setCumulativeData(summaryPayload);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoadingSummaryData(false);
    }
  };

  useEffect(() => {
    setInputs((values) => ({ ...values, ...initialDateRange }));
    setAppliedDateRange(initialDateRange);
    fetchData(1, pagination.limit, initialDateRange);
    fetchSummaryData(initialDateRange);
  }, [location.search]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const resRole = await Http.get("/staff-type-check");
        setRole(resRole.data);
      } catch (error) {
        console.error("Role fetch error:", error);
      }
    };
    fetchRole();
  }, []);

  // const selectHandleChange = (selectedOption, actionMeta) => {
  //   const name = actionMeta.name;
  //   const value = selectedOption.value;
  //   setInputs((values) => ({ ...values, [name]: value }));
  // };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "work_place_zone_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + value,
      ).then((res) => {
        setRegion(res.data);
      });
    }
    if (name == "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value,
      ).then((res) => {
        setArea(res.data);
      });
    }
  };

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

  const formatTo12HourWithDate = (dateTimeString) => {
    if (!dateTimeString) return "";
    const [datePart, timePart] = dateTimeString.split(" ");
    if (!timePart) return datePart;
    const [hours, minutes] = timePart.split(":");
    const hours12 = (+hours % 12 || 12).toString().padStart(2, "0");
    const period = +hours < 12 ? "AM" : "PM";
    return `${datePart} ${hours12}:${minutes} ${period}`;
  };

  const cols = [
    { field: "name", header: "Name" },
    { field: "official_designation", header: "Designation" },
    { field: "workplace", header: "workplace" },
    // {
    //   field: (rowData) => {
    //     return (
    //       <span className={rowData.is_late === 1 ? "text-danger" : ""}>
    //         {rowData.attendance_time}
    //       </span>
    //     );88
    //   },
    //   header: "Attendance At",
    // },
    {
      field: (rowData) => formatTo12HourWithDate(rowData.attendance_time),
      header: "Attendance At",
    },
    {
      field: (rowData) => formatTo12HourWithDate(rowData.attendance_time),
      header: "Attendance At",
    },
    {
      field: (rowData) => (rowData.is_late === 1 ? "Yes" : "No"),
      header: "Late",
    },
    { field: "distributor_base", header: "Distributor Base" },
    { field: "attendance_location", header: "Attendance Location" },
    { field: "checkout_location", header: "Checkout Location" },
    {
      field: (rowData) => formatTo12HourWithDate(rowData.checkout_time),
      header: "Checkout At",
    },
    {
      field: "total_verified",
      header: "Verified Store",
    },
    { field: "total_unverified", header: "Unverified Store" },
    {
      field: "visited_store_team_orderwala",
      header: "Visited store Team Orderwala",
    },
    { field: "visited_store_orderwala", header: "Visited store Orderwala" },
    { field: "visited_store", header: "Visited store" },
    { field: "closed_store", header: "Closed store" },

    { field: "order_qty_team_orderwala", header: "Order Qty Team Orderwala" },
    { field: "order_qty_orderwala", header: "Order Qty Orderwala" },
    { field: "order_qty", header: "Order qty" },
    { field: "delivery_qty", header: "Delivery qty" },
    {
      field: "order_amount_team_orderwala",
      header: "Order Amount Team Orderwala",
    },
    { field: "order_amount_orderwala", header: "Order Amount Orderwala" },
    { field: "undeliverydOrderAmount", header: "Undelivered Order amount" },
    { field: "deliveredOrderAmount", header: "Delivered Order amount" },
    { field: "order_amount", header: "Order amount" },
    // { field: "all_order_amount", header: "Actual Order amount" },
    { field: "total_order_item_amount", header: "Actual Order amount" },
    { field: "distributor_order_amount", header: "Distributor Sales Amount" },
  ];

  const exportCols = cols.map((col) => {
    if (typeof col.field === "function") {
      return { header: col.header, accessor: col.field };
    }
    return { header: col.header, field: col.field };
  });

  // const mappedData = receiveData.map((item) => {
  //   const attendances = item.attendances
  //     .map((attendances) => attendances?.attendance_at)
  //     .join(" || ");

  //   return {
  //     ...item,
  //     attendances,
  //   };
  // });

  //   const formSubmit = () => {
  //     Http.post("/chart-of-account-report/", inputs).then((res) => {
  //       setReceiveData(res.data.info);
  //     });

  // const formSubmit = () => {
  //   Http.get("/app/report/attendance", inputs).then((res) => {
  //     setReceiveData(res.data.list);
  //   });
  // };

  const formSubmit = async () => {
    try {
      // const nextDateRange = { from: inputs.from, to: inputs.to };
      // setAppliedDateRange(nextDateRange);
      // setPagination((prev) => ({ ...prev, page: 1 }));
      // await fetchData(1, pagination.limit, nextDateRange);
      // await fetchSummaryData(nextFilters);

      const nextFilters = {
        from: inputs.from,
        to: inputs.to,
        zone: normalizeNumber(inputs.work_place_zone_id),
        region: normalizeNumber(inputs.work_place_region_id),
        area: normalizeNumber(inputs.work_place_area_id),
      };
      setAppliedFilters(nextFilters);
      setAppliedDateRange({ from: nextFilters.from, to: nextFilters.to });
      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchData(1, pagination.limit, nextFilters);
      await fetchSummaryData(nextFilters);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  const normalizeNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const [appliedFilters, setAppliedFilters] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    search: "",
    zone: null,
    region: null,
    area: null,
    base: null,
  });

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const queryString = getLocationQueryString();
      const dateRange = appliedDateRange ?? {
        from: inputs.from,
        to: inputs.to,
      };
      const submissionInputs = {
        ...inputs,
      };

      const queryParams = new URLSearchParams({
        type: "mdc",
        from_date: dateRange.from,
        to_date: dateRange.to,
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

      if (queryString) {
        queryString.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          queryParams.append(key, value);
        });
      }

      const res = await Http.get(
        `/app/moo/attendance-report?${queryParams.toString()}`,
      );
      const listPayload = res.data.list;
      const allData = Array.isArray(listPayload)
        ? listPayload
        : Array.isArray(listPayload?.data)
          ? listPayload.data
          : [];

      exportToCSV({
        cols: exportCols,
        data: allData,
        filename: `mdc_attendance_${dateRange.from}_${dateRange.to}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      showAlert("Failed to export data", "danger");
    } finally {
      setExporting(false);
    }
  };

  const actionTemplate = (rowData) => {
    const handleApprove = async () => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to approve this entry!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, approve it!",
        });

        if (result.isConfirmed) {
          // Call the API to approve the attendance
          await Http.post(`/approve-mdo-attendnace/${rowData.attendance_id}`);

          Swal.fire("Approved!", "The entry has been approved.", "success");

          // Update the receiveData state to remove the "Approve" button
          setReceiveData((prevData) =>
            prevData.map((item) =>
              item.attendance_id === rowData.attendance_id
                ? { ...item, is_late: 0 } // Mark as not late
                : item,
            ),
          );
        }
      } catch (error) {
        console.error("Approval error:", error);
        Swal.fire("Error", "Something went wrong while approving.", "error");
      }
    };
    return (
      rowData.id && (
        <div className="text-xs text-nowrap">
          <Link
            // to={{
            //   pathname:
            //     "/tracking-reports/attendance-reports/mdo/" +
            //     rowData.id +
            //     "?from_date=" +
            //     inputs.from +
            //     "&to_date=" +
            //     inputs.to,
            // }}
            to={{
              pathname: `/tracking-reports/attendance-reports/mdo/${rowData.id}`,
              search: createSearchParams({
                from_date: inputs.from,
                to_date: inputs.to,
              }).toString(),
            }}
            className="btn btn-info btn-sm mx-1"
            title="View"
          >
            <i className="fa fa-list" aria-hidden="true"></i>
          </Link>
          {rowData.is_late === 1 && role === "hmo" && (
            <button
              className="btn btn-success btn-sm mx-1"
              onClick={handleApprove}
            >
              Approve
            </button>
          )}
        </div>
      )
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">
              Supervisor Attendance Report
              {(mdmName || regionName) && (
                <span className="tx-14 mg-l-10">
                  ({[mdmName, regionName].filter(Boolean).join(" - ")})
                </span>
              )}
            </h5>
            {urlParams.get("mdm_id") && (
              <Link
                to="/tracking-reports/attendance-reports/mdc"
                className="btn btn-outline-secondary btn-sm"
              >
                Show all
              </Link>
            )}
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
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
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Area</label>
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
                  <label for="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="chart_of_account_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div> */}
                <div className="col-lg mt-4">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>

              {loadingSummaryData ? (
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
                  <table className="table mb-0 mt-3">
                    <tr>
                      <th>Total Supervisor : {cumulative.total_staff}</th>
                      <th>
                        Total Supervisor Attendant :{" "}
                        {cumulative.attendance_given}
                      </th>
                      <th>
                        Total Verified Store : {cumulative.total_verified} ||
                        Total Unverified Store : {cumulative.total_unverified}
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <b style={{ paddingLeft: 0 }}>Visited Stores : </b>(OW:{" "}
                        {cumulative.total_visited_store_orderwala} || TOW:{" "}
                        {cumulative.total_visited_store_team_orderwala} ||
                        Total: {cumulative.total_visited_store})<br />{" "}
                        <b style={{ paddingLeft: 0 }}>Closed Stores :</b>{" "}
                        {cumulative.total_closed_store}
                      </th>
                      <th>
                        Order Qty : (OW: {cumulative.total_order_qty_orderwala}{" "}
                        || TOW: {cumulative.total_order_qty_team_orderwala} ||
                        Total: {cumulative.total_order_qty}) || Distributor
                        Sales: {cumulative.total_distributor_order_qty})
                        <br />
                        {""}
                        <b style={{ paddingLeft: 0 }}>Total Delivery Qty : </b>
                        {cumulative.total_delivery_qty}
                      </th>
                      <th>
                        Order Amount : (OW:{" "}
                        {cumulative.total_order_amount_orderwala} || TOW:{" "}
                        {cumulative.total_order_amount_team_orderwala} || TUA:{" "}
                        {cumulative.total_undelivered_order_amount}
                        || TDA: {cumulative.total_delivered_order_amount} ||
                        Total: {cumulative.total_order_amount})|| Distributor
                        Sales Amount:{" "}
                        {cumulative.total_distributor_order_amount}
                      </th>
                    </tr>
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <div className="col-lg-6 px-0 mb-3">
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
              <DataTable
                value={receiveData}
                paginator
                lazy
                loading={loading}
                rows={pagination.limit}
                first={(pagination.page - 1) * pagination.limit}
                totalRecords={pagination.total}
                rowsPerPageOptions={[10, 20, 50, 100]}
                onPage={(e) => {
                  const nextPage = (e.page ?? 0) + 1;
                  const nextLimit = e.rows ?? pagination.limit;
                  setPagination((prev) => ({
                    ...prev,
                    page: nextPage,
                    limit: nextLimit,
                  }));
                  fetchData(nextPage, nextLimit, appliedDateRange);
                }}
                resizableColumns
                stripedRows
                showGridlines
                emptyMessage="No Data Found !"
                scrollable
                scrollHeight="433px"
              >
                {cols.map((col, index) => {
                  const isFrozen =
                    typeof col.field === "string" &&
                    ["name", "official_designation", "workplace"].includes(
                      col.field,
                    );

                  if (typeof col.field === "function") {
                    return (
                      <Column
                        key={index}
                        header={col.header}
                        body={col.field}
                        frozen={isFrozen}
                      />
                    );
                  }

                  return (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      frozen={isFrozen}
                    />
                  );
                })}
                <Column header="Action" body={actionTemplate} />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
