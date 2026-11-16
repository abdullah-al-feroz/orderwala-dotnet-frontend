import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/distributor/order-return/" + id).then((res) => {
      setReceiveData(res.data);
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
        Http.get("/distributor/distributor-purchase-order/" + id)
          .then((res) => {
            Swal.fire("Order Received Successfully!", "success");
            navigate("/distributor/order", {
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Order Detail</h5>
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
                            <td width="18%">
                              <strong>Distributor Name</strong>
                              <br />
                              <strong>Distributor Id</strong>
                              <br />
                              <strong>Contact Person</strong>
                              <br />
                              <strong>Phone</strong>
                              <br />
                              <strong>Address</strong>
                            </td>
                            <td width="42%">
                              :{" "}
                              {receiveData.distributor
                                ? receiveData.distributor.name
                                : ""}{" "}
                              <br />:{" "}
                              {receiveData.distributor
                                ? receiveData.distributor.code
                                : ""}
                              <br />:{" "}
                              {receiveData.distributor
                                ? receiveData.distributor.contact_person
                                : ""}{" "}
                              <br />:{" "}
                              {receiveData.distributor
                                ? receiveData.distributor.contact_phone
                                : ""}{" "}
                              <br />:{" "}
                              {receiveData.distributor
                                ? receiveData.distributor.godown_address
                                : ""}
                            </td>
                            <td width="35%" align="right">
                              Invoice For <b>Group A</b>
                              <br />
                              Invoice Date : {receiveData.date} (
                              {receiveData.time})
                              <br />
                              Working Date : {receiveData.date}
                              <br />
                              Invoice No. : {receiveData.receipt_no}
                              <br />
                              SR Name :{" "}
                              {receiveData.sr ? receiveData.sr.name : ""}
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
                                <u>Purchase Return</u>
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
                            <td>Unit Price</td>
                            <td>Line Total</td>
                          </tr>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td align="right">{item.qty}</td>
                                  <td align="right">{item.unit_price} BDT</td>
                                  <td align="right">
                                    {item.actual_amount} BDT
                                  </td>
                                </tr>
                              ))
                            : ""}

                          <tr>
                            <td colspan="4" align="right">
                              <strong>Total Price</strong>
                            </td>
                            <td align="right">
                              <strong>{receiveData.total_price} BDT </strong>
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
