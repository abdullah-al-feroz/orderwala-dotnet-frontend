import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/final-quotation").then((res) => {
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
            <h5 className="am-title">All Final Quotaitons</h5>
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
                          Circular Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          WO Number
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created By
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Status
                        </th>
                        {role === "admin" ||
                          (role === "supply_chain" && (
                            <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-nowrap">
                              Action
                            </th>
                          ))}
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">
                            {item.circular ? item.circular.title : ""}
                          </td>
                          <td className="text-xs">{item.wo_number}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.total_amount}</td>
                          <td className="text-xs">{item.created_by.name}</td>
                          <td className="text-xs">{item.status}</td>
                          {role === "admin" ||
                            (role === "supply_chain" && (
                              <>
                                <td className="text-xs text-nowrap">
                                  <Link
                                    to={{
                                      pathname:
                                        "/circular-compare/" +
                                        item.circular_rfq_id,
                                    }}
                                    className="btn btn-primary btn-sm"
                                    title="Circular Compare"
                                  >
                                    <i
                                      className="fa fa-pencil"
                                      aria-hidden="true"
                                    ></i>
                                  </Link>
                                  <Link
                                    to={{
                                      pathname:
                                        "/final-quotation-view/" +
                                        item.circular_rfq_id,
                                    }}
                                    className="btn btn-info btn-sm ms-1"
                                    title="View"
                                  >
                                    <i
                                      className="fa fa-list"
                                      aria-hidden="true"
                                    ></i>
                                  </Link>
                                  <button
                                    className="btn btn-danger btn-sm ms-1"
                                    onClick={() =>
                                      deleteData(
                                        item.id,
                                        "final-quotation",
                                        "final-quotation"
                                      )
                                    }
                                    title="Delete"
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </td>
                              </>
                            ))}
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
