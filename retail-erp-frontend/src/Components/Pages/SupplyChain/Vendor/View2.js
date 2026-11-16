import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const View = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [vendorCode, setVendorCode] = useState({});
  // if upload has any File
  const [grn, setGrn] = useState([]);
  const [directPurchases, setDirectPurchases] = useState([]);
  const [assetDirectPurchases, setAssetDirectPurchases] = useState([]);
  const [workOrder, setWorkOrder] = useState([]);
  const [assetWorkOrder, setAssetWorkOrder] = useState([]);

  const fetchData = () => {
    Http.get("/vendor/" + id).then((res) => {
      setInputs({
        name: res.data.info.name,
        contact_person: res.data.info.contact_person,
        contact_phone: res.data.info.contact_phone,
        secondary_phone: res.data.info.secondary_phone,
        email: res.data.info.email,
        present_address: res.data.info.present_address,
        permanent_address: res.data.info.permanent_address,
        website: res.data.info.website,
        previous_due: res.data.info.previous_due
          ? res.data.info.previous_due
          : 0,
        notes: res.data.info.notes,

        grn_count: res.data.info.grn_count > 0 ? res.data.info.grn_count : 0,
        direct_purchases_count:
          res.data.info.direct_purchases_count > 0
            ? res.data.info.direct_purchases_count
            : 0,
        work_order_items_count:
          res.data.info.work_order_items_count > 0
            ? res.data.info.work_order_items_count
            : 0,
        asset_direct_purchases_count:
          res.data.info.asset_direct_purchases_count > 0
            ? res.data.info.asset_direct_purchases_count
            : 0,
        asset_work_order_items_count:
          res.data.info.asset_work_order_items_count > 0
            ? res.data.info.asset_work_order_items_count
            : 0,

        grn_amount:
          res.data.info.grn.items_sum_actual_amount > 0
            ? res.data.info.grn.items_sum_actual_amount
            : 0,
        direct_purchase_amount: res.data.info.direct_purchases.items_sum_price
          ? res.data.info.direct_purchases.items_sum_price
          : 0,
        asset_direct_purchase_amount: res.data.info.asset_direct_purchases
          .items_sum_price
          ? res.data.info.asset_direct_purchases.items_sum_price
          : 0,
        work_order_item_amount:
          res.data.info.work_order_items_sum_actual_amount > 0
            ? res.data.info.work_order_items_sum_actual_amount
            : 0,
        asset_work_order_item_amount:
          res.data.info.asset_work_order_items_sum_actual_amount > 0
            ? res.data.info.asset_work_order_items_sum_actual_amount
            : 0,

        total_paid_amount:
          res.data.info.journal_voucher_items_sum_amount > 0
            ? res.data.info.journal_voucher_items_sum_amount
            : 0,

        license_no: res.data.info.vendor_documents.license_no,
        vat_reg_no: res.data.info.vendor_documents.vat_reg_no,
        tin_no: res.data.info.vendor_documents.tin_no,
        nid: res.data.info.vendor_documents.nid,
      });

      setVendorCode(res.data.info.code);

      setGrn(res.data.grn);
      setDirectPurchases(res.data.directPurchases);
      setAssetDirectPurchases(res.data.assetDirectPurchases);
      setWorkOrder(res.data.workOrder);
      setAssetWorkOrder(res.data.assetWorkOrder);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  Set Input Value with state
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Form Submit
  const formSubmit = () => {
    Http.post("/staff-filter/", inputs).then((res) => {});
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Vendor Details</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-sm-40">
            <h5 className="text-center">{inputs.name}</h5>
            <hr />
            <div className="row">
              <div className="col-lg">
                <label>
                  Start Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={inputs.start_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  End Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={inputs.end_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>.</label>
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-md-12 text-center pb-2">
                <h4>Details</h4>
              </div>
              <hr />
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-7">
                    <table className="table table-bordered table-hover table-sm p-2">
                      <tbody>
                        <tr>
                          <th>Contact Person</th>
                          <td>{inputs.contact_person}</td>
                        </tr>
                        <tr>
                          <th>Address</th>
                          <td>{inputs.present_address}</td>
                        </tr>
                        <tr>
                          <th>Notes</th>
                          <td>NID No: {inputs.nid}</td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>{inputs.contact_phone}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{inputs.email}</td>
                        </tr>
                        <tr>
                          <th>Website</th>
                          <td>{inputs.website || ""}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-5">
                    <table className="table table-bordered table-hover table-sm p-2">
                      <tbody>
                        <tr>
                          <th>License No.</th>
                          <td>{inputs.license_no || ""}</td>
                        </tr>
                        <tr>
                          <th>VAT Reg No.</th>
                          <td>{inputs.vat_reg_no || ""}</td>
                        </tr>
                        <tr>
                          <th>TIN</th>
                          <td>{inputs.tin_no || ""}</td>
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
                          {parseFloat(inputs.grn_count) > 0 ||
                          parseFloat(inputs.asset_direct_purchases_count) > 0 ||
                          parseFloat(inputs.asset_work_order_items_count) > 0 ||
                          parseFloat(inputs.direct_purchases_count) > 0 ||
                          parseFloat(inputs.work_order_items_count) > 0
                            ? parseFloat(inputs.grn_count) +
                              parseFloat(inputs.asset_direct_purchases_count) +
                              parseFloat(inputs.asset_work_order_items_count) +
                              parseFloat(inputs.direct_purchases_count) +
                              parseFloat(inputs.work_order_items_count)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Purchase Amount</th>
                        <td>
                          {parseFloat(inputs.grn_amount) > 0 ||
                          parseFloat(inputs.direct_purchase_amount) > 0 ||
                          parseFloat(inputs.asset_direct_purchase_amount) > 0 ||
                          parseFloat(inputs.work_order_item_amount) > 0 ||
                          parseFloat(inputs.asset_work_order_item_amount) > 0
                            ? parseFloat(inputs.grn_amount) +
                              parseFloat(inputs.direct_purchase_amount) +
                              parseFloat(inputs.asset_direct_purchase_amount) +
                              parseFloat(inputs.work_order_item_amount) +
                              parseFloat(inputs.asset_work_order_item_amount)
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Paid Amount</th>
                        <td>
                          {inputs.total_paid_amount > 0
                            ? inputs.total_paid_amount
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <th>Total VAT Paid</th>
                        <td>0</td>
                      </tr>
                      <tr>
                        <th>Total Discount Received</th>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="am-pagebody">
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
                          <td align="right">{inputs.previous_due} BDT</td>
                        </tr>
                        <tr>
                          <td>Total Purchased Amount</td>
                          <td align="right">
                            {inputs.direct_purchase_amount > 0 ||
                            inputs.asset_direct_purchase_amount > 0 ||
                            inputs.work_order_item_amount > 0 ||
                            inputs.asset_work_order_item_amount > 0
                              ? parseFloat(inputs.direct_purchase_amount) +
                                parseFloat(
                                  inputs.asset_direct_purchase_amount
                                ) +
                                parseFloat(inputs.work_order_item_amount) +
                                parseFloat(inputs.asset_work_order_item_amount)
                              : 0}
                            &nbsp; BDT
                          </td>
                        </tr>
                        <tr>
                          <td>Total Payabale</td>
                          <th align="right" className="text-right">
                            {inputs.direct_purchase_amount > 0 ||
                            inputs.asset_direct_purchase_amount > 0 ||
                            inputs.work_order_item_amount > 0 ||
                            inputs.asset_work_order_item_amount > 0 ||
                            inputs.previous_due > 0
                              ? parseFloat(inputs.direct_purchase_amount) +
                                parseFloat(
                                  inputs.asset_direct_purchase_amount
                                ) +
                                parseFloat(inputs.work_order_item_amount) +
                                parseFloat(
                                  inputs.asset_work_order_item_amount
                                ) +
                                parseFloat(inputs.previous_due)
                              : 0}
                            &nbsp; BDT
                          </th>
                        </tr>
                        <tr>
                          <td>Total Payments</td>
                          <td align="right">{inputs.total_paid_amount} BDT</td>
                        </tr>
                        <tr>
                          <td>Total Due Payments</td>
                          <td align="right">
                            {parseFloat(inputs.direct_purchase_amount) +
                              parseFloat(inputs.asset_direct_purchase_amount) +
                              parseFloat(inputs.work_order_item_amount) +
                              parseFloat(inputs.asset_work_order_item_amount) -
                              inputs.total_paid_amount}{" "}
                            BDT
                          </td>
                        </tr>
                        <tr>
                          <th>Total Due Payabale</th>
                          <th align="right" className="text-right">
                            {parseFloat(inputs.direct_purchase_amount) +
                              parseFloat(inputs.asset_direct_purchase_amount) +
                              parseFloat(inputs.work_order_item_amount) +
                              parseFloat(inputs.asset_work_order_item_amount) +
                              inputs.previous_due}{" "}
                            BDT
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
                          <td align="right"></td>
                          <td>Maximum Paid Amount</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Minimum Purchase Amount</td>
                          <td align="right"></td>
                          <td>Minimum Paid Amount</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Average Purchase Amount</td>
                          <td align="right"></td>
                          <td>Average Paid Amount</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Total Purchase Amount</td>
                          <td align="right"></td>
                          <td>Total Paid Amount</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Maximum Discount Received</td>
                          <td align="right"></td>
                          <td>Maximum Vat Paid</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Minimum Discount Received</td>
                          <td align="right"></td>
                          <td>Minimum Vat Paid</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Average Discount Received</td>
                          <td align="right"></td>
                          <td>Average Vat Paid</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Total Discount Received</td>
                          <td align="right"></td>
                          <td>Total Vat Paid</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Maximum Due Amount</td>
                          <td align="right"></td>
                          <td>Minimum Due Amount</td>
                          <td align="right"></td>
                        </tr>
                        <tr>
                          <td>Average Due Amount</td>
                          <td align="right"></td>
                          <td>Total Due Amount</td>
                          <td align="right"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="am-pagebody">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">Direct Purchases</h4>
                    <hr />
                  </div>
                  <div className="box-body">
                    <table className="table table-bordered table-hover table-striped display">
                      <thead>
                        <tr>
                          <th>Sl.</th>
                          <th>Date-Time</th>
                          <th>Receipt No</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grn.length > 0
                          ? grn.map((item, index) => (
                              <>
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.date}</td>
                                  <td>{item.receipt_no}</td>
                                  <td align="right">
                                    {item.items_sum_actual_amount}
                                  </td>
                                </tr>
                              </>
                            ))
                          : ""}
                        {directPurchases.length > 0
                          ? directPurchases.map((item, index) => (
                              <>
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.date}</td>
                                  <td>{item.receipt_no}</td>
                                  <td align="right">{item.items_sum_price}</td>
                                </tr>
                              </>
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
        <div className="am-pagebody">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">
                      Asset Direct Purchases
                    </h4>{" "}
                    <hr />
                  </div>
                  <div className="box-body">
                    <table className="table table-bordered table-hover table-striped display">
                      <thead>
                        <tr>
                          <th>Sl.</th>
                          <th>Date-Time</th>
                          <th>Receipt No</th>
                          <th>Total Price</th>
                          <th>VAT</th>
                          <th>Discount</th>
                          <th>Payed Amount</th>
                          <th>Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetDirectPurchases.length > 0
                          ? assetDirectPurchases.map((item, index) => (
                              <>
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.date}</td>
                                  <td>{item.receipt_no}</td>
                                  <td align="right">{item.items_sum_price}</td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                </tr>
                              </>
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
        <div className="am-pagebody">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title text-center">Work Order</h4> <hr />
                  </div>
                  <div className="box-body">
                    <table className="table table-bordered table-hover table-striped display">
                      <thead>
                        <tr>
                          <th>Sl.</th>
                          <th>Date-Time</th>
                          <th>Work Order No</th>
                          <th>Total Price</th>
                          <th>VAT</th>
                          <th>Discount</th>
                          <th>Payed Amount</th>
                          <th>Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workOrder.length > 0
                          ? workOrder.map((item, index) => (
                              <>
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.date}</td>
                                  <td>{item.wo_number}</td>
                                  <td align="right">{item.total_amount}</td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                </tr>
                              </>
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
        <div className="am-pagebody">
          <div className="card pd-2 pd-sm-40">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-info">
                  <div className="box-header">
                    <h4 className="box-title">Asset Work Order</h4>
                  </div>
                  <div className="box-body">
                    <table className="table table-bordered table-hover table-striped display">
                      <thead>
                        <tr>
                          <th>Sl.</th>
                          <th>Date-Time</th>
                          <th>Work Order No</th>
                          <th>Total Price</th>
                          <th>VAT</th>
                          <th>Discount</th>
                          <th>Payed Amount</th>
                          <th>Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetWorkOrder.length > 0
                          ? assetWorkOrder.map((item, index) => (
                              <>
                                <tr key={item.id}>
                                  <td>{index + 1}</td>
                                  <td>{item.date}</td>
                                  <td>{item.wo_number}</td>
                                  <td align="right">{item.total_amount}</td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                  <td align="right"></td>
                                </tr>
                              </>
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
    </div>
  );
};

export default View;
