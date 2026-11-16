import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,

  // For Pie Chart
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

//New Data table Code Start
// import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const PieChartReport = () => {
  // const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  // const [alert, setAlert] = useState(null);
  // const [role, setRole] = useState(null);
  // //   const [inputs, setInputs] = useState({});
  // const [staff, setStaff] = useState({});
  const [region, setRegion] = useState({});
  const [area, setArea] = useState({});
  const [base, setBase] = useState({});
  const { id } = useParams();
  const [inputs, setInputs] = useState({
    date: new Date().toISOString().substr(0, 10),
    // to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = () => {
    Http.get("/app/report/get-target").then((res) => {
      // console.log(res.data.list);
      setReceiveData(res.data.list);
    });
    Http.get("/region").then((res) => {
      setRegion(res.data);
    });

    // Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
    //   (res) => {
    //     setStaff(res.data);
    //   }
    // );
    // Http.get("/staff-type-check").then((res) => {
    //   setRole(res.data);
    // });
  };

  const areaRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    Http.get("/region-wise-area/" + value).then((res) => {
      setArea(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };
  // console.log(inputs)

  // Base Load Region Change Wise
  const baseRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    Http.get("/area-wise-base/" + value).then((res) => {
      setBase(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    // DatatableFunc();
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const pieChart1 = [
    { name: "Target", value: parseInt(receiveData.primary_total_target) },
    {
      name: "Achievement",
      value: parseInt(receiveData.primary_total_achivement),
    },
  ];
  const pieChart2 = [
    { name: "Target", value: parseInt(receiveData.secondary_total_target) },
    {
      name: "Achievement",
      value: parseInt(receiveData.secondary_total_achivement),
    },
  ];

  // Example colors for each slice
  const COLORS1 = ["#0088FE", "#00C49F"];
  const COLORS2 = ["#FFBB28", "#FF8042"];

  const formSubmit = () => {
    Http.get(
      "/app/report/get-target?date=" +
        inputs.date +
        "&region_id=" +
        inputs.work_place_region_id +
        "&area_id=" +
        inputs.work_place_area_id +
        "&base_id=" +
        inputs.work_place_base_id
    ).then((res) => {
      setReceiveData(res.data.list);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Target VS Achievement</h5>
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
        <div className="card pd-sm-40">
          {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
          <div className="row">
            <div className="col-lg">
              <input
                type="date"
                className="form-control"
                name="date"
                value={inputs.date || ""}
                onChange={handleChange}
              />
            </div>

            <div className="col-lg">
              <select
                className="form-control"
                name="work_place_region_id"
                onChange={areaRegionWise}
              >
                <option value="">Select Region</option>
                {Array.from(region).map((item, index) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="col-lg">
              <select
                className="form-control"
                name="work_place_area_id"
                onChange={baseRegionWise}
              >
                <option value="">Select Area</option>
                {Array.from(area).map((item, index) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="col-lg">
              <select
                className="form-control"
                name="work_place_base_id"
                onChange={handleChange}
              >
                <option value="">Select Base</option>
                {Array.from(base).map((item, index) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="col-lg">
              <button
                className="btn btn-primary btn-block mg-b-10"
                onClick={formSubmit}
              >
                <i className="fa fa-send mg-r-10"></i> Search
              </button>
            </div>
          </div>
        </div>
        <div className="am-pagebody">
          {/* row */}

          <div className="row row-sm mg-t-15 mg-sm-t-20">
            <div className="col-md-6">
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
              </div>
            </div>
            <div className="col-md-6">
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
              </div>
            </div>
          </div>

          {/* row */}

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
    </div>
  );
};

export default PieChartReport;
