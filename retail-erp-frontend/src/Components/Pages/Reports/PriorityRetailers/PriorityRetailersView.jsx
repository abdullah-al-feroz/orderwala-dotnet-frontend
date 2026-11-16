import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Alert from "../../../Common/Alert";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";

import { Oval } from "react-loader-spinner";
import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const { id } = useParams();

  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substring(0, 10),
    to: new Date().toISOString().substring(0, 10),
  });

  /**
   * Table Columns
   */
  const cols = [
    {
      field: "owner_name",
      header: "Owner Name",
    },
    {
      field: "shop_name",
      header: "Shop Name",
    },
    {
      field: "phone",
      header: "Phone",
    },
    {
      field: "address",
      header: "Address",
    },
    {
      field: "route_name",
      header: "Route",
    },
    {
      field: (rowData) => (rowData.available_for_mdo === 1 ? "Team Orderwala" : "Orderwala"),
      header: "Variation",
    },
    {
      field: (rowData) => (rowData.sequence_number === 1 ? "Saturday" : rowData.sequence_number === 2 ? "Sunday" : rowData.sequence_number === 3 ? "Monday" : rowData.sequence_number === 4 ? "Tuesday" : rowData.sequence_number === 5 ? "Wednesday" : rowData.sequence_number === 6 ? "Thursday" : rowData.sequence_number === 7 ? "Friday" : ""),
      header: "Day",
    },

    // Week 1
    {
      field: "week_1_order",
      header: "Week 1 Order",
    },
    {
      field: "week_1_delivery",
      header: "Week 1 Delivery",
    },

    // Week 2
    {
      field: "week_2_order",
      header: "Week 2 Order",
    },
    {
      field: "week_2_delivery",
      header: "Week 2 Delivery",
    },

    // Week 3
    {
      field: "week_3_order",
      header: "Week 3 Order",
    },
    {
      field: "week_3_delivery",
      header: "Week 3 Delivery",
    },

    // Week 4
    {
      field: "week_4_order",
      header: "Week 4 Order",
    },
    {
      field: "week_4_delivery",
      header: "Week 4 Delivery",
    },

    // Week 5
    {
      field: "week_5_order",
      header: "Week 5 Order",
    },
    {
      field: "week_5_delivery",
      header: "Week 5 Delivery",
    },
  ];

  /**
   * Format API data for DataTable
   */
  const formatData = (list = []) => {
    return list.map((item) => ({
      ...item,

      route_name: item.route?.name || "",

      week_1_order: item.orders?.week_1?.order_amount || "0.00",
      week_1_delivery: item.orders?.week_1?.delivery_amount || "0.00",

      week_2_order: item.orders?.week_2?.order_amount || "0.00",
      week_2_delivery: item.orders?.week_2?.delivery_amount || "0.00",

      week_3_order: item.orders?.week_3?.order_amount || "0.00",
      week_3_delivery: item.orders?.week_3?.delivery_amount || "0.00",

      week_4_order: item.orders?.week_4?.order_amount || "0.00",
      week_4_delivery: item.orders?.week_4?.delivery_amount || "0.00",

      week_5_order: item.orders?.week_5?.order_amount || "0.00",
      week_5_delivery: item.orders?.week_5?.delivery_amount || "0.00",
    }));
  };

  /**
   * Fetch Data
   */
  const fetchData = async (fromDate = null, toDate = null) => {
    setLoading(true);

    try {
      const searchParams = new URLSearchParams(location.search);

      const params = {};

      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      if (fromDate) {
        params.from_date = fromDate;
      }

      if (toDate) {
        params.to_date = toDate;
      }

      const queryString = new URLSearchParams(params).toString();

      const url = `/app/new-report/dashboard/priority-customer/${id}${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await Http.get(url);

      const formattedData = formatData(res.data?.list || []);

      setReceiveData(formattedData);
      setCumulativeData(res.data || {});
    } catch (error) {
      console.error("Fetch error:", error);

      setAlert({
        message:
          error?.response?.data?.message ||
          "Something went wrong while fetching data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial Load
   */
  useEffect(() => {
    fetchData();
  }, [location.search, id]);

  /**
   * Handle Date Change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((values) => ({
      ...values,
      [name]: value,
    }));
  };

  /**
   * Search
   */
  const formSubmit = async () => {
    if (!inputs.from || !inputs.to) {
      setAlert({
        message: "Please select both From Date and To Date.",
        type: "warning",
      });

      return;
    }

    await fetchData(inputs.from, inputs.to);
  };

  return (
    <div>
      <IsLogin />

      <div className="am-mainpanel">
        {/* Page Title */}
        <div className="am-pagetitle">
          <h5 className="am-title">Priority Customer Report</h5>
        </div>

        {/* Filter Section */}
        <div className="am-pagebody p-2">
          <Alert alert={alert} />

          <div className="card pd-sm-40 mt-2">
            <div className="row">
              {/* From Date */}
              <div className="col-lg-4">
                <label className="form-label">
                  From Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="from"
                  value={inputs.from || ""}
                  onChange={handleChange}
                />
              </div>

              {/* To Date */}
              <div className="col-lg-4">
                <label className="form-label">
                  To Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="to"
                  value={inputs.to || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Search */}
              <div className="col-lg-4 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={formSubmit}
                  disabled={loading}
                >
                  <i className="fa fa-search mg-r-10"></i>
                  Search
                </button>
              </div>
            </div>

            {/* Summary */}
            {loading ? (
              <div
                className="mt-4"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Oval
                  height={60}
                  width={60}
                  color="#00BFFF"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </div>
            ) : (
              <div className="table-responsive mt-4">
                <table className="table table-bordered mb-0">
                  <tbody>
                    <tr>
                      <th>
                        Total Customers:
                        <span className="mg-l-5">
                          {cumulative.total_customer || 0}
                        </span>
                      </th>

                      <th>
                        Total Order Amount:
                        <span className="mg-l-5">
                          {cumulative.total_order_amount || "0.00"}
                        </span>
                      </th>

                      <th>
                        Total Delivery Amount:
                        <span className="mg-l-5">
                          {cumulative.total_delivery_amount || "0.00"}
                        </span>
                      </th>
                    </tr>

                    <tr>
                      <th colSpan="3" style={{ textAlign: "center" }}>
                        {cumulative.date || ""}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="am-pagebody p-2">
          <div className="card pd-sm-40">
            <div className="row">
              <ReactDataTable
                cols={cols}
                isLoading={loading}
                receiveData={receiveData}
                frozenColumnFields={[
                  "owner_name",
                  "shop_name",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;