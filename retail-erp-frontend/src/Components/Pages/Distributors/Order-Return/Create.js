import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Create = () => {
  var someDate = new Date();
  var date = someDate.setDate(someDate.getDate());
  var defaultDateValue = new Date(date).toISOString().split("T")[0];

  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({
    date: defaultDateValue,
  });
  const [error, setError] = useState({});
  const [list, setList] = useState({});
  const [product, setProduct] = useState({});
  const [unit, setUnit] = useState({});
  const [order, setOrder] = useState({});
  const [factory, setFactory] = useState({});
  const [lastGrnNo, setLastGrnNo] = useState("000001");

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const selectHandleChangeGrn = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    const id = value;

    Http.get("/distributor/distributor-order/" + id).then((res) => {
      const listInfo = [];

      Object.keys(res.data.list).forEach((key) => {
        listInfo.push({
          item_id: res.data.list[key].id,
          product_id: res.data.list[key].product_id,
          unit_id: res.data.list[key].unit_id,
          unit_price: res.data.list[key].rate,
          qty: res.data.list[key].qty,
          desc: "",
          prev_rcv: 0,
        });
      });

      console.log(listInfo);
      setList(listInfo);
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };
  const handleReceiveQty = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    if (
      parseFloat(e.target.getAttribute("due_qty")) >= parseFloat(e.target.value)
    ) {
      inputInfo[index][name] = value;
    } else {
      alert("Qty Not Available on Order");
      inputInfo[index][name] = 0;
    }

    setList(inputInfo);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = () => {
    Http.get("/product").then((res) => {
      setProduct(res.data);
    });

    Http.get("/last-code-increment-by-one/order_returns/receipt_no/ORRE").then(
      (res) => {
        setLastGrnNo(res.data);
      }
    );

    Http.get("/distributor/orderSelect2").then((res) => {
      setOrder(res.data);
    });
    // Http.get("/factory").then((res) => {
    //   setFactory(res.data);
    // });
    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });
    Http.get("/unit").then((res) => {
      setUnit(res.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const formSubmit = () => {
    inputs.items = list;
    inputs.receipt_no = lastGrnNo;

    Http.post("/distributor/order-return", inputs)
      .then((res) => {
        navigate("/distributor/order-return", {
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
          <h5 className="am-title">Distributor Order Return</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Distributor Order Return
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
                  placeholder="Input Date"
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Receipt No</label>
                <input
                  type="text"
                  className="form-control"
                  name="receipt_no"
                  value={lastGrnNo || "00001"}
                  onChange={handleChange}
                  placeholder="Input GRN No"
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Order <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={order[0]}
                  name="order_id"
                  options={order}
                  onChange={selectHandleChangeGrn}
                />
              </div>
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
            </div>

            <div className="row mt-3">
              <table className="table table-sm align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Product
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Unit Price
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Order Qty
                    </th>
                    {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Prev Return
                    </th> */}
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Return Qty
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(list).map((x, i) => (
                    <tr>
                      <td>
                        <select
                          className="form-control"
                          name="product_id"
                          disabled
                          onChange={(e) => handleInputChange(e, i)}
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
                          name="unit_price"
                          disabled
                          value={x.unit_price || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="qty"
                          disabled
                          value={x.qty || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td>
                      {/* <td>
                        <input
                          type="text"
                          className="form-control"
                          name="prev_rcv"
                          disabled
                          value={x.prev_rcv || ""}
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </td> */}
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          name="receive_qty"
                          value={x.receive_qty || ""}
                          due_qty={parseFloat(x.qty) - parseFloat(x.prev_rcv)}
                          onChange={(e) => handleReceiveQty(e, i)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
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
        </div>
      </div>
    </div>
  );
};

export default Create;
