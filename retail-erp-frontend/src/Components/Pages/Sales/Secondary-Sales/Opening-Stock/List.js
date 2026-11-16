import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/target").then((res) => {
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
            <h5 className="am-title">Monthly Target</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <h3 className="text-center">Monthly Target</h3>
              <div className="row">
                <div className="col-1"></div>
                <div className="col-2">
                  <Link
                    to="/create-target"
                    className="btn btn-primary btn-block"
                  >
                    <i className="fa fa-plus-square"></i> Add Target
                  </Link>
                </div>
                <div className="col-2">
                  <Link to="/edit-target" className="btn btn-info btn-block">
                    <i className="fa fa-plus-square"></i> Edit Target
                  </Link>
                </div>
                <div className="col-2">
                  <Link to="/view-os" className="btn btn-success btn-block">
                    <i className="fa fa-plus-square"></i> View OS
                  </Link>
                </div>
                <div className="col-2">
                  <Link to="/create-os" className="btn btn-warning btn-block">
                    <i className="fa fa-plus-square"></i> Add OS
                  </Link>
                </div>
                <div className="col-2">
                  <Link to="/edit-os" className="btn btn-danger btn-block">
                    <i className="fa fa-plus-square"></i> Edit OS
                  </Link>
                </div>
                <div className="col-1"></div>
              </div>
            </div>
          </div>
          <div className="am-pagebody">
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
                          Month
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Start Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          End Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          No Of Working Days
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Target
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total IMS
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Difference
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.target_month}</td>
                          <td className="text-xs">{item.target_start_date}</td>
                          <td className="text-xs">{item.target_end_date}</td>
                          <td className="text-xs">{item.no_of_working_days}</td>
                          <td className="text-xs">0</td>
                          <td className="text-xs">0</td>
                          <td className="text-xs">0</td>
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
