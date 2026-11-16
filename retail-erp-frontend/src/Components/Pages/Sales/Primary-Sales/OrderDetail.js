import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();

  const fetchData = () => {
    Http.get("/order/" + id).then((res) => {
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
  // function AmountInWords(amount) {
  //   const amountInWords = wordify(amount, "en");

  //   return (
  //     <div>
  //       <p>Total Amount: {amount}</p>
  //       <p>In Words: {amountInWords}</p>
  //     </div>
  //   );
  // }

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
                          to={{
                            pathname: "/mushok-6-3/" + receiveData.id,
                          }}
                          className="btn btn-primary btn-sm ms-1"
                        >
                          Mushok 6.3
                        </Link>
                        <Link
                          to={{
                            pathname: "/chalan/" + receiveData.id,
                          }}
                          className="btn btn-secondary btn-sm ms-1"
                        >
                          Chalan
                        </Link>
                        <Link
                          className="no-print btn-sm ms-1 btn btn-info"
                          onClick={print}
                        >
                          Print
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
                            <td>Invoice Qty</td>
                            <td>T/O Qty</td>
                            <td>Total Qty</td>
                            <td>Crtn Size</td>
                            <td>Carton</td>
                            <td>Unit Price</td>
                            <td>Primary Price</td>
                            <td>TP</td>
                            <td>MRP</td>
                            <td>Line Total</td>
                          </tr>
                          {receiveData.list
                            ? receiveData.list.map((item, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td align="right">{item.ordrPackQty}</td>
                                  <td align="right">{item.qty}</td>
                                  <td align="right">{item.toQty}</td>
                                  <td align="right">
                                    {parseInt(item.qty) + parseInt(item.toQty)}
                                  </td>
                                  <td align="right">
                                    {item.product ? item.product.pack_size : ""}
                                  </td>
                                  <td align="right">
                                    <b>
                                      {getCartonAndPieces(
                                        parseInt(item.qty) +
                                          parseInt(item.toQty),
                                        item.product
                                          ? item.product.pack_size
                                          : 0
                                      )}
                                    </b>
                                  </td>
                                  <td align="right">{item.rate} BDT</td>
                                  <td align="right">
                                    {item.primary_price} BDT
                                  </td>
                                  <td align="right">
                                    {item.secondary_price} BDT
                                  </td>
                                  <td align="right">{item.mrp} BDT</td>
                                  <td align="right">{item.price} BDT</td>
                                </tr>
                              ))
                            : ""}

                          <tr>
                            <td colspan="12" align="right">
                              <strong>Total Price</strong>
                            </td>
                            <td align="right">
                              <strong>{receiveData.total_price} BDT </strong>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="12" align="right">
                              <strong>Received Amount</strong>
                            </td>
                            <td align="right">
                              <strong>
                                {receiveData.received_amount > 0
                                  ? receiveData.received_amount
                                  : 0}{" "}
                                BDT
                              </strong>
                            </td>
                          </tr>
                          {/* <tr>
                            <td colspan="10">
                              <strong>Total Price In Words:</strong>
                              {AmountInWords(receiveData.total_price)}
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-12 signature_section">
                      <table className="table table-sm" width="100%">
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <span>
                                .................................
                                <br />
                                Distributor's Signature
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span>
                                .................................
                                <br />
                                Prepared By
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span>
                                .................................
                                <br />
                                Checked By
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span>
                                .................................
                                <br />
                                Approved By
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span>
                                .................................
                                <br />
                                Depot In-Charge
                              </span>
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
