import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [circular, setCircular] = useState({});
  const [workOrderAmount, setWorkOrderAmount] = useState({});
  const [alert, setAlert] = useState(null);
  const { id } = useParams();

  const fetchData = () => {
    Http.get("/rfq-sent-from-vendor/" + id).then((res) => {
      setReceiveData(res.data.info);
      setCircular(res.data.circular);
      setWorkOrderAmount(res.data.amount);
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
            <h5 className="am-title">{circular.title}</h5>
            <Link
              to={{ pathname: "/circular-compare/" + id }}
              className="btn btn-primary"
            >
              Compare
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
                          Vendor
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Validaty Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Work Order Amount
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
                          <td className="text-xs">{item.vendor.name}</td>
                          <td className="text-xs">
                            {item.quotation_validity_date}
                          </td>
                          <td className="text-xs">{item.total_amount}</td>
                          <td className="text-xs">
                            {workOrderAmount[item.vendor_id]}
                          </td>
                          <td>
                            <Link
                              to={{
                                pathname: "/show-vendor-quotation/" + item.id,
                              }}
                              className="btn btn-info btn-sm ms-1"
                              title="Show"
                            >
                              <i
                                className="fa fa-list ms-1"
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
