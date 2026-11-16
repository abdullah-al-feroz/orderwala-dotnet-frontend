import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [chartOfAccount, setChartOfAccount] = useState({});
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/order/" + id).then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/chart-of-account-code").then((res) => {
      setChartOfAccount(res.data.chart_of_accounts);
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

  const delivery = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are going to Delivery of this Order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delivery Order!",
    }).then((result) => {
      if (result.isConfirmed) {
        inputs.id = id;
        Http.post("/order-delivery", inputs)
          .then((res) => {
            Swal.fire("Order Delivered! has been Created.", "success");
            navigate("/primary-sales", {
              state: { message: res.data.message, type: "success" },
            });
          })
          .catch(function (e) {
            setError(e.response.data.errors);
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
            <h5 className="am-title">Payment Receive</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-header p-4">
                    <a className="pt-2 d-inline-block">
                      {receiveData.distributor
                        ? receiveData.distributor.name
                        : ""}
                    </a>
                    <div className="float-right">
                      <h3 className="mb-0">Invoice {receiveData.receipt_no}</h3>
                      Date: {receiveData.date}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Order Info:</h5>
                        <div>Date : {receiveData.date}</div>
                        <div>Invoice No : {receiveData.receipt_no}</div>
                        <div>Time : {receiveData.time}</div>
                        <div>
                          Distributor :
                          {receiveData.distributor
                            ? receiveData.distributor.name
                            : ""}
                        </div>
                        <div>
                          Sr : {receiveData.sr ? receiveData.sr.name : ""}
                        </div>
                        <div>Payment Type : {receiveData.payment_type}</div>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Code</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Crtn Size</th>
                            <th className="right text-right">Order Qty</th>
                            <th className="text-right">Inv. Qty</th>
                            <th className="text-right">T/O Qty</th>
                            <th className="text-right">Rate</th>
                            <th className="text-right">Total Qty</th>
                            <th className="right text-right">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiveData.list
                            ? receiveData.list.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="center">{index + 1}</td>
                                  <td className="left strong">
                                    {item.product ? item.product.code : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.product
                                      ? item.product.unit
                                        ? item.product.unit.name
                                        : ""
                                      : ""}
                                  </td>
                                  <td className="left">
                                    {item.product ? item.product.pack_size : ""}
                                  </td>
                                  <td className="right text-right">
                                    {item.ordrPackQty}
                                  </td>
                                  <td className="text-right">{item.qty}</td>
                                  <td className="right text-right">
                                    {item.toQty}
                                  </td>
                                  <td className="right text-right">
                                    {item.rate}
                                  </td>
                                  <td className="right text-right">
                                    {parseFloat(item.toQty) +
                                      parseFloat(item.qty)}
                                  </td>
                                  <td className="right text-right">
                                    {parseFloat(item.price) *
                                      parseFloat(item.qty)}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-sm-5 d-flex align-items-center">
                        {receiveData.delivery_status != "delivered" ? (
                          <button
                            className="btn btn-primary btn-block mg-b-10"
                            onClick={() => delivery(id)}
                          >
                            <i className="fa fa-send mg-r-10"></i> Delivery
                            Order
                          </button>
                        ) : (
                          <button className="btn btn-success btn-block mg-b-10">
                            <i className="fa fa-send mg-r-10"></i> Order
                            Delivered
                          </button>
                        )}
                      </div>
                      <div className="col-lg-4 col-sm-5 ml-auto">
                        <table className="table table-clear">
                          <tbody>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">
                                  Total Price
                                </strong>
                              </td>
                              <td className="right text-right">
                                {receiveData.total_price}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">Discount</strong>
                              </td>
                              <td className="right text-right">
                                {receiveData.discount
                                  ? receiveData.discount
                                  : 0}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">
                                  Received Amount
                                </strong>
                              </td>
                              <td className="right text-right">
                                {receiveData.payment_amount}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">
                                  Due Amount
                                </strong>
                              </td>
                              <td className="right text-right">
                                <strong className="text-dark">
                                  {receiveData.due_amount}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
