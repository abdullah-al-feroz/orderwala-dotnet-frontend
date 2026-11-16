import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const CreateRegion = () => {
  var someDate = new Date();
  var date = someDate.setDate(someDate.getDate());
  var defaultDateValue = new Date(date).toISOString().split("T")[0];

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    date: defaultDateValue,
  });
  // const [location, setLocation] = useState({});
  const [factory, setFactory] = useState({});
  // const [department, setDepartment] = useState({});
  const [product, setProduct] = useState({});
  // const [unit, setUnit] = useState({});
  const [error, setError] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [vendor, setVendor] = useState({});
  const [list, setList] = useState([
    { product_id: "", unit_id: "", qty: "", desc: "" },
  ]);

  const selectHandleChangeAddMore = (selectedOption, actionMeta, index) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };
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
  };
  // Default Load
  const fetchData = () => {
    Http.get("/vendor").then((res) => {
      setVendor(res.data);
    });
    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });
    Http.get("/product").then((res) => {
      setProduct(res.data);
    });
    Http.get("/last-code-increment-by-one/grns/receipt_no").then((res) => {
      setInputs((values) => ({ ...values, ["receipt_no"]: res.data }));
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // End Default Load

  // Add More List
  const addMoreList = () => {
    setList([
      ...list,
      { product_id: "", unit_id: "", qty: "", price: "", desc: "" },
    ]); // Add One More List
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

    // inputs.file = selectedFile;
    inputs.items = listArr;
    inputs.type = "other-receive";
    Http.post("/others-receive", inputs)
      .then((res) => {
        navigate("/others-receive", {
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
          <h5 className="am-title">Create</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Others Receive</h6>
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
                <label htmlFor="">Factory</label>
                {/* <select
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
                </select> */}

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
                      Price <i className="fa fa-star required"></i>
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
                          <option value="">Select product </option>
                          {Array.from(product).map((item, index) => (
                            <option value={item.id} key={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>

                        {/* <Select
                          className="basic-single"
                          classNamePrefix="select"
                          defaultValue={product[0]}
                          name="product_id"
                          options={product}
                          onChange={selectHandleChange}
                        /> */}
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
                        <input
                          type="text"
                          className="form-control"
                          name="price"
                          value={x.price || ""}
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

            {/* <div className="row mt-3">
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
            </div> */}

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
