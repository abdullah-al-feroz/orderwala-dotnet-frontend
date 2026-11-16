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
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/direct-purchase/" + id).then((res) => {
      console.log(res.data);
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

  const dataList = receiveData.items || [];

  // Calculate the totals
  const vatAmount = dataList.reduce(
    (acc, item) => acc + parseFloat(item.vat_amount || 0),
    0
  );

  const print = () => {
    window.print();
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
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
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Direct Purchase</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card card-primary card-outline">
              <div className="card-header noPrint">
                <div className="row">
                  <div className="col-md-7">
                    <h4 className="card-title">
                      Purchase Order - {receiveData.receipt_no}
                    </h4>
                  </div>
                  <div className="col-md-5 text-right">
                    <button className="btn btn-default" onClick={print}>
                      {" "}
                      <i className="fa fa-print"></i>
                      &nbsp;Print
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body" id="printable-content">
                <div className="row">
                  <div className="col-md-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td style={{ border: "none" }} align="center">
                            <img
                              src="https://ldlerp.com/assets/img/acpl-logo.png"
                              width="30%"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td width="30%">
                            {receiveData.vendor ? receiveData.vendor.name : ""}
                            <br />
                            {receiveData.vendor
                              ? receiveData.vendor.present_address
                              : ""}{" "}
                          </td>
                          <td width="35%" align="right">
                            Order Date: {receiveData.date}
                            <br />
                            Delivery Date:
                            <br />
                            Receipt No: {receiveData.receipt_no}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td align="center">
                            <h5>
                              <u>Purchase Order</u>
                            </h5>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12" _style="min-height:880px;">
                    <table className=" table table-bordered table-sm">
                      <tbody>
                        <tr>
                          <th width="3%">sl.</th>
                          <th width="10%">Code</th>
                          <th width="20%">Item Name</th>
                          <th width="10%">Ordr Qty</th>
                          <th width="7%">Rcv Qty</th>
                          <th width="10%">Product Price</th>
                          <th width="10%">Salary reimbursement</th>
                          <th width="10%">Vat On Price</th>
                          <th width="10%">Rate</th>
                          <th width="10%">Amount</th>
                        </tr>
                        {receiveData.items
                          ? receiveData.items.map((item, index) => (
                              <tr>
                                <td key={item.id}>{index + 1}</td>
                                <td>{item.product ? item.product.code : ""}</td>
                                <td>{item.product ? item.product.name : ""}</td>
                                <td align="right">{item.qty}</td>
                                <td align="right">{item.received_qty}</td>
                                <td align="right">
                                  {parseFloat(item.price).toFixed(2)}
                                </td>
                                <td align="right">
                                  {item.salary_reinversment}
                                </td>
                                <td align="right">{item.vat_amount}</td>
                                <td align="right">{item.rate}</td>
                                <td align="right">
                                  {parseInt(item.total_amount).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          : ""}
                        <tr>
                          <td colspan="9" align="right">
                            Total Price
                          </td>
                          <td align="right">
                            <strong>
                              {parseInt(receiveData.total_amount).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="9" align="right">
                            VAT
                          </td>
                          <td align="right">
                            <strong>{vatAmount.toFixed(2)}</strong>
                          </td>
                        </tr>
                        {/* <tr>
                          <td colspan="10">
                            <strong>Net Payable In Words : </strong>
                            <b style={{ fontWeight: "bold !important" }}>
                              Three Lakh Thirty-Six Thousand Four Hundred Taka
                              Only
                            </b>
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <b>Note:</b>{" "}
                    <ol style={{ marginTop: "20px", paddingLeft: "0px" }}>
                      <li style={{ listStyle: "none" }}>
                        <b>Terms &amp; Condition .</b>
                      </li>
                    </ol>
                    <ol style={{ marginTop: "20px" }}>
                      {receiveData.terms_condition
                        ? receiveData.terms_condition.map((item, index) => (
                            <li>{item.terms_condition}</li>
                          ))
                        : ""}
                    </ol>
                    <p></p>
                    <p></p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <table className="table" style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            width="30%"
                            align="center"
                            style={{ borderTop: "none" }}
                          >
                            <br />
                            <br />
                            <br />
                            ......................................................
                            <br />
                            Prepared By
                          </td>
                          <td width="10%" style={{ borderTop: "none" }}>
                            &nbsp;
                          </td>
                          <td
                            width="30%"
                            align="center"
                            style={{ borderTop: "none" }}
                          >
                            <br />
                            <br />
                            <br />
                            ......................................................
                            <br />
                            Checked By
                          </td>
                          <td width="10%" style={{ borderTop: "none" }}>
                            &nbsp;
                          </td>
                          <td
                            width="30%"
                            align="center"
                            style={{ borderTop: "none" }}
                          >
                            <br />
                            <br />
                            <br />
                            ......................................................
                            <br />
                            Approved By
                          </td>
                          <td width="10%" style={{ borderTop: "none" }}>
                            &nbsp;
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
  );
};

export default Show;
