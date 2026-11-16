import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Swal from "sweetalert2";

import ReactDataTable from "../../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/base").then((res) => {
      console.log(res.data);
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
    { field: "name", header: "Name" },
    { field: "zone.name", header: "Zone" },
    { field: "region.name", header: "Region" },
    { field: "area.name", header: "Area" },
    // { field: "dsr.name", header: "DSR" },
    // { field: "so.id", header: "SID" },
    { field: "so.name", header: "SO" },
    { field: "so.email", header: "SO Email" },
    { field: "distributor.distributor.id", header: "DID" },
    { field: "distributor.distributor.name", header: "Distributor" },
    { field: "status", header: "Status" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Base</h5>
            <Link to="/createbase" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Base
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
          pathname: "/create-route-plan-on-base/" + rowData.id + "/mdo",
        }}
        className="btn btn-info btn-sm mr-1"
      >
        <i className="fa fa-map-marker" aria-hidden="true"></i> MDO
      </Link>
      <Link
        to={{
          pathname: "/create-route-plan-on-base/" + rowData.id + "/dsr",
        }}
        className="btn btn-secondary btn-sm mr-1"
      >
        <i className="fa fa-map-marker" aria-hidden="true"></i> DSR
      </Link>
      <Link
        to={{ pathname: "/editbase/" + rowData.id }}
        className="btn btn-primary btn-sm"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
    </div>
  );
};

export default List;
