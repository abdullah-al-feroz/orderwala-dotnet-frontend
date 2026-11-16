import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const Create = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [receiveData, setReceiveData] = useState([]);
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [rmpm, setRmpm] = useState({});
  const [factory, setFactory] = useState({});
  const [distributor, setDistributor] = useState({});
  const [sr, setSr] = useState({});
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleInvChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    // Line Total Price
    let price = value * parseFloat(list[index]["price"]);

    inputInfo[index]["line_total"] = price;
    setList(inputInfo);

    // Total Price
    let totalPrice = 0;
    Object.keys(list).forEach((key) => {
      totalPrice += list[key].line_total;
    });
    inputs.total_price = totalPrice;

    setInputs((values) => ({ ...values, ["final_price"]: totalPrice }));

    // Trade Offer
    let trade_offer_qty = 0;

    if (list[index]["trade_offer"] != null) {
      let trade_offer_input_qty = list[index]["trade_offer"].qty
        ? list[index]["trade_offer"].qty
        : 0;
      let trade_offer_offer_qty = list[index]["trade_offer"].offer_qty
        ? list[index]["trade_offer"].offer_qty
        : 0;
      let trade_offer_number = parseInt(value / trade_offer_input_qty);
      if (trade_offer_number > 0) {
        trade_offer_qty = parseFloat(value / trade_offer_input_qty);
        inputInfo[index]["to_qty"] = trade_offer_qty;
        setList(inputInfo);
      }
    }
    // Total Qty
    inputInfo[index]["total_qty"] =
      parseFloat(value) + parseFloat(trade_offer_qty);
    setList(inputInfo);

    // Due Amount
    let final_price = totalPrice > 0 ? parseFloat(totalPrice) : 0;
    let previous_due =
      inputs.previous_due > 0 ? parseFloat(inputs.previous_due) : 0;
    let received_amount =
      inputs.received_amount > 0 ? parseFloat(inputs.received_amount) : 0;

    setInputs((values) => ({
      ...values,
      ["due_amount"]: final_price + previous_due - received_amount,
    }));
  };
  const handleTOChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    inputInfo[index]["total_qty"] =
      parseFloat(value) + parseFloat(inputInfo[index]["qty"]);
    setList(inputInfo);
  };
  const handleDiscountChange = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setInputs((values) => ({
      ...values,
      ["final_price"]: parseFloat(inputs.total_price) - parseFloat(value),
    }));

    // Due Amount
    let final_price = parseFloat(inputs.total_price) - parseFloat(value);
    let previous_due =
      inputs.previous_due > 0 ? parseFloat(inputs.previous_due) : 0;
    let received_amount =
      inputs.received_amount > 0 ? parseFloat(inputs.received_amount) : 0;

    setInputs((values) => ({
      ...values,
      ["due_amount"]: final_price + previous_due - received_amount,
    }));
  };
  const handleReceivedAmountChange = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    // Due Amount
    let final_price =
      inputs.final_price > 0 ? parseFloat(inputs.final_price) : 0;
    let previous_due =
      inputs.previous_due > 0 ? parseFloat(inputs.previous_due) : 0;
    let received_amount = value > 0 ? parseFloat(value) : 0;

    setInputs((values) => ({
      ...values,
      ["due_amount"]: final_price + previous_due - received_amount,
    }));
  };

  const handleDistributorChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    Http.get("/distributor/" + value).then((res) => {
      const listInfo = [];
      Object.keys(res.data.sr_base_info).forEach((key) => {
        listInfo.push({
          id: res.data.sr_base_info[key].base.id,
          name: res.data.sr_base_info[key].base.name,
        });
      });
      setSr(listInfo);
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    let price =
      parseFloat(inputInfo[index]["rate"]) *
      parseFloat(inputInfo[index]["qty"]);
  };

  // Default Load
  const fetchData = () => {
    Http.get("/pro-factory-transfer/" + id).then((res) => {
      setReceiveData(res.data);

      setInputs({
        receipt_no: res.data.receipt_no,
        factory_id: res.data.factory_id,
        date: res.data.date,
        time: res.data.time,
        total_price: res.data.total_price,
      });

      const listInfo = [];
      Object.keys(res.data.list).forEach((key) => {
        listInfo.push({
          id: res.data.list[key].product.id,
          code: res.data.list[key].product.code,
          name: res.data.list[key].product.name,
          qty: res.data.list[key].qty,
          to_qty: res.data.list[key].to_qty,
          unit_id: res.data.list[key].product.unit_id,
          pack_size: res.data.list[key].product.pack_size,
          price: res.data.list[key].rate,

          unit: {
            qty: res.data.list[key].product.pack_size,
          },
          order_qty: res.data.list[key].ordrPackQty,

          total_qty:
            parseFloat(res.data.list[key].qty) +
            parseFloat(res.data.list[key].to_qty),
          line_total:
            parseFloat(res.data.list[key].qty) *
            parseFloat(res.data.list[key].rate),
        });
      });
      setList(listInfo);
    });
    Http.get("/fg-with-stock").then((res) => {
      setProduct(res.data);
    });
    Http.get("/rmpm-with-stock").then((res) => {
      setRmpm(res.data);
    });
    Http.get("/factory").then((res) => {
      setFactory(res.data);
    });
    Http.get("/distributor").then((res) => {
      setDistributor(res.data);
    });
  };
  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);
  // End Default Load

  // Add More List
  const addMoreList = (id) => {
    let exists = false;
    Object.keys(list).forEach((key) => {
      if (parseInt(list[key].id) == parseInt(id)) {
        alert("This Product already in the list ! Please choose another RMPM.");
        exists = true;
      }
    });

    if (!exists) {
      Http.get("/product/" + id).then((res) => {
        setList([...list, res.data]);
      });
    }
  };
  // Remove List
  const removeList = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const inputInfo = [...list]; // Load All Existing experience State Data
        inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
        setList(inputInfo); // Replace Existing experience into State
      }
    });
  };

  const formSubmit = () => {
    inputs.items = list;
    Http.put("/pro-factory-transfer/" + id, inputs)
      .then((res) => {
        navigate("/factory-transfer", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Factory Transfer</h5>
        </div>
        <div className="am-pagebody row">
          <div className="card pd-20 pd-sm-40 col-8">
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Edit Factory Transfer Form
            </h6>
            <hr></hr>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                />
              </div>
              <div className="col-lg">
                <label>
                  Transfer ID <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="receipt_no"
                  value={inputs.receipt_no || ""}
                  onChange={handleChange}
                  placeholder="Input Invoice No"
                />
              </div>

              <div className="col-lg">
                <label>
                  Time <i className="fa fa-star required"></i>
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={inputs.time || ""}
                  onChange={handleChange}
                  placeholder="Input Time"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Factory <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="factory_id"
                  onChange={handleDistributorChange}
                >
                  <option value="">Select Factory</option>
                  {Array.from(factory).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={inputs.factory_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <div className="card card-solid">
                <div className="card-header with-border text-center">
                  <h5 className="card-title mb-0">
                    Items in the Order <i className="fa fa-star required"></i>
                  </h5>
                </div>
                <div className="card-body p-0">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          #
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Product
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Crtn Size
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          T/O Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Rate
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Line Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.length < 1 ? (
                        <tr>
                          <td colSpan={10}>
                            <p
                              style={{ color: "red" }}
                              className="text-center mt-3"
                            >
                              Please Add Few Products to Process Order
                            </p>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}

                      {Array.from(list).map((x, i) => (
                        <tr>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeList(i)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                          <td>
                            <div className="col-lg">{list[i].code}</div>
                          </td>
                          <td>
                            <div className="col-lg">{list[i].name}</div>
                          </td>
                          <td>{list[i].unit ? list[i].unit.qty : 0}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="qty"
                              value={x.qty || ""}
                              onChange={(e) => handleInvChange(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="to_qty"
                              value={x.to_qty || ""}
                              onChange={(e) => handleTOChange(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="rate"
                              value={x.price}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="total_qty"
                              value={x.total_qty || ""}
                              onChange={(e) => handleInputChange(e, i)}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="line_total"
                              value={x.line_total || ""}
                              onChange={(e) => handleInputChange(e, i)}
                              disabled
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={8}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Total Price
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="total_price"
                            value={inputs.total_price || ""}
                            onChange={handleChange}
                            placeholder="Total Price"
                            disabled
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Create
                </button>
              </div>
            </div>
          </div>
          <div
            className="card pd-20 pd-sm-40 col-4"
            style={{ backgroundColor: "#ffffffc7" }}
          >
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Available Items
            </h6>
            <hr></hr>
            <div className="row mt-3">
              <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Code
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Item
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Unit
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Stock
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(product).map((x, i) => (
                    <tr>
                      <td></td>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>
                        {x.unit_qty}
                        {x.unit_name}
                      </td>
                      <td>
                        <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
                          {x.stockQty ? x.stockQty : 0}
                        </p>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => addMoreList(x.id)}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
