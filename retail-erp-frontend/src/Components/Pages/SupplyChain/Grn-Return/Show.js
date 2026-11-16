import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/grn-return/" + id).then((res) => {
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

  const receiveWorkOrder = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You wan't to create an Purchase Order based on this quotation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Create Purchase Order!",
    }).then((result) => {
      if (result.isConfirmed) {
        inputs.circular_rfq_id = id;
        inputs.work_order_id = receiveData.id;
        inputs.work_order_items_id = receiveData.items;

        Http.post("/create-purchase-order/", inputs)
          .then((res) => {
            Swal.fire("Purchase Order! has been Created.", "success");
            navigate("/final-quotation", {
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
            <h5 className="am-title">Purchase Order</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-header p-4">
                    <a className="pt-2 d-inline-block">
                      <div className="col-sm-12">
                        <div>Date :{receiveData ? receiveData.date : ""}</div>
                        <div>
                          Receipt No :
                          {receiveData ? receiveData.receipt_no : ""}
                        </div>
                        <div>
                          GRN :
                          {receiveData.grn ? receiveData.grn.receipt_no : ""}
                        </div>
                        <div>
                          Factory :
                          {receiveData.factory ? receiveData.factory.name : ""}
                        </div>
                      </div>
                    </a>
                    <div className="float-right">
                      <h3 className="mb-0">
                        Purchase Order Return {receiveData.wo_number}
                      </h3>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Circular Info:</h5>
                        <div>
                          Date :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular.date
                              : ""
                            : ""}
                        </div>
                        <div>
                          Circular No :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular.circular_no
                              : ""
                            : ""}
                        </div>
                        <div>
                          Title :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular.title
                              : ""
                            : ""}
                        </div>
                        <div>
                          Subject :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular.subject
                              : ""
                            : ""}
                        </div>
                        <div>
                          Last Date Of Quotation :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular
                                  .last_date_of_quotation
                              : ""
                            : ""}
                        </div>
                        <div>
                          Location :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular.company_location
                                ? receiveData.work_order.circular
                                    .company_location.name
                                : ""
                              : ""
                            : ""}
                        </div>
                        <div>
                          Factory :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.factory
                                ? receiveData.work_order.factory.title
                                : ""
                              : ""
                            : ""}
                        </div>
                        <div>
                          Department :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.department
                                ? receiveData.work_order.department.title
                                : ""
                              : ""
                            : ""}
                        </div>
                        <div>
                          Description :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                              ? receiveData.work_order.circular.description
                              : ""
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Vendor</th>
                            <th>Unit</th>
                            <th>Item</th>
                            <th>Description</th>
                            <th className="right text-right">Price</th>
                            <th className="text-right">Qty</th>
                            <th className="right text-right">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="center">{index + 1}</td>
                                  <td className="left strong">
                                    {item.vendor ? item.vendor.name : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.unit
                                      ? item.unit.name + "-" + item.unit.qty
                                      : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td className="left">{item.description}</td>
                                  <td className="right text-right">
                                    {item.unit_price}
                                  </td>
                                  <td className="text-right">{item.qty}</td>
                                  <td className="right text-right">
                                    {item.actual_amount}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-sm-5 ml-auto">
                        <table className="table table-clear">
                          <tbody>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">Total</strong>
                              </td>
                              <td className="right text-right">
                                <strong className="text-dark">
                                  {receiveData.total_amount}
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
