import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import DatatableFunc from "../../../Common/DatatableFunc";
import he from "he";
import ProductStockDetail from "../../Reports/Distributor/ProductStockDetail";

const View = (props) => {
  const [data, setData] = useState({});
  const [orderHistory, setOrderHistory] = useState({});
  const [journalHistory, setJournalHistory] = useState({});
  const [productWiseOrderReturnHistory, setProductWiseOrderReturnHistory] =
    useState({});
  const [returnHistory, setReturnHistory] = useState({});
  const [partyLedger, setPartyLedger] = useState({});
  const [productStock, setProductStock] = useState({});
  const { id } = useParams();

  const fetchData = () => {
    Http.get("/distributor-details/" + id).then((res) => {
      setData(res.data.info);
      setOrderHistory(res.data.order);
      setProductWiseOrderReturnHistory(res.data.product_wise_total_order);
      setReturnHistory(res.data.return_order);
      setJournalHistory(res.data.journal);
      setPartyLedger(res.data.party_ledger);
      setProductStock(res.data.product_stock);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const calculateJournalBalance = () => {
    let balance = data.previous_due;
    let totalDebit = 0.0;
    let totalCredit = 0.0;
    return journalHistory.map((item, index) => {
      const { debit, credit } = item;

      if (credit > 0) {
        balance += credit;
        totalCredit += credit;
      } else if (debit > 0) {
        balance -= debit;
        totalDebit += debit;
      }

      // Decode HTML entities using the `he` library
      const decodedName = item.chart_of_account
        ? he.decode(item.chart_of_account.name)
        : "";

      return (
        <tr key={item.id}>
          <td>{index + 1}</td>
          <td>{item.journal_voucher ? item.journal_voucher.date : ""}</td>
          <td>{item.journal_voucher ? item.journal_voucher.time : ""}</td>
          <td>{item.type}</td>
          <td>{decodedName}</td>
          <td className="text-right">
            {debit > 0 ? parseFloat(debit).toFixed(2) : 0}
          </td>
          <td className="text-right">
            {credit > 0 ? parseFloat(credit).toFixed(2) : 0}
          </td>
          <td className="text-right">{balance.toFixed(2)}</td>
        </tr>
      );
    });
  };
  const calculatePartyLedger = () => {
    let balance = 0.0;
    let totalInvAmt = 0.0;
    let totalPaymentAmt = 0.0;
    return partyLedger.map((item, index) => {
      const {
        date,
        payment_date,
        transfer_date,
        receipt_no,
        type,
        inv_amount,
        payment_amount,
      } = item;
      const payable = parseFloat(inv_amount) - parseFloat(payment_amount);
      balance += inv_amount - payment_amount;
      totalInvAmt += inv_amount;
      totalPaymentAmt += payment_amount;

      return (
        <tr key={item.id}>
          <td>{date}</td>
          <td>{payment_date}</td>
          <td>{transfer_date}</td>
          <td>{receipt_no}</td>
          <td>{type}</td>
          <td className="text-right">
            {inv_amount > 0 ? parseFloat(inv_amount).toFixed(2) : ""}
          </td>
          <td className="text-right">
            {payment_amount > 0 ? parseFloat(payment_amount).toFixed(2) : ""}
          </td>
          <td className="text-right">
            {payable > 0 ? parseFloat(payable).toFixed(2) : ""}
          </td>
          <td className="text-right">{balance.toFixed(2)}</td>
        </tr>
      );
    });
  };
  const calculateTotalDebit = () => {
    if (!Array.isArray(journalHistory)) {
      return 0.0;
    }

    return journalHistory.reduce(
      (total, item) =>
        item.debit > 0 ? parseFloat(total) + parseFloat(item.debit) : 0,
      0.0
    );
  };

  const calculateTotalCredit = () => {
    if (!Array.isArray(journalHistory)) {
      return 0.0;
    }

    return journalHistory.reduce(
      (total, item) =>
        item.credit > 0 ? parseFloat(total) + parseFloat(item.credit) : 0,
      0.0
    );
  };

  const calculateTotalBalance = () => {
    const totalDebit = calculateTotalDebit();
    const totalCredit = calculateTotalCredit();
    return data.previous_due + totalCredit - totalDebit;
  };

  //  Set Input Value with state
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((values) => ({ ...values, [name]: value }));
  };

  // Form Submit
  const formSubmit = () => {
    Http.post("/staff-filter/", data).then((res) => {});
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Distributor Details</h5>
        </div>
        {/* <div className="am-pagebody pb-0">
          <div className="card pd-sm-40">
            <h5 className="text-center">{data.name}</h5>
            <hr />
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="row">
                  <div className="col-md-5">
                    <label>
                      Start Date <i class="fa fa-star required"></i>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      value={data.start_date}
                      onChange={handleChange}
                      data-required
                    />
                  </div>
                  <div className="col-md-5">
                    <label>
                      End Date <i class="fa fa-star required"></i>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="end_date"
                      value={data.end_date}
                      onChange={handleChange}
                      data-required
                    />
                  </div>
                  <div className="col-md-2">
                    <label>.</label>
                    <button
                      className="btn btn-primary btn-block mg-b-10"
                      onClick={formSubmit}
                    >
                      <i className="fa fa-send mg-r-10"></i> Search
                    </button>
                  </div>
                  <div className="col-md-12">
                    <p className="text-danger text-center mb-0">
                      Showing Data From the beginning to till date
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="am-pagebody  pb-0">
          <div className="card pd-10 pd-sm-40">
            <div className="row">
              <div className="col-md-12 text-center pb-2">
                <h4>{data.name} Details</h4>
              </div>
              <hr />
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-7">
                    <table className="table table-bordered table-hover table-sm p-2">
                      <tbody>
                        <tr>
                          <th>Proprietor Name</th>
                          <td>{data.name}</td>
                        </tr>
                        <tr>
                          <th>Godown Address</th>
                          <td>{data.godown_address}</td>
                        </tr>
                        <tr>
                          <th>Current Address</th>
                          <td>{data.present_address}</td>
                        </tr>
                        <tr>
                          <th>Notes</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Contact Number</th>
                          <td>{data.contact_phone}</td>
                        </tr>
                        <tr>
                          <th>Secondary Contact</th>
                          <td>{data.secondary_phone}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-5">
                    <table className="table table-bordered table-hover table-sm p-2">
                      <tbody>
                        <tr>
                          <th>Distributor Type</th>
                          <td>{data.business_type}</td>
                        </tr>
                        <tr>
                          <th>Base</th>
                          <td>{data.base ? data.base.base.name : ""}</td>
                        </tr>
                        <tr>
                          <th>Region</th>
                          <td>{data.base ? data.base.region.name : ""}</td>
                        </tr>
                        <tr>
                          <th>Area</th>
                          <td>{data.base ? data.base.area.name : ""}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{data.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-right">
                <small>
                  <table className="table table-bordered table-hover table-sm p-2">
                    <tbody>
                      <tr>
                        <th>Total Purchase Orders</th>
                        <td>
                          {parseFloat(data.order_count) > 0
                            ? parseFloat(data.order_count).toFixed(2)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Purchase Amount</th>
                        <td>
                          {parseFloat(data.order_sum_total_price) > 0
                            ? parseFloat(data.order_sum_total_price).toFixed(2)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Payment Amount</th>
                        <td>
                          {data.order_sum_payment_amount > 0
                            ? parseFloat(data.order_sum_payment_amount).toFixed(
                                2
                              )
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Discount Received</th>
                        <td>
                          {data.order_sum_discount > 0
                            ? parseFloat(data.order_sum_discount).toFixed(2)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Due Amount</th>
                        <td>
                          {data.order_sum_due_amount > 0
                            ? parseFloat(data.order_sum_due_amount).toFixed(2)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Due amount paid</th>
                        <td>
                          {data.journal_voucher_items_sum_amount > 0
                            ? parseFloat(
                                data.journal_voucher_items_sum_amount
                              ).toFixed(2)
                            : 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </small>
              </div>
              <div className="col-md-12">
                <div
                  style={{
                    backgroundColor: "rgb(233, 236, 239)",
                    padding: "20px",
                  }}
                >
                  <h6 className="text-center">Places</h6>
                  <hr />
                  {data && data.sr_base ? (
                    data.sr_base.map((baseItem) => {
                      // Check if base and its routes exist before proceeding
                      if (!baseItem.base || !baseItem.base.routes) {
                        return null; // Or display a placeholder if base or routes are null
                      }

                      return baseItem.base.routes.map((route) => {
                        // Check if places exist in the route before proceeding
                        if (!route.places) {
                          return null; // Or display a placeholder if places are null
                        }

                        return route.places.map((place) => (
                          <span
                            key={place.id}
                            className="badge bg-secondary me-1"
                            style={{ fontSize: "80%", fontWeight: 300 }}
                          >
                            {place.place ? place.place.name : ""}
                          </span>
                        ));
                      });
                    })
                  ) : (
                    <p>Loading or no data available</p> // Display loading message or some placeholder
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="am-pagebody  pb-0">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-md-4">
                <div className="box box-warning">
                  <div className="box-header">
                    <h4 className="box-title pb-1 text-center">
                      Account Summary
                    </h4>{" "}
                    <hr />
                  </div>
                  <div className="box-body">
                    <table className="table table-bordered table-hover table-striped table-condensed">
                      <tbody>
                        <tr>
                          <td>Initial Due</td>
                          <td align="right">
                            {data.previous_due > 0
                              ? parseFloat(data.previous_due).toFixed(2)
                              : 0.0}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Sales Amount</td>
                          <td align="right">
                            {parseFloat(data.order_sum_total_price) > 0
                              ? parseFloat(data.order_sum_total_price).toFixed(
                                  2
                                )
                              : 0}{" "}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Returned Amount</td>
                          <th align="right" className="text-right">
                            {parseFloat(data.order_return_sum_total_price) > 0
                              ? parseFloat(
                                  data.order_return_sum_total_price
                                ).toFixed(2)
                              : 0}{" "}
                          </th>
                        </tr>
                        <tr>
                          <td>Total Discount per receipt</td>
                          <td align="right">
                            {data.order_sum_discount > 0
                              ? parseFloat(data.order_sum_discount).toFixed(2)
                              : 0}{" "}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Payabale</td>
                          <td align="right">
                            {parseFloat(
                              parseFloat(
                                data.order_sum_total_price > 0
                                  ? data.order_sum_total_price
                                  : 0
                              ) -
                                parseFloat(
                                  data.order_return_sum_total_price > 0
                                    ? data.order_return_sum_total_price
                                    : 0
                                ) -
                                parseFloat(
                                  data.order_sum_discount > 0
                                    ? data.order_sum_discount
                                    : 0
                                )
                            ).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <th>Total Payments</th>
                          <th align="right" className="text-right">
                            {parseFloat(
                              data.journal_voucher_items_sum_amount
                            ).toFixed(2)}{" "}
                          </th>
                        </tr>
                        <tr>
                          <th>Total Paid</th>
                          <th align="right" className="text-right">
                            {parseFloat(
                              data.journal_voucher_items_sum_amount
                            ).toFixed(2)}{" "}
                          </th>
                        </tr>
                        <tr>
                          <th title="For Enable rebate paid client has to be fixed chart of account code">
                            Rebate Paid
                          </th>
                          <th align="right" className="text-right">
                            0
                          </th>
                        </tr>
                        <tr>
                          <th>Total Due Payabale</th>
                          <th align="right" className="text-right">
                            {parseFloat(
                              parseFloat(
                                data.order_sum_total_price > 0
                                  ? data.order_sum_total_price
                                  : 0
                              ) -
                                parseFloat(
                                  data.order_return_sum_total_price > 0
                                    ? data.order_return_sum_total_price
                                    : 0
                                ) -
                                parseFloat(
                                  data.order_sum_discount > 0
                                    ? data.order_sum_discount
                                    : 0
                                )
                            ) -
                              parseFloat(
                                data.journal_voucher_items_sum_amount
                              ).toFixed(2)}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="box box-warning">
                  <div className="box-header">
                    <h4 className="box-title pb-1 text-center">Statistics</h4>
                    <hr />
                  </div>
                  <div className="box-body">
                    <table className="table table-bordered table-hover table-striped table-condensed">
                      <tbody>
                        <tr>
                          <td>Maximum Purchase Amount</td>
                          <td align="right">
                            {parseFloat(data.order_max_total_price).toFixed(2)}
                          </td>
                          <td>Maximum Paid Amount</td>
                          <td align="right">
                            {parseFloat(
                              data.journal_voucher_items_max_amount
                            ).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td>Minimum Purchase Amount</td>
                          <td align="right">
                            {parseFloat(data.order_min_total_price).toFixed(2)}
                          </td>
                          <td>Minimum Paid Amount</td>
                          <td align="right">
                            {parseFloat(
                              data.journal_voucher_items_min_amount
                            ).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td>Average Purchase Amount</td>
                          <td align="right">
                            {parseFloat(data.order_avg_total_price).toFixed(2)}
                          </td>
                          <td>Average Paid Amount</td>
                          <td align="right">
                            {parseFloat(
                              data.journal_voucher_items_avg_amount
                            ).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Purchase Amount</td>
                          <td align="right">
                            {parseFloat(data.order_sum_total_price) > 0
                              ? parseFloat(data.order_sum_total_price).toFixed(
                                  2
                                )
                              : 0}
                          </td>
                          <td>Total Paid Amount</td>
                          <td align="right">
                            {parseFloat(
                              data.journal_voucher_items_sum_amount
                            ).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td>Total Due Amount</td>
                          <td align="right" colSpan={3}>
                            {parseFloat(
                              parseFloat(
                                data.order_sum_total_price > 0
                                  ? data.order_sum_total_price
                                  : 0
                              ) -
                                parseFloat(
                                  data.order_return_sum_total_price > 0
                                    ? data.order_return_sum_total_price
                                    : 0
                                ) -
                                parseFloat(
                                  data.order_sum_discount > 0
                                    ? data.order_sum_discount
                                    : 0
                                )
                            ) -
                              parseFloat(
                                data.journal_voucher_items_sum_amount
                              ).toFixed(2)}
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

        <div className="am-pagebody  pb-0">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">Party Ledger</h4>
                    <hr />
                  </div>
                  <div className="box-body">
                    <div className="table-responsive p-0 pb-2">
                      <table className="table table-bordered table-hover table-striped display datatable">
                        <thead>
                          <tr>
                            <th>Inv. Date</th>
                            <th>Payment Date</th>
                            <th>Transfer Date</th>
                            <th>Receipt No</th>
                            <th>Type</th>
                            <th>Inv Amount</th>
                            <th>Payment Amount</th>
                            <th>Payable</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {partyLedger.length > 0 ? calculatePartyLedger() : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="am-pagebody  pb-0">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">Journal Ledger</h4>
                    <hr />
                  </div>
                  <div className="box-body">
                    <div className="table-responsive p-0 pb-2">
                      <table className="table table-bordered table-hover table-striped display">
                        <thead>
                          <tr>
                            <th>Sl No</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>COA</th>
                            <th>Dr</th>
                            <th>Cr</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key="0">
                            <th colSpan={7} className="text-center">
                              Opening Balance
                            </th>
                            <td className="text-right">
                              {data.previous_due
                                ? parseFloat(data.previous_due).toFixed(2)
                                : 0}
                            </td>
                          </tr>
                          {journalHistory.length > 0
                            ? calculateJournalBalance()
                            : ""}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan="5" className="text-right">
                              Total
                            </th>
                            <th className="text-right">
                              {calculateTotalDebit()}
                            </th>
                            <th className="text-right">
                              {calculateTotalCredit()}
                            </th>
                            <th className="text-right">
                              {calculateTotalBalance()}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="am-pagebody  pb-0">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">Order History</h4>{" "}
                    <hr />
                  </div>
                  <div className="box-body">
                    <div className="table-responsive p-0 pb-2">
                      <table className="table table-bordered table-hover table-striped display datatable">
                        <thead>
                          <tr>
                            <th>Sl.</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Receipt No</th>
                            <th>Total Price</th>
                            <th>VAT</th>
                            <th>Discount</th>
                            <th>Payment Amount</th>
                            <th>Due</th>
                            <th>Payment</th>
                            <th>Delivery</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderHistory.length > 0
                            ? orderHistory.map((item, index) => (
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.date}</td>
                                  <td>{item.time}</td>
                                  <td>{item.receipt_no}</td>
                                  <td className="text-right">
                                    {item.total_price > 0
                                      ? parseFloat(item.total_price).toFixed(2)
                                      : ""}
                                    /=
                                  </td>
                                  <td className="text-right">
                                    {item.vat > 0
                                      ? parseFloat(item.vat).toFixed(2)
                                      : ""}
                                  </td>
                                  <td className="text-right">
                                    {item.discount > 0
                                      ? parseFloat(item.discount).toFixed(2)
                                      : ""}
                                  </td>
                                  <td className="text-right">
                                    {item.payment_amount > 0
                                      ? parseFloat(item.payment_amount).toFixed(
                                          2
                                        )
                                      : ""}
                                    /=
                                  </td>
                                  <td className="text-right">
                                    {item.due_amount > 0
                                      ? parseFloat(item.due_amount).toFixed(2)
                                      : ""}
                                    /=
                                  </td>
                                  <td>
                                    {item.payment_receive_status == 1
                                      ? "Payment Received"
                                      : "Payment Not Received"}
                                  </td>
                                  <td>
                                    {item.transfer_status == 1
                                      ? "Delivered"
                                      : "Undelivered"}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="am-pagebody  pb-0">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">Return History</h4>{" "}
                    <hr />
                  </div>
                  <div className="box-body">
                    <div className="table-responsive p-0 pb-2">
                      <table className="table table-bordered table-hover table-striped display datatable">
                        <thead>
                          <tr>
                            <th>Sl.</th>
                            <th>Date</th>
                            <th>Receipt No</th>
                            <th>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {returnHistory.length > 0
                            ? returnHistory.map((item, index) => (
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <th>{item.date}</th>
                                  <th>{item.receipt_no}</th>
                                  <td className="text-right">
                                    {parseFloat(item.total_price).toFixed(2)}
                                    /=
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="am-pagebody  pb-0">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">
                      Product Purchase History
                    </h4>{" "}
                    <hr />
                  </div>
                  <div className="box-body">
                    <div className="table-responsive p-0 pb-2">
                      <table className="table table-bordered table-hover table-striped display datatable">
                        <thead>
                          <tr>
                            <th>Sl.</th>
                            <th>Product name</th>
                            <th>Quantity Sold </th>
                            <th>Price Sold</th>
                            <th>Quantity Returned</th>
                            <th>Price Returned</th>
                            <th>Final Quantity</th>
                            <th>Final Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productWiseOrderReturnHistory.length > 0
                            ? productWiseOrderReturnHistory.map(
                                (item, index) => (
                                  <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <th>{item.name}</th>
                                    <td className="text-right">
                                      {item.stockQty > 0
                                        ? parseFloat(item.stockQty).toFixed(2)
                                        : ""}
                                    </td>
                                    <td className="text-right">
                                      {item.stockAmount > 0
                                        ? parseFloat(item.stockAmount).toFixed(
                                            2
                                          )
                                        : ""}
                                      /=
                                    </td>
                                    <td className="text-right">
                                      {item.returnQty > 0
                                        ? parseFloat(item.returnQty).toFixed(2)
                                        : ""}
                                    </td>
                                    <td className="text-right">
                                      {item.returnAmount > 0
                                        ? parseFloat(item.returnAmount).toFixed(
                                            2
                                          )
                                        : ""}
                                    </td>
                                    <td className="text-right">
                                      {parseFloat(
                                        parseFloat(item.stockQty) -
                                          parseFloat(item.returnQty)
                                      ).toFixed(2)}
                                    </td>
                                    <td className="text-right">
                                      {parseFloat(
                                        parseFloat(item.stockAmount) -
                                          parseFloat(item.returnAmount)
                                      ).toFixed(2)}
                                      /=
                                    </td>
                                  </tr>
                                )
                              )
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="am-pagebody  pb-0">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Products Stock
            </h6>
            <hr />
            <div className="row">
              <div className="table-responsive p-0 pb-2">
                <ProductStockDetail data={productStock} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
