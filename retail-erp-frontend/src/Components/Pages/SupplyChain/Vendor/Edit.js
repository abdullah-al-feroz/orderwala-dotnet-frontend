import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import Select from "react-select";
import Url from "../../../Common/Url";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [vendorCode, setVendorCode] = useState({});
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState({});
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

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setSelectedStaff({
      label: selectedOption.label,
      value: selectedOption.value,
    });
  };

  const fetchData = () => {
    Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
      (res) => {
        setStaff(res.data);
      }
    );
    Http.get("/vendor/" + id + "/edit").then((res) => {
      setInputs({
        code: res.data.code,
        name: res.data.name,
        contact_person: res.data.contact_person,
        contact_phone: res.data.contact_phone,
        secondary_phone: res.data.secondary_phone,
        email: res.data.email,
        present_address: res.data.present_address,
        permanent_address: res.data.permanent_address,
        website: res.data.website,
        previous_due: res.data.previous_due,
        notes: res.data.notes,
        assign_staff_id: res.data.assign_staff_id,
        license_no: res.data.vendor_documents
          ? res.data.vendor_documents.license_no
          : "",
        license_img: res.data.vendor_documents
          ? res.data.vendor_documents.license_img
          : "",
        license_no_validaty_date: res.data.vendor_documents
          ? res.data.vendor_documents.license_no_validaty_date
          : "",
        vat_reg_no: res.data.vendor_documents
          ? res.data.vendor_documents.vat_reg_no
          : "",
        vat_reg_img: res.data.vendor_documents
          ? res.data.vendor_documents.vat_reg_img
          : "",
        vat_reg_no_validaty_date: res.data.vendor_documents
          ? res.data.vendor_documents.vat_reg_no_validaty_date
          : "",
        tin_no: res.data.vendor_documents
          ? res.data.vendor_documents.tin_no
          : "",
        tin_no_validaty_date: res.data.vendor_documents
          ? res.data.vendor_documents.tin_no_validaty_date
          : "",
        tin_img: res.data.vendor_documents
          ? res.data.vendor_documents.tin_img
          : "",
        nid: res.data.vendor_documents ? res.data.vendor_documents.nid : "",
        nid_img: res.data.vendor_documents
          ? res.data.vendor_documents.nid_img
          : "",
      });
      setVendorCode(res.data.code);
      setSelectedStaff({
        label: res.data.assign_staff.name,
        value: res.data.assign_staff.id,
      });

      // Contact Person State update
      const contact_person = [];
      Object.keys(res.data.contact_persons).forEach((key) => {
        contact_person.push({
          contact_person_name: res.data.contact_persons[key]["name"],
          contact_person_email: res.data.contact_persons[key]["email"],
          contact_person_phone: res.data.contact_persons[key]["phone"],
          contact_person_designation:
            res.data.contact_persons[key]["designation"],
        });
      });
      setContactPerson(contact_person);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
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
  //   inputs.license_img = selectedFile1;
  //   inputs.vat_reg_img = selectedFile2;
  //   inputs.tin_img = selectedFile3;
  //   inputs.nid_img = selectedFile4;
  //   inputs.code = vendorCode;
  //   Http.put("/vendor/" + id, inputs)
  //     .then((res) => {
  //       navigate("/vendors", {
  //         state: { message: res.data.message, type: res.data.type },
  //       });
  //     })
  //     .catch(function (e) {
  //       setError(e.response.data.errors);
  //     });
  // };

  const formSubmit = () => {
    const formData = new FormData();

    // Append all input fields (excluding file inputs)
    Object.keys(inputs).forEach((key) => {
      formData.append(key, inputs[key]);
    });

    // Append selected files only if newly selected
    if (selectedFile1) formData.append("license_img", selectedFile1);
    if (selectedFile2) formData.append("vat_reg_img", selectedFile2);
    if (selectedFile3) formData.append("tin_img", selectedFile3);
    if (selectedFile4) formData.append("nid_img", selectedFile4);
    if (selectedFile5) formData.append("logo_image", selectedFile5);

    // Append vendor code
    formData.append("code", vendorCode);

    // Append contact person list
    formData.append("contact_person_list", JSON.stringify(contactPerson));

    // Submit with method override (_method=PUT)
    Http.post(`/vendor/${id}?_method=PUT`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        navigate("/vendors", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch((e) => {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Company</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            {/* <h6 className="card-body-title mg-sm-b-30">Edit Unit Form</h6> */}
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
                  value={inputs.code || ""}
                  onChange={handleChange}
                  placeholder="Input Code"
                />
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
                  required
                />
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
                />
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
                />
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
                />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  placeholder="Input email"
                  required
                />
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
                />
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
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Assign to Staff <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedStaff}
                  value={selectedStaff}
                  onChange={selectHandleChange}
                  name="assign_staff_id"
                  options={staff}
                />
              </div>
            </div>

            {/* NID */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>Company Logo</label>
                <input
                  type="file"
                  className="form-control"
                  name="logo_image"
                  onChange={handleFileChange5}
                />
              </div>
              <div className="col-lg">
                <label>
                  Contact Person NID No <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nid"
                  value={inputs.nid || ""}
                  onChange={handleChange}
                  placeholder="Input license no"
                />
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
                {inputs.nid_img != "" ? (
                  <a
                    href={Url + "vendor_documents/" + inputs.nid_img}
                    target="_blank"
                  >
                    Download
                  </a>
                ) : (
                  ""
                )}
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
                />
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
                {inputs.license_img != "" ? (
                  <a
                    href={Url + "vendor_documents/" + inputs.license_img}
                    target="_blank"
                  >
                    Download
                  </a>
                ) : (
                  ""
                )}
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
                  minLength={10}
                  maxLength={17}
                  placeholder="Input license no"
                />
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
                {inputs.vat_reg_img != "" ? (
                  <a
                    href={Url + "vendor_documents/" + inputs.vat_reg_img}
                    target="_blank"
                  >
                    Download
                  </a>
                ) : (
                  ""
                )}
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
                />
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
                <label>TIN Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="tin_img"
                  onChange={handleFileChange3}
                  placeholder="Input license no"
                />
                {inputs.tin_img != "" ? (
                  <a
                    href={Url + "vendor_documents/" + inputs.tin_img}
                    target="_blank"
                  >
                    Download
                  </a>
                ) : (
                  ""
                )}
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
