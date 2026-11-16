import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  // const [location, setLocation] = useState({});
  const [factory, setFactory] = useState({});
  // const [department, setDepartment] = useState({});
  const [product, setProduct] = useState({});
  // const [unit, setUnit] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [list, setList] = useState({});
  const [vendor, setVendor] = useState({});
  const [attachment, setAttachment] = useState({});
  const [error, setError] = useState({});
  const [url, setUrl] = useState(Http.getUri());

  const [selectedFactoryOption, setSelectedFactoryOption] = useState(null);

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
  const fetchData = () => {
    Http.get("/vendor").then((res) => {
      setVendor(res.data);
    });
    // Http.get("/location").then((res) => {
    //   setLocation(res.data);
    // });
    // Http.get("/factory").then((res) => {
    //   setFactory(res.data);
    // });

    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });
    // Http.get("/department").then((res) => {
    //   setDepartment(res.data);
    // });
    Http.get("/product").then((res) => {
      setProduct(res.data);
    });
    // Http.get("/unit").then((res) => {
    //   setUnit(res.data);
    // });
    Http.get("/others-receive/" + id + "/edit").then((res) => {
      setInputs({
        date: res.data.date,
        receipt_no: res.data.receipt_no,
        vendor_id: res.data.vendor_id,
        company_location_id: res.data.company_location_id,
        // factory_id: res.data.factory_id,
        department_id: res.data.department_id,
        description: res.data.description,
        status: res.data.status,
      });

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          product_id: res.data.items[key].product_id,
          qty: res.data.items[key].qty,
          price: res.data.items[key].unit_price,
          desc: res.data.items[key].desc,
        });
      });
      setList(listInfo);

      setSelectedFactoryOption({
        label: res.data.factory.name,
        value: res.data.factory.id,
      });

      const attachmentInfo = [];
      Object.keys(res.data.attachment).forEach((key) => {
        attachmentInfo.push({ name: res.data.attachment[key].attachment });
      });
      console.log("lorem" + attachmentInfo);
      setAttachment(attachmentInfo);

      console.log(res.data.factory.name);
    });
    // Http.get("/unit").then((res) => {
    //   setUnit(res.data);
    // });
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
  const addMoreList = () => {
    setList([...list, { product_id: "", unit_id: "", qty: "", desc: "" }]); // Add One More List
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

    inputs.file = selectedFile;
    inputs.items = listArr;

    Http.put("/others-receive/" + id, inputs)
      .then((res) => {
        navigate("/others-receive", {
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
          <h5 className="am-title">Edit Others Receive</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
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
              </div> */}
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
                {/* <select
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
                </select> */}
              </div>
              {/* <div className="col-lg">
                <label htmlFor="">Department</label>
                <select
                  className="form-control"
                  name="department_id"
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {Array.from(department).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={inputs.department_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div> */}
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
                    {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Unit
                    </th> */}
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
                          onChange={(e) => handleInputChange(e, i)}
                        >
                          <option value="">Select Unit</option>
                          {Array.from(unit).map((item, index) => (
                            <option
                              value={item.id}
                              key={item.id}
                              selected={x.unit_id === item.id ? true : false}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </td> */}
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
                {Array.from(attachment).map((x, i) => (
                  <a
                    href={url + "circular/" + x.name}
                    target="_blank"
                    className="btn btn-info"
                    style={{ marginRight: "10px", marginTop: "10px" }}
                  >
                    Download
                  </a>
                ))}
              </div>
            </div> */}

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
