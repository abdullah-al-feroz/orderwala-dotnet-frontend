import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CampaignOfferProductWise = () => {
  const [receiveData, setReceiveData] = useState({ report: [], totals: {} });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);

  const { firstDay, lastDay, today } = getCurrentMonthDateRange();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const defaultYear = [2025, 2026].includes(currentYear) ? currentYear : 2025;

  const [inputs, setInputs] = useState({
    start_date: today,
    end_date: today,
    month: currentMonth,
    year: defaultYear,
  });

  function getCurrentMonthDateRange() {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const first = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const last = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(
      year,
      month + 1,
      0,
    ).getDate()}`;
    const today = dateObj.toISOString().split("T")[0];

    return { firstDay: first, lastDay: last, today: today };
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const z = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(z.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const normalizeResponse = (data) => {
    const list =
      data?.report ||
      data?.list ||
      data?.data ||
      data?.workPlaceRoute?.data ||
      [];

    // Group products by distributor to calculate rowspan
    const groupedList = [];
    const groupSizes = {};
    let lastDistributorId = null;
    let currentGroupSize = 0;
    let currentGroupStartIndex = -1;

    // First pass: calculate group sizes
    list.forEach((row, index) => {
      const currentDistributorId =
        row.id + "_" + (row.distributor?.id || row.distributor_id);

      if (currentDistributorId !== lastDistributorId) {
        if (lastDistributorId !== null && currentGroupStartIndex >= 0) {
          groupSizes[currentGroupStartIndex] = currentGroupSize;
        }
        lastDistributorId = currentDistributorId;
        currentGroupStartIndex = index;
        currentGroupSize = 1;
      } else {
        currentGroupSize++;
      }
    });

    // Don't forget the last group
    if (currentGroupStartIndex >= 0) {
      groupSizes[currentGroupStartIndex] = currentGroupSize;
    }

    // Second pass: add rowspan info to data
    lastDistributorId = null;
    let groupStartIndex = -1;

    list.forEach((row, index) => {
      const currentDistributorId =
        row.id + "_" + (row.distributor?.id || row.distributor_id);
      const isNewGroup = currentDistributorId !== lastDistributorId;

      if (isNewGroup) {
        groupStartIndex = index;
      }

      groupedList.push({
        ...row,
        showGroupFields: isNewGroup,
        isFirstInGroup: isNewGroup,
        rowspan: isNewGroup ? groupSizes[groupStartIndex] : 0,
      });

      lastDistributorId = currentDistributorId;
    });

    const totals = {
      total_order_qty:
        data?.total_order_qty ??
        list.reduce(
          (sum, row) => sum + (getVal(row, ["total_order_qty"]) || 0),
          0,
        ),
      total_delivery_qty:
        data?.total_delivery_qty ??
        list.reduce(
          (sum, row) => sum + (getVal(row, ["total_delivery_qty"]) || 0),
          0,
        ),
    };
    return { report: groupedList, totals };
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption?.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name === "work_place_zone_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + value,
      ).then((res) => setRegion(res.data));
    }
    if (name === "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value,
      ).then((res) => setArea(res.data));
    }
    if (name === "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value,
      ).then((res) => setBase(res.data));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };
    const queryParams = new URLSearchParams();
    if (submissionInputs.month != null && submissionInputs.month !== "") {
      queryParams.set("month", String(submissionInputs.month));
    }
    if (submissionInputs.year != null && submissionInputs.year !== "") {
      queryParams.set("year", String(submissionInputs.year));
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
    if (Number.isInteger(submissionInputs.work_place_base_id)) {
      queryParams.append("base", submissionInputs.work_place_base_id);
    }
    try {
      //   const response = await Http.get(
      //     `/app/moo/base-wise-order-delivery-range?${queryParams.toString()}`,
      //   );
      //   setReceiveData(normalizeResponse(response.data));

      const response = await Http.get(
        `/moo-panel/reports/campaign-offer-productwise?${queryParams.toString()}`,
      );
      setReceiveData(normalizeResponse(response.data));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yearOptions = [
    { value: 2025, label: "2025" },
    { value: 2026, label: "2026" },
  ];

  const getVal = (row, keys) => {
    if (!row) return 0;
    if (keys.length === 1) {
      const k = keys[0];
      return row[k] ?? row?.ranges?.[k] ?? 0;
    }
    let v = row;
    for (let i = 0; i < keys.length; i++) {
      v = v?.[keys[i]];
      if (v == null) break;
    }
    return v ?? 0;
  };

  const filteredReport = useMemo(() => {
    const report = receiveData.report || [];
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return report;
    }

    return report.filter((row) => {
      const searchFields = [
        getVal(row, ["id"]),
        getVal(row, ["zone", "name"]) || getVal(row, ["base", "zone", "name"]),
        getVal(row, ["region", "name"]) ||
          getVal(row, ["base", "region", "name"]),
        getVal(row, ["area", "name"]) || getVal(row, ["base", "area", "name"]),
        getVal(row, ["base", "name"]) || getVal(row, ["base_name"]),
        getVal(row, ["distributor", "name"]) || getVal(row, ["name"]),
        getVal(row, ["distributor", "code"]) || getVal(row, ["code"]),
        getVal(row, ["total_memo_amount"]),
        getVal(row, ["total_memo_qty"]),
        getVal(row, ["total_offer_amount"]),
        getVal(row, ["product_name"]),
        getVal(row, ["product_code"]),
        getVal(row, ["product_qty"]),
        getVal(row, ["product_rate"]),
        getVal(row, ["product_total_amount"]),
      ];

      return searchFields.some((field) =>
        String(field ?? "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [receiveData.report, searchTerm]);

  // Export to CSV function
  const exportCSV = () => {
    const csvData = receiveData.report.map((row) => ({
      ID: getVal(row, ["id"]),
      Zone:
        getVal(row, ["zone", "name"]) || getVal(row, ["base", "zone", "name"]),
      Region:
        getVal(row, ["region", "name"]) ||
        getVal(row, ["base", "region", "name"]),
      Area:
        getVal(row, ["area", "name"]) || getVal(row, ["base", "area", "name"]),
      Base: getVal(row, ["base", "name"]) || getVal(row, ["base_name"]),
      "DB Name": getVal(row, ["distributor", "name"]) || getVal(row, ["name"]),
      "DB Code": getVal(row, ["distributor", "code"]) || getVal(row, ["code"]),
      "Order Amount": getVal(row, ["total_memo_amount"]),
      "Memo Qty": getVal(row, ["total_memo_qty"]),
      "Offer Amount": getVal(row, ["total_offer_amount"]),
      "Product Name": getVal(row, ["product_name"]) || "N/A",
      "Product Code": getVal(row, ["product_code"]) || "N/A",
      "Product Qty": getVal(row, ["product_qty"]) || "0",
      "Product Rate": getVal(row, ["product_rate"]) || "0",
      "Product Total Amount": getVal(row, ["product_total_amount"]) || "0",
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvRows = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(","),
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-offer-productwise-${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Export to PDF function
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    const tableData = receiveData.report.map((row) => [
      getVal(row, ["id"]),
      getVal(row, ["zone", "name"]) || getVal(row, ["base", "zone", "name"]),
      getVal(row, ["region", "name"]) ||
        getVal(row, ["base", "region", "name"]),
      getVal(row, ["area", "name"]) || getVal(row, ["base", "area", "name"]),
      getVal(row, ["base", "name"]) || getVal(row, ["base_name"]),
      getVal(row, ["distributor", "name"]) || getVal(row, ["name"]),
      getVal(row, ["distributor", "code"]) || getVal(row, ["code"]),
      getVal(row, ["total_memo_amount"]),
      getVal(row, ["total_memo_qty"]),
      getVal(row, ["total_offer_amount"]),
      getVal(row, ["product_name"]) || "N/A",
      getVal(row, ["product_code"]) || "N/A",
      getVal(row, ["product_qty"]) || "0",
      getVal(row, ["product_rate"]) || "0",
      getVal(row, ["product_total_amount"]) || "0",
    ]);

    doc.autoTable({
      head: [
        [
          "ID",
          "Zone",
          "Region",
          "Area",
          "Base",
          "DB Name",
          "DB Code",
          "Order Amount",
          "Memo Qty",
          "Offer Amount",
          "Product Name",
          "Product Code",
          "Product Qty",
          "Product Rate",
          "Product Total Amount",
        ],
      ],
      body: tableData,
      styles: { fontSize: 7 },
      margin: { top: 40 },
    });

    doc.save(`campaign-offer-productwise-${new Date().getTime()}.pdf`);
  };

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Campaign Offer</h5>
          </div>
          <div className="am-pagebody">
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
                <div className="col-lg">
                  <label htmlFor="">Select Month</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="month"
                    options={monthOptions}
                    value={
                      monthOptions.find(
                        (m) => Number(m.value) === Number(inputs.month),
                      ) || null
                    }
                    onChange={selectHandleChange}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999999999999,
                      }),
                    }}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Select Year</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="year"
                    options={yearOptions}
                    value={
                      yearOptions.find(
                        (y) => Number(y.value) === Number(inputs.year),
                      ) || null
                    }
                    onChange={selectHandleChange}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999999999999,
                      }),
                    }}
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
              {/* <div className="row mt-4">
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
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
              </div> */}
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <button
                    className="btn btn-sm btn-info mr-2"
                    onClick={exportCSV}
                    disabled={loading || !receiveData.report?.length}
                  >
                    <i className="fa fa-file-excel-o mr-2"></i>Export CSV
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={exportPDF}
                    disabled={loading || !receiveData.report?.length}
                  >
                    <i className="fa fa-file-pdf-o mr-2"></i>Export PDF
                  </button>
                </div>
                <div>
                  {receiveData.report?.length > 0 && (
                    <span>
                      Displaying {filteredReport.length} of{" "}
                      {receiveData.report.length} entries
                    </span>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 ml-auto">
                  <label htmlFor="datatable-search" className="mb-1">
                    Search:
                  </label>
                  <input
                    id="datatable-search"
                    type="text"
                    className="form-control"
                    placeholder="Search in table..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <i className="fa fa-spinner fa-spin fa-3x"></i>
                  <p className="mt-3">Loading...</p>
                </div>
              ) : (
                <div
                  className="table-responsive"
                  style={{ maxHeight: "600px", overflow: "auto" }}
                >
                  <table className="table table-bordered table-striped table-hover">
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#fff",
                        zIndex: 10,
                      }}
                    >
                      <tr>
                        <th>ID</th>
                        <th>Zone</th>
                        <th>Region</th>
                        <th>Area</th>
                        <th>Base</th>
                        <th>DB Name</th>
                        <th>DB Code</th>
                        <th>Order Amount</th>
                        <th>Memo Qty</th>
                        <th>Offer Amount</th>
                        <th>Product Name</th>
                        <th>Product Code</th>
                        <th>Product Qty</th>
                        <th>Product Rate</th>
                        <th>Product Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReport?.length > 0 ? (
                        filteredReport.map((row, index) => (
                          <tr key={index}>
                            {row.showGroupFields && (
                              <>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["id"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["zone", "name"]) ||
                                    getVal(row, ["base", "zone", "name"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["region", "name"]) ||
                                    getVal(row, ["base", "region", "name"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["area", "name"]) ||
                                    getVal(row, ["base", "area", "name"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["base", "name"]) ||
                                    getVal(row, ["base_name"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["distributor", "name"]) ||
                                    getVal(row, ["name"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["distributor", "code"]) ||
                                    getVal(row, ["code"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["total_memo_amount"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["total_memo_qty"])}
                                </td>
                                <td rowSpan={row.rowspan}>
                                  {getVal(row, ["total_offer_amount"])}
                                </td>
                              </>
                            )}
                            <td>{getVal(row, ["product_name"]) || "N/A"}</td>
                            <td>{getVal(row, ["product_code"]) || "N/A"}</td>
                            <td>{getVal(row, ["product_qty"]) || "0"}</td>
                            <td>{getVal(row, ["product_rate"]) || "0"}</td>
                            <td>
                              {getVal(row, ["product_total_amount"]) || "0"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="15" className="text-center">
                            {receiveData.report?.length > 0
                              ? "No matching records found"
                              : "No Data Found!"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignOfferProductWise;
