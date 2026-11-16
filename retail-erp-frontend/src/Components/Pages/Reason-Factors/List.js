import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../Common/Alert";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";

//New Data table Code Start
import ReactDataTable from "../../Common/ReactDataTable";
//New Data table Code End

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const ordersResponse = await Http.get("/so-track/reasons");
      setReceiveData(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
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

  const cols = [
    // { field: "id", header: "Card No. " },
    { field: "start_date", header: "Start Date" },
    { field: "end_date", header: "End Date" },
    { field: "reason_type.name", header: "Type" },
    { field: "remarks", header: "Remarks" },
    // { field: "user.workplace.region.name", header: "Region " },
    // { field: "user.mobile", header: "Phone " },
    // { field: "attendance_at", header: "Attendance In " },
    // { field: "checkout_at", header: "Attendance Out " },
    // { field: "user.designation.designation_code", header: "Designation " },
    // { field: "distance", header: "Distance " },
  ];

  // const mappedData = receiveData.map((item) => {
  //   const attendances = item.attendances
  //     .map((attendances) => attendances?.attendance_at)
  //     .join(" || ");

  //   return {
  //     ...item,
  //     attendances,
  //   };
  // });

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          {/* <div className="am-pagetitle">
            <h5 className="am-title">SO Track Overview</h5>
            <Link to="/create-distributors" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div> */}
          <div className="am-pagetitle">
            <h5 className="am-title">All Holiday</h5>
            <Link
              to="/reason-factors/reason-create"
              className="btn btn-primary"
            >
              <i className="fa fa-plus-square mg-r-6"></i>Reason Factors
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                // imageBodyTemplate={imageBodyTemplate}
                // actionTemplate={actionTemplate}
                // detailOnName={detailOnName}
                deleteData={deleteData}
                // statusChange={statusChange}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default List;
