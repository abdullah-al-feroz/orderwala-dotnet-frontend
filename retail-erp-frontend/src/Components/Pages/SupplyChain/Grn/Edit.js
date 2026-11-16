import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [list, setList] = useState({});
  const [product, setProduct] = useState({});
  const [unit, setUnit] = useState({});
  const [location, setLocation] = useState({});
  const [factory, setFactory] = useState({});
  const [lastGrnNo, setLastGrnNo] = useState("000001");

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };
  const handleReceiveQty = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    // if (
    //   parseFloat(e.target.getAttribute("due_qty")) >= parseFloat(e.target.value)
    // ) {
    //   inputInfo[index][name] = value;
    // } else {
    //   alert("Qty Not Available on Purchase Order");
    //   inputInfo[index][name] = 0;
    // }
    inputInfo[index][name] = value;

    setList(inputInfo);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const fetchData = () => {
    const listInfo = [];
    Http.get("/grn/" + id).then((res) => {
      const listInfo = [];
      console.log(res.data.items);
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          item_id: res.data.items[key].work_order_item_id,
          product_id: res.data.items[key].product_id,
          unit_id: res.data.items[key].unit_id,
          unit_qty: res.data.items[key].unit.qty,
          unit_price: res.data.items[key].unit_price,
          qty: res.data.items[key].qty,
          actual_qty: res.data.items[key].actual_qty,
          desc: res.data.items[key].desc,
          prev_rcv:
            parseFloat(res.data.items[key].received_qty) > 0
              ? res.data.items[key].received_qty
              : "0",

          receive_qty:
            parseFloat(res.data.items[key].qty) -
            parseFloat(res.data.items[key].received_qty),
        });
        setInputs({
          id: res.data.id,
          work_order_id: res.data.work_order_id,
          date: res.data.date,
          grn_no: res.data.receipt_no,
          company_location_id: res.data.location_id,
          factory_id: res.data.factory_id,
          status: res.data.status,
        });
      });
      setList(listInfo);
    });

    Http.get("/product").then((res) => {
      setProduct(res.data);
    });
    Http.get("/last-grn-no").then((res) => {
      setLastGrnNo(res.data);
    });
    Http.get("/location").then((res) => {
      setLocation(res.data);
    });
    Http.get("/factory").then((res) => {
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
    inputs.grn_id = id;

    Http.put("/grn/" + id, inputs)
      .then((res) => {
        navigate("/purchase-order", {
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
          <h5 className="am-title">Receive Product</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Receive Product</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Date <i class="fa fa-star required"></i>
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
                <label>GRN No</label>
                <input
                  type="text"
                  className="form-control"
                  name="grn_no"
                  value={inputs.grn_no || "00001"}
                  onChange={handleChange}
                  placeholder="Input GRN No"
                />
              </div>
              {/* <div className="col-lg">
                <label htmlFor="">Location</label>
                <select
                  className="form-control"
                  name="company_location_id"
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {Array.from(location).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.company_location_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">Factory</label>
                <select
                  className="form-control"
                  name="factory_id"
                  onChange={handleChange}
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
              </div> */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Status</label>
                <select
                  className="form-control"
                  name="status"
                  onChange={handleChange}
                >
                  <option
                    value="received"
                    selected={inputs.status === "received" ? true : false}
                  >
                    Received
                  </option>
                  {/* <option
                    value="active"
                    selected={inputs.status === "active" ? true : false}
                  >
                    Active
                  </option>
                  <option
                    value="inactive"
                    selected={inputs.status === "inactive" ? true : false}
                  >
                    inactive
                  </option> */}
                  <option
                    value="completed"
                    selected={inputs.status === "completed" ? true : false}
                  >
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <table className="table table-sm align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Product
                    </th>
                    {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Unit
                    </th> */}
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Unit Price
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Order Qty
                    </th>
                    {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Prev Receive
                    </th> */}
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Receive Qty
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
                      {/* <td>
                        <select
                          className="form-control"
                          name="unit_id"
                          disabled
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <option value="">Select Unit</option>
                          {Array.from(unit).map((item, index) => (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={x.unit_id === item.id ? true : false}
                            >
                              {item.name} - ({item.qty})
                            </option>
                          ))}
                        </select>
                      </td> */}
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
                          value={x.actual_qty || 0}
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
                          value={x.qty || 0}
                          // due_qty={
                          //   parseFloat(x.receive_qty) +
                          //   parseFloat(x.qty) -
                          //   parseFloat(x.prev_rcv / x.unit_qty)
                          // }
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
