import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";
import Select from "react-select";

const Edit = (props) => {
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
  const [attachment, setAttachment] = useState({});
  const [error, setError] = useState({});
  const [url, setUrl] = useState(Http.getUri());

  const [selectedfactoryOption, setSelectedfactoryOption] = useState(null);

  const selectHandleChange = (selectedOption, actionMeta) => {
    setSelectedfactoryOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });

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
  const fetchData = () => {
    Http.get("/location").then((res) => {
      setLocation(res.data);
    });
    // Http.get("/factory").then((res) => {
    //   setFactory(res.data);
    // });

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
    Http.get("/circular-rfq/" + id + "/edit").then((res) => {
      setInputs({
        date: res.data.date,
        title: res.data.title,
        subject: res.data.subject,
        description: res.data.description,
        circular_no: res.data.circular_no,
        last_date_of_quotation: res.data.last_date_of_quotation,
        quotation_validaty: res.data.quotation_validaty,
        company_location_id: res.data.company_location_id,
        factory_id: res.data.factory_id,
        department_id: res.data.department_id,
        status: res.data.status,
      });

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          product_id: res.data.items[key].product_id,
          unit_id: res.data.items[key].unit_id,
          qty: res.data.items[key].qty,
          desc: res.data.items[key].desc,
        });
      });
      setList(listInfo);

      setSelectedfactoryOption({
        label: res.data.factory.name,
        value: res.data.factory.id,
      });

      const attachmentInfo = [];
      Object.keys(res.data.attachment).forEach((key) => {
        attachmentInfo.push({ name: res.data.attachment[key].attachment });
      });
      console.log("lorem" + attachmentInfo);
      setAttachment(attachmentInfo);
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

    Http.put("/circular-rfq/" + id, inputs)
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
          <h5 className="am-title">Edit Circular RFQ Form</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Circular RFQ Form
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
                  defaultValue={selectedfactoryOption}
                  value={selectedfactoryOption}
                  onChange={selectHandleChange}
                  name="work_place_region_id"
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
                      Unit
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
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
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
