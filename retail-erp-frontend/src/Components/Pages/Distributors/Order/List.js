import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [role, setRole] = useState(null);

  const fetchData = () => {
    Http.get("/order").then((res) => {
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Purchase Order</h5>
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
                          D.Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          O.Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Invoice No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Distributor Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Inv. Total
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          PAID
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.delivery_date}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">{item.receipt_no}</td>
                          <td className="text-xs">
                            {item.distributor ? item.distributor.name : ""}
                          </td>
                          <td className="text-xs">{item.total_price}</td>
                          <td className="text-xs">{item.payment_amount}</td>
                          <td className="text-xs">
                            <Link
                              to={{
                                pathname: "/distributor/order/" + item.id,
                              }}
                              className="btn btn-info btn-sm"
                            >
                              <i className="fa fa-list" aria-hidden="true"></i>
                            </Link>

                            {item.grn_received_status != 1 ? (
                              <Link
                                to={{
                                  pathname: "/distributor/order/" + item.id,
                                }}
                                className="btn btn-primary btn-sm ms-2"
                              >
                                Receive
                              </Link>
                            ) : (
                              <button className="btn btn-success btn-sm ms-2">
                                <i className="fa fa-check"></i> Received
                              </button>
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
