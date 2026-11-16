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
    Http.get("/distributor").then((res) => {
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
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: (rowData) => (<Link to={{ pathname: "/distributor-details/" + rowData.id }} title="Distributor Details"> <i className="fa fa-list" aria-hidden="true"></i>{" "} </Link>), header: "" },
    { field: "factory.name", header: "Depot" },
    { field: "business_type", header: "Type" },
    { field: (item) => item.sr_base_info ? item.sr_base_info.map((item2, index2) => item2.base ? (<span key={index2} className="badge bg-secondary me-1" style={{ fontSize: "80%", fontWeight: 300 }}>{item2.base.user ? item2.base.user.name : ""}</span>) : ("")) : "", header: "SR" },
    { field: (item) => item.distributor_workplace ? item.distributor_workplace.map((item2, index2) => item2.region ? (<span key={index2} className="badge bg-secondary me-1" style={{ fontSize: "80%", fontWeight: 300 }}>{item2.region.name}</span>) : ("")) : "", header: "Region" },
    { field: (item) => item.distributor_workplace ? item.distributor_workplace.map((item2, index2) => item2.area ? (<span key={index2} className="badge bg-secondary me-1" style={{ fontSize: "80%", fontWeight: 300 }}>{item2.area.name}</span>) : ("")) : "", header: "Area" },
    { field: (item) => item.distributor_workplace ? item.distributor_workplace.map((item2, index2) => item2.base ? (<span key={index2} className="badge bg-secondary me-1" style={{ fontSize: "80%", fontWeight: 300 }}>{item2.base.name}</span>) : ("")) : "", header: "Base" },
    { field: "status", header: "Status" },
    { field: "balance", header: "Balance" }
  ];


  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Distributors</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                // actionTemplate={actionTemplate}
                deleteData={deleteData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
