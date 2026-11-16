import React, { useEffect, useState } from "react";
import Select from "react-select";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import ReactDataTable from "../../Common/ReactDataTable";

// Each workplace dropdown, the model it loads from and the column that links it to its parent
const levels = [
  { key: "zone", label: "Zone", model: "Hr.WorkPlaceZone" },
  {
    key: "region",
    label: "Region",
    model: "Hr.WorkPlaceRegion",
    parentColumn: "work_place_zone_id",
  },
  {
    key: "area",
    label: "Select Area",
    model: "Hr.WorkPlaceArea",
    parentColumn: "work_place_region_id",
  },
  {
    key: "base",
    label: "Select Base",
    model: "Hr.WorkPlaceBase",
    parentColumn: "work_place_area_id",
  },
];

function getCurrentMonthDateRange() {
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const firstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(
    year,
    month + 1,
    0
  ).getDate()}`;

  return { firstDay, lastDay };
}

const ProductWiseSalesDeliveryReport = () => {
  const { firstDay, lastDay } = getCurrentMonthDateRange();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [summary, setSummary] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState({
    zone: [],
    region: [],
    area: [],
    base: [],
  });
  const [selected, setSelected] = useState({
    zone: null,
    region: null,
    area: null,
    base: null,
  });
  const [inputs, setInputs] = useState({ from: firstDay, to: lastDay });

  const applyResponse = (data) => {
    setList(data?.list || []);
    setSummary(data?.summary || {});
    setMessage(data?.message || "");
  };

  const fetchReport = async (params) => {
    setLoading(true);
    setError("");
    try {
      const res = await Http.get(
        `/app/moo/product-wise-sales-delivery?${params.toString()}`
      );
      applyResponse(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load the report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Zone and region lists are loaded up front, like the SKU wise item summary
    Http.get("/select2/Hr.WorkPlaceZone/id,name").then((res) =>
      setOptions((prev) => ({ ...prev, zone: res.data }))
    );
    Http.get("/select2/Hr.WorkPlaceRegion/id,name").then((res) =>
      setOptions((prev) => ({ ...prev, region: res.data }))
    );
    fetchReport(new URLSearchParams({ from: firstDay, to: lastDay }));
  }, []);

  const selectHandleChange = (levelKey) => (option) => {
    const index = levels.findIndex((level) => level.key === levelKey);
    const child = levels[index + 1];

    setSelected((prev) => {
      const next = { ...prev, [levelKey]: option };
      // A changed parent clears every level below it
      levels.slice(index + 1).forEach((level) => {
        next[level.key] = null;
      });
      return next;
    });

    // Reload the next dropdown for the chosen parent and empty the ones below it
    setOptions((prev) => {
      const next = { ...prev };
      levels.slice(index + 2).forEach((level) => {
        next[level.key] = [];
      });
      return next;
    });
    if (child) {
      const url = option
        ? `/select2/${child.model}/id,name/${child.parentColumn}:${option.value};status:active`
        : child.key === "region"
        ? "/select2/Hr.WorkPlaceRegion/id,name"
        : null;
      if (url) {
        Http.get(url).then((res) =>
          setOptions((prev) => ({ ...prev, [child.key]: res.data }))
        );
      } else {
        setOptions((prev) => ({ ...prev, [child.key]: [] }));
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = () => {
    const params = new URLSearchParams({ from: inputs.from, to: inputs.to });
    levels.forEach((level) => {
      if (selected[level.key]) {
        params.append(level.key + "_id", selected[level.key].value);
      }
    });
    fetchReport(params);
  };

  const cols = [
    { header: "Product", field: "product_name" },
    { header: "SKU", field: "sku" },
    { header: "Order Qty", field: "order_qty" },
    { header: "Order Value", field: "order_value" },
    { header: "IMS Qty", field: "ims_qty" },
    { header: "IMS Value", field: "ims_value" },
  ];

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Product wise sales & delivery</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                {levels.map((level) => (
                  <div className="col-lg" key={level.key}>
                    <label htmlFor="">{level.label}</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isClearable
                      value={selected[level.key]}
                      options={options[level.key]}
                      onChange={selectHandleChange(level.key)}
                    />
                  </div>
                ))}
              </div>
              <div className="row mt-4">
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg mt-4">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                    disabled={loading}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {message && !error && <p className="mt-3 mb-2">{message}</p>}
              <table className="table mb-0">
                <tbody>
                  <tr>
                    <th>Total Order Qty: {summary.total_order_qty || 0}</th>
                    <th>Total Order Value: {summary.total_order_value || 0}</th>
                    <th>Total IMS Qty: {summary.total_ims_qty || 0}</th>
                    <th>Total IMS Value: {summary.total_ims_value || 0}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <ReactDataTable
                cols={cols}
                receiveData={list}
                isLoading={loading}
                frozenColumnFields={["product_name"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductWiseSalesDeliveryReport;
