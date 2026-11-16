import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [rmpm, setRmpm] = useState({});
  const [factory, setFactory] = useState({});
  const [lastReceiptNo, setLastReceiptNo] = useState("000001");
  const [list, setList] = useState([{ product_id: "", qty: "", desc: "" }]);
  const [listDetail, setListDetail] = useState({});
  const [custom, setCustom] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleCustomInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    // console.log(list[index]);
    // Receipe Item Load
    let inputChangeData = [];
    inputChangeData["product_id"] = list[index]["id"];
    inputChangeData["qty"] = list[index]["issue_qty"];
    inputChangeData["batch_size"] = inputs.batch_size;
    inputChangeData["fg_product_id"] = inputs.product_id;
    inputChangeData["receipe_type"] = inputs.receipe_type;
    console.log(
      list[index]["id"],
      list[index]["issue_qty"],
      inputs.batch_size,
      inputs.product_id,
      inputs.receipe_type
    );
    // inputs.input = inputInfo;
    // Http.post("/receipe-item-load", inputs)
    //   .then((res) => {
    //     setList(res.data.purchase_order_items);
    //     setListDetail(res.data.product_purchase_detail);
    //   })
    //   .catch(function (e) {
    //     setError(e.response.data.errors);
    //   });
  };

  // Default Load
  const fetchData = () => {
    Http.get("/finished-good").then((res) => {
      setProduct(res.data);
    });
    Http.get("/raw-packing-materials").then((res) => {
      setRmpm(res.data);
    });
    Http.get("/factory").then((res) => {
      setFactory(res.data);
    });
    Http.get("/last-receipe-no").then((res) => {
      setLastReceiptNo(res.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // End Default Load

  // Add More List
  const addMoreList = () => {
    setList([...list, { product_id: "", qty: "", desc: "" }]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
    const inputInfo = [...list]; // Load All Existing experience State Data
    inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
    setList(inputInfo); // Replace Existing experience into State
  };

  const formSubmit = () => {
    Http.post("/unit", inputs)
      .then((res) => {
        navigate("/unit", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const receipeLoad = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    inputs.receipe_type = value;
    Http.post("/receipe-load", inputs).then((res) => {
      setList(res.data.purchase_order_items);
      if (inputs.receipe_type == "custom") {
        setCustom(res.data.product_purchase_list);
        setListDetail({});
      } else {
        setCustom({});
        setListDetail(res.data.product_purchase_detail);
      }
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Issue</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Issue Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Reference No</label>
                <input
                  type="text"
                  className="form-control"
                  name="reference_no"
                  value={inputs.reference_no || ""}
                  onChange={handleChange}
                  placeholder="Input Reference No"
                />
              </div>
              <div className="col-lg">
                <label>Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={inputs.time || ""}
                  onChange={handleChange}
                  placeholder="Input Time"
                />
              </div>
              <div className="col-lg">
                <label>Batch No</label>
                <input
                  type="batch_no"
                  className="form-control"
                  name="batch_no"
                  value={inputs.batch_no || ""}
                  onChange={handleChange}
                  placeholder="Input Batch No"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Batch Size</label>
                <input
                  type="batch_size"
                  className="form-control"
                  name="batch_size"
                  value={inputs.batch_size || ""}
                  onChange={handleChange}
                  placeholder="Input Batch Size"
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Finished Good</label>
                <select
                  className="form-control"
                  name="product_id"
                  onChange={handleChange}
                >
                  <option value="">Select Product</option>
                  {Array.from(product).map((item, index) => (
                    <option value={item.id} key={item.id}>
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
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">Receipe Type</label>
                <select
                  className="form-control"
                  name="receipe_type"
                  onChange={receipeLoad}
                >
                  <option value="">Select Receipe Type</option>
                  <option value="fifo">FIFO</option>
                  <option value="lifo">LIFO</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-10"></div>
              <div className="col-2">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
              <table className="table table-sm align-items-center mb-0">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Product
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Standard Qty
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Issue Qty
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Details
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(list).map((x, i) => (
                    <tr>
                      <td>
                        {/* <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
                          {x.code} - {x.name}
                        </p> */}
                        <select
                          className="form-control"
                          name="product_id"
                          onChange={(e) => handleCustomInputChange(e, i)}
                        >
                          <option value="">Select Product</option>
                          {Array.from(rmpm).map((item, index) => (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={x.id === item.id ? true : false}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
                          {x.stndrd_qty ? x.stndrd_qty : 0}
                        </p>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          name="issue_qty"
                          value={x.issue_qty || "0"}
                          onChange={(e) => handleCustomInputChange(e, i)}
                        />
                      </td>
                      <td>
                        {custom.length > 0 ? (
                          <select
                            className="form-control"
                            name="custom_purchase_order"
                          >
                            <option value="">Select Product</option>
                            {Array.from(x.purchase_list).map((item, index) => (
                              <option value={item.id} key={item.id}>
                                Rate - {item.unit_price} | Available Qty -{" "}
                                {item.actual_qty - item.issue_qty}
                              </option>
                            ))}
                          </select>
                        ) : (
                          listDetail[i]
                        )}
                      </td>
                      <td>
                        {list.length > 1 ? (
                          <button
                            className="btn btn-danger btn-block"
                            onClick={() => removeList(i)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        ) : (
                          ""
                        )}
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
