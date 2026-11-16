import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../../Common/Http";
import FormValidation from "../../../../Common/FormValidation";
import Select from "react-select";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Edit = (props) => {
  var someDate = new Date();
  var date = someDate.setDate(someDate.getDate());
  var defaultDateValue = new Date(date).toISOString().split("T")[0];

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [location, setLocation] = useState({});
  const [factory, setFactory] = useState({});
  const [department, setDepartment] = useState({});
  const [product, setProduct] = useState({});
  const [unit, setUnit] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [list, setList] = useState({});
  const [vendor, setVendor] = useState({});
  const [error, setError] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [url, setUrl] = useState(Http.getUri());

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleDiscountChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    const inputInfo = [...list];
    amountAndFinalAmount(inputInfo);
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

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const inputInfo = [...list];

    inputInfo[index][name] = parseFloat(value) > 0 ? parseFloat(value) : 0;

    let amount =
      parseFloat(inputInfo[index]["qty"]) *
      parseFloat(inputInfo[index]["price"]);
    let vatValue = (amount * parseFloat(inputInfo[index]["vat"])) / 100;
    let taxValue = (amount * parseFloat(inputInfo[index]["tax"])) / 100;

    inputInfo[index]["amount"] = amount;
    inputInfo[index]["final_amount"] = amount + vatValue + taxValue;

    setList(inputInfo);
    amountAndFinalAmount(inputInfo);
  };

  const amountAndFinalAmount = (inputInfo) => {
    let amount = 0;
    let finalAmount = 0;

    Object.keys(inputInfo).forEach((key) => {
      amount += inputInfo[key].amount > 0 ? inputInfo[key].amount : 0;
      finalAmount +=
        inputInfo[key].final_amount > 0 ? inputInfo[key].final_amount : 0;
    });

    setTotalAmount(amount);

    // Calculate finalAmount by deducting discount from the total
    setFinalAmount(finalAmount - parseFloat(inputs.discount || 0));
  };

  const fetchData = () => {
    Http.get("/vendorSelect2").then((res) => {
      setVendor(res.data);
    });

    Http.get("/factory").then((res) => {
      setFactory(res.data);
    });

    Http.get("/product").then((res) => {
      setProduct(res.data);
    });

    Http.get("/circular-rfq/" + id + "/edit").then((res) => {
      setInputs({
        circular_rfq_id: id,
        date: res.data.date,
        title: res.data.title,
        subject: res.data.subject,
        description: res.data.description,
        circular_no: res.data.circular_no,
        factory_id: res.data.factory_id,
        status: res.data.status,
        discount: 0,
        quotation_validaty_date: defaultDateValue,
      });

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          product_id: res.data.items[key].product_id,
          unit_qty: res.data.items[key].qty,
          qty: res.data.items[key].qty,
          vat: 0,
          tax: 0,
          desc: res.data.items[key].desc,
        });
      });
      setList(listInfo);
    });
    Http.get("/unit").then((res) => {
      setUnit(res.data);
    });
  };

  useEffect(() => {
    fetchData();

    // const splitUrl = url.split("/");
    // let fullUrl = "";
    // for (var i = 0; i < splitUrl.length - 1; i++) {
    //   fullUrl += splitUrl[i] + "/";
    // }
    // setUrl(fullUrl);
  }, []);

  const formSubmit = () => {
    const listArr = [];
    Object.keys(list).forEach((key) => {
      listArr.push(list[key]);
    });

    inputs.file = selectedFile;
    inputs.items = listArr;
    inputs.total_amount = finalAmount;

    Http.post("/rfq-sent-from-vendor", inputs)
      .then((res) => {
        navigate("/circular-rfq", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Vendor Quotation Form</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Quotation Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>

            <div className="row">
              <div className="col-lg">
                <label>
                  Vendor <i className="fa fa-star required"></i>
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
                  Quotation Validaty Date{" "}
                  <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="quotation_validaty_date"
                  value={inputs.quotation_validaty_date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="row mt-3">
              <table className="table table-sm align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Product
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Qty
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Price
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Vat
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Tax
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Description
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Amount
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Final Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(list).map((x, i) => (
                    <tr key={i}>
                      <td>
                        <select
                          className="form-control"
                          name="product_id"
                          defaultValue={x.product_id}
                          onChange={(e) => handleInputChange(e, i)}
                          disabled
                        >
                          <option value="">Select Product</option>
                          {Array.from(product).map((item, index) => (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={x.product_id === item.id ? true : false}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="qty"
                          // value={x.qty || ""}
                          defaultValue={x.qty}
                          onChange={(e) => handleInputChange(e, i)}
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="price"
                          value={x.price || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="vat"
                          value={x.vat || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="tax"
                          value={x.tax || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          name="desc"
                          value={x.desc || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        ></textarea>
                      </td>
                      <td>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="amount"
                          value={x.amount || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          name="final_amount"
                          value={x.final_amount || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} style={{ textAlign: "right" }}>
                      <label style={{ fontWeight: "bold", lineHeight: "35px" }}>
                        Discount
                      </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="discount"
                        value={inputs.discount || ""}
                        onChange={handleDiscountChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} style={{ textAlign: "right" }}>
                      Total :{" "}
                    </td>
                    <td style={{ textAlign: "right" }}>{totalAmount}</td>
                    <td style={{ textAlign: "right" }}>{finalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label>Attachment</label>
                <input
                  type="file"
                  name="attachment"
                  className="form-control"
                  multiple
                  onChange={handleFileChange}
                />
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Edit;
