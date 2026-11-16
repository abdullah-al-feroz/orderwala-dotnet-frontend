import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderComponent } from "../../Common/LoaderComponent";
import {
  // For Graph Chart
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

  // For Pie Chart
  PieChart,
  Pie,
  Cell,

  // For Bar Chart
  BarChart,
  Bar,

  // Area Chart
  AreaChart,
  Area,

  // ComposedChart,
  ComposedChart,
} from "recharts";

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

const DistributorDashboard = () => {
  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Distributor Dashboard</h5>
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
          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-md-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Bar Chart</h6>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* card */}
            </div>
            <div className="col-md-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Bar Chart</h6>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => entry.name}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-md-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Bar Chart</h6>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart width={500} height={400} data={barChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* card */}
            </div>
            <div className="col-md-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Bar Chart</h6>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    width={500}
                    height={400}
                    data={areaChart}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="pv"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                    <Area
                      type="monotone"
                      dataKey="amt"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-md-12">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Compossed Chart</h6>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart
                    width={500}
                    height={400}
                    data={ComposedChartData}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Area
                      type="monotone"
                      dataKey="amt"
                      fill="#8884d8"
                      stroke="#8884d8"
                    />
                    <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              {/* card */}
            </div>
          </div>
          <div className="row row-sm mt-3">
            <div className="col-lg-3">
              <div className="card">
                <div id="rs1" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Total Stock
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">12,212</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card">
                <div id="rs2" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Total Purchase
                      </h6>
                      <p className="tx-12  pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">28,746</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Retailer Order
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card">
                <div id="rs1" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Retailer Delivery
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">12,212</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs2" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Today's Retailer Order
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">28,746</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Today's Retailer Delivery
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Today's Retailer Return
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Transfer to Depot
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs2" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Active SO
                      </h6>
                      <p className="tx-12">November 20 - 27, 2023</p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">28,746</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Active DSR
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Active Retailer
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Unverified Retailer
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>

            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs2" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Total commission
                      </h6>
                      <p className="tx-12">November 20 - 27, 2023</p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">28,746</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mg-t-15 mg-sm-t-20 mg-lg-t-20">
              <div className="card">
                <div id="rs3" className="wd-100p ht-200" />
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Commission Received
                      </h6>
                      <p className="tx-12 pb-3"></p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default DistributorDashboard;
