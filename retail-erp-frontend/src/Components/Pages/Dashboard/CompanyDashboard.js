import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const CompanyDashboard = () => {
  const [receiveData, setReceiveData] = useState({});
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [receivePie, setReceivePie] = useState([]);

  const fetchData = async () => {
    // setLoading(true); // Set loading to true before fetching data
    try {
      const res = await Http.get("/app/report/dashboard");
      setReceiveData(res.data); // Populate data
      const pieres = await Http.get("/app/report/get-target");
      setReceivePie(pieres.data.list); // Populate pie chart data
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      // setLoading(false); // Ensure loading is false after fetch
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

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel dashboard">
        <div className="am-pagetitle">
          <h5 className="am-title">Dashboard Moo </h5>
          <form id="searchBar" className="search-bar" action="index.html">
            <div className="form-control-wrapper">
              <input
                type="search"
                className="form-control bd-0"
                placeholder="Search..."
              />
            </div>
            {/* form-control-wrapper */}
            <button id="searchBtn" className="btn btn-orange">
              <i className="fa fa-search" />
            </button>
          </form>
          {/* search-bar */}
        </div>
        {/* am-pagetitle */}
        <div className="am-pagebody">
          <div className="row row-sm">
            {/* <div className="col-lg-4">
              <Link to="/tracking-reports/attendance-reports/cdm">
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
                          Today's Attendance
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.today_attendance_given}
                      {" / "}
                      {receiveData.info?.total_team_member}
                    </h2>
                  </div>
                </div>
              </Link>
            </div> */}
            <div className="col-lg-3">
              <Link to="/tracking-reports/attendance-reports/mdo">
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
                          Today's MDO Attendance
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.today_mdo_attendance_given}
                      {" / "}
                      {receiveData.info?.total_mdo_team_member}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/tracking-reports/attendance-reports/mdc">
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
                          Today's MDC Attendance
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.today_mdc_attendance_given}
                      {" / "}
                      {receiveData.info?.total_mdc_team_member}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/tracking-reports/attendance-reports/mdm">
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
                          Today's MDM Attendance
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.today_mdm_attendance_given}
                      {" / "}
                      {receiveData.info?.total_mdm_team_member}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3">
              <Link to="/tracking-reports/attendance-reports/cdm">
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
                          Today's CDM Attendance
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
                          Orderwala Sales Amount
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
                          Orderwala Sales Qty
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
            <div className="col-lg-4">
              <Link to="/tracking-reports/mdo-sales-reports/rsm">
                <div className="card">
                  <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#8bd0db"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#17A2B8"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's Total MDO Sales Qty.
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.total_sales_qty}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/mdo-sales-reports/rsm">
                <div className="card">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#8bd0db"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#17A2B8"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's Total MDO Sales Amount
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      &#2547; {receiveData.info?.total_sales_amount}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-4">
              <Link to="/tracking-reports/mdo-created-stores-reports/rsm">
                <div className="card">
                  <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#8bd0db"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#17A2B8"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's Total MDO Shop created
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.store_create}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                  <svg width="520" height="200">
                    <g>
                      <path
                        d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                        className="area"
                        fill="#8bd0db"
                      ></path>
                      <path
                        d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                        className="line"
                        fill="none"
                        stroke="#17A2B8"
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
                    {receiveData.info?.total_shop_assigned}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/mdo-visited-area-reports/rsm">
                <div className="card">
                  <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#8bd0db"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#17A2B8"
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
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.total_shop_visit}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/dsr-delivery-reports/rsm">
                <div className="card">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#8bd0db"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#17A2B8"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Yesterday Delivered Amount
                        </h6>
                        <p className="tx-12">
                          &#2547; {receiveData.info?.date}
                        </p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.total_delivery_amount}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/ow-orders-reports/rsm">
                <div className="card">
                  <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#a5ecb5"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                          className="line"
                          fill="none"
                          stroke="#28A745"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's OrderWala Sales Qty
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.orderwala_sales_qty}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-4">
              <Link to="/tracking-reports/ow-orders-reports/rsm">
                <div className="card">
                  <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#a5ecb5"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                          className="line"
                          fill="none"
                          stroke="#28A745"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's OrderWala Sales Amount
                        </h6>
                        <p className="tx-12">
                          &#2547; {receiveData.info?.date}
                        </p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.orderwala_sales_amount}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/ow-total-verified-stores-reports/rsm">
                <div className="card">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#a5ecb5"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                          className="line"
                          fill="none"
                          stroke="#28A745"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          Today's OrderWala Verified
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.orderwala_store_verify}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="row row-sm">
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/mdo-undeliver-reports/rsm">
                <div className="card">
                  <div id="rs3" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#8bd0db"
                        ></path>
                        <path
                          d="M0,175Q45.06666666666667,163.83333333333334,52,162.5C62.4,160.5,93.6,155,104,155S145.6,163,156,162.5S197.6,148.75,208,150S249.6,173.75,260,175S301.6,162.5,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,140,468,137.5Q474.93333333333334,135.83333333333334,520,125"
                          className="line"
                          fill="none"
                          stroke="#17A2B8"
                          strokeWidth="2"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="overlay-body pd-x-20 pd-t-20">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                          MDO Undelivered
                        </h6>
                        <p className="tx-12">{receiveData.info?.date}</p>
                      </div>
                    </div>
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.mdo_undelivery_amount}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <Link to="/tracking-reports/ow-undeliver-reports/rsm">
                <div className="card">
                  <div id="rs2" className="wd-100p ht-200 rickshaw_graph">
                    <svg width="520" height="200">
                      <g>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150L520,200Q474.93333333333334,200,468,200C457.6,200,426.4,200,416,200S374.4,200,364,200S322.4,200,312,200S270.4,200,260,200S218.4,200,208,200S166.4,200,156,200S114.4,200,104,200S62.4,200,52,200Q45.06666666666667,200,0,200Z"
                          className="area"
                          fill="#a5ecb5"
                        ></path>
                        <path
                          d="M0,150Q45.06666666666667,174.16666666666666,52,175C62.4,176.25,93.6,162.5,104,162.5S145.6,175,156,175S197.6,161.25,208,162.5S249.6,187.5,260,187.5S301.6,163.75,312,162.5S353.6,176.25,364,175S405.6,153.75,416,150S457.6,137.5,468,137.5Q474.93333333333334,137.5,520,150"
                          className="line"
                          fill="none"
                          stroke="#28A745"
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
                    <h2 className="mg-b-5 tx-inverse tx-lato">
                      {receiveData.info?.orderwala_undelivery_amount}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-lg-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">
                  Target VS Achievement (Primary){" "}
                </h6>
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
                  to="/tracking-reports/target-vs-achievement"
                  className="flex-column flex-md-row justify-content-end"
                >
                  <div className="btn btn-primarybtn btn-primary disabled">
                    Details
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">
                  Target VS Achievement (Secondary)
                </h6>
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
                  to="/tracking-reports/target-vs-achievement"
                  className="flex-column flex-md-row justify-content-end"
                >
                  <div className="btn btn-primarybtn btn-primary disabled">
                    Details
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* row */}
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

export default CompanyDashboard;
