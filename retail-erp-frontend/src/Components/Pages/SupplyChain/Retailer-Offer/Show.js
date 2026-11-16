import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
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
    Http.get("/retailer-offer/" + id).then((res) => {
      console.log(res.data);
      setReceiveData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const replaceWords = (str) => {
    if (!str) return "";

    const replacements = {
      coupon: "Coupon Offer",
      registration: "Registration Offer",
      one_percent: "One Percent Discount",
      two_percent: "Two Percent Discount",
      refferral: "Referral Bonus", // assuming 'refferral' is not a typo
      _: " ", // Replaces underscores with spaces
    };

    return str
      .split(" ")
      .map((word) => replacements[word] || word)
      .join(" ");
  };

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
            <h5 className="am-title">Offer</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card card-primary card-outline">
              <div className="card-header noPrint">
                <div className="row">
                  <div className="col-md-7">
                    <h4 className="card-title">{receiveData.title}</h4>
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
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td width="20%">Region</td>
                          <td>
                            {receiveData.region ? receiveData.region.name : ""}
                          </td>
                        </tr>
                        <tr>
                          <td width="20%">Area</td>
                          <td>
                            {receiveData.area ? receiveData.area.name : ""}
                          </td>
                        </tr>
                        <tr>
                          <td width="20%">Base</td>
                          <td>
                            {receiveData.base ? receiveData.base.name : ""}
                          </td>
                        </tr>
                        <tr>
                          <td width="20%">Route</td>
                          <td>
                            {receiveData.route ? receiveData.route.name : ""}
                          </td>
                        </tr>
                        <tr>
                          <td width="20%">Distributor</td>
                          <td>
                            {receiveData.distributor
                              ? receiveData.distributor.name
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td width="20%">Title</td>
                          <td>{receiveData.title}</td>
                        </tr>
                        <tr>
                          <td width="20%">Description</td>
                          <td>{receiveData.description}</td>
                        </tr>
                        <tr>
                          <td width="20%">Offer Type</td>
                          <th>{replaceWords(receiveData.offer_type)}</th>
                        </tr>
                        <tr>
                          <td width="20%">Start Date</td>
                          <td>{receiveData.start_date}</td>
                        </tr>
                        <tr>
                          <td width="20%">End Date</td>
                          <td>{receiveData.end_date}</td>
                        </tr>
                        {receiveData.offer_type == "basket" ? (
                          <>
                            <tr>
                              <th width="20%">Primary Price</th>
                              <th>{receiveData.primary_price}</th>
                            </tr>
                            <tr>
                              <th width="20%">Secondary Price</th>
                              <th>{receiveData.secondary_price}</th>
                            </tr>
                            <tr>
                              <th width="20%">MRP</th>
                              <th>{receiveData.mrp}</th>
                            </tr>
                          </>
                        ) : (
                          ""
                        )}
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
                              <u>Offer Item</u>
                            </h5>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12" _style="min-height:880px;">
                    {receiveData.offer_type == "coupon" ||
                      receiveData.offer_type == "registration" ||
                      receiveData.offer_type == "one_percent" ||
                      receiveData.offer_type == "two_percent" ||
                      receiveData.offer_type == "refferral" ? (
                      <table className=" table table-bordered table-sm">
                        <tbody>
                          <tr>
                            <th className="text-center">Minimum Purchase</th>
                            <th className="text-center">Discount Type</th>
                            <th className="text-center">Discount Amount</th>
                          </tr>
                          <tr>
                            <td className="text-center">
                              {receiveData.minimum_purchase}
                            </td>
                            <td className="text-center">
                              {receiveData.discount_type}
                            </td>
                            <td className="text-center">
                              {receiveData.discount_value}
                            </td>
                          </tr>
                          <tr>
                            <th className="text-center ">SL</th>
                            <th className="text-left" colSpan={2} >Item Name</th>
                          </tr>
                          {receiveData.percentage_offer_exception_product && receiveData.percentage_offer_exception_product.map((item, index) => (

                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left text-danger" colSpan={2}>{item.product.name}</td>
                            </tr>

                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className=" table table-bordered table-sm">
                        <tbody>
                          <tr>
                            <th width="3%">sl.</th>
                            <th width="20%">Item Name</th>
                            {receiveData.offer_type ==
                              "product_percent_offer" ? (
                              <>
                                <th width="10%">Minimum Purchase Amount</th>
                                <th width="10%">Percentage</th>
                              </>
                            ) : receiveData.rate_or_qty == "rate" ? (
                              <>
                                {receiveData.offer_type != "basket" ? (
                                  <th width="10%">Percentage</th>
                                ) : (
                                  ""
                                )}
                                <th width="10%">Qty</th>
                              </>
                            ) : (
                              <>
                                <th width="10%">Actual Qty</th>
                                <th width="10%">Trade Offer FG</th>
                                <th width="10%">Trade Offer Qty</th>
                              </>
                            )}
                          </tr>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                              <tr>
                                <td key={item.id}>{index + 1}</td>
                                <td>
                                  {item.category ? item.category.name : ""}
                                  {item.product ? item.product.name : ""}
                                </td>
                                {receiveData.offer_type ==
                                  "product_percent_offer" ? (
                                  <>
                                    <th width="10%">
                                      {item.minimum_purchase_amount}
                                    </th>
                                    <th>{item.price}</th>
                                  </>
                                ) : receiveData.rate_or_qty == "rate" ? (
                                  <>
                                    {receiveData.offer_type != "basket" ? (
                                      <th width="10%">{item.price}</th>
                                    ) : (
                                      ""
                                    )}
                                    <th width="10%">{item.qty}</th>
                                  </>
                                ) : (
                                  <>
                                    <th width="10%">{item.qty}</th>
                                    <th width="10%">
                                      {item.bonus_product
                                        ? item.bonus_product.name
                                        : ""}
                                    </th>
                                    <th width="10%">{item.bonus_quantity}</th>
                                  </>
                                )}
                              </tr>
                            ))
                            : ""}

                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Show;
