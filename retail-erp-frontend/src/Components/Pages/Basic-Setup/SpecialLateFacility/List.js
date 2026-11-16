import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/special-late-facility").then((res) => {
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
    // { field: "id", header: "S/N" },
    { field: "year", header: "Year" },
    { field: "staff.card_no", header: "Card No" },
    { field: "staff.designation.name", header: "Designation" },
    { field: "staff.department.name", header: "Department" },
    { field: "staff.company_location.name", header: "Location" },
    { field: "staff.name", header: "Name" },
    { field: "staff.email", header: "Email" },
    { field: "staff.mobile", header: "Mobile" },
    { field: "staff.type", header: "Type" },
    { field: "staff.joining_date", header: "Joining Date" },
    { field: "staff.blood_group", header: "Blood Group" },
    { field: "staff.date_of_birth", header: "Date Of Birth" },
    { field: "staff.type", header: "Type" },
    { field: "staff.status", header: "Status" },
    // { field: "actions", header: "Action" }
];


  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Special Late Facility</h5>
            <Link
              to="/create-special-late-facility"
              className="btn btn-primary"
            >
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            
            <div className="card">
            <ReactDataTable
              cols={cols}
              receiveData={receiveData}
              actionTemplate={actionTemplate}
              deleteData={deleteData}
            />
          </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (item, deleteData) => {
  return (
    <td className="text-xs">
      <Link
        to={{
          pathname: "/edit-special-late-facility/" + item.id,
        }}
        className="btn btn-primary btn-sm"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() =>
          deleteData(item.id, "special-late-facility", "Special Late Facility")
        }
      >
        <i className="fa fa-trash"></i>
      </button>
    </td>
  );
};

export default List;
