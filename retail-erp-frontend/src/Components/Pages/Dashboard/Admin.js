import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoaderComponent } from "../../Common/LoaderComponent";
import "../../../index.css";
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
import ReactDataTable from "../../Common/ReactDataTable";
import Http from "../../Common/Http";
import Swal from "sweetalert2";

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


const Admin = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({ status: "active" });
  const [outSideCompany, setOutSideCompany] = useState([]);



  const fetchData = async () => {
    try {
      const retailerOfferResponse = await Http.get("/retailer-offer");
      setReceiveData(retailerOfferResponse.data);

      const outsideCompanyResponse = await Http.get("/me");
      setOutSideCompany(outsideCompanyResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => { fetchData() }, []);


  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = getToday();

  const rowClassName = (rowData) => {
    const start = rowData.start_date;
    const end = rowData.end_date;
    const isActive = start <= today && end >= today;
    return {
      'active-row': isActive, // custom class
    };
  };

  const cols = [
    ...(outSideCompany?.data?.user_type !== "other-company"
      ? [
        { field: "region.name", header: "Region" },
        { field: "area.name", header: "Area" },
        { field: "base.name", header: "Base" },
        { field: "route.name", header: "Route" },
      ]
      : []),
    { field: "distributor.name", header: "Distributor" },
    { field: "offer_type", header: "Offer Type" },
    { field: 'title', header: "Title" },
    { field: "start_date", header: "Start Date" },
    { field: "end_date", header: "End Date" },
  ];

  const mappedData = receiveData.map((item) => ({
    ...item,
    region: item.region ? item.region : { name: "All" }, // Providing a default object with name as null if region doesn't exist
    area: item.area ? item.area : { name: "ALL" }, // Providing a default object with name as null if area doesn't exist
    base: item.base ? item.base : { name: "ALL" }, // Providing a default object with name as null if base doesn't exist
    route: item.route ? item.route : { name: "ALL" }, // Providing a default object with name as null if route doesn't exist
    distributor: item.distributor ? item.distributor : { name: "ALL" }, // Providing a default object with name as null if distributor doesn't exist
  }));

  const actionTemplate = (rowData, deleteData) => {
    return (
      <div className="text-xs text-nowrap">
        <Link
          to={{
            pathname: "/show-retailer-offer/" + rowData.id,
          }}
          className="btn btn-info btn-sm ms-1"
          title="Show"
        >
          <i className="fa fa-list ms-1" aria-hidden="true"></i>
        </Link>
      </div>
    );
  };

  const deleteData = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Dashboard</h5>
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
            <div className="col-lg-4">
              <div className="card">
                {/* <div id="rs1" className="wd-100p ht-200" /> */}
                <div id="rs1" className="wd-100p ht-200 rickshaw_graph">
                  <svg width="526" height="200">
                    <g>
                      <path
                        d="M0,150Q45.58666666666667,174.16666666666666,52.6,175C63.12,176.25,94.68,162.5,105.2,162.5S147.27999999999997,175,157.79999999999998,175S199.88,161.25,210.4,162.5S252.48000000000002,187.5,263,187.5S305.08,163.75,315.59999999999997,162.5S357.68,176.25,368.2,175S410.28000000000003,153.75,420.8,150S462.88000000000005,141.25,473.40000000000003,137.5Q480.41333333333336,135,526,112.5L526,200Q480.41333333333336,200,473.40000000000003,200C462.88000000000005,200,431.32,200,420.8,200S378.71999999999997,200,368.2,200S326.11999999999995,200,315.59999999999997,200S273.52,200,263,200S220.92000000000002,200,210.4,200S168.32,200,157.79999999999998,200S115.72,200,105.2,200S63.12,200,52.6,200Q45.58666666666667,200,0,200Z"
                        class="area"
                        fill="#fdc390"
                      ></path>
                      <path
                        d="M0,150Q45.58666666666667,174.16666666666666,52.6,175C63.12,176.25,94.68,162.5,105.2,162.5S147.27999999999997,175,157.79999999999998,175S199.88,161.25,210.4,162.5S252.48000000000002,187.5,263,187.5S305.08,163.75,315.59999999999997,162.5S357.68,176.25,368.2,175S410.28000000000003,153.75,420.8,150S462.88000000000005,141.25,473.40000000000003,137.5Q480.41333333333336,135,526,112.5"
                        class="line"
                        fill="none"
                        stroke="#FB9337"
                        stroke-width="2"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        Today's Earnings
                      </h6>
                      <p className="tx-12">November 21, 2023</p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  {/* d-flex */}
                  <h2 className="mg-b-5 tx-inverse tx-lato">12,212</h2>
                  <p className="tx-12 mg-b-0">Earnings before taxes.</p>
                </div>
              </div>
              {/* card */}
            </div>
            {/* col-4 */}
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card">
                <div id="rs2" class="wd-100p ht-200 rickshaw_graph">
                  <svg width="526" height="200">
                    <g>
                      <path
                        d="M0,175Q45.58666666666667,163.83333333333334,52.6,162.5C63.12,160.5,94.68,155,105.2,155S147.27999999999997,163,157.79999999999998,162.5S199.88,148.75,210.4,150S252.48000000000002,173.75,263,175S305.08,162.5,315.59999999999997,162.5S357.68,176.25,368.2,175S410.28000000000003,153.75,420.8,150S462.88000000000005,140,473.40000000000003,137.5Q480.41333333333336,135.83333333333334,526,125L526,200Q480.41333333333336,200,473.40000000000003,200C462.88000000000005,200,431.32,200,420.8,200S378.71999999999997,200,368.2,200S326.11999999999995,200,315.59999999999997,200S273.52,200,263,200S220.92000000000002,200,210.4,200S168.32,200,157.79999999999998,200S115.72,200,105.2,200S63.12,200,52.6,200Q45.58666666666667,200,0,200Z"
                        class="area"
                        fill="#8bd0db"
                      ></path>
                      <path
                        d="M0,175Q45.58666666666667,163.83333333333334,52.6,162.5C63.12,160.5,94.68,155,105.2,155S147.27999999999997,163,157.79999999999998,162.5S199.88,148.75,210.4,150S252.48000000000002,173.75,263,175S305.08,162.5,315.59999999999997,162.5S357.68,176.25,368.2,175S410.28000000000003,153.75,420.8,150S462.88000000000005,140,473.40000000000003,137.5Q480.41333333333336,135.83333333333334,526,125"
                        class="line"
                        fill="none"
                        stroke="#17A2B8"
                        stroke-width="2"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        This Week's Earnings
                      </h6>
                      <p className="tx-12">November 20 - 27, 2023</p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  {/* d-flex */}
                  <h2 className="mg-b-5 tx-inverse tx-lato">28,746</h2>
                  <p className="tx-12 mg-b-0">Earnings before taxes.</p>
                </div>
              </div>
              {/* card */}
            </div>
            {/* col-4 */}
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card">
                <div id="rs3" class="wd-100p ht-200 rickshaw_graph">
                  <svg width="526" height="200">
                    <g>
                      <path
                        d="M0,150Q45.58666666666667,174.16666666666666,52.6,175C63.12,176.25,94.68,162.5,105.2,162.5S147.27999999999997,175,157.79999999999998,175S199.88,161.25,210.4,162.5S252.48000000000002,187.5,263,187.5S305.08,163.75,315.59999999999997,162.5S357.68,176.25,368.2,175S410.28000000000003,153.75,420.8,150S462.88000000000005,137.5,473.40000000000003,137.5Q480.41333333333336,137.5,526,150L526,200Q480.41333333333336,200,473.40000000000003,200C462.88000000000005,200,431.32,200,420.8,200S378.71999999999997,200,368.2,200S326.11999999999995,200,315.59999999999997,200S273.52,200,263,200S220.92000000000002,200,210.4,200S168.32,200,157.79999999999998,200S115.72,200,105.2,200S63.12,200,52.6,200Q45.58666666666667,200,0,200Z"
                        class="area"
                        fill="#a5ecb5"
                      ></path>
                      <path
                        d="M0,150Q45.58666666666667,174.16666666666666,52.6,175C63.12,176.25,94.68,162.5,105.2,162.5S147.27999999999997,175,157.79999999999998,175S199.88,161.25,210.4,162.5S252.48000000000002,187.5,263,187.5S305.08,163.75,315.59999999999997,162.5S357.68,176.25,368.2,175S410.28000000000003,153.75,420.8,150S462.88000000000005,137.5,473.40000000000003,137.5Q480.41333333333336,137.5,526,150"
                        class="line"
                        fill="none"
                        stroke="#28A745"
                        stroke-width="2"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="overlay-body pd-x-20 pd-t-20">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-5">
                        This Month's Earnings
                      </h6>
                      <p className="tx-12">November 1 - 30, 2023</p>
                    </div>
                    <a className="tx-gray-600 hover-info">
                      <i className="icon ion-more tx-16 lh-0" />
                    </a>
                  </div>
                  {/* d-flex */}
                  <h2 className="mg-b-5 tx-inverse tx-lato">72,118</h2>
                  <p className="tx-12 mg-b-0">Earnings before taxes.</p>
                </div>
              </div>
              {/* card */}
            </div>
            {/* col-4 */}
          </div>
          {/* row */}
          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-md-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Bar Chart</h6>
                <ResponsiveContainer width="100%" height={400}>
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
          </div>

          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-md-6">
              <div className="card pd-20 pd-sm-40">
                <h6 className="card-body-title">Bar Chart</h6>
                <ResponsiveContainer width="100%" height={400}>
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
          {/* row */}
          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header bg-transparent pd-20">
                  <h6 className="card-title tx-uppercase tx-12 mg-b-0">
                    User Transaction History
                  </h6>
                </div>
                {/* card-header */}
                <div className="table-responsive">
                  <table className="table table-white mg-b-0 tx-12">
                    <tbody>
                      <tr>
                        <td className="pd-l-20 tx-center">
                          <img
                            src="../../assets/img/default_user.png"
                            className="wd-36 rounded-circle"
                            alt="national-museum"
                          />
                        </td>
                        <td>
                          <a className="tx-inverse tx-14 tx-medium d-block">
                            Mark K. Peters
                          </a>
                          <span className="tx-11 d-block">
                            TRANSID: 1234567890
                          </span>
                        </td>
                        <td className="tx-12">
                          <span className="square-8 bg-success mg-r-5 rounded-circle" />{" "}
                          Email verified
                        </td>
                        <td>Just Now</td>
                      </tr>
                      <tr>
                        <td className="pd-l-20 tx-center">
                          <img
                            src="../../assets/img/default_user.png"
                            className="wd-36 rounded-circle"
                            alt="national-museum"
                          />
                        </td>
                        <td>
                          <a className="tx-inverse tx-14 tx-medium d-block">
                            Karmen F. Brown
                          </a>
                          <span className="tx-11 d-block">
                            TRANSID: 1234567890
                          </span>
                        </td>
                        <td className="tx-12">
                          <span className="square-8 bg-warning mg-r-5 rounded-circle" />{" "}
                          Pending verification
                        </td>
                        <td>Apr 21, 2023 8:34am</td>
                      </tr>
                      <tr>
                        <td className="pd-l-20 tx-center">
                          <img
                            src="../../assets/img/default_user.png"
                            className="wd-36 rounded-circle"
                            alt="national-museum"
                          />
                        </td>
                        <td>
                          <a className="tx-inverse tx-14 tx-medium d-block">
                            Gorgonio Magalpok
                          </a>
                          <span className="tx-11 d-block">
                            TRANSID: 1234567890
                          </span>
                        </td>
                        <td className="tx-12">
                          <span className="square-8 bg-success mg-r-5 rounded-circle" />{" "}
                          Purchased success
                        </td>
                        <td>Apr 10, 2023 4:40pm</td>
                      </tr>
                      <tr>
                        <td className="pd-l-20 tx-center">
                          <img
                            src="../../assets/img/default_user.png"
                            className="wd-36 rounded-circle"
                            alt="national-museum"
                          />
                        </td>
                        <td>
                          <a className="tx-inverse tx-14 tx-medium d-block">
                            Ariel T. Hall
                          </a>
                          <span className="tx-11 d-block">
                            TRANSID: 1234567890
                          </span>
                        </td>
                        <td className="tx-12">
                          <span className="square-8 bg-warning mg-r-5 rounded-circle" />{" "}
                          Payment on hold
                        </td>
                        <td>Apr 02, 2023 6:45pm</td>
                      </tr>
                      <tr>
                        <td className="pd-l-20 tx-center">
                          <img
                            src="../../assets/img/default_user.png"
                            className="wd-36 rounded-circle"
                            alt="national-museum"
                          />
                        </td>
                        <td>
                          <a className="tx-inverse tx-14 tx-medium d-block">
                            John L. Goulette
                          </a>
                          <span className="tx-11 d-block">
                            TRANSID: 1234567890
                          </span>
                        </td>
                        <td className="tx-12">
                          <span className="square-8 bg-pink mg-r-5 rounded-circle" />{" "}
                          Account deactivated
                        </td>
                        <td>Mar 30, 2023 10:30am</td>
                      </tr>
                      <tr>
                        <td className="pd-l-20 tx-center">
                          <img
                            src="../../assets/img/default_user.png"
                            className="wd-36 rounded-circle"
                            alt="national-museum"
                          />
                        </td>
                        <td>
                          <a className="tx-inverse tx-14 tx-medium d-block">
                            John L. Goulette
                          </a>
                          <span className="tx-11 d-block">
                            TRANSID: 1234567890
                          </span>
                        </td>
                        <td className="tx-12">
                          <span className="square-8 bg-pink mg-r-5 rounded-circle" />{" "}
                          Account deactivated
                        </td>
                        <td>Mar 30, 2023 10:30am</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* table-responsive */}
                <div className="card-footer tx-12 pd-y-15 bg-transparent bd-t bd-gray-200">
                  <a>
                    <i className="fa fa-angle-down mg-r-5" />
                    View All Transaction History
                  </a>
                </div>
                {/* card-footer */}
              </div>
              {/* card */}
            </div>
            {/* col-8 */}
            <div className="col-lg-4 mg-t-15 mg-sm-t-20 mg-lg-t-0">
              <div className="card pd-20">
                <h6 className="tx-12 tx-uppercase tx-inverse tx-bold mg-b-15">
                  Sales Report
                </h6>
                <div className="d-flex mg-b-10">
                  <div className="bd-r pd-r-10">
                    <label className="tx-12">Today</label>
                    <p className="tx-lato tx-inverse tx-bold">1,898</p>
                  </div>
                  <div className="bd-r pd-x-10">
                    <label className="tx-12">This Week</label>
                    <p className="tx-lato tx-inverse tx-bold">32,112</p>
                  </div>
                  <div className="pd-l-10">
                    <label className="tx-12">This Month</label>
                    <p className="tx-lato tx-inverse tx-bold">72,067</p>
                  </div>
                </div>
                {/* d-flex */}
                <div className="progress mg-b-10">
                  <div
                    className="progress-bar wd-50p"
                    role="progressbar"
                    aria-valuenow={50}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    50%
                  </div>
                </div>
                <p className="tx-12 mg-b-0">
                  Maecenas tempus, tellus eget condimentum rhoncus
                </p>
              </div>
              {/* card */}
              <ul className="list-group widget-list-group bg-info mg-t-20">
                <li className="list-group-item rounded-top-0">
                  <p className="mg-b-0">
                    <i className="fa fa-cube tx-white-7 mg-r-8" />
                    <strong className="tx-medium">
                      Retina: 13.3-inch
                    </strong>{" "}
                    <span className="text-muted">Display</span>
                  </p>
                </li>
                <li className="list-group-item">
                  <p className="mg-b-0">
                    <i className="fa fa-cube tx-white-7 mg-r-8" />
                    <strong className="tx-medium">
                      Intel Iris Graphics 6100
                    </strong>{" "}
                    <span className="text-muted">Graphics</span>
                  </p>
                </li>
                <li className="list-group-item">
                  <p className="mg-b-0">
                    <i className="fa fa-cube tx-white-7 mg-r-8" />
                    <strong className="tx-medium">500 GB</strong>{" "}
                    <span className="text-muted">Flash Storage</span>
                  </p>
                </li>
                <li className="list-group-item">
                  <p className="mg-b-0">
                    <i className="fa fa-cube tx-white-7 mg-r-8" />
                    <strong className="tx-medium">
                      3.1 GHz Intel Core i7
                    </strong>{" "}
                    <span className="text-muted">Processor</span>
                  </p>
                </li>
                <li className="list-group-item rounded-bottom-0">
                  <p className="mg-b-0">
                    <i className="fa fa-cube tx-white-7 mg-r-8" />
                    <strong className="tx-tx-medium">
                      16 GB 1867 MHz DDR3
                    </strong>{" "}
                    <span className="text-muted">Memory</span>
                  </p>
                </li>
              </ul>
            </div>
            {/* col-4 */}
            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={mappedData}
                rowClass={true}
                // imageBodyTemplate={imageBodyTemplate}
                actionTemplate={actionTemplate}
                deleteData={deleteData}
              />
              {/* <Column <Tag className="mr-2" icon="pi pi-user" value="Active"></Tag> /> */}
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

export default Admin;
