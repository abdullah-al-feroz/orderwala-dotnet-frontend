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
    Http.get("/vendor").then((res) => {
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
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },

    { field: "contact_person", header: "Contact Person" },

    { field: "contact_phone", header: "Contact Phone" },
    { field: "email", header: "Email" },

    { field: "present_address", header: "Present Address" },

    { field: "status", header: "Status" },
  ];

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.image} // Assuming thumbImage is the URL of the image
        alt={rowData.name} // Assuming name is the name of the product
        style={{ width: "50px", height: "50px" }} // Adjust width and height as needed
      />
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Comapnies</h5>
            <Link to="/create-vendor" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                imageBodyTemplate={imageBodyTemplate}
                actionTemplate={actionTemplate}
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
      <Link
        to={{
          pathname: "/edit-vendor/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <Link
        to={{ pathname: "/vendor-details/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>

      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "vendor", "vendor")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button>
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

export default List;
