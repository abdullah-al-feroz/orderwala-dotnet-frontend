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
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const [inputs, setInputs] = useState({
    month: month,
    year: year,
    status: "active",
  });

  const fetchData = () => {
    Http.get("/apa").then((res) => {
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
            <h5 className="am-title">All APA</h5>
            <Link to="/create-apa" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>APA
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
                          Type
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Staff
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Effective Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Basic
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Other
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Increment Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-right">
                          Updated Salary
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Remarks
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created At
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.type}</td>
                          <td className="text-xs">{item.staff.name}</td>
                          <td className="text-xs">{item.effective_date}</td>
                          <td className="text-xs">{item.basic}</td>
                          <td className="text-xs">{item.other}</td>
                          <td className="text-xs">{item.type_name_if}</td>
                          <td className="text-xs text-right">
                            {parseFloat(
                              item.staff.salary_structure_latest.gross
                            ).toFixed(2)}
                          </td>
                          <td className="text-xs">{item.remarks}</td>
                          <td className="text-xs">{item.created_at}</td>
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
