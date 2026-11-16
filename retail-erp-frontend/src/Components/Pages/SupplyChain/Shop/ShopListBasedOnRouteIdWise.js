import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(null);
  const [inputs, setInputs] = useState({ status: "active" });

  const withUserTypeLabel = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((row) => ({
      ...row,
      user_type_label:
        row?.available_for_mdo == 1 ? "Team Orderwala" : "Orderwala",
    }));
  };

  const fetchData = async () => {
    try {
      setLoading(true); // Start loader
      const customerResponse = await Http.get(
        `/customer?status=${inputs.status}&route_id=${id}`
        // `/customer-list?status=${inputs.status}`
      );
      setReceiveData(withUserTypeLabel(customerResponse.data));

      const roleResponse = await Http.get("/staff-type-check");
      setRole(roleResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

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
          setReceiveData(withUserTypeLabel(res.data));
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };
  const statusChange = (id, url, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are goin to change Status of Customer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change Status!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.get("/" + url + "/" + id).then((res) => {
          setReceiveData(withUserTypeLabel(res.data));
          Swal.fire(
            "Status Chnage!",
            "Customer Status has been Changed.",
            "success"
          );
        });
      }
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const formSubmit = () => {
    Http.get("/customer?status=" + inputs.status).then((res) => {
      setReceiveData(withUserTypeLabel(res.data));
      DatatableFunc(); // Initialize a new instance
    });
  };

  const cols = [
    // { field: "serialNumber", header: "S/N" },
    { field: "code", header: "Code" },
    { field: "shop_name", header: "Name" },
    { field: "route.name", header: "Route" },
    { field: "place.name", header: "Place" },
    { field: "thana.name", header: "Thana" },
    { field: "district.name", header: "District" },
    { field: "division.name", header: "Division" },
    { field: "distributor.name", header: "Distributor" },
    { field: "route.base.so.name", header: "So" },
    { field: "route.base.dsr.name", header: "DSR" },
    { field: "phone", header: "Phone" },
    { field: "address", header: "Address" },
    { field: "status", header: "Status" },
    { field: "total_order_amount", header: "Total Order" },
    { field: "total_paid_amount", header: "Total Payment" },
    { field: "total_due_amount", header: "Total Balance" },
    { field: "verified_by.name", header: "Verified By" },
    { field: "user_type_label", header: "User Type" },
    // { field: "status", header: "Action" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Shops</h5>
            {/*<Link to="/create-shop" className="btn btn-primary">
                        <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>*/}
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="row">
                    <div className="col-lg">
                      <select
                        className="form-control"
                        name="status"
                        value={inputs.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">InActive</option>
                        <option value="unverified">Unverified</option>
                      </select>
                    </div>
                    {/* <div className="col-lg">
                      <button
                        className="btn btn-primary btn-block mg-b-10"
                        onClick={formSubmit}
                      >
                        <i className="fa fa-send mg-r-10"></i> Search
                      </button>
                    </div> */}
                  </div>
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
                deleteData={deleteData}
                statusChange={statusChange}
                isLoading={loading}
                role={role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData, statusChange, role) => {
  // console.log(role);
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{ pathname: "/shop-details/" + rowData.id }}
        className="btn btn-info btn-sm mr-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>

      {/* {rowData.orders.length == 0 ? (
        <button
          className="btn btn-danger btn-sm ms-1"
          onClick={() => deleteData(rowData.id, "customer", "shop")}
          title="Detele"
        >
          <i className="fa fa-trash"></i>
        </button>
      ) : (
        ""
      )} */}

      {/* {role != "moo" ? (
        <button
          className="btn btn-primary btn-sm ms-1"
          onClick={() => statusChange(rowData.id, "shop-status", "shop")}
          title="Active Inactive"
        >
          <i className="fa fa-link"></i>
        </button>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default List;
