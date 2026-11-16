import React, { useEffect, useState } from "react";
import Select from "react-select";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import ReactDataTable from "../../Common/ReactDataTable";

const BaseWiseOrderDeliveryRangeReport = () => {
  const [receiveData, setReceiveData] = useState({ report: [], totals: {} });
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);

  const { firstDay, lastDay, today } = getCurrentMonthDateRange();

  const [inputs, setInputs] = useState({
    // start_date: firstDay,
    // end_date: lastDay,
    start_date: today,
    end_date: today,
  });

  function getCurrentMonthDateRange() {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const first = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const last = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(
      year,
      month + 1,
      0
    ).getDate()}`;
    const today = dateObj.toISOString().split("T")[0];

    return { firstDay: first, lastDay: last, today: today };
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const z = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(z.data);
      const res = await Http.get("/app/moo/base-wise-order-delivery-range");
      setReceiveData(normalizeResponse(res.data));
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
          0
        ),
      total_delivery_qty:
        data?.total_delivery_qty ??
        list.reduce(
          (sum, row) => sum + (getVal(row, ["total_delivery_qty"]) || 0),
          0
        ),
    };
    return { report: list, totals };
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name === "work_place_zone_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + value
      ).then((res) => setRegion(res.data));
    }
    if (name === "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => setArea(res.data));
    }
    if (name === "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
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
    const queryParams = new URLSearchParams({
      from: submissionInputs.start_date,
      to: submissionInputs.end_date,
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
        `/app/moo/base-wise-order-delivery-range?${queryParams.toString()}`
      );
      setReceiveData(normalizeResponse(response.data));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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
      header: "Below 500 tk order qty",
      field: (row) => getVal(row, ["below_500_order_qty"]),
    },
    {
      header: "Below 500 tk delivery Qty",
      field: (row) => getVal(row, ["below_500_delivery_qty"]),
    },
    {
      header: "500 tk to 999 tk order qty",
      field: (row) => getVal(row, ["range_500_999_order_qty"]),
    },
    {
      header: "500 tk to 999 tk delivery qty",
      field: (row) => getVal(row, ["range_500_999_delivery_qty"]),
    },
    {
      header: "1000 tk to 1499 tk order qty",
      field: (row) => getVal(row, ["range_1000_1499_order_qty"]),
    },
    {
      header: "1000 tk to 1499 tk delivery qty",
      field: (row) => getVal(row, ["range_1000_1499_delivery_qty"]),
    },
    {
      header: "1500 tk to 1999 tk order qty",
      field: (row) => getVal(row, ["range_1500_1999_order_qty"]),
    },
    {
      header: "1500 tk to 1999 tk delivery Qty",
      field: (row) => getVal(row, ["range_1500_1999_delivery_qty"]),
    },
    {
      header: "2000 tk & above order Qty",
      field: (row) => getVal(row, ["range_2000_plus_order_qty"]),
    },
    {
      header: "2000 tk & above delivery Qty",
      field: (row) => getVal(row, ["range_2000_plus_delivery_qty"]),
    },
    {
      header: "Total Order Qty",
      field: (row) => getVal(row, ["total_order_qty"]),
    },
    {
      header: "Total Delivery Qty",
      field: (row) => getVal(row, ["total_delivery_qty"]),
    },
  ];

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">
              Base wise order & delivery qty (range-wise)
            </h5>
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
              </div>
              <div className="row mt-4">
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
              </div>
              <table className="table mb-0">
                <tr>
                  <th>
                    Total Order Qty: {receiveData?.totals?.total_order_qty || 0}
                  </th>
                  <th>
                    Total Delivery Qty:{" "}
                    {receiveData?.totals?.total_delivery_qty || 0}
                  </th>
                </tr>
              </table>
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

export default BaseWiseOrderDeliveryRangeReport;
