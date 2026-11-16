import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";

//New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
//New Data table Code End

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  //Date range start

  // const firstDayOfMonth = new Date(
  //   new Date().getFullYear(),
  //   new Date().getMonth(),
  //   2
  // )
  //   .toISOString()
  //   .substr(0, 10);

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });
  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const ordersResponse = await Http.get("/so-track/mdo-store-checking");
      setReceiveData(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
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
    { field: "user.card_no", header: "Card No." },
    { field: "user.name", header: "Name" },
    { field: "user.mobile", header: "Phone" },
    { field: "user.user_type", header: "Designation" },
    { field: "user.department.name", header: "Dept." },
    { field: "user.workplace.name", header: "Base Name" },
    { field: "store.shop_name", header: "Shop Name" },
    { field: "store.owner_name", header: "Proprietor Name" },
    { field: "store.phone", header: "Shop Phone" },
    { field: "checkin_at", header: "Check In" },
    { field: "checkout_at", header: "Check Out" },
  ];

  //Date range start
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    Http.post("/so-track/mdo-store-checking", inputs).then((res) => {
      setReceiveData(res.data);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">SO Track Overview</h5>
            <Link to="/create-distributors" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            {/* Date range start */}
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
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
            {/* Date range end */}

            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                // imageBodyTemplate={imageBodyTemplate}
                actionTemplate={actionTemplate}
                // detailOnName={detailOnName}
                deleteData={deleteData}
                // statusChange={statusChange}
                isLoading={loading}
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
      <Link
        to={{
          pathname: "/edit-distributors/" + rowData.id,
        }}
        className="btn btn-primary btn-sm ml-1"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "distributors", "distributors")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button> */}
      <Link
        to={{ pathname: "/distributor-details/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-primary btn-sm ms-1"
        onClick={() => statusChange(rowData.id, "shop-status", "shop")}
        title="Active Inactive"
      >
        <i className="fa fa-link"></i>
      </button> */}
    </div>
  );
};
// const detailOnName = (rowData) => {
//   return (
//     <div className="text-xs text-nowrap">

//       <Link
//         to={{
//           pathname: "/distributor-details/" + rowData.id,
//         }}
//         title="Distributor Details"
//       >
//         {rowData.name}
//       </Link>
//     </div>
//   );
// };

export default List;
