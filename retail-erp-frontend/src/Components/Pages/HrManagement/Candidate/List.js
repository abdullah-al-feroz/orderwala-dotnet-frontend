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
  const [url, setUrl] = useState(Http.getUri());

  const fetchData = () => {
    Http.get("/candidate").then((res) => {
      setReceiveData(res.data);
    });

    const splitUrl = url.split("/");
    let fullUrl = "";
    for (var i = 0; i < splitUrl.length - 1; i++) {
      fullUrl += splitUrl[i] + "/";
    }
    setUrl(fullUrl);
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
  const invite = (id, status) => {
    Http.get("/candidate_invite_change/" + status + "/" + id).then((res) => {
      setReceiveData(res.data);
      Swal.fire(
        "Candiate Invitation!",
        "Candidate Invitation Has Been Updated",
        "success"
      );
    });
  };

  const cols = [
    { field: "id", header: "S/N" },
    { field: "name", header: "Name" },
    { field: "email", header: "Email" },
    { field: "mobile", header: "Mobile" },
    { field: "experience", header: "Experience" },
    { field: "skills", header: "Skills" },
    { field: "expected_salary", header: "Expected Salary" },
    { field: "expected_joining_date", header: "Expected Joining Date" },
    { field: "reference_name", header: "Reference" },
    { field: "cv", header: "CV" },
    { field: "status", header: "Status" },
    { field: "remarks", header: "Remarks" },
    { field: "actions", header: "Action" }
];


  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Candidate</h5>
            <Link to="/create-candidate" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Candidate
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

const actionTemplate = (item, deleteData , invite) => {
  return (
    <td className="text-xs">
      {item.invite == 0 && item.approved_by == "" ? (
        <button
          className="btn btn-info btn-sm ms-1"
          onClick={() => invite(item.id, 1)}
        >
          <i className="fa fa-check"></i>
        </button>
      ) : (
        ""
      )}
      {item.invite == 1 && item.approved_by == "" ? (
        <button
          className="btn btn-primary btn-sm ms-1"
          onClick={() => invite(item.id, 0)}
        >
          <i className="fa fa-minus"></i>
        </button>
      ) : (
        ""
      )}
      {item.approved_by < 1 ? (
        <Link
          to={{
            pathname: "/create-staff/" + item.id,
          }}
          className="btn btn-info btn-sm ms-1"
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </Link>
      ) : (
        ""
      )}
      {item.approved_by < 1 ? (
        <button
          className="btn btn-danger btn-sm ms-1"
          onClick={() => deleteData(item.id, "candidate", "Candidate")}
        >
          <i className="fa fa-trash"></i>
        </button>
      ) : (
        "Approved"
      )}
    </td>
  );
};

export default List;
