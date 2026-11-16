import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../Common/LoaderComponent";

import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/coupon-offer").then((res) => {
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

  const updateStatus = (id, currentStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${
        currentStatus === 1 ? "deactivate" : "activate"
      } this item?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${
        currentStatus === 1 ? "deactivate" : "activate"
      } it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        // Toggle the status
        const newStatus = currentStatus === 1 ? 0 : 1;

        // Make an API call to update the status using POST method
        Http.post(`/coupon-offer-status/${id}`, { status: newStatus })
          .then((res) => {
            // Update local state or re-fetch data
            setReceiveData(
              receiveData.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
              )
            );

            // Show success message
            Swal.fire(
              "Updated!",
              `The item has been ${
                newStatus === 1 ? "activated" : "deactivated"
              }.`,
              "success"
            );
          })
          .catch((error) => {
            // Handle errors here
            Swal.fire(
              "Failed!",
              "There was an error updating the item.",
              "error"
            );
          });
      }
    });
  };

  const actionTemplate = (rowData, deleteData, statusChange) => {
    return (
      <div className="text-xs text-nowrap">
        {/* <Link
          to={`/edit-coupon-offer/${rowData.id}`}
          className="btn btn-primary btn-sm"
          title="Edit"
        >
          <i className="fa fa-pencil" aria-hidden="true"></i>
        </Link> */}
        {/* <button
          className="btn btn-danger btn-sm ms-1"
          onClick={() => deleteData(rowData.id, "coupon-offer", "Coupon Offer")}
          title="Delete"
        >
          <i className="fa fa-trash"></i>
        </button> */}
        {/* <button
          className="btn btn-info btn-sm ms-1"
          onClick={() => updateStatus(rowData.id, rowData.status)}
          title={rowData.status === 1 ? "Deactivate" : "Activate"}
        >
          <i
            className={`fa ${
              rowData.status === 1 ? "fa-toggle-on" : "fa-toggle-off"
            }`}
          ></i>
        </button> */}
      </div>
    );
  };

  const cols = [
    { field: "title", header: "Title" },
    { field: "circular_number", header: "Circular Number" },
    { field: "start_date", header: "Start Date" },
    { field: "end_date", header: "End Date" },
    { field: "discount_value", header: "Discount Value" },
    { field: "minimum_purchase", header: "Minimum Purchase" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Coupon Offers</h5>
            <Link to="/create-coupon-offer" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                deleteData={deleteData}
                actionTemplate={actionTemplate}
                statusChange={updateStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
