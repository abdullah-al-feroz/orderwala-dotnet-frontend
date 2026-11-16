import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const CreateRegion = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [rmpm, setRmpm] = useState({});
  const [product, setProduct] = useState({});
  const [error, setError] = useState({});
  const [lastReceiptNo, setLastReceiptNo] = useState("000001");
  const [list, setList] = useState([{ product_id: "", qty: "", desc: "" }]);

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
  };
  // Default Load
  const fetchData = () => {
    Http.get("/finished-good").then((res) => {
      setProduct(res.data);
    });
    Http.get("/raw-packing-materials").then((res) => {
      setRmpm(res.data);
    });
    Http.get("/receipe/" + id + "/edit").then((res) => {
      setInputs({
        receipt_no: res.data.receipt_no,
        date: res.data.date,
        batch_size: res.data.batch_size,
        product_id: res.data.product_id,
        yield: res.data.yield,
        overhead_percent: res.data.overhead_percent,
        overhead_amount: res.data.overhead_amount,
      });

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          product_id: res.data.items[key].product_id,
          qty: res.data.items[key].qty,
          desc: res.data.items[key].description,
        });
      });
      setList(listInfo);
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
    Http.put("/receipe/" + id, inputs)
      .then((res) => {
        navigate("/receipe", {
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
          <h5 className="am-title">Edit Receipe</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Receipe Form</h6>
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
                />
              </div>
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
                <label>
                  Batch Size <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="batch_size"
                  value={inputs.batch_size || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Yield %</label>
                <input
                  type="text"
                  className="form-control"
                  name="yield"
                  value={inputs.yield || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Finished Good <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="product_id"
                  onChange={handleChange}
                >
                  <option value="">Select Product</option>
                  {Array.from(product).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={inputs.product_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label>Overhead %</label>
                <input
                  type="text"
                  className="form-control"
                  name="overhead_percent"
                  value={inputs.overhead_percent || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Overhead Amount</label>
                <input
                  type="text"
                  className="form-control"
                  name="overhead_amount"
                  value={inputs.overhead_amount || ""}
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
                          {Array.from(rmpm).map((item, index) => (
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

export default CreateRegion;
