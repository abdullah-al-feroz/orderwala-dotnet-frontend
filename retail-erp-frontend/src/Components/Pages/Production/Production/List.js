import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/production").then((res) => {
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
            <h5 className="am-title">All Productoins</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

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
                          Production Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Receive Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Reference No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Batch No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Product
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Batch Size
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Quantity
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Unit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Receive
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.receive_date}</td>
                          <td className="text-xs">{item.receipt_no}</td>
                          <td className="text-xs">{item.batch_no}</td>
                          <td className="text-xs">
                            {item.product ? item.product.name : ""}
                          </td>
                          <td className="text-xs">{item.batch_size}</td>
                          <td className="text-xs">{item.qty}</td>
                          <td className="text-xs">
                            {item.product
                              ? item.product.unit
                                ? item.product.unit.name
                                : ""
                              : ""}
                          </td>
                          <td className="text-xs">
                            {item.receive_status != 1 ? (
                              <Link
                                to={{
                                  pathname: "/production-receive/" + item.id,
                                }}
                                className="btn btn-info btn-sm"
                              >
                                Receive
                              </Link>
                            ) : (
                              <p className="btn btn-success btn-sm">
                                <i className="fa fa-check"></i>
                              </p>
                            )}
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
