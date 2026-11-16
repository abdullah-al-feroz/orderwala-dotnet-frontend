import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import Http from "../../../../Common/Http";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import IsLogin from "../../../../Common/IsLogin";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/view-quotation-quotation/" + id).then((res) => {
      console.log(res.data);
      setReceiveData(res.data);
    });
  };

  function getTotal(qty, unit_price, vat, tax) {
    let amount = parseFloat(qty) * parseFloat(unit_price);
    let vatValue = (amount * parseFloat(vat)) / 100;
    let taxValue = (amount * parseFloat(tax)) / 100;

    return amount + vatValue + taxValue;
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Vendor Quotation Detail</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-header p-4">
                    <a className="pt-2 d-inline-block">{receiveData.title}</a>
                    <div className="float-right">
                      <h3 className="mb-0">Invoice {receiveData.wo_number}</h3>
                      Date: {receiveData.date}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-4">
                        <h5 className="mb-3">Circular Info:</h5>
                        <p>Date :{receiveData.date}</p>
                        <p>
                          Circular No :{receiveData.circular_rfq?.circular_no}
                        </p>
                        <p>Title :{receiveData.circular_rfq?.title}</p>
                        <p>Subject :{receiveData.circular_rfq?.subject}</p>
                        <p>
                          Last Date Of Quotation :
                          {receiveData.circular_rfq?.last_date_of_quotation}
                        </p>
                      </div>
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4">
                        <h5 className="mb-3">Vendor Info:</h5>
                        <p>Vendor Name :{receiveData.vendor?.name}</p>
                        <p>
                          Contact person :{receiveData.vendor?.contact_person}
                        </p>
                        <p>Phone :{receiveData.vendor?.contact_phone}</p>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Item</th>
                            <th className="text-right">Qty</th>
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Vat</th>
                            <th className="text-right">Tax</th>
                            <th className="text-right">Total</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="center">{index + 1}</td>
                                  <td className="left strong">
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td className="right text-right">
                                    {item.qty}
                                  </td>
                                  <td className="right text-right">
                                    {item.unit_price}
                                  </td>
                                  <td className="right text-right">
                                    {item.vat}
                                  </td>
                                  <td className="right text-right">
                                    {item.tax}
                                  </td>
                                  <td className="right text-right">
                                    {getTotal(
                                      item.qty,
                                      item.unit_price,
                                      item.vat,
                                      item.tax
                                    )}
                                  </td>
                                  <td className="right text-right">
                                    {item.desc}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-sm-5 d-flex align-items-center"></div>
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
                            <tr>
                              <td className="left">
                                <strong className="text-dark">Discount</strong>
                              </td>
                              <td className="right text-right">
                                <strong className="text-dark">
                                  {receiveData.discount}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="left">
                                <strong className="text-dark">
                                  Grand Total
                                </strong>
                              </td>
                              <td className="right text-right">
                                <strong className="text-dark">
                                  {parseFloat(receiveData.total_amount) -
                                    parseFloat(receiveData.discount)}
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
