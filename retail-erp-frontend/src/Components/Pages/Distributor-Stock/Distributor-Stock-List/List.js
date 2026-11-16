import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

//New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
//New Data table Code End

const DistributorStockList = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.post("/so-track/mdo-attendance").then((res) => {
      console.log(res);
      setReceiveData(res.data);
    });
    // Http.get("/staff-type-check").then((res) => {
    //   setRole(res.data);
    // });
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
    { field: "user.card_no", header: "Card No. " },
    { field: "user.name", header: "Name " },
    { field: "user.workplace.name", header: "Base " },
    { field: "user.workplace.region.name", header: "Region " },
    { field: "user.mobile", header: "Phone " },
    { field: "attendance_at", header: "Attendance In " },
    { field: "checkout_at", header: "Attendance Out " },
    { field: "user.designation.designation_code", header: "Designation " },
    { field: "distance", header: "Distance " },
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
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">SO Track Overview</h5>
            <Link to="/distributor-stock/distributor-create" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                // imageBodyTemplate={imageBodyTemplate}
                actionTemplate={actionTemplate}
                // detailOnName={detailOnName}
                deleteData={deleteData}
                // statusChange={statusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData, statusChange) => {
  return (
    <div className="text-xs text-nowrap">
      {/* <Link
        to={{
          pathname: "/edit-shop/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link> */}
      <Link
        to={{
          pathname: "/edit-distributors/" + rowData.id,
        }}
        className="btn btn-primary btn-sm ml-1"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "distributors", "distributors")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button> */}
      <Link
        to={{ pathname: "/distributor-details/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-primary btn-sm ms-1"
        onClick={() => statusChange(rowData.id, "shop-status", "shop")}
        title="Active Inactive"
      >
        <i className="fa fa-link"></i>
      </button> */}
    </div>
  );
};
// const detailOnName = (rowData) => {
//   return (
//     <div className="text-xs text-nowrap">

//       <Link
//         to={{
//           pathname: "/distributor-details/" + rowData.id,
//         }}
//         title="Distributor Details"
//       >
//         {rowData.name}
//       </Link>
//     </div>
//   );
// };

export default DistributorStockList;
