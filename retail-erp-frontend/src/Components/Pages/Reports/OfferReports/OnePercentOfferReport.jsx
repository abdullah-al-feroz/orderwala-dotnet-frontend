import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

//Date range start
//Date range end

//New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
//New Data table Code End

const OnePercentOfferReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  //Date range start

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  )
    .toISOString()
    .substr(0, 10);
  console.log(firstDayOfMonth);

  const [inputs, setInputs] = useState({
    from: firstDayOfMonth,
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  //Date range end

  const fetchData = () => {
    Http.post("/one-percent-offer-report").then((res) => {
      console.log(res);
      setReceiveData(res.data);
    });
    // Http.get("/staff-type-check").then((res) => {
    //   setRole(res.data);
    // });
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

  // const deleteData = (id, deleteApiUrl, showMsg) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
  //         setReceiveData(res.data);
  //         Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
  //       });
  //     }
  //   });
  // };

  const cols = [
    { field: "customer.shop_name", header: "Retailer Name" },
    { field: "customer.phone", header: "Phone" },
    { field: "customer.address", header: "Address" },
    { field: "total_price", header: "Order Amount" },
    { field: "discount", header: "Offer Amount" },
    { field: "date", header: "Date" },
    { field: "distributor.name", header: "Distributor" },
    { field: "base.name", header: "Base" },
  ];

  //Date range start
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    Http.post("/one-percent-offer-report", inputs).then((res) => {
      setReceiveData(res.data);
    });
  };

  //Date range end
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">One Percent Offer Report</h5>
            {/* <Link to="/create-distributors" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link> */}
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
                // actionTemplate={actionTemplate}
                // detailOnName={detailOnName}
                // deleteData={deleteData}
                // statusChange={statusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const actionTemplate = (rowData, deleteData, statusChange) => {
//   return (
//     <div className="text-xs text-nowrap">
//       {/* <Link
//         to={{
//           pathname: "/edit-shop/" + rowData.id,
//           state: { id: rowData.id },
//         }}
//         className="btn btn-primary btn-sm"
//         title="Edit"
//       >
//         <i className="fa fa-pencil" aria-hidden="true"></i>
//       </Link> */}
//       <Link
//         to={{
//           pathname: "/edit-distributors/" + rowData.id,
//         }}
//         className="btn btn-primary btn-sm ml-1"
//       >
//         <i className="fa fa-pencil" aria-hidden="true"></i>
//       </Link>
//       {/* <button
//         className="btn btn-danger btn-sm ms-1"
//         onClick={() => deleteData(rowData.id, "distributors", "distributors")}
//         title="Delete"
//       >
//         <i className="fa fa-trash"></i>
//       </button> */}
//       <Link
//         to={{ pathname: "/distributor-details/" + rowData.id }}
//         className="btn btn-info btn-sm mx-1"
//         title="View"
//       >
//         <i className="fa fa-list" aria-hidden="true"></i>
//       </Link>
//       {/* <button
//         className="btn btn-primary btn-sm ms-1"
//         onClick={() => statusChange(rowData.id, "shop-status", "shop")}
//         title="Active Inactive"
//       >
//         <i className="fa fa-link"></i>
//       </button> */}
//     </div>
//   );
// };

export default OnePercentOfferReport;
