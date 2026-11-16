import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import IsLogin from "../../../../Common/IsLogin";
import Swal from "sweetalert2";

import ReactDataTable from "../../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/tag").then((res) => {
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

    { field: "status", header: "Status" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Tag</h5>
            <Link to="/create-tag" className="btn btn-primary">
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

const actionTemplate = (rowData, deleteData) => {
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{
          pathname: "/edit-tag/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "tag", "tag")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button> */}
    </div>
  );
};

export default List;
