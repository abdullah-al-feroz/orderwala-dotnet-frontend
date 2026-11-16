import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  Cell,
  Legend,
  Pie,
  // For Pie Chart
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Http from "../../Common/Http";

// Example data
const data = [
  { name: "Week 1", earnings: 4000 },
  { name: "Week 2", earnings: 3000 },
  { name: "Week 3", earnings: 2000 },
  { name: "Week 4", earnings: 2780 },
  { name: "Week 5", earnings: 1890 },
];

// Example data
const pieChart = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const barChart = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const donutChart = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

// Area Chart
// Sample data
const areaChart = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const ComposedChartData = [
  {
    name: "Page A",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Page B",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: "Page C",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Page D",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: "Page E",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Page F",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
];

// Example colors for each slice
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MooDashboard = () => {
  const [receiveData, setReceiveData] = useState({});
  const [primarySaleData, setPrimarySaleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [topSectionLoading, setTopSectionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receivePie, setReceivePie] = useState([]);
  const [me, setMe] = useState([]);
  const [channel, setChannel] = useState([]);
  const [inputs, setInputs] = useState({});

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const res = await Http.get("/app/report/dashboard");
      setReceiveData(res.data);
      // const res = await Http.get("/moo-panel/dashboard/top-section");
      // setReceiveData(res.data);

      const me = await Http.get("/me");
      setMe(me.data.data); // Populate data

      setChannel(res.data.info.channel);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Ensure loading is false after fetch

      const pieres = await Http.get("/app/report/get-target");
      setReceivePie(pieres.data.list); // Populate pie chart data

      const primarySalesRes = await Http.get(
        "/app/report/primarySaleDashboardPrimarySaleReport"
      );
      setPrimarySaleData(primarySalesRes.data);
    }
  };

  const pieChart1 = [
    { name: "Target", value: parseInt(receivePie.primary_total_target) },
    {
      name: "Achievement",
      value: parseInt(receivePie.primary_total_achivement),
    },
  ];
  const pieChart2 = [
    { name: "Target", value: parseInt(receivePie.secondary_total_target) },
    {
      name: "Achievement",
      value: parseInt(receivePie.secondary_total_achivement),
    },
  ];

  // Example colors for each slice
  const COLORS1 = ["#0088FE", "#00C49F"];
  const COLORS2 = ["#FFBB28", "#FF8042"];

  useEffect(() => {
    fetchData();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setLoading(true);
    try {
      const res = await Http.get("/app/report/dashboard?team=" + value);
      setReceiveData(res.data); // Populate data
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Ensure loading is false after fetch
      const pieres = await Http.get("/app/report/get-target?team=" + value);
      setReceivePie(pieres.data.list); // Populate pie chart data
    }
  };
  const dateHandleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setLoading(true);
    try {
      const res = await Http.get(
        "/app/report/dashboard?team=" + inputs.team + "&date=" + value
      );
      setReceiveData(res.data); // Populate data
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Ensure loading is false after fetch
      const pieres = await Http.get("/app/report/get-target?team=" + value);
      setReceivePie(pieres.data.list); // Populate pie chart data
    }
  };

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel dashboard">
        <div className="am-pagetitle">
          {me.user_type == "moo" ? (
            <>
              <h5 className="am-title">Dashboard Moo</h5>
              <div id="searchBar" className="search-bar">
                <div className="form-control-wrapper">
                  <input
                    type="date"
                    className="form-control"
                    onChange={dateHandleChange}
                    name="date"
                  />
                </div>
                <div className="form-control-wrapper">
                  {/* <select
                    name="team"
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option value="">All Team Data</option>
                    <option value={1}>Team Noor</option>
                    <option value={2}>Team Noor Alam Siddique</option>
                    <option value={3}>Team Mazhar</option>
                  </select> */}
                  <select
                    name="team"
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option value="">All Cluster Head Data</option>
                    {channel.map((item) => (
                      <option
                        key={item.assign_person_id}
                        value={item.assign_person_id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <h5 className="am-title">Dashboard Of {me?.name}</h5>
          )}

          {/* search-bar */}
        </div>
        {/* am-pagetitle */}
        <div className="am-pagebody">
          {/* {loading ? (
            <div className="row row-sm">
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div className="col-lg-12">
                  <div className="card">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : ( */}
          <>
            <div className="row row-sm">
              <div className="col-lg-4">
                <Link
                  to={`/tracking-reports/attendance-reports/mdo?team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Today's MDO Attendance
                          </h6>
                          <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Trainee:{" "}
                                {receiveData.info?.total_mdo_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_mdo_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_mdo_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.today_mdo_attendance_given}
                            {" / "}
                            {receiveData.info?.total_mdo_team_member}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4">
                <Link
                  to={`/tracking-reports/attendance-reports/mdc?team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Today's Supervison Area Attendance
                          </h6>

                          <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Trainee:{" "}
                                {receiveData.info?.total_mdc_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_mdc_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_mdc_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.today_mdc_attendance_given}
                            {" / "}
                            {receiveData.info?.total_mdc_team_member}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              {/* <div className="col-lg-3">
                <Link
                  to={`/tracking-reports/attendance-reports/mdm?team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Today's Coordination Area Attendance
                          </h6>

                          <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1 text-right">
                                Trainee:{" "}
                                {receiveData.info?.total_mdm_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_mdm_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1 text-right">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_mdm_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.today_mdm_attendance_given}
                            {" / "}
                            {receiveData.info?.total_mdm_team_member}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div> */}
              <div className="col-lg-4">
                <Link
                  to={`/tracking-reports/attendance-reports/cdm?team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Today's Coordination Area Attendance
                          </h6>

                          <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-6 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1 text-right">
                                Trainee:{" "}
                                {receiveData.info?.total_cdm_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_cdm_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1 text-right">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_cdm_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.today_cdm_attendance_given}
                            {" / "}
                            {receiveData.info?.total_cdm_team_member}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              {/* <div className="col-lg-4">
                <Link
                  to={`/tracking-reports/attendance-reports/hmo?team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Today's Bengal In Charge Attendance
                          </h6>

                          <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1 text-right">
                                Trainee:{" "}
                                {receiveData.info?.total_hmo_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_hmo_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1 text-right">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_hmo_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.today_hmo_attendance_given}
                            {" / "}
                            {receiveData.info?.total_hmo_team_member}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div> */}

              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <div className="card dashboardCard">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#fdc390"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                          className="line"
                          fill="none"
                          stroke="#FB9337"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div
                    className="overlay-body pd-x-20 pd-t-20"
                    role="region"
                    aria-live="polite"
                    aria-busy={loading}
                    aria-label="Team Orderwala Yesterday IMS metrics"
                  >
                    <div className="d-flex justify-content-center pd-t-5">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                          Team Orderwala Yesterday IMS
                        </h6>
                      </div>
                    </div>

                    {loading ? (
                      <>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          role="status"
                          aria-label="Loading Team Orderwala Yesterday IMS"
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
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="tx-inverse tx-lato  pd-t-5"
                            aria-label={`Team delivery amount ${
                              receiveData.info?.total_delivery_amount ?? ""
                            }`}
                          >
                            {receiveData.info?.total_delivery_amount}
                          </h6>
                        </div>
                        <div className="d-flex justify-content-center pd-t-5">
                          <div>
                            <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                              Orderwala Yesterday IMS
                            </h6>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="tx-inverse tx-lato pd-t-5"
                            aria-label={`Orderwala yesterday delivery amount ${
                              receiveData.info
                                ?.yesterday_orderwala_delivery_amount ?? ""
                            }`}
                          >
                            {
                              receiveData.info
                                ?.yesterday_orderwala_delivery_amount
                            }
                          </h6>
                        </div>
                        <div className="d-flex justify-content-center pd-t-5">
                          <div>
                            <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                              Yesterday Total IMS
                            </h6>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="tx-inverse tx-lato pd-t-5"
                            aria-label="Yesterday total IMS"
                          >
                            {
                              receiveData.info
                                ?.yesterday_total_ims_orderwala_and_team_orderwala
                            }
                          </h6>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <div className="card dashboardCard">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#fdc390"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                          className="line"
                          fill="none"
                          stroke="#FB9337"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div
                    className="overlay-body pd-x-20 pd-t-10"
                    role="region"
                    aria-live="polite"
                    aria-busy={loading}
                    aria-label="Monthly Team Orderwala IMS metrics"
                  >
                    <div className="d-flex justify-content-center">
                      <div>
                        <p
                          style={{
                            color: "#c0392b",
                            textAlign: "center",
                            marginBottom: "5px",
                          }}
                        >
                          Order - ({receiveData.info?.ims_business_months})
                        </p>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1 text-center">
                          Monthly Team Orderwala IMS
                        </h6>
                      </div>
                    </div>

                    {loading ? (
                      <>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          role="status"
                          aria-label="Loading Monthly Team Orderwala IMS"
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
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="tx-inverse tx-lato pd-t-5"
                            aria-label={`Monthly team Orderwala IMS ${
                              receiveData.info
                                ?.total_monthly_team_orderwala_delivery_amount ??
                              ""
                            }`}
                          >
                            {
                              receiveData.info
                                ?.total_monthly_team_orderwala_delivery_amount
                            }
                          </h6>
                        </div>
                        <div className="d-flex justify-content-center pd-t-5">
                          <div>
                            <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                              Monthly Orderwala IMS
                            </h6>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="tx-inverse tx-lato pd-t-5"
                            aria-label={`Monthly Orderwala IMS ${
                              receiveData.info
                                ?.total_monthly_orderwala_delivery_amount ?? ""
                            }`}
                          >
                            {
                              receiveData.info
                                ?.total_monthly_orderwala_delivery_amount
                            }
                          </h6>
                        </div>

                        <div className="d-flex justify-content-center pd-t-5">
                          <div>
                            <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                              Monthly Total IMS
                            </h6>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="tx-inverse tx-lato pd-t-5"
                            aria-label="Monthly total IMS"
                          >
                            {receiveData.info?.total_monthly_delivery_amount}
                          </h6>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <div className="card dashboardCard">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#fdc390"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                          className="line"
                          fill="none"
                          stroke="#FB9337"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div
                    className="overlay-body pd-x-20 pd-t-10"
                    role="region"
                    aria-live="polite"
                    aria-busy={loading}
                    aria-label="Primary sales metrics"
                  >
                    <div className="d-flex justify-content-center">
                      <div>
                        <p
                          style={{
                            color: "#c0392b",
                            textAlign: "center",
                            marginBottom: "5px",
                          }}
                        >
                          Order - (
                          {receiveData.info?.primary_sales_business_months})
                        </p>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1 text-center">
                          Today Primary Sales Amount
                        </h6>
                      </div>
                    </div>

                    {loading ? (
                      <>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          role="status"
                          aria-label="Loading primary sales amounts"
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
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="mg-b-5 tx-inverse tx-lato mt-2"
                            aria-label={`Today primary sales amount ${
                              primarySaleData?.todayData ?? ""
                            }`}
                          >
                            {primarySaleData?.todayData}
                          </h6>
                        </div>
                        {/* <div className="d-flex justify-content-center">
                          <div>
                            <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                              Last 7 Days Primary Sales Amount
                            </h6>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="mg-b-5 tx-inverse tx-lato mt-2"
                            aria-label={`Last 7 days primary sales amount ${
                              primarySaleData?.weeklyData ?? ""
                            }`}
                          >
                            {primarySaleData?.weeklyData}
                          </h6>
                        </div> */}
                        <div className="d-flex justify-content-center pd-t-5">
                          <div>
                            <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                              Monthly Primary Sales Amount
                            </h6>
                          </div>
                        </div>
                        <div
                          className=""
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <h6
                            className="pd-t-5 tx-inverse tx-lato"
                            aria-label={`Monthly running primary sales amount ${
                              primarySaleData?.monthlyData ?? ""
                            }`}
                          >
                            {primarySaleData?.monthlyData}
                          </h6>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <br />
            <h3
              className="text-center card"
              style={{ background: "#dedeed", color: "#2a2962" }}
            >
              Team Orderwala
            </h3>
            <div className="row row-sm">
              <div className="col-lg-3">
                <Link
                  // to={`/tracking-reports/mdo-sales-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=mdo-order-reports&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=mdo-order-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's Total Memo Qty
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2 className="mg-b-5 tx-inverse tx-lato">
                        <h2
                          className="mg-b-5 tx-inverse tx-lato"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {loading ? (
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
                          ) : (
                            <>{receiveData.info?.total_sales_qty}</>
                          )}
                        </h2>
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/tracking-reports/mdo-sales-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=mdo-order-reports&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=mdo-order-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's Total Memo Amount
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2 className="mg-b-5 tx-inverse tx-lato">
                        <h2
                          className="mg-b-5 tx-inverse tx-lato"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {loading ? (
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
                          ) : (
                            <>{receiveData.info?.total_sales_amount}</>
                          )}
                        </h2>
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link
                  // to={`/tracking-reports/mdo-created-stores-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=mdo-store-created&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=mdo-store-created&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's Total MDO Shop Registered
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2 className="mg-b-5 tx-inverse tx-lato">
                        <h2
                          className="mg-b-5 tx-inverse tx-lato"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {loading ? (
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
                          ) : (
                            <>{receiveData.info?.store_create}</>
                          )}
                        </h2>
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <div className="card dashboardCard">
                  <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#2a2962"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#E4231B"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's Total Assigned Store
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.total_shop_assigned}</>
                        )}
                      </h2>
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row row-sm">
              <div className="col-lg-3">
                <Link to="/tracking-reports/attendance-reports/cdm?orderwala_verified=1">
                  <div className="card">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Orderwala Verified
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2 className="mg-b-5 tx-inverse tx-lato">
                        {receiveData.info?.today_cdm_attendance_given}
                        {" / "}
                        {receiveData.info?.total_cdm_team_member}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link to="/tracking-reports/attendance-reports/cdm?orderwala_sales_amount=1">
                  <div className="card">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Orderwala Memo Amount
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2 className="mg-b-5 tx-inverse tx-lato">
                        {receiveData.info?.today_cdm_attendance_given}
                        {" / "}
                        {receiveData.info?.total_cdm_team_member}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link to="/tracking-reports/attendance-reports/cdm?orderwala_sales_qty=1">
                  <div className="card">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#fdc390"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#FB9337"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Orderwala Memo Qty
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2 className="mg-b-5 tx-inverse tx-lato">
                        {receiveData.info?.today_cdm_attendance_given}
                        {" / "}
                        {receiveData.info?.total_cdm_team_member}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            </div> */}
            <div className="row row-sm">
              {/* <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  to={`/tracking-reports/mdo-visited-area-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=mdo-visited-area-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's Total Visited Store
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.total_shop_visit}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div> */}
              <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/reports/field?type=mdo-visited-shop&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=mdo-visited-shop&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's Total Visited Store
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.total_shop_visit}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/reports/field?type=team-orderwala-yesterday-delivered-report&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=team-orderwala-yesterday-delivered-report&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-1">
                            Yesterday Delivered Amount
                          </h6>
                          <p className="tx-12 noMargin">
                            {receiveData.info?.date} <br /> (
                            {receiveData.info?.before_yesterday_date}:Order
                            amount {receiveData.info?.total_order_amount})
                          </p>
                        </div>
                      </div>

                      {loading ? (
                        <>
                          <div
                            className=""
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
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            className=""
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* <h2
                              className="mg-b-5 tx-inverse tx-lato mg-r-6"
                              style={{
                                borderRight: "1px solid #000000",
                                marginRight: "20px",
                                paddingRight: "20px",
                              }}
                            >
                              <p className="tx-12">Order Amount</p>
                              {receiveData.info?.total_order_amount}
                            </h2> */}
                            <h2 className="mg-b-5 tx-inverse tx-lato">
                              {/* <p className="tx-12">Delivery Amount</p> */}
                              {receiveData.info?.total_delivery_amount}
                            </h2>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                {/* <Link
                  to={`/tracking-reports/mdo-undeliver-reports/rsm?team=${inputs.team}`}
                > */}
                <Link
                  // to={`/reports/field?type=mdo-undeliver-reports&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=mdo-undeliver-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#2a2962"
                          ></path>
                          <path
                            d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                            className="line"
                            fill="none"
                            stroke="#E4231B"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            MDO Undelivery Order Amount
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>

                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.mdo_undelivery_amount}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <br />
            <h3
              className="text-center card"
              style={{ background: "rgb(242 221 228)", color: "#2a2962" }}
            >
              Orderwala
            </h3>
            <div className="row row-sm">
              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/tracking-reports/ow-orders-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=ow-order-reports&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=ow-order-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>

                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's OrderWala Memo Qty
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.orderwala_sales_qty}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4">
                <Link
                  // to={`/tracking-reports/ow-orders-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=ow-order-reports&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=ow-order-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's OrderWala Memo Amount
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.orderwala_sales_amount}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/tracking-reports/ow-total-verified-stores-reports/rsm?team=${inputs.team}`}
                  // to={`/reports/field?type=ow-store-verify&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=ow-store-verify&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Today's OrderWala Registered
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.orderwala_store_verify}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/reports/field?type=ow-undeliver-reports&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=ow-undeliver-reports&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Orderwala Undelivery Order Amount
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.orderwala_undelivery_amount}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              {/* <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  to={`/reports/previous-day-order-report/rsm?team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Orderwala Yesterday Delivered Amount
                          </h6>
                          {receiveData.info?.date} <br /> (
                          {receiveData.info?.yesterday_date}: Order amount{" "}
                          {
                            receiveData.info
                              ?.yesterday_orderwala_delivery_amount
                          }
                          )
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {
                              receiveData.info
                                ?.yesterday_orderwala_delivery_amount
                            }
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div> */}
              <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  // to={`/reports/field?type=ow-yesrerday-delivered-amount&userType=hmo&team=${inputs.team}`}
                  to={`/reports/field?type=ow-yesrerday-delivered-amount&userType=cdm&team=${inputs.team}`}
                >
                  <div className="card dashboardCard">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            Orderwala Yesterday Delivered Amount
                          </h6>
                          Yesterday - {receiveData.info?.yesterday_date}
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {
                              receiveData.info
                                ?.yesterday_orderwala_delivery_amount
                            }
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <h3
              className="text-center card"
              style={{
                background: "rgb(222, 237, 227);",
                color: "rgb(45, 98, 41)",
              }}
            >
              Brand Promoter
            </h3>
            <div className="row row-sm">
              <div className="col-lg-3">
                <Link to={`/tracking-reports/attendance-reports/bp`}>
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#DEEDE3"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#DEEDE3"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div className="col-12">
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Today's BP Attendance
                          </h6>
                          <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-end">
                              <p className="tx-12 mb-1">
                                Active:{" "}
                                {receiveData.info?.total_active_bp_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.today_bp_attendance_given}
                            {" / "}
                            {receiveData.info?.$total_bp_team_member}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link to={`/survey-report-pagination`}>
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#DEEDE3"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#DEEDE3"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-center">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Total Survey
                          </h6>

                          {/* <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Trainee:{" "}
                                {receiveData.info?.total_mdc_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_mdc_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_mdc_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <h2
                        className="mg-b-4 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                          marginTop: "38px",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.surveyCount}
                            {/* {" / "} */}
                            {/* {receiveData.info?.total_mdc_team_member} */}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link to={`/fake-customer-report`}>
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#DEEDE3"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#DEEDE3"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-center">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Fake Customer
                          </h6>

                          {/* <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Trainee:{" "}
                                {receiveData.info?.total_mdc_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_mdc_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_mdc_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <h2
                        className="mg-b-4 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                          marginTop: "38px",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.fake_customer}
                            {/* {" / "}
                            {receiveData.info?.total_mdc_team_member} */}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3">
                <Link to={`/bp-tracking-report`}>
                  <div className="card dashboardCard">
                    <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#DEEDE3"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,141.25,468,137.5Q474.93333333333334,135,520,112.5"
                            className="line"
                            fill="none"
                            stroke="#DEEDE3"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-center">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5 text-center">
                            Category wise order
                          </h6>

                          {/* <div className="row mt-4">
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-0">
                                Date: {receiveData.info?.date || "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Trainee:{" "}
                                {receiveData.info?.total_mdc_trainee_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0">
                              <p className="tx-12 mb-1">
                                Vacant:{" "}
                                {receiveData.info?.total_mdc_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="col-6 p-0 text-right">
                              <p className="tx-12 mb-1">
                                Active:{" "}
                                {receiveData.info
                                  ?.total_mdc_without_trainee_and_vacant_member ||
                                  "N/A"}
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <h2
                        className="mg-b-4 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "30%",
                          marginTop: "38px",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>
                            {receiveData.info?.totalMin4CatOrder}
                            {/* {" / "} */}
                            {/* {receiveData.info?.total_mdc_team_member} */}
                          </>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="row row-sm">
              {/* <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
                <Link
                  to={`/tracking-reports/ow-undeliver-reports/rsm?team=${inputs.team}`}
                >
                  <div className="card">
                    <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                      <svg width="520" height="200">
                        <g>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                            className="area"
                            fill="#f93074"
                          ></path>
                          <path
                            d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                            className="line"
                            fill="none"
                            stroke="#1B91DA"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div className="overlay-body pd-x-20 pd-t-20">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                            OW Undelivered
                          </h6>
                          <p className="tx-12">{receiveData.info?.date}</p>
                        </div>
                      </div>
                      <h2
                        className="mg-b-5 tx-inverse tx-lato"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
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
                        ) : (
                          <>{receiveData.info?.orderwala_undelivery_amount}</>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div> */}
            </div>
            <div className="row row-sm mg-t-15 mg-sm-t-20">
              <div className="col-lg-6">
                <div className="card pd-20 pd-sm-40">
                  <h6 className="card-body-title">
                    Target VS Achievement (Primary){" "}
                  </h6>

                  {loading ? (
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
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={pieChart1}
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            fill="#8884d8"
                            dataKey="value"
                            label={(entry) => entry.name}
                          >
                            {pieChart1.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS1[index % COLORS1.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>

                      <Link
                        to={`/tracking-reports/target-vs-achievement?team=${inputs.team}`}
                        className="flex-column flex-md-row justify-content-end"
                      >
                        <div className="btn btn-primarybtn btn-primary disabled">
                          Details
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card pd-20 pd-sm-40">
                  <h6 className="card-body-title">
                    Target VS Achievement (Secondary)
                  </h6>
                  {loading ? (
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
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={pieChart2}
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            fill="#8884d8"
                            dataKey="value"
                            label={(entry) => entry.name}
                          >
                            {pieChart2.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS2[index % COLORS2.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <Link
                        to={`/tracking-reports/target-vs-achievement?team=${inputs.team}`}
                        className="flex-column flex-md-row justify-content-end"
                      >
                        <div className="btn btn-primarybtn btn-primary disabled">
                          Details
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
          {/* )} */}
        </div>
        {/* am-pagebody */}
        <div className="am-footer">
          <span>
            Copyright ©. All Rights Reserved.{" "}
            <a href="http://limerickbd.com/">Limerick Resources Limited</a>
          </span>
        </div>
        {/* am-footer */}
      </div>
      ;
    </div>
  );
};

export default MooDashboard;
