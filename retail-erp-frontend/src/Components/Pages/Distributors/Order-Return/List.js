import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/distributor/order-return").then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/staff-type-check").then((res) => {
      setRole(res.data);
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Return Order</h5>
            <Link
              to="/distributor/order-return-create"
              className="btn btn-primary"
            >
              <i className="fa fa-plus-square mg-r-6"></i>Return Order
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-20 pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Receipt No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.receipt_no}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.total_price}</td>
                          <td className="text-xs text-center">
                            <Link
                              to={{
                                pathname:
                                  "/distributor/order-return/" + item.id,
                              }}
                              className="btn btn-info btn-sm ms-1"
                              title="View"
                            >
                              <i className="fa fa-list" aria-hidden="true"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
