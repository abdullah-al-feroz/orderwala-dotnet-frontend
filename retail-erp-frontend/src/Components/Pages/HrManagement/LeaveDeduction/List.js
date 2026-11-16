import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import ReactDataTable from "../../../Common/ReactDataTable";

const Staff = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/leave-deduction").then((res) => {
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
    { field: "id", header: "S/N" },
    { field: "staff.card_no", header: "Card No" },
    // { field: "staff.name", header: "Name" },
    {
      header: "Name",
      field: (item) => (
        <Link to={{ pathname: "/profile/" + item.staff.id }}>
          {item.staff.name}
        </Link>
      ),
    },
    { field: "staff.designation.name", header: "Designation" },
    { field: "staff.department.name", header: "Department" },
    { field: "staff.company_location.name", header: "Location" },
    { field: "year", header: "Year" },
    { field: "casual", header: "Casual" },
    { field: "sick", header: "Sick" },
    { field: "earn", header: "Earn" },
    { field: "others", header: "Others" },
    { field: "remarks", header: "Remarks" },
    { field: "actions", header: "Action" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Leave Deduction</h5>
            <Link to="/create-leave-deduction" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
          </div>
          
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
  );
};

const actionTemplate = (item, deleteData) => {
  return (
    <td className="text-xs" style={{ textWrap: "nowrap" }}>
      <Link
        to={{
          pathname: "/edit-leave-deduction/" + item.id,
        }}
        className="btn btn-primary btn-sm"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(item.id, "staff", "Staff")}
      >
        <i className="fa fa-trash"></i>
      </button>
    </td>
  );
};

export default Staff;
