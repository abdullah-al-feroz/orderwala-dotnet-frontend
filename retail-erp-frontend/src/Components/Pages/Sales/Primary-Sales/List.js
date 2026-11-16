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
  const [inputs, setInputs] = useState({});
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/order").then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/staff-type-check").then((res) => {
      setRole(res.data);
    });
  };

  // console.log(role);

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, [inputs.status]);

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

  //  Set Input Value with state
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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

  // Form Submit
  const formSubmit = () => {
    Http.post("/staff-filter/", inputs).then((res) => {
      setReceiveData(res.data);
    });
  };

  const cols = [
    { field: "id", header: "S/N" },
    { field: "delivery_date", header: "D.Date" },
    { field: "date", header: "O.Date" },
    { field: "receipt_no", header: "Invoice No" },
    { field: "distributor.name", header: "Distributor Name" },
    { field: "created_by.name", header: "Created By" },
    { field: "total_price", header: "Inv. Total" },
    { field: "payment_amount", header: "Received" },
    { field: "payment_type", header: "Type" },
    {
      // field: "payment_receive_status",
      header: "Payment",
      field: (rowData) =>
        rowData.payment_receive_status != 1 ? (
          <Link
            to={{ pathname: "/payment-receive/" + rowData.id }}
            className="btn btn-info btn-sm"
          >
            Receive
          </Link>
        ) : (
          <p className="btn btn-success btn-sm">
            <i className="fa fa-check"></i>
          </p>
        ),
    },
    {
      // field: "delivery_status",
      header: "Delivery",
      field: (rowData) =>
        rowData.delivery_status != "delivered" ? (
          <Link
            to={{ pathname: "/delivery-order/" + rowData.id }}
            className="btn btn-info btn-sm"
          >
            Deliver
          </Link>
        ) : (
          <p className="btn btn-success btn-sm">
            <i className="fa fa-check"></i>
          </p>
        ),
    },
    // { field: "actions", header: "Actions" }
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Primary Sales</h5>
            <Link to="/create-primary-sales" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> Primary Sales
            </Link>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={inputs.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    value={inputs.end_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <select
                    className="form-control"
                    name="type"
                    onChange={handleChange}
                  >
                    <option value="order_date">Search By Order Date</option>
                    <option value="delivery_date">
                      Search By Delivery Date
                    </option>
                  </select>
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

          <div className="card">
            <ReactDataTable
              cols={cols}
              receiveData={receiveData}
              actionTemplate={actionTemplate}
              deleteData={deleteData}
              role={role}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData, role) => {
  console.log(role);
  return (
    <td className="text-xs">
      <Link
        to={{
          pathname: "/primary-sales-detail/" + rowData.id,
        }}
        className="btn btn-info btn-sm"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
      {role === "admin" && (
        <>
          <Link
            to={{
              pathname: "/edit-primary-sales/" + rowData.id,
            }}
            className="btn btn-primary btn-sm ms-1"
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>
          <button
            className="btn btn-danger btn-sm ms-1"
            onClick={() => deleteData(rowData.id, "asset", "asset")}
          >
            <i className="fa fa-trash"></i>
          </button>
        </>
      )}
    </td>
  );
};

export default List;
