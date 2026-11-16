import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import Select from "react-select";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [staff, setStaff] = useState({});
  const [vendorCode, setVendorCode] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  // if upload has any File
  const [selectedFile1, setSelectedFile1] = useState();
  const [selectedFile2, setSelectedFile2] = useState();
  const [selectedFile3, setSelectedFile3] = useState();
  const [selectedFile4, setSelectedFile4] = useState();
  const [selectedFile5, setSelectedFile5] = useState();

  const contact_person = [
    {
      contact_person_name: "",
      contact_person_email: "",
      contact_person_phone: "",
      contact_person_designation: "",
    },
    {
      contact_person_name: "",
      contact_person_email: "",
      contact_person_phone: "",
      contact_person_designation: "",
    },
  ];
  const [contactPerson, setContactPerson] = useState(contact_person);

  // Add More ContactPerson
  const addMoreContactPerson = () => {
    setContactPerson([
      ...contactPerson,
      {
        contact_person_name: "",
        contact_person_email: "",
        contact_person_phone: "",
        contact_person_designation: "",
      },
    ]); // Add One More Contact Person
  };
  // Remove Contact Person
  const removeContactPerson = (index) => {
    const list = [...contactPerson]; // Load All Existing Contact Person State Data
    list.splice(index, 1); // Remove Contact Person by Index/Click Event Wise
    setContactPerson(list); // Replace Existing Contact Person into State
  };
  // Set Contact Person State
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Contact Person Input Name and Value
    const list = [...contactPerson]; // Defined Contact Person State All Information into List Variable
    list[index][name] = value;
    setContactPerson(list);
  };
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // if upload has any File
  const handleFileChange1 = (e) => {
    setSelectedFile1(e.target.files[0]);
  };
  const handleFileChange2 = (e) => {
    setSelectedFile2(e.target.files[0]);
  };
  const handleFileChange3 = (e) => {
    setSelectedFile3(e.target.files[0]);
  };
  const handleFileChange4 = (e) => {
    setSelectedFile4(e.target.files[0]);
  };
  const handleFileChange5 = (e) => {
    setSelectedFile5(e.target.files[0]);
  };

  // const formSubmit = () => {
  //   if (checkRequiredFields()) {
  //     inputs.license_img = selectedFile1;
  //     inputs.vat_reg_img = selectedFile2;
  //     inputs.tin_img = selectedFile3;
  //     inputs.nid_img = selectedFile4;
  //     inputs.logo_image = selectedFile5;
  //     inputs.code = vendorCode;
  //     inputs.contact_person_list = contactPerson;
  //     Http.post("/vendor", inputs)
  //       .then((res) => {
  //         navigate("/vendors", {
  //           state: { message: res.data.message, type: "success" },
  //         });
  //       })
  //       .catch(function (e) {
  //         setError(e.response.data.errors);
  //         setFormErrors(e.response.data.errors);

  //         console.log(formErrors.name[0]);
  //       });
  //   }
  // };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const formData = new FormData();

      // Append all input fields
      for (const key in inputs) {
        if (inputs[key] !== undefined && inputs[key] !== null) {
          formData.append(key, inputs[key]);
        }
      }

      // Append files
      if (selectedFile1) formData.append("license_img", selectedFile1);
      if (selectedFile2) formData.append("vat_reg_img", selectedFile2);
      if (selectedFile3) formData.append("tin_img", selectedFile3);
      if (selectedFile4) formData.append("nid_img", selectedFile4);
      if (selectedFile5)
        formData.append("logo_image", selectedFile5, selectedFile5.name);

      // Append vendor code
      formData.append("code", vendorCode);

      // Append contact person list as JSON string
      formData.append("contact_person_list", JSON.stringify(contactPerson));

      Http.post("/vendor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          navigate("/vendors", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
          setFormErrors(e.response.data.errors);
          console.log(e.response.data.errors);
        });
    }
  };

  // Default Load
  const fetchData = () => {
    Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
      (res) => {
        setStaff(res.data);
      }
    );

    Http.get("/last-code-increment-by-one/vendors/code/V").then((res) => {
      setVendorCode(res.data);
    });
  };
  useEffect(() => {
    fetchData(); // Get All Fetch Info/Data
  }, []);
  // End Default Load

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Company</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Company Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Code <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={vendorCode || ""}
                  onChange={handleChange}
                  placeholder="Input Code"
                  data-required
                />
                {displayError("code")}
                {/* {formErrors.name && (
                  <span className="error">{formErrors.code[0]}</span>
                )} */}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                  // required
                  data-required
                />
                {displayError("name")}
                {/* {formErrors.name && (
                  <span className="error">{formErrors.name[0]}</span>
                )} */}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Contact Person <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_person"
                  value={inputs.contact_person || ""}
                  onChange={handleChange}
                  placeholder="Input contact person"
                  data-required
                />
                {displayError("contact_person")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Contact Phone <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_phone"
                  value={inputs.contact_phone || ""}
                  onChange={handleChange}
                  placeholder="Input contact phone"
                  data-required
                />
                {displayError("contact_phone")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label>Secondary Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="secondary_phone"
                  value={inputs.secondary_phone || ""}
                  onChange={handleChange}
                  placeholder="Input secondary phone"
                  data-required
                />
                {displayError("secondary_phone")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  placeholder="Input email"
                  // required
                  data-required
                />
                {displayError("email")}
              </div>
            </div>
            {/* 8 9 12  */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>Website</label>
                <input
                  type="text"
                  className="form-control"
                  name="website"
                  value={inputs.website || ""}
                  onChange={handleChange}
                  placeholder="Input website"
                  data-required
                />
                {displayError("website")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Previous Due</label>
                <input
                  type="number"
                  className="form-control"
                  name="previous_due"
                  value={inputs.previous_due || ""}
                  onChange={handleChange}
                  placeholder="Input previous due"
                  data-required
                />
                {displayError("previous_due")}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Assign to Staff <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={staff[0]}
                  name="assign_staff_id"
                  options={staff}
                  onChange={selectHandleChange}
                />
              </div>
            </div>

            {/* NID */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Company Logo <i className="fa fa-star required"></i>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="logo_image"
                  onChange={handleFileChange5}
                  data-required
                />
                {displayError("logo_image")}
              </div>
              <div className="col-lg">
                <label>
                  Contact Person NID No <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="nid"
                  value={inputs.nid || ""}
                  onChange={handleChange}
                  placeholder="Input license no"
                  minLength={10}
                  maxLength={17}
                  data-required
                />
                {displayError("nid")}
              </div>
              <div className="col-lg">
                <label>NID Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="nid_img"
                  onChange={handleFileChange4}
                  placeholder="Input license no"
                />
              </div>
            </div>

            {/* license */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  License No <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="license_no"
                  value={inputs.license_no || ""}
                  onChange={handleChange}
                  placeholder="Input license no"
                  data-required
                />
                {displayError("license_no")}
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Validity Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="license_no_validaty_date"
                  value={inputs.license_no_validaty_date || ""}
                  onChange={handleChange}
                  placeholder="Input contact phone"
                />
              </div>
              <div className="col-lg">
                <label>License Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="license_img"
                  onChange={handleFileChange1}
                  placeholder="Input license no"
                />
              </div>
            </div>

            {/* Vat */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>BIN</label>
                <input
                  type="text"
                  className="form-control"
                  name="vat_reg_no"
                  value={inputs.vat_reg_no || ""}
                  onChange={handleChange}
                  placeholder="Input license no"
                  data-required
                />
                {displayError("vat_reg_no")}
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Validity Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="vat_reg_no_validaty_date"
                  value={inputs.vat_reg_no_validaty_date || ""}
                  onChange={handleChange}
                  placeholder="Input contact phone"
                />
              </div>
              <div className="col-lg">
                <label>Vat Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="vat_reg_img"
                  onChange={handleFileChange2}
                  placeholder="Input license no"
                />
              </div>
            </div>

            {/* TIN */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>TIN No</label>
                <input
                  type="text"
                  className="form-control"
                  name="tin_no"
                  value={inputs.tin_no || ""}
                  onChange={handleChange}
                  placeholder="Input license no"
                  data-required
                />
                {displayError("tin_no")}
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Validity Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="tin_no_validaty_date"
                  value={inputs.tin_no_validaty_date || ""}
                  onChange={handleChange}
                  placeholder="Input contact phone"
                />
              </div>
              <div className="col-lg">
                <label>Vat Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="tin_img"
                  onChange={handleFileChange3}
                  placeholder="Input license no"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label>Present Address</label>
                <textarea
                  name="present_address"
                  className="form-control"
                  cols="30"
                  rows="5"
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-lg">
                <label>Permanent Address</label>
                <textarea
                  name="permanent_address"
                  className="form-control"
                  cols="30"
                  rows="5"
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-lg">
                <label>Remarks</label>
                <textarea
                  name="notes"
                  className="form-control"
                  cols="30"
                  rows="5"
                  onChange={handleChange}
                ></textarea>
              </div>
              {/* col */}
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <h6 className="card-body-title mg-sm-b-30">Contact Persons</h6>
              </div>
              <div className="col-lg">
                <label htmlFor=""></label>
                <button
                  className="btn btn-info float-right"
                  onClick={addMoreContactPerson}
                >
                  +
                </button>
              </div>
              <hr></hr>
            </div>
            {Array.from(contactPerson).map((x, i) => (
              <div className="row mt-3" key={i}>
                <div className="col-lg">
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="contact_person_name"
                    value={x.contact_person_name || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="contact_person_email"
                    value={x.contact_person_email || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                    name="contact_person_phone"
                    value={x.contact_person_phone || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Designation</label>
                  <div className="row">
                    <div className="col-lg-9">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Designation"
                        name="contact_person_designation"
                        value={x.contact_person_designation || ""}
                        onChange={(e) => handleInputChange(e, i)}
                      />
                    </div>
                    <div className="col-lg-3">
                      {contactPerson.length > 1 ? (
                        <button
                          className="btn btn-danger float-right btn-sm mt-1"
                          onClick={() => removeContactPerson(i)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

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
