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
    Http.get("/work-order/" + id).then((res) => {
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
                      {receiveData.circular ? receiveData.circular.title : ""}
                    </a>
                    <div className="float-right">
                      <h3 className="mb-0">Invoice {receiveData.wo_number}</h3>
                      Date: {receiveData.date}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Circular Info:</h5>
                        <div>
                          Date :
                          {receiveData.circular
                            ? receiveData.circular.date
                            : ""}
                        </div>
                        <div>
                          Circular No :
                          {receiveData.circular
                            ? receiveData.circular.circular_no
                            : ""}
                        </div>
                        <div>
                          Title :
                          {receiveData.circular
                            ? receiveData.circular.title
                            : ""}
                        </div>
                        <div>
                          Subject :
                          {receiveData.circular
                            ? receiveData.circular.subject
                            : ""}
                        </div>
                        <div>
                          Last Date Of Quotation :
                          {receiveData.circular
                            ? receiveData.circular.last_date_of_quotation
                            : ""}
                        </div>
                        <div>
                          Location :
                          {receiveData.circular
                            ? receiveData.circular.company_location
                              ? receiveData.circular.company_location.name
                              : ""
                            : ""}
                        </div>
                        <div>
                          Factory :
                          {receiveData.circular
                            ? receiveData.circular.factory
                              ? receiveData.circular.factory.name
                              : ""
                            : ""}
                        </div>
                        <div>
                          Department :
                          {receiveData.circular
                            ? receiveData.circular.department
                              ? receiveData.circular.department.name
                              : ""
                            : ""}
                        </div>
                        <div>
                          Description :
                          {receiveData.circular
                            ? receiveData.circular.description
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
                            <th className="text-right">Receive Qty</th>
                            <th className="text-right">Due Qty</th>
                            <th className="right text-right">Total Price</th>
                            <th className="right text-right">
                              Receive Products Price
                            </th>
                            <th className="right text-right">
                              Due Amount Product
                            </th>
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
                                    {item.unit ? item.unit.name : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td className="left">
                                    {item.quotation_item_sent_from_vendor
                                      ? item.quotation_item_sent_from_vendor
                                          .remarks
                                      : ""}
                                  </td>
                                  <td className="right text-right">
                                    {item.unit_price}
                                  </td>
                                  <td className="text-right">{item.qty}</td>
                                  <td className="text-right">
                                    {item.received_qty}
                                  </td>
                                  <td className="text-right">
                                    {item.qty - item.received_qty}
                                  </td>
                                  <td className="right text-right">
                                    {item.actual_amount}
                                  </td>
                                  <td className="right text-right">
                                    {item.received_qty * item.unit_price}
                                  </td>
                                  <td className="right text-right">
                                    {item.actual_amount -
                                      item.received_qty * item.unit_price}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-sm-5 d-flex align-items-center">
                        {receiveData.status != "completed" ? (
                          <Link
                            className="btn btn-primary btn-block mg-b-10"
                            to={{
                              pathname: "/create-grn/" + receiveData.id,
                            }}
                          >
                            <i className="fa fa-send mg-r-10"></i> Receive Order
                          </Link>
                        ) : (
                          <button className="btn btn-success btn-block mg-b-10">
                            <i className="fa fa-send mg-r-10"></i> Receive Order
                            Completed
                          </button>
                        )}
                      </div>
                      <div className="col-lg-4 col-sm-5 ml-auto">
                        <table className="table table-clear">
                          <tbody>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">Subtotal</strong>
                              </td>
                              <td className="right text-right">
                                {receiveData.sub_total}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">Discount</strong>
                              </td>
                              <td className="right text-right">
                                {receiveData.discount}
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">VAT</strong>
                              </td>
                              <td className="right text-right">
                                {receiveData.vat}
                              </td>
                            </tr>
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
