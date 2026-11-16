import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import ReactDataTable from "../../../Common/ReactDataTable";

const LeaveReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/report-leave-report").then((res) => {
      setReceiveData(res.data);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const cols = [
    { field: "dept_name", header: "Name" },
    {
      field: (receiveData) =>
        receiveData.staff.map((staff, index) => (
          <div key={index} style={{ borderBottom: "1px solid black" }}>
            <div>
              {" "}
              <br />
            </div>
            <div>{staff.name}</div>
          </div>
        )),
      header: "Staff",
    },

    {
      field: (receiveData) =>
        receiveData.staff.map((staff, index) => (
          <div key={index} style={{ borderBottom: "1px solid black" }}>
            <div>
              {" "}
              <br />
            </div>
            <div>{staff.casual}</div>
          </div>
        )),
      header: "Casual Leave Allowance",
    },
    {
      field: (receiveData) =>
        receiveData.staff.map((staff, index) => (
          <div key={index} style={{ borderBottom: "1px solid black" }}>
            <div>
              {" "}
              <br />
            </div>
            <div>{staff.sick}</div>
          </div>
        )),
      header: "Sick Leave Allowance",
    },
    { field: "earn_leave_allowance", header: "Earn Leave Allowance" },
    { field: "others_leave_allowance", header: "Others Leave Allowance" },
    { field: "casual_leave_taken", header: "Casual Leave Taken" },
    { field: "sick_leave_taken", header: "Sick Leave Taken" },
    { field: "earn_leave_taken", header: "Earn Leave Taken" },
    { field: "others_leave_taken", header: "Others Leave Taken" },
    { field: "casual_leave_balance", header: "Casual Leave Balance" },
    { field: "sick_leave_balance", header: "Sick Leave Balance" },
    { field: "earn_leave_balance", header: "Earn Leave Balance" },
    { field: "others_leave_balance", header: "Others Leave Balance" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Salary Structure</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
          </div>

          <div className="card">
            <ReactDataTable cols={cols} receiveData={receiveData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReport;
