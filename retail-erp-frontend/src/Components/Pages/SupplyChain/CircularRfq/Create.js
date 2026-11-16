import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";
import Select from "react-select";

const CreateRegion = () => {
  var someDate = new Date();
  var date = someDate.setDate(someDate.getDate());
  var defaultDateValue = new Date(date).toISOString().split("T")[0];

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    date: defaultDateValue,
    last_date_of_quotation: defaultDateValue,
  });
  const [location, setLocation] = useState({});
  const [factory, setFactory] = useState({});
  const [department, setDepartment] = useState({});
  const [product, setProduct] = useState({});
  const [unit, setUnit] = useState({});
  const [error, setError] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [list, setList] = useState([
    { product_id: "", unit_id: "", qty: "", desc: "" },
  ]);

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

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;
    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };

  // Default Load
  const fetchData = () => {
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

    Http.get("/last-code-increment-by-one/circular_rfqs/circular_no").then(
      (res) => {
        setInputs((values) => ({ ...values, ["circular_no"]: res.data }));
      }
    );
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);
  // End Default Load

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
    Http.post("/circular-rfq", inputs)
      .then((res) => {
        navigate("/circular-rfq", {
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
          <h5 className="am-title">Create Circular RFQ</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Circular RFQ Form
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
              <div className="col-lg">
                <label>
                  Circular no <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="circular_no"
                  value={inputs.circular_no || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>
                  Title <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={inputs.title || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>
                  Subject <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={inputs.subject || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Last Date Of Quotation</label>
                <input
                  type="date"
                  className="form-control"
                  name="last_date_of_quotation"
                  value={inputs.last_date_of_quotation || ""}
                  onChange={handleChange}
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
                            <option value={item.id} key={item.id}>
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
