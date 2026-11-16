import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/others-receive").then((res) => {
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
            <h5 className="am-title">All Others Recceive </h5>
            <Link to="/create-others-receive" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> Others Recceive
            </Link>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
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
                        {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Location
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Factory
                        </th>
                        {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Department
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Description
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created By
                        </th>
                        {role === "admin" ||
                          (role === "supply_chain" && (
                            <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                              Action
                            </th>
                          ))}
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.date}</td>
                          {/* <td className="text-xs">
                            {item.company_location
                              ? item.company_location.name
                              : ""}
                          </td> */}
                          <td className="text-xs">
                            {item.factory ? item.factory.name : ""}
                          </td>
                          {/* <td className="text-xs">
                            {item.department ? item.department.name : ""}
                          </td> */}
                          <td className="text-xs">{item.description}</td>
                          <td className="text-xs">
                            {item.created_by ? item.created_by.name : ""}
                          </td>
                          {role === "admin" ||
                            (role === "supply_chain" && (
                              <td className="text-xs">
                                <Link
                                  to={{
                                    pathname: "/others-receive/" + item.id,
                                  }}
                                  className="btn btn-info btn-sm ms-1"
                                >
                                  <i
                                    className="fa fa-list"
                                    aria-hidden="true"
                                  ></i>
                                </Link>
                                <Link
                                  to={{
                                    pathname: "/edit-others-receive/" + item.id,
                                  }}
                                  className="btn btn-primary btn-sm ms-1"
                                >
                                  <i
                                    className="fa fa-pencil"
                                    aria-hidden="true"
                                  ></i>
                                </Link>
                                <button
                                  className="btn btn-danger btn-sm ms-1"
                                  onClick={() =>
                                    deleteData(
                                      item.id,
                                      "others-receive",
                                      "others-receive"
                                    )
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
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
