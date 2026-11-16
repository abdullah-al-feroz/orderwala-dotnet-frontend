import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";
import Swal from "sweetalert2";
import Select from "react-select";
import $ from "jquery"; // Import jQuery

const Edit = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSelected, setIsSelected] = useState([]);
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [factory, setFactory] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [vendor, setVendor] = useState({});
  const [list, setList] = useState({});
  const termsConditionsceInitialState = [{ terms_conditions: "" }];
  const [termsConditions, setTermsConditions] = useState(
    termsConditionsceInitialState
  );

  const [selectedVendorOption, setSelectedVendorOption] = useState(null);
  const [selectedFactoryOption, setSelectedFactoryOption] = useState(null);

  const [location, setLocation] = useState({});
  const [department, setDepartment] = useState({});
  const [unit, setUnit] = useState({});
  const [attachment, setAttachment] = useState({});
  const [url, setUrl] = useState(Http.getUri());

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleFileChange = (e) => {
    const fileArray = [];
    const files = e.target.files;
    Object.keys(files).forEach((key) => {
      fileArray.push(e.target.files[key]);
    });
    setSelectedFile(fileArray);
    setIsSelected(true);
  };

  // Set Experience State
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    inputInfo[index]["product_id"] = parseFloat(list[index]["id"]);

    // Line Total Price
    let price = value * parseFloat(list[index]["price"]);

    inputInfo[index]["rate"] =
      parseFloat(list[index]["price"]) +
      parseFloat(list[index]["salary_reinversment"]);
    setList(inputInfo);

    inputInfo[index]["line_total"] =
      parseFloat(list[index]["price"]) * parseFloat(inputInfo[index]["qty"]);
    setList(inputInfo);

    // Total Price
    let totalPrice = 0;
    Object.keys(list).forEach((key) => {
      totalPrice += list[key].line_total;
    });
    inputs.total_price = totalPrice;

    setInputs((values) => ({
      ...values,
      ["final_price"]: totalPrice - parseFloat(["discount"]),
    }));

    // Due Amount
    let due_amount = totalPrice > 0 ? parseFloat(totalPrice) : 0;

    setInputs((values) => ({
      ...values,
      ["due_amount"]: due_amount,
    }));
  };

  const handleSalaryReinversment = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    let price = value * parseFloat(list[index]["price"]);

    inputInfo[index]["rate"] =
      parseFloat(value) + parseFloat(list[index]["price"]);
    setList(inputInfo);

    setInputs((values) => ({
      ...values,
      ["rate"]: parseFloat(list[index]["price"]) + parseFloat(value),
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
      ["final_price"]:
        parseFloat(inputs.total_price) - parseFloat(inputs.discount),
    }));

    // Due Amount
    let due_amount =
      parseFloat(inputs.total_price) - parseFloat(inputs.discount);

    setInputs((values) => ({
      ...values,
      ["due_amount"]: due_amount,
    }));
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

  const fetchData = () => {
    $("body").toggleClass("collapse-menu");
    $("body").toggleClass("show-left");
    Http.get("/vendorSelect2").then((res) => {
      setVendor(res.data);
    });
    Http.get("/location").then((res) => {
      setLocation(res.data);
    });

    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });
    Http.get("/department").then((res) => {
      setDepartment(res.data);
    });
    Http.get("/product").then((res) => {
      setProduct(res.data);
    });
    Http.get("/unit").then((res) => {
      setUnit(res.data);
    });
    Http.get("/direct-purchase/" + id + "/edit").then((res) => {
      setInputs({
        date: res.data.date,
        receipt_no: res.data.receipt_no,
        vendor_id: res.data.vendor_id,
        company_location_id: res.data.company_location_id,
        factory_id: res.data.factory_id,
        department_id: res.data.department_id,
        description: res.data.description,
        total_price: res.data.total_amount,
        discount: res.data.discount,
        total_vat_amount: res.data.total_vat_amount,
        final_price: res.data.total_amount,
        due_amount: res.data.due_amount,
        status: res.data.status,
      });

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          id: res.data.items[key].product_id,
          product_id: res.data.items[key].product_id,
          code: res.data.items[key].product.code,
          name: res.data.items[key].product.name,
          qty: res.data.items[key].qty,
          price: res.data.items[key].price,
          salary_reinversment: res.data.items[key].salary_reinversment,
          rate: res.data.items[key].rate,
          line_total:
            res.data.items[key].qty *
            (parseInt(res.data.items[key].price) +
              parseInt(res.data.items[key].salary_reinversment)),
        });
      });
      setList(listInfo);

      const termsCondition = [];
      Object.keys(res.data.terms_condition).forEach((key) => {
        termsCondition.push({
          id: res.data.terms_condition[key].id,
          direct_purchase_id: res.data.terms_condition[key].direct_purchase_id,
          terms_conditions: res.data.terms_condition[key].terms_condition,
        });
      });
      setTermsConditions(termsCondition);
      console.log(termsCondition);

      setSelectedVendorOption({
        label: res.data.vendor.name,
        value: res.data.vendor.id,
      });

      setSelectedFactoryOption({
        label: res.data.factory.name,
        value: res.data.factory.id,
      });
    });
    Http.get("/unit").then((res) => {
      setUnit(res.data);
    });
  };

  useEffect(() => {
    fetchData();

    const splitUrl = url.split("/");
    let fullUrl = "";
    for (var i = 0; i < splitUrl.length - 1; i++) {
      fullUrl += splitUrl[i] + "/";
    }
    setUrl(fullUrl);
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    if (actionMeta.name === "vendor_id") {
      setSelectedVendorOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (actionMeta.name === "factory_id") {
      setSelectedFactoryOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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
        let info = res.data;
        info.salary_reinversment = 0;
        setList([...list, info]);
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

    Http.put("/direct-purchase/" + id, inputs)
      .then((res) => {
        navigate("/direct-purchase", {
          state: { message: res.data.message, type: res.data.type },
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
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Direct Purchase Form</h5>
        </div>
        <div className="am-pagebody row">
          <div className="card pd-20 pd-sm-40 col-9">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Direct Purchase Form
            </h6>
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
                  Vendor <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedVendorOption}
                  value={selectedVendorOption}
                  onChange={selectHandleChange}
                  name="vendor_id"
                  options={vendor}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Factory</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedFactoryOption}
                  value={selectedFactoryOption}
                  onChange={selectHandleChange}
                  name="factory_id"
                  options={factory}
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
                          Qty
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
                          <td colSpan={8}>
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
                              name="price"
                              value={x.price || ""}
                              onChange={(e) => handleInputChange(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="salary_reinversment"
                              value={x.salary_reinversment || ""}
                              onChange={(e) => handleSalaryReinversment(e, i)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="rate"
                              value={x.rate || ""}
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
                          colSpan={7}
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
                          colSpan={7}
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
                          colSpan={7}
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
                          colSpan={7}
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
                          colSpan={7}
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
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Update
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
              <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Code
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Item
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(product).map((x, i) => (
                    <tr>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
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

export default Edit;
