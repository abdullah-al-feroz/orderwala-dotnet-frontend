import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ receipe_type: "receipe" });
  const [product, setProduct] = useState({});
  const [error, setError] = useState({});
  const [lastReceiptNo, setLastReceiptNo] = useState("000001");
  const [list, setList] = useState([{ product_id: "", qty: "", desc: "" }]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (name == "receipe_type") receipeItemsLoad();
  };
  const handleProductChange = (e) => {
    const name = e.target.name;
    const productId = e.target.value;

    setInputs((values) => ({ ...values, [name]: productId }));
    receipeItemsLoad();
  };

  const receipeItemsLoad = (e) => {
    if (inputs.product_id > 0 && inputs.receipe_type != "") {
      Http.get(
        "/receipe-product-wise/" + inputs.product_id + "/" + inputs.receipe_type
      ).then((res) => {
        const listInfo = [];
        Object.keys(res.data.items).forEach((key) => {
          listInfo.push({
            product_id: res.data.items[key].product_id,
            qty: res.data.items[key].qty,
            desc: res.data.items[key].description,
          });
        });

        setInputs((values) => ({ ...values, ["receipe_id"]: res.data.id }));
        setList(listInfo);
      });
    }
  };

  // Set Experience State
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };
  // Default Load
  const fetchData = () => {
    Http.get("/finished-good").then((res) => {
      setProduct(res.data);
    });
    Http.get("/last-requisition-production-no").then((res) => {
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
    const listArr = [];
    Object.keys(list).forEach((key) => {
      listArr.push(list[key]);
    });

    inputs.items = listArr;
    inputs.receipt_no = lastReceiptNo;
    Http.post("/requisition-production/", inputs)
      .then((res) => {
        navigate("/requisition-production", {
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
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Requisition Production</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Requisition Production Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>Receipt no</label>
                <input
                  type="text"
                  className="form-control"
                  name="receipt_no"
                  value={lastReceiptNo || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg">
                <label>Expected Production Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expected_production_date"
                  value={inputs.expected_production_date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Factory</label>
                <select
                  className="form-control"
                  name="factory_id"
                  onChange={handleChange}
                >
                  <option value="">Select Factory</option>
                  {Array.from(product).map((item, index) => (
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
                  onChange={handleChange}
                >
                  <option value="">Select Receipe Type</option>
                  <option value="receipe">Receipe</option>
                  <option value="factory">Factory</option>
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">Finished Good</label>
                <select
                  className="form-control"
                  name="product_id"
                  onChange={handleProductChange}
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
                <label>Batch Size</label>
                <input
                  type="text"
                  className="form-control"
                  name="batch_size"
                  value={inputs.batch_size || ""}
                  onChange={handleChange}
                />
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
                      Qty
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Description
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
                        <select
                          className="form-control"
                          name="product_id"
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <option value="">Select Product</option>
                          {Array.from(product).map((item, index) => (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={x.product_id === item.id ? true : false}
                            >
                              {item.name} - {item.unit.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          name="qty"
                          value={x.qty || ""}
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
