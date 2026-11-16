import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import DatatableFunc from "../../../Common/DatatableFunc";
import Select from "react-select";
import Swal from "sweetalert2";
import $ from "jquery"; // Import jQuery

const Create = () => {
  var someDate = new Date();
  var date = someDate.setDate(someDate.getDate());
  var defaultDateValue = new Date(date).toISOString().split("T")[0];

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    date: defaultDateValue,
  });
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [factory, setFactory] = useState({});
  const [vendor, setVendor] = useState({});
  const [list, setList] = useState([]);
  const termsConditionsceInitialState = [{ terms_conditions: "" }];
  const [termsConditions, setTermsConditions] = useState(
    termsConditionsceInitialState
  );

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (name == "vendor_id") {
      setList([]);
      Http.get("/product?vendor_id=" + value).then((res) => {
        setProduct(res.data);
        DatatableFunc({
          bDestroy: true,
        });
      });
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Set Experience State
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    if (name == "qty") {
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
          inputInfo[index]["trade_offer_product_offer_id"] = null;
          if (list[index]["trade_offer"].trade_offer_product_id > 0) {
            inputInfo[index]["trade_offer_product_offer_id"] =
              list[index]["trade_offer"].trade_offer_product_id;
            inputInfo[index]["trade_offer_product"] =
              list[index]["trade_offer"].trade_offer_product.name;
          }
          trade_offer_qty = parseFloat(value / trade_offer_input_qty);
          inputInfo[index]["trade_offer_qty"] = parseInt(
            trade_offer_qty * trade_offer_offer_qty
          );
          inputInfo[index]["trade_offer_id"] = list[index]["trade_offer"].id;
          setList(inputInfo);
        }
      }
    }

    // Line Total Price
    let price = value * parseFloat(list[index]["purchase_price"]);
    inputInfo[index]["salary_reinversment"] =
      parseFloat(list[index]["salary_reinversment"]) > 0
        ? parseFloat(list[index]["salary_reinversment"])
        : 0;

    inputInfo[index]["rate"] =
      parseFloat(list[index]["purchase_price"]) +
      parseFloat(list[index]["salary_reinversment"]);
    setList(inputInfo);

    inputInfo[index]["line_total"] =
      parseFloat(list[index]["purchase_price"]) *
      parseFloat(inputInfo[index]["qty"]);
    setList(inputInfo);

    // Total Price
    let totalPrice = 0;
    Object.keys(list).forEach((key) => {
      totalPrice += parseFloat(list[key].line_total ? list[key].line_total : 0);
    });
    inputs.total_price = totalPrice;

    setInputs((values) => ({ ...values, total_price: totalPrice }));

    setInputs((values) => ({
      ...values,
      ["final_price"]: parseFloat(totalPrice),
    }));

    let due_amount = totalPrice > 0 ? parseFloat(totalPrice) : 0;

    setInputs((values) => ({ ...values, ["due_amount"]: due_amount }));
    vatCalculation(index);
  };

  const handleSalaryReinversment = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    let price = value * parseFloat(list[index]["purchase_price"]);

    inputInfo[index]["rate"] =
      parseFloat(value) + parseFloat(list[index]["purchase_price"]);
    setList(inputInfo);

    setInputs((values) => ({
      ...values,
      ["rate"]: parseFloat(list[index]["purchase_price"]) + parseFloat(value),
    }));

    inputInfo[index]["line_total"] =
      parseFloat(list[index]["qty"]) * parseFloat(inputInfo[index]["rate"]);
    setList(inputInfo);

    // Total Price
    let totalPrice = 0;
    Object.keys(list).forEach((key) => {
      totalPrice += list[key].line_total;
    });
    inputs.total_price = totalPrice;

    setInputs((values) => ({ ...values, ["total_price"]: totalPrice }));

    setInputs((values) => ({
      ...values,
      ["final_price"]: parseFloat(totalPrice),
    }));

    setInputs((values) => ({
      ...values,
      ["due_amount"]: parseFloat(totalPrice),
    }));
    vatCalculation(index);
  };

  const handleDiscountChange = (e, index) => {
    const name = e.target.name;
    const value = e.target.value > 0 ? parseFloat(e.target.value) : 0;
    setInputs((values) => ({ ...values, [name]: value }));

    setInputs((values) => ({
      ...values,
      ["final_price"]: parseFloat(inputs.total_price) - parseFloat(value),
    }));

    // Due Amount
    let final_price = parseFloat(inputs.total_price) - parseFloat(value);

    setInputs((values) => ({
      ...values,
      ["due_amount"]: final_price,
    }));
  };
  // Default Load
  const fetchData = () => {
    // Http.get("/product").then((res) => {
    //   setProduct(res.data);
    // });

    Http.get("/vendorSelect2").then((res) => {
      setVendor(res.data);
    });

    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });

    Http.get("/last-code-increment-by-one/direct_purchases/receipt_no/DP").then(
      (res) => {
        setInputs((values) => ({ ...values, ["receipt_no"]: res.data }));
      }
    );
  };
  useEffect(() => {
    DatatableFunc();
    fetchData();

    $("body").toggleClass("collapse-menu");
    $("body").toggleClass("show-left");
  }, []);
  // End Default Load

  // Add More List
  const addMoreList = (id) => {
    // let exists = false;
    // Object.keys(list).forEach((key) => {
    //   if (parseInt(list[key].id) == parseInt(id)) {
    //     alert("This Product already in the list ! Please choose another RMPM.");
    //     exists = true;
    //   }
    // });

    // if (!exists) {
    Http.get("/product/" + id).then((res) => {
      res.data.price = res.data.purchase_price;
      setList([...list, res.data]);
    });
    // }
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
        recalculateTotals(inputInfo);
      }
    });
  };

  const recalculateTotals = (inputInfo) => {
    const list = [...inputInfo];

    // Total Price
    let totalPrice = 0;
    Object.keys(list).forEach((key) => {
      totalPrice += list[key].line_total;
    });
    inputs.total_price = totalPrice;

    // console.log(parseFloat(["discount"]);

    setInputs((values) => ({
      ...values,
      ["final_price"]: totalPrice - parseFloat(inputs.discount),
    }));

    // Due Amount
    let due_amount = totalPrice > 0 ? parseFloat(totalPrice) : 0;

    setInputs((values) => ({
      ...values,
      ["due_amount"]: totalPrice - parseFloat(inputs.discount),
    }));
  };

  const formSubmit = () => {
    inputs.items = list;
    inputs.terms_condition = termsConditions;
    Http.post("/direct-purchase", inputs)
      .then((res) => {
        navigate("/direct-purchase", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  const addMoreTermsCondition = () => {
    setTermsConditions([
      ...termsConditions,
      {
        terms_conditions: "",
      },
    ]); // Add One More termsConditions
  };
  // Remove termsConditions
  const removeTermsConditions = (index) => {
    const list = [...termsConditions]; // Load All Existing termsConditions State Data
    list.splice(index, 1); // Remove termsConditions by Index/Click Event Wise
    setTermsConditions(list); // Replace Existing termsConditions into State
  };
  const handleTermsConditionChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...termsConditions];
    list[index][name] = value;
    setTermsConditions(list);
  };

  function vatCalculation(sl) {
    const lists = [...list];
    let vatAmount = 0;

    vatAmount =
      (parseFloat(lists[sl].price) * parseFloat(lists[sl].vat_inv)) / 100;

    lists[sl]["vat_amount"] = vatAmount;

    let rate =
      parseFloat(lists[sl].price ? lists[sl].price : 0) +
      parseFloat(
        lists[sl].salary_reinversment ? lists[sl].salary_reinversment : 0
      ) +
      parseFloat(vatAmount ? vatAmount : 0);
    lists[sl]["rate"] = rate;
    lists[sl]["line_total"] = rate * lists[sl].qty;
    setList(lists);

    let totalVat = 0;
    Object.keys(list).forEach((key) => {
      totalVat += list[key].vat_amount;
    });
    // inputs.totalVat = totalVat;
    console.log(totalVat);

    setInputs((values) => ({
      ...values,
      ["total_vat_amount"]: totalVat,
    }));
  }

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Direct Purchase</h5>
        </div>
        <div className="am-pagebody row">
          <div className="card pd-20 pd-sm-40 col-9">
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Direct Purchase
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
                />
              </div>
              <div className="col-lg">
                <label>
                  Receipt no <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="receipt_no"
                  value={inputs.receipt_no || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Company <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={vendor[0]}
                  name="vendor_id"
                  options={vendor}
                  onChange={selectHandleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Factory</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={factory[0]}
                  name="factory_id"
                  options={factory}
                  onChange={selectHandleChange}
                />
              </div>
              <div className="col-lg">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={inputs.description || ""}
                  onChange={handleChange}
                ></textarea>
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
                          Product
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Batch No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          TO Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Product Rate
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Salary Reimbursement
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Vat
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Unit Price
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Amount
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
                            <div className="col-lg">{list[i].name}</div>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="batch_no"
                              value={x.batch_no || ""}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="qty"
                              value={x.qty || ""}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="trade_offer_qty"
                              value={x.trade_offer_qty || ""}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                            <label>{x.trade_offer_product}</label>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="purchase_price"
                              value={x.purchase_price || 0}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="salary_reinversment"
                              value={x.salary_reinversment || 0}
                              onChange={(e) => handleSalaryReinversment(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              disabled
                              className="form-control"
                              name="vat_amount"
                              value={x.vat_amount || 0}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="rate"
                              value={x.rate || 0}
                              onChange={(e) => handleInputChange(e, i)}
                              disabled
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="line_total"
                              value={x.line_total || 0}
                              onChange={(e) => handleInputChange(e, i)}
                              disabled
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {list.length > 0 ? (
                        <>
                          <tr>
                            <td
                              colSpan={9}
                              className="text-right"
                              style={{ lineHeight: "40px" }}
                            >
                              Total Vat Amount
                            </td>
                            <td colSpan={1}>
                              <input
                                type="text"
                                className="form-control"
                                name="total_vat_amount"
                                value={inputs.total_vat_amount || 0}
                                disabled
                              />
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={9}
                              className="text-right"
                              style={{ lineHeight: "40px" }}
                            >
                              Total Price
                            </td>
                            <td colSpan={1}>
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
                          <tr>
                            <td
                              colSpan={9}
                              className="text-right"
                              style={{ lineHeight: "40px" }}
                            >
                              Discount
                            </td>
                            <td colSpan={1}>
                              <input
                                type="text"
                                className="form-control"
                                name="discount"
                                value={inputs.discount || ""}
                                onChange={handleDiscountChange}
                                placeholder="Total Discount"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={9}
                              className="text-right"
                              style={{ lineHeight: "40px" }}
                            >
                              Final Price
                            </td>
                            <td colSpan={1}>
                              <input
                                type="text"
                                className="form-control"
                                name="final_price"
                                value={inputs.final_price || ""}
                                placeholder="Final Amount"
                                disabled
                              />
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={9}
                              className="text-right"
                              style={{ lineHeight: "40px" }}
                            >
                              Due Amount
                            </td>
                            <td colSpan={1}>
                              <input
                                type="text"
                                className="form-control"
                                name="due_amount"
                                value={inputs.due_amount || ""}
                                onChange={handleChange}
                                placeholder="Total Due Amount"
                                disabled
                              />
                            </td>
                          </tr>
                        </>
                      ) : (
                        ""
                      )}
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="card card-solid">
                <div className="card-header with-border">
                  <h5 className="card-title mb-0 row">
                    <div className="col-lg">
                      <h6
                        className="card-body-title"
                        style={{ marginTop: "10px" }}
                      >
                        Terms &amp; Conditions
                      </h6>
                    </div>
                    <div className="col-lg">
                      <label htmlFor=""></label>
                      <button
                        className="btn btn-info float-right btn-sm"
                        onClick={addMoreTermsCondition}
                      >
                        +
                      </button>
                    </div>
                  </h5>
                </div>
                <div className="card-body p-0">
                  {Array.from(termsConditions).map((x, i) => (
                    <div className="row mt-3" key={i}>
                      <div className="col-lg">
                        <div className="row">
                          <div className="col-lg-11">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Terms &amp; Conditions"
                              name="terms_conditions"
                              value={x.terms_conditions || ""}
                              onChange={(e) => handleTermsConditionChange(e, i)}
                            />
                          </div>
                          <div className="col-lg-1">
                            {termsConditions.length > 1 ? (
                              <button
                                className="btn btn-danger float-right btn-sm"
                                onClick={() => removeTermsConditions(i)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-6"></div>
              <div className="col-3"></div>
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
            className="card pd-20 pd-sm-40 col-3"
            style={{ backgroundColor: "#ffffffc7" }}
          >
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Available Items
            </h6>
            <hr></hr>
            <div className="row mt-3">
              <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                <thead>
                  <tr>
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
                      Price
                    </th>
                    {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Stock
                    </th> */}
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(product).map((x, i) => (
                    <tr key={x.id}>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>{x.unit ? x.unit.name : ""}</td>
                      <td>{x.purchase_price}</td>
                      {/* <td>
                        <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
                          {x.stockQty ? x.stockQty : 0}
                        </p>
                      </td> */}
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
