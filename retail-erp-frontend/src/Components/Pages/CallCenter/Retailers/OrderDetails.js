import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const Show = () => {
  const [receiveData, setReceiveData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await Http.get("/customer-care/retailer-order-details/" + id);
      setReceiveData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const print = () => {
    window.print();
  };

  const totalAmount =
    receiveData.list?.reduce(
      (acc, item) => acc + parseFloat(item.actual_amount || 0),
      0
    ) || 0;

  const getCartonAndPieces = (totalQty, crtnSize) => {
    const crtns = Math.floor(totalQty / crtnSize);
    const pcs = totalQty % crtnSize;
    if (crtns < 1) return `${pcs} pcs`;
    else return `${crtns} Crtn ${pcs} pcs`;
  };

  return (
    <div>
      <IsLogin />
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Customer Order Detail</h5>
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
                            <td width="8%">
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
                              <br />
                              Delivery Status : {receiveData.delivery_status}
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
                            <td>Order Qty</td>
                            <td>T/O Item</td>
                            <td>T/O Qty</td>
                            <td>Unit Price</td>
                            <td>Total</td>
                          </tr>
                          {receiveData.list &&
                            receiveData.list.map((item, index) => (
                              <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>
                                  {item.basket
                                    ? item.basket.title
                                    : item.product
                                    ? item.product.name
                                    : ""}
                                </td>
                                <td align="right">{item.qty}</td>
                                <td>
                                  {item.minimum_percentage_allowed === 1
                                    ? item.offer_info.product
                                    : item.offer_product
                                    ? item.offer_product.name
                                    : "-"}
                                </td>
                                <td align="right">
                                  {item.trade_offer_qty || "-"}
                                </td>
                                <td align="right">{item.unit_price}</td>
                                <td align="right">{item.actual_amount}</td>
                              </tr>
                            ))}

                          <tr>
                            <td colSpan="6" align="right">
                              <strong>Total Amount</strong>
                            </td>
                            <td align="right">
                              <strong>{totalAmount.toFixed(2)}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="6" align="right">
                              <strong>Discount Amount</strong>
                            </td>
                            <td align="right">
                              <strong>{receiveData.discount} </strong>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="6" align="right">
                              <strong>Grand Total</strong>
                            </td>
                            <td align="right">
                              <strong>{receiveData.total_price} </strong>
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
  );
};

export default Show;
