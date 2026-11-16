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
    Http.get("/requisition").then((res) => {
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
    { field: "department.name", header: "Department" },
    { field: "designation.name", header: "Designation" },
    { field: "vacancy", header: "Vacancy" },
    { field: "experience_requirements", header: "Experience Requirement" },
    { field: "job_title", header: "Title" },
    { field: "job_context", header: "Context" },
    { field: "job_description", header: "Description" },
    { field: "employment_status", header: "Employment Status" },
    { field: "last_date_of_application", header: "Last Date of Application" },
    { field: "salary_range", header: "Salary Range" },
    { field: "key_skills", header: "Key Skills" },
    { field: "candidate_need_to_be_join_date", header: "Needed to be Joining" },
    { field: "created_at", header: "Created At" },
    // { field: "actions", header: "Action" }y
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Requisitions</h5>
            <Link to="/create-requisition" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Requisition
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
    <td
      className="text-xs"
      style={{
        textWrap: "nowrap",
      }}
    >
      <Link
        to={{ pathname: "/edit-requisition/" + item.id }}
        className="btn btn-primary btn-sm"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(item.id, "requisition", "Requisition")}
      >
        <i className="fa fa-trash"></i>
      </button>
    </td>
  );
};

export default List;
