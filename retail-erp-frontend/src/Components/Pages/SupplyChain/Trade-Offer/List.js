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
    Http.get("/trade-offer").then((res) => {
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
        Http.post(`/trade-offer-status/${id}`, { status: newStatus })
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

  const cols = [
    // { field: "serialNumber", header: "S/N" },
    { field: "effective_date", header: "Effective From" },
    { field: "end_date", header: "End Date" },

    // { field: "product.name", header: "FG Name (Bangla)" },
    { field: "product.name_en", header: "FG Name" },
    // { field: "sr_base_info.base.user.name", header: "Users (MDO,DSR,AM,RSM)" },
    { field: "qty", header: "Actual Quantity" },

    // {
    //   field: "trade_offer_product.name",
    //   header: "Trade Offer FG Name (Bangla)",
    // },
    { field: "trade_offer_product.name_en", header: "Trade Offer FG Name" },

    { field: "offer_qty", header: "T/O Quantity" },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Trade Offer</h5>
            <Link to="/create-trade-offer" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
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

const actionTemplate = (rowData, deleteData, statusChange) => {
  return (
    <div className="text-xs text-nowrap">
      {/* <Link
        to={{
          pathname: "/edit-shop/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link> */}
      {/* <Link
        to={{ pathname: "/shop-details/" + rowData.id }}
        className="btn btn-info btn-sm mr-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link> */}
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "shop", "shop")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button> */}
      {/* <button
        className="btn btn-primary btn-sm ms-1"
        onClick={() => statusChange(rowData.id, "shop-status", "shop")}
        title="Active Inactive"
      >
        <i className="fa fa-link"></i>
      </button> */}
      {/* <button
        className={`btn btn-sm ms-1 ${
          rowData.status ? "btn-success" : "btn-secondary"
        }`}
        onClick={() => statusChange(rowData.id, rowData.status)}
      >
        {rowData.status ? "Active" : "Inactive"}
      </button> */}
    </div>
  );
};

export default List;
