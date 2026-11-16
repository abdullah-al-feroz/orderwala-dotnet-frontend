import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/cash-count").then((res) => {
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
        Http.delete("/" + deleteApiUrl + "/" + id + "/cash-count").then(
          (res) => {
            setReceiveData(res.data);
            Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
          }
        );
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
            <h5 className="am-title">All Cash Count</h5>
            <Link to="/create-cash-count" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Cash Count
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
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          1000
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          500
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          200
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          100
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          50
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          20
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          10
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          5
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          2
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          1
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Suspense
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total
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
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.thousand_total}</td>
                          <td className="text-xs">{item.five_hundred_total}</td>
                          <td className="text-xs">{item.two_hundred_total}</td>
                          <td className="text-xs">{item.one_hundred_total}</td>
                          <td className="text-xs">{item.fifty_total}</td>
                          <td className="text-xs">{item.twenty_total}</td>
                          <td className="text-xs">{item.ten_total}</td>
                          <td className="text-xs">{item.five_total}</td>
                          <td className="text-xs">{item.two_total}</td>
                          <td className="text-xs">{item.one_total}</td>
                          <td className="text-xs">{item.suspense}</td>
                          <td className="text-xs">{item.total_amount}</td>
                          <td className="text-xs">
                            {/* <Link to={{ pathname: "/edit-cash-count/" + item.id }} className="btn btn-primary btn-sm">
                              <i className="fa fa-pencil" aria-hidden="true"></i>
                            </Link> */}
                            <button
                              className="btn btn-danger btn-sm ms-1"
                              onClick={() =>
                                deleteData(item.id, "transaction", "cash-count")
                              }
                            >
                              <i className="fa fa-trash"></i>
                            </button>
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
