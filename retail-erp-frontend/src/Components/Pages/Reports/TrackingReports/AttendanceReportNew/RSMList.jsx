import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link, useLocation, createSearchParams } from "react-router-dom";
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Params passed from the CDM list when drilling down into one zone
  const urlParams = new URLSearchParams(location.search);
  const cdmName = urlParams.get("cdm_name");
  const zoneName = urlParams.get("zone_name");
  const today = new Date().toISOString().substr(0, 10);
  const initialFilters = {
    from: urlParams.get("from_date") || today,
    to: urlParams.get("to_date") || today,
    zone: null,
    region: null,
  };
  const [inputs, setInputs] = useState({
    from: initialFilters.from,
    to: initialFilters.to,
    status: "active",
  });
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const normalizeNumber = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

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

  const buildQueryParams = (filters, extra = {}) => {
    const queryParams = new URLSearchParams({ type: "mdm", ...extra });
    if (filters?.from) {
      queryParams.set("from_date", filters.from);
    }
    if (filters?.to) {
      queryParams.set("to_date", filters.to);
    }
    if (Number.isInteger(filters?.zone)) {
      queryParams.append("zone", filters.zone);
    }
    if (Number.isInteger(filters?.region)) {
      queryParams.append("region", filters.region);
    }

    const queryString = getLocationQueryString();
    if (queryString) {
      queryString.split("&").forEach((pair) => {
        const [key, value] = pair.split("=");
        queryParams.append(key, value);
      });
    }
    return queryParams;
  };

  const fetchData = async (
    page = pagination.page,
    limit = pagination.limit,
    filters = appliedFilters,
  ) => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams(filters, {
        page: String(page),
        limit: String(limit),
      });

      const res = await Http.get(
        `/moo-panel/dashboard-section/rsm-table?${queryParams.toString()}`,
      );
      const listPayload = res.data.list;
      if (Array.isArray(listPayload)) {
        setReceiveData(listPayload);
        setPagination((prev) => ({
          ...prev,
          page,
          limit,
          total: res.data?.total ?? listPayload.length,
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

  const fetchSummaryData = async (filters = appliedFilters) => {
    setLoadingSummaryData(true);
    try {
      const queryParams = buildQueryParams(filters);
      const summaryRes = await Http.get(
        `/moo-panel/dashboard-section/rsm-summary?${queryParams.toString()}`,
      );
      setCumulativeData(summaryRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoadingSummaryData(false);
    }
  };

  useEffect(() => {
    Http.get("/select2/Hr.WorkPlaceZone/id,name")
      .then((res) => setZone(res.data))
      .catch((error) => console.error("Zone fetch error:", error));
  }, []);

  useEffect(() => {
    setInputs((values) => ({
      ...values,
      from: initialFilters.from,
      to: initialFilters.to,
      work_place_zone_id: null,
      work_place_region_id: null,
    }));
    setAppliedFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData(1, pagination.limit, initialFilters);
    fetchSummaryData(initialFilters);
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
      setInputs((values) => ({ ...values, work_place_region_id: null }));
      Http.get(
        "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + value,
      ).then((res) => {
        setRegion(res.data);
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
    { field: "workplace", header: "Workplace" },
    { field: "zone", header: "Zone" },
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
    { field: "total_verified", header: "Verified Store" },
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

  const formSubmit = async () => {
    try {
      const nextFilters = {
        from: inputs.from,
        to: inputs.to,
        zone: normalizeNumber(inputs.work_place_zone_id),
        region: normalizeNumber(inputs.work_place_region_id),
      };
      setAppliedFilters(nextFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));
      await Promise.all([
        fetchData(1, pagination.limit, nextFilters),
        fetchSummaryData(nextFilters),
      ]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const queryParams = buildQueryParams(appliedFilters);
      const res = await Http.get(
        `/moo-panel/dashboard-section/rsm-table?${queryParams.toString()}`,
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
        filename: `rsm_attendance_${appliedFilters.from}_${appliedFilters.to}`,
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
            to={{
              pathname: "/tracking-reports/attendance-reports/mdc",
              search: createSearchParams({
                mdm_id: rowData.id,
                mdm_name: rowData.name ?? "",
                region_name: rowData.workplace ?? "",
                from_date: appliedFilters.from,
                to_date: appliedFilters.to,
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
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">
              MDM Attendance Report
              {(cdmName || zoneName) && (
                <span className="tx-14 mg-l-10">
                  ({[cdmName, zoneName].filter(Boolean).join(" - ")})
                </span>
              )}
            </h5>
            {urlParams.get("cdm_id") && (
              <Link
                to="/tracking-reports/attendance-reports/mdm"
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
                    name="work_place_zone_id"
                    options={zone}
                    value={
                      zone.find(
                        (item) => item.value === inputs.work_place_zone_id,
                      ) ?? null
                    }
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Region</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="work_place_region_id"
                    options={region}
                    value={
                      region.find(
                        (item) => item.value === inputs.work_place_region_id,
                      ) ?? null
                    }
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
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
                      <th>Total MDM : {cumulative.total_staff}</th>
                      <th>
                        Total MDM Attendant : {cumulative.attendance_given}
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
                        Sales: {cumulative.total_distributor_order_qty}
                        <br />
                        <b style={{ paddingLeft: 0 }}>Total Delivery Qty : </b>
                        {cumulative.total_delivery_qty}
                      </th>
                      <th>
                        Order Amount : (OW:{" "}
                        {cumulative.total_order_amount_orderwala} || TOW:{" "}
                        {cumulative.total_order_amount_team_orderwala} || TUA:{" "}
                        {cumulative.total_undelivered_order_amount}
                        || TDA: {cumulative.total_delivered_order_amount} ||
                        Total: {cumulative.total_order_amount}) || Distributor
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
                  fetchData(nextPage, nextLimit, appliedFilters);
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
