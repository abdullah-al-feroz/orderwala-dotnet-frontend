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
    Http.get("/journal-code").then((res) => {
      console.log(res.data);
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Journal Code</h5>
            <Link to="/create-journal-code" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
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
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Remarks
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
                          <td className="text-xs">{item.code}</td>
                          <td className="text-xs">{item.name}</td>
                          <td className="text-xs">{item.remarks}</td>
                          <td className="text-xs">
                            <Link
                              to={{ pathname: "/edit-journal-code/" + item.id }}
                              className="btn btn-primary btn-sm"
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
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
