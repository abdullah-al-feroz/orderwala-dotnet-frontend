import React, { useEffect, useState } from "react";
import IsLogin from "../Common/IsLogin";
import Http from "../Common/Http";
import StaffDashboard from "./Dashboard/Staff";
import AdminDashboard from "./Dashboard/Admin";
import MooDashboard from "./Dashboard/MooDashboard";
import MooDashboardNew from "./Dashboard/MooDashboardNew";
import DistributorDashboard from "./Dashboard/DistributorDashboard";
// import { LoaderComponent } from "../Common/LoaderComponent";
import $ from "jquery";
import CompanyDashboard from "./Dashboard/CompanyDashboard";

const Dashboard = () => {
  // const [receiveData, setReceiveData] = useState([]);

  /*const fetchData = () => {
    Http.get("/staff-type-check").then((res) => {
      setReceiveData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);*/

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}

      {localStorage.getItem("type") === "user" &&
        (localStorage.getItem("role") === "admin" ||
          localStorage.getItem("role") === "depot" ||
          localStorage.getItem("role") === "supply_chain") && (
          <AdminDashboard />
        )}
      {localStorage.getItem("type") === "user" &&
        (localStorage.getItem("role") === "staff" ||
          localStorage.getItem("role") === "hr" ||
          localStorage.getItem("role") === "so") && <StaffDashboard />}

      {localStorage.getItem("type") === "distributor" &&
        localStorage.getItem("role") === "distributor" && (
          <DistributorDashboard />
        )}

      {localStorage.getItem("type") === "user" &&
        (localStorage.getItem("role") === "moo" ||
          // localStorage.getItem("role") === "hmo") && <MooDashboard />}
          localStorage.getItem("role") === "cluster") && <MooDashboardNew />}

      {localStorage.getItem("type") === "company" &&
        localStorage.getItem("role") === "company" && <CompanyDashboard />}
    </div>
  );
};

export default Dashboard;
