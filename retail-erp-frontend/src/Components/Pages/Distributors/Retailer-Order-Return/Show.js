import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";
import useRequiredFields from "../../../../hooks/useRequiredFields";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ type: "", return_order_to_do: "" });
  const [error, setError] = useState({});
  const [role, setRole] = useState(null);
  const { checkRequiredFields } = useRequiredFields();

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = () => {
    Http.get("/distributor/retailer-order-return/" + id).then((res) => {
      setReceiveData(res.data);
    });
    Http.get("/staff-type-check").then((res) => {
      setRole(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const print = () => {
    window.print();
  };

  function getCartonAndPieces(totalQty, crtnSize) {
    const crtns = Math.floor(totalQty / crtnSize);
    const pcs = totalQty % crtnSize;
    if (crtns < 1) return `${pcs} pcs`;
    else return `${crtns} Crtn ${pcs} pcs`;
  }
  const receive = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are going to Receive of this Order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Receive Order!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.get("/distributor/retailer-return-order-recieve/" + id)
          .then((res) => {
            Swal.fire("Order Received Successfully!", "success");
            navigate("/distributor/retailer-order-return", {
              state: {
                message: "Order Successfully Received",
                type: "success",
              },
            });
          })
          .catch(function (e) {
            setError(e.response.data.errors);
          });
      }
    });
  };
  const receiveCustomerCare = (id) => {
    if (checkRequiredFields) {
      if (inputs.type == "" || inputs.return_order_to_do == "") {
        Swal.fire("Please Fill All Fields", "", "error");
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You are going to Receive of this Order!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Receive Order!",
        }).then((result) => {
          if (result.isConfirmed) {
            Http.post(
              "/customer-care/retailer-return-order-recieve/" + id,
              inputs
            )
              .then((res) => {
                Swal.fire("Order Received Successfully!", "success");
                navigate("/distributor/retailer-order-return", {
                  state: {
                    message: "Order Successfully Received",
                    type: "success",
                  },
                });
              })
              .catch(function (e) {
                setError(e.response.data.errors);
              });
          }
        });
      }
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Customer Order Return Detail</h5>
          </div>
          <style>
            {`
              @media print {
                  body * { visibility: hidden; font-size:10px;}
                  .no-print { visibility: hidden !important; }
                  #printable-content, #printable-content * { visibility: visible; }
                  #printable-content { position: absolute; left: 0; top: 0; width: 100%; }
                  .main-card { padding: 0px; }
                  .am-pagebody { padding: 0px; }
                  .am-mainpanel { margin-top: 0px; }
                  .signature_section .table td{ border-bottom: 0;}
              }
              .main-card { padding: 40px; }
            `}
          </style>
          <div className="am-pagebody">
            <div className="card main-card">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg text-right">
                        {role == "distributor" ? (
                          receiveData.distributor_recieved != 1 ? (
                            <button
                              className="no-print btn btn-primary btn-sm ms-1"
                              onClick={() => receive(id)}
                            >
                              <i className="fa fa-send mg-r-10"></i> Receive
                              Return Order
                            </button>
                          ) : (
                            <button className="no-print  btn-sm ms-1 btn btn-success">
                              <i className="fa fa-send mg-r-10"></i> Return
                              Order Received
                            </button>
                          )
                        ) : (
                          ""
                        )}

                        <Link
                          className="no-print btn-sm ms-1 btn btn-info"
                          onClick={print}
                        >
                          <i className="fa fa-print"></i> &nbsp; Print
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" id="printable-content">
                  <div className="row">
                    <div className="col-md-12">
                      <table className="table" width="100%">
                        <tbody>
                          <tr>
                            <td width="100%" align="center">
                              <img
                                src="../../assets/img/logo.png"
                                alt="Logo"
                                style={{
                                  width: "30%",
                                }}
                              />
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <table className="table" width="100%">
                        <tbody>
                          <tr>
                            <td width="18%">
                              <strong>Shop Name</strong>
                              <br />
                              <strong>Shop Id</strong>
                              <br />
                              <strong>Owner Name</strong>
                              <br />
                              <strong>Phone</strong>
                              <br />
                              <strong>Address</strong>
                            </td>
                            <td width="42%">
                              :{" "}
                              {receiveData.customer
                                ? receiveData.customer.shop_name
                                : ""}{" "}
                              <br />:{" "}
                              {receiveData.customer
                                ? receiveData.customer.code
                                : ""}
                              <br />:{" "}
                              {receiveData.customer
                                ? receiveData.customer.owner_name
                                : ""}{" "}
                              <br />:{" "}
                              {receiveData.customer
                                ? receiveData.customer.phone
                                : ""}{" "}
                              <br />:{" "}
                              {receiveData.customer
                                ? receiveData.customer.address
                                : ""}
                            </td>
                            <td width="35%" align="right">
                              Invoice From{" "}
                              <b>
                                {receiveData.distributor
                                  ? receiveData.distributor.name
                                  : ""}
                              </b>
                              <br />
                              Invoice Date : {receiveData.date} (
                              {receiveData.time})
                              <br />
                              Working Date : {receiveData.date}
                              <br />
                              Invoice No. : {receiveData.receipt_no}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <table className="table" width="100%">
                        <tbody>
                          <tr>
                            <td align="center">
                              <h4>
                                <u>INVOICE</u>
                              </h4>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <table
                        className="table table-bordered table-sm"
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td>Sl.</td>
                            <td>Product Name</td>
                            <td>Qty</td>
                            <td>Crtn Size</td>
                            <td>Carton</td>
                            <td>Unit Price</td>
                            <td>Line Total</td>
                          </tr>
                          {receiveData.list
                            ? receiveData.list.map((item, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td align="right">{item.qty}</td>
                                  <td align="right">
                                    {item.product ? item.product.pack_size : ""}
                                  </td>
                                  <td align="right">
                                    <b>
                                      {getCartonAndPieces(
                                        item.invoice_qty,
                                        item.product
                                          ? item.product.pack_size
                                          : 0
                                      )}
                                    </b>
                                  </td>
                                  <td align="right">{item.unit_price} BDT</td>
                                  <td align="right">
                                    {item.actual_amount} BDT
                                  </td>
                                </tr>
                              ))
                            : ""}

                          <tr>
                            <td colspan="6" align="right">
                              <strong>Total Price</strong>
                            </td>
                            <td align="right">
                              <strong>{receiveData.total_price} BDT </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {role == "customer-care" &&
                      receiveData.customer_care_recieved != 1 ? (
                        <div>
                          <div className="col-lg">
                            <label>
                              Return Type{" "}
                              <i className="fa fa-star required"></i>
                            </label>
                            <select
                              className="form-control"
                              name="type"
                              onChange={handleChange}
                              data-required
                            >
                              <option value="">Select Type</option>
                              <option value="damage-product">
                                Damage Product
                              </option>
                              <option value="wrong-product">
                                Wrong Product
                              </option>
                            </select>
                            <label className="error">
                              {displayError("type")}
                            </label>
                          </div>
                          <div className="col-lg">
                            <label>
                              Return Order To Do{" "}
                              <i className="fa fa-star required"></i>
                            </label>
                            <select
                              className="form-control"
                              name="return_order_to_do"
                              onChange={handleChange}
                            >
                              <option value="">Select Type</option>
                              <option value="product-replacement">
                                Product Replacement
                              </option>
                              <option value="balance-add">Balance Add</option>
                            </select>
                            <label className="error">
                              {displayError("return_order_to_do")}
                            </label>
                          </div>
                          <div className="col-lg">
                            <label>Remarks</label>
                            <textarea
                              className="form-control"
                              name="remarks"
                              onChange={handleChange}
                            >
                              {inputs.remarks || ""}
                            </textarea>
                            <label className="error">{error.remarks}</label>
                          </div>
                        </div>
                      ) : receiveData.customer_care_recieved == 1 ? (
                        <div>
                          <div className="col-lg">
                            <label>Return Type : </label>
                            <b>{receiveData.customer_care_return_type}</b>
                          </div>
                          <div className="col-lg">
                            <label>Return Order To Do : </label>
                            <b>
                              {receiveData.customer_care_return_order_to_do}
                            </b>
                          </div>
                          <div className="col-lg">
                            <label>Remarks : </label>
                            <b>{receiveData.customer_care_remarks}</b>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {role == "customer-care" ? (
                        receiveData.customer_care_recieved != 1 ? (
                          <div className="mt-5">
                            <button
                              className="no-print btn btn-success btn-sm ms-1 float-right"
                              onClick={() => receiveCustomerCare(id)}
                            >
                              <i className="fa fa-send mg-r-10"></i> Accept
                              Return Order
                            </button>
                            <button
                              className="no-print btn btn-danger btn-sm ms-1 float-right"
                              onClick={() => receiveCustomerCare(id)}
                            >
                              <i className="fa fa-send mg-r-10"></i> Reject
                              Return Order
                            </button>
                          </div>
                        ) : (
                          <button className="no-print  btn-sm ms-1 btn btn-success float-right">
                            <i className="fa fa-send mg-r-10"></i>Customer Care
                            Return Order Accepted
                          </button>
                        )
                      ) : (
                        ""
                      )}
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
