import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";

//New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
//New Data table Code End

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});

  const fetchData = () => {
    Http.get("/app/report/attendance").then((res) => {
      setReceiveData(res.data.list);
    });

    Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
      (res) => {
        setStaff(res.data);
      }
    );
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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

  const formSubmit = () => {
    Http.post("/chart-of-account-report/", inputs).then((res) => {
      setReceiveData(res.data.info);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Attendance Report </h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="chart_of_account_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
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
      <Link
        to={{
          pathname: "/edit-distributors/" + rowData.id,
        }}
        className="btn btn-primary btn-sm ml-1"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <Link
        to={{ pathname: "/distributor-details/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
    </div>
  );
};

export default List;
