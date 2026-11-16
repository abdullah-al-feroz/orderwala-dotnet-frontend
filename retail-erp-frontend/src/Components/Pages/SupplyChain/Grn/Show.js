import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/grn/" + id).then((res) => {
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

  const print = () => {
    window.print();
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">GRN</h5>
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
                  .table_top th, .table_top td{ border: 0; padding: 0;}
                  .divFooter .table th, .divFooter .table td {border: 0;}
                  .table_main th, .table_main td {padding: 2px;}
              }
              .main-card { padding: 40px; }
            `}
          </style>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card main-card">
              <div className="col-lg-12">
                <div className="card card-primary card-outline">
                  <div className="card-header noPrint">
                    <div className="row">
                      <div className="col-7"></div>
                      <div className="col-5 text-right">
                        <button className="btn btn-default" onClick={print}>
                          {" "}
                          <i className="fa fa-print"></i>
                          &nbsp;Print
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0" id="printable-content">
                    <table className="table" width="100%">
                      <tbody>
                        <tr>
                          <td
                            width="100%"
                            align="center"
                            style={{ border: "none" }}
                          >
                            <img
                              src="https://ldlerp.com/assets/img/acpl-logo.png"
                              width="30%"
                            />
                            <p
                              style={{
                                textAlign: "center",
                                fontSize: "16px",
                                marginTop: "20px",
                              }}
                            >
                              Good Receive Voucher
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="row" style={{ marginBottom: "20px" }}>
                      <div className="col-12">
                        <table className="table table_top">
                          <tbody>
                            <tr>
                              <td>
                                <table className="table table-condensed border_style">
                                  <tbody>
                                    <tr>
                                      <td>Purchase Order No.</td>
                                      <td>
                                        :{" "}
                                        {receiveData.direct_purchase
                                          ? receiveData.direct_purchase
                                              .receipt_no
                                          : receiveData.work_order
                                          ? receiveData.work_order.wo_number
                                          : ""}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Receive Location</td>
                                      <td>
                                        :{" "}
                                        {receiveData.factory
                                          ? receiveData.factory.name
                                          : ""}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Supplier</td>
                                      <td>
                                        :{" "}
                                        {receiveData.vendor
                                          ? receiveData.vendor.name
                                          : ""}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td>
                                <table className="table table-condensed border_style">
                                  <tbody>
                                    <tr>
                                      <td>GRN No.</td>
                                      <td>: {receiveData.receipt_no}</td>
                                    </tr>
                                    <tr>
                                      <td>GRN Date</td>
                                      <td>: {receiveData.date} </td>
                                    </tr>
                                    <tr>
                                      <td>GRN Type</td>
                                      <td>: {receiveData.type}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <table
                          className="table table-bordered table-condensed table_main"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <th style={{ textAlign: "center" }}>
                                Code &amp; Product Name
                              </th>
                              <th colSpan="3" style={{ textAlign: "center" }}>
                                Challan
                              </th>
                              <th>Receive Qty</th>
                              <th>Units</th>
                            </tr>

                            <tr>
                              <th></th>
                              <th>No.</th>
                              <th>Date</th>
                              <th>Qty</th>
                              <th></th>
                              <th></th>
                            </tr>
                            {receiveData.items
                              ? receiveData.items.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      {item.product ? item.product.code : ""}
                                      &nbsp;{" "}
                                      {item.product ? item.product.name : ""}
                                    </td>

                                    <td></td>
                                    <td>{receiveData.challan_date} </td>
                                    <td style={{ textAlign: "right" }}>
                                      {item.direct_purchase_items
                                        ? item.direct_purchase_items.qty
                                        : ""}
                                      {item.work_order_items
                                        ? item.work_order_items.qty
                                        : ""}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      <b>{item.qty}</b>
                                    </td>
                                    <td>{item.unit.name}</td>
                                  </tr>
                                ))
                              : ""}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div
                      className="row"
                      style={{
                        textAlign: "center",
                        fontSize: "19px",
                        fontWeight: "bold",
                        marginTop: "40px",
                      }}
                    >
                      # VAT Rebat Amount -
                    </div>

                    <div className="row divFooter">
                      <div className="col-12">
                        <table className="table">
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
                {/* <div className="card">
                  <div className="card-header p-4">
                    <a className="pt-2 d-inline-block">
                      {receiveData.work_order
                        ? receiveData.work_order.circular.title
                        : ""}
                    </a>
                    <div className="float-right">
                      <h3 className="mb-0">GRN No {receiveData.receipt_no}</h3>
                      Date: {receiveData.date}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Circular Info:</h5>
                        <div>
                          Date :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.date
                            : ""}
                        </div>
                        <div>
                          Circular No :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.circular_no
                            : ""}
                        </div>
                        <div>
                          Title :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.title
                            : ""}
                        </div>
                        <div>
                          Subject :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.subject
                            : ""}
                        </div>
                        <div>
                          Last Date Of Quotation :
                          {receiveData.work_order
                            ? receiveData.work_order.circular
                                .last_date_of_quotation
                            : ""}
                        </div>
                        <div>
                          Location :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.company_location
                              ? receiveData.work_order.circular.company_location
                                  .name
                              : ""
                            : ""}
                        </div>
                        <div>
                          Factory :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.factory
                              ? receiveData.work_order.circular.factory.name
                              : ""
                            : ""}
                        </div>
                        <div>
                          Department :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.department
                              ? receiveData.work_order.circular.department.name
                              : ""
                            : ""}
                        </div>
                        <div>
                          Description :
                          {receiveData.work_order
                            ? receiveData.work_order.circular.description
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
                                    {item.work_order_items
                                      ? item.work_order_items.vendor.name
                                      : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.unit ? item.unit.name : ""}
                                  </td>
                                  <td className="left strong">
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td className="left">
                                    {item.work_order_items
                                      ? item.work_order_items
                                          .quotation_item_sent_from_vendor
                                          .remarks
                                      : ""}
                                  </td>
                                  <td className="right text-right">
                                    {item.unit_price}
                                  </td>
                                  <td className="text-right">
                                    {item.actual_qty}
                                  </td>
                                  <td className="right text-right">
                                    {item.actual_amount}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
