import React, { useEffect, useState } from "react";
import Select from "react-select";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import ReactDataTable from "../../Common/ReactDataTable";

const CampaignOffer = () => {
  const [receiveData, setReceiveData] = useState({ report: [], totals: {} });
  const [loading, setLoading] = useState(false);
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
    return { report: list, totals };
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
        `/moo-panel/reports/campaign-offer?${queryParams.toString()}`,
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

  const cols = [
    {
      header: "ID",
      field: (row) => getVal(row, ["id"]),
    },
    {
      header: "Zone",
      field: (row) =>
        getVal(row, ["zone", "name"]) || getVal(row, ["base", "zone", "name"]),
    },
    {
      header: "Region",
      field: (row) =>
        getVal(row, ["region", "name"]) ||
        getVal(row, ["base", "region", "name"]),
    },
    {
      header: "Area",
      field: (row) =>
        getVal(row, ["area", "name"]) || getVal(row, ["base", "area", "name"]),
    },
    {
      header: "Base",
      field: (row) =>
        getVal(row, ["base", "name"]) || getVal(row, ["base_name"]),
    },
    {
      header: "Order Amount",
      field: (row) => getVal(row, ["total_memo_amount"]),
    },
    {
      header: "Memo Qty",
      field: (row) => getVal(row, ["total_memo_qty"]),
    },
    {
      header: "Offer Amount",
      field: (row) => getVal(row, ["total_offer_amount"]),
    },
    {
      header: "DB Name",
      field: (row) =>
        getVal(row, ["distributor", "name"]) || getVal(row, ["name"]),
    },
    {
      header: "DB Code",
      field: (row) =>
        getVal(row, ["distributor", "code"]) || getVal(row, ["code"]),
    },
  ];

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
              <ReactDataTable
                cols={cols}
                receiveData={receiveData.report}
                isLoading={loading}
                frozenColumnFields={["Zone", "Region", "Area", "Base"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignOffer;
