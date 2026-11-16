import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import Select from "react-select";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [base, setBase] = useState({});
  const [rsm, setRsm] = useState({});
  const [factory, setFactory] = useState({});
  const [selectedBaseOption, setSelectedBaseOption] = useState(null);
  const [selectedSrBase, setSelectedSrBase] = useState([]);
  const { checkRequiredFields } = useRequiredFields();
  const [isRequired, setIsRequired] = useState(false);
  const [outSideCompany, setOutSideCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({});

  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [place, setPlace] = useState([]);

  // if upload has any File
  const [selectedFile1, setSelectedFile1] = useState();
  const [selectedFile2, setSelectedFile2] = useState();
  const [selectedFile3, setSelectedFile3] = useState();
  const [selectedFile4, setSelectedFile4] = useState();
  const [selectedFileNidBack, setSelectedFileNidBack] = useState();
  const [selectedFileProfile, setSelectedFileProfile] = useState();
  const [selectedFileAgreement, setSelectedFileAgreement] = useState();
  const [selectedFileAgreementBack, setSelectedFileAgreementBack] = useState();
  const [selectedFileOpeningForm, setSelectedFileOpeningForm] = useState();
  const [selectedFileOpeningFormBack, setSelectedFileOpeningFormBack] = useState();
  const [selectedFileNoTransection, setSelectedFileNoTransection] = useState();
  const [selectedFileNoTransectionBack, setSelectedFileNoTransectionBack] = useState();
  const [selectedFileBaseTaken, setSelectedFileBaseTaken] = useState();
  const [selectedFileBaseTakenBack, setSelectedFileBaseTakenBack] = useState();
  const [selectedFileLicenseBack, setSelectedFileLicenseBack] = useState();
  const [selectedFileVatBack, setSelectedFileVatBack] = useState();
  const [selectedFileTinBack, setSelectedFileTinBack] = useState();

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["opening_date"]: shortDate }));
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
    if (name == "division_id") {
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.District/id,name/division_id:" +
        value
      ).then((res) => {
        setDistrict(res.data);
      });
    }
    if (name == "district_id") {
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Thana/id,name/district_id:" +
        value
      ).then((res) => {
        setThana(res.data);
      });
    }
    if (name == "thana_id") {
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Place/id,name/thana_id:" +
        value
      ).then((res) => {
        setPlace(res.data);
      });
    }
  };

  const handleSelect2Change = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;

    if (actionMeta.name === "base_id") {
      setSelectedBaseOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    setInputs((values) => ({ ...values, [name]: value }));
  };
  const fetchData = () => {
    let data = {};
    data.designation_id = 7;

    Http.get("/me", data).then((res) => {
      setOutSideCompany(res.data);
    });

    Http.post("/staff-filter", data).then((res) => {
      setRsm(res.data);
    });
    Http.get("/base2").then((res) => {
      setBase(res.data);
    });
    Http.get("/factory").then((res) => {
      setFactory(res.data);
    });
    Http.get("/department2").then((res) => {
      setDepartment(res.data);
    });
    Http.get("/last-code-increment-by-one/distributors/code/D").then((res) => {
      setInputs({
        code: res.data,
      });
    });
    Http.get(
      "/select2/SupplyChainPurchaseManagement.Setting.Division/id,name"
    ).then((res) => {
      setDivision(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);

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
  const handleFileChangeNidBack = (e) => {
    setSelectedFileNidBack(e.target.files[0]);
  };
  const handleFileChangeProfile = (e) => {
    setSelectedFileProfile(e.target.files[0]);
  };
  const handleFileChangeAgreement = (e) => {
    setSelectedFileAgreement(e.target.files[0]);
  };
  const handleFileChangeAgreementBack = (e) => {
    setSelectedFileAgreementBack(e.target.files[0]);
  };
  const handleFileChangeOpeningForm = (e) => {
    setSelectedFileOpeningForm(e.target.files[0]);
  };
  const handleFileChangeOpeningFormBack = (e) => {
    setSelectedFileOpeningFormBack(e.target.files[0]);
  };
  const handleFileChangeNoTransection = (e) => {
    setSelectedFileNoTransection(e.target.files[0]);
  };
  const handleFileChangeNoTransectionBack = (e) => {
    setSelectedFileNoTransectionBack(e.target.files[0]);
  };
  const handleFileChangeBaseTaken = (e) => {
    setSelectedFileBaseTaken(e.target.files[0]);
  };
  const handleFileChangeBaseTakenBack = (e) => {
    setSelectedFileBaseTakenBack(e.target.files[0]);
  };
  const handleFileChangeLicenseBack = (e) => {
    setSelectedFileLicenseBack(e.target.files[0]);
  };
  const handleFileChangeVatBack = (e) => {
    setSelectedFileVatBack(e.target.files[0]);
  };
  const handleFileChangeTinBack = (e) => {
    setSelectedFileTinBack(e.target.files[0]);
  };

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const formSubmit = async () => {
    if (!checkRequiredFields()) return;
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(inputs || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key + "[]", v));
        } else {
          formData.append(key, value);
        }
      });

      if (selectedSrBase && selectedSrBase.length) {
        selectedSrBase.forEach((item) => {
          const scalar = item && (item.value ?? item.id ?? item);
          formData.append("sr_base[]", scalar);
        });
      }

      if (selectedFileProfile) formData.append("profile_img", selectedFileProfile);
      if (selectedFileAgreement) formData.append("agreement_img", selectedFileAgreement);
      if (selectedFileAgreementBack) formData.append("agreement_back_img", selectedFileAgreementBack);
      if (selectedFileOpeningForm) formData.append("openingform_img", selectedFileOpeningForm);
      if (selectedFileOpeningFormBack) formData.append("openingform_back_img", selectedFileOpeningFormBack);
      if (selectedFileNoTransection) formData.append("no_transaction_from", selectedFileNoTransection);
      if (selectedFileNoTransectionBack) formData.append("no_transaction_from_back", selectedFileNoTransectionBack);
      if (selectedFileBaseTaken) formData.append("base_taken_from", selectedFileBaseTaken);
      if (selectedFileBaseTakenBack) formData.append("base_taken_from_back", selectedFileBaseTakenBack);

      if (selectedFile1) formData.append("license_img", selectedFile1);
      if (selectedFileLicenseBack) formData.append("license_back_img", selectedFileLicenseBack);
      if (selectedFile2) formData.append("vat_reg_img", selectedFile2);
      if (selectedFileVatBack) formData.append("vat_reg_back_img", selectedFileVatBack);
      if (selectedFile3) formData.append("tin_img", selectedFile3);
      if (selectedFileTinBack) formData.append("tin_back_img", selectedFileTinBack);
      if (selectedFile4) formData.append("nid_img", selectedFile4);
      if (selectedFileNidBack) formData.append("nid_back_img", selectedFileNidBack);
      const res = await Http.post("/distributor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/distributors", {
        state: { message: res.data.message, type: "success" },
      });
    } catch (e) {
      setError(e.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const selectSrBaseChange = (selectedValues) => {
    setSelectedSrBase(selectedValues);
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Distributor</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Distributor Form
            </h6>
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
                  placeholder="Input code"
                  data-required
                />
                {displayError("code")}
              </div>
              <div className="col-lg">
                <label>
                  Distributor Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                  data-required
                />
                {displayError("name")}
              </div>

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
                  placeholder="Input Contact Person"
                  data-required
                />
                {displayError("contact_person")}
              </div>

              <div className="col-lg">
                <label>Contact Phone</label>
                <input
                  type="number"
                  className="form-control"
                  name="contact_phone"
                  value={inputs.contact_phone || ""}
                  onChange={handleChange}
                  placeholder="Input Contact Phone"
                />
              </div>
              <div className="col-lg">
                <label>Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="profile_img"
                  onChange={handleFileChangeProfile}
                  placeholder="Upload profile image"
                />
                {displayError("profile_img")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label>Secondary Phone</label>
                <input
                  type="number"
                  className="form-control"
                  name="secondary_phone"
                  value={inputs.secondary_phone || ""}
                  onChange={handleChange}
                  placeholder="Input Secondary Phone"
                />
              </div>
              <div className="col-lg">
                <label>
                  Email <i className="fa fa-star required"></i>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  placeholder="Input email"
                  data-required
                />
                {displayError("email")}
              </div>
              <div className="col-lg">
                <label>
                  Password <i className="fa fa-star required"></i>
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="Password"
                  value={inputs.Password || ""}
                  onChange={handleChange}
                  placeholder="Input Password"
                  data-required
                />
                {displayError("Password")}
              </div>
              <div className="col-lg">
                <label>Opening Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="opening_date"
                  value={inputs.opening_date || ""}
                  onChange={handleChange}
                  placeholder="Input opening_date"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Blood Group</label>
                <select
                  className="form-control"
                  name="blood_group"
                  onChange={handleChange}
                >
                  <option value="">Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Department <i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={department[0]}
                  name="department_id"
                  options={department}
                  onChange={selectHandleChange}
                />

                {/* <select
                  className="form-control"
                  name="department_id"
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {Array.from(department).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label>Card No.</label>
                <textarea
                  className="form-control"
                  name="card_no"
                  onChange={handleChange}
                >
                  {inputs.card_no || ""}
                </textarea>
              </div>
              <div className="col-lg">
                <label>Present Address</label>
                <textarea
                  className="form-control"
                  name="present_address"
                  onChange={handleChange}
                >
                  {inputs.present_address || ""}
                </textarea>
              </div>
              <div className="col-lg">
                <label>Permanent Address</label>
                <textarea
                  className="form-control"
                  name="permanent_address"
                  onChange={handleChange}
                >
                  {inputs.permanent_address || ""}
                </textarea>
              </div>
              <div className="col-lg">
                <label>Godown Address</label>
                <textarea
                  className="form-control"
                  name="godown_address"
                  onChange={handleChange}
                >
                  {inputs.godown_address || ""}
                </textarea>
              </div>
              {outSideCompany?.data?.user_type !== "other-company" && (
                <div className="col-lg">
                  <label>
                    Business Type{" "}
                    <i
                      className={`fa fa-star required ${outSideCompany?.data?.user_type !== "other-company"
                        ? "required"
                        : ""
                        }`}
                    ></i>
                  </label>
                  <select
                    className="form-control"
                    name="business_type"
                    required=""
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="commission">Commission</option>
                    <option value="institute">Institute</option>
                    <option value="temporary">Temporary</option>
                    <option value="rdso">RDSO</option>
                  </select>
                </div>
              )}
            </div>
            {outSideCompany?.data?.user_type !== "other-company" && (
              <>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label>
                      Distributor Base <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={base[0]}
                      name="base_id"
                      options={base}
                      onChange={handleSelect2Change}
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      Distributor Opened By{" "}
                      <i className="fa fa-star required"></i>
                    </label>
                    <select
                      className="form-control"
                      name="opened_by"
                      onChange={handleChange}
                    >
                      <option value="">Select RSM</option>
                      {Array.from(rsm).map((item, index) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg">
                    <label>
                      SR Base <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      value={selectedSrBase}
                      name="sr_base"
                      options={base}
                      text="Please select Base."
                      isMulti="yes"
                      onChange={selectSrBaseChange}
                      {...(isRequired && {
                        styles: {
                          control: (base, { menuIsOpen, hasValue }) => {
                            const borderColor = hasValue
                              ? "#ccc"
                              : menuIsOpen
                                ? "#ccc"
                                : "red";
                            return { ...base, borderColor };
                          },
                        },
                      })}
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      Commission % <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="commission"
                      value={inputs.commission || ""}
                      onChange={handleChange}
                      placeholder="Input Commission Rate"
                      data-required
                    />
                    {displayError("commission")}
                  </div>
                </div>
              </>
            )}
            <div className="row mt-3">
              {outSideCompany?.data?.user_type !== "other-company" && (
                <div className="col-lg">
                  <label>
                    Assign To a Factory <i className="fa fa-star required"></i>
                  </label>
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
              )}
              <div className="col-lg">
                <label>Bin No</label>
                <input
                  type="text"
                  className="form-control"
                  name="bin_no"
                  value={inputs.bin_no || ""}
                  onChange={handleChange}
                  placeholder="Input Bin no"
                />
              </div>

              <div className="col-lg">
                <label>Previous Due</label>
                <input
                  type="number"
                  className="form-control"
                  name="previous_due"
                  value={inputs.previous_due || ""}
                  onChange={handleChange}
                  placeholder="Input Previous Due"
                />
              </div>
            </div>
            {/* NID */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>NID No</label>
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
              </div>
              <div className="col-lg">
                <label>NID Back Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="nid_back_img"
                  onChange={handleFileChangeNidBack}
                  placeholder="Input nid back image"
                />
              </div>
            </div>

            {/* license */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>License No</label>
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
              </div>
              <div className="col-lg">
                <label>License Back Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="license_back_img"
                  onChange={handleFileChangeLicenseBack}
                  placeholder="Input license back image"
                />
              </div>
            </div>

            {/* Vat */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>Vat Reg. No</label>
                <input
                  type="text"
                  className="form-control"
                  name="vat_reg_no"
                  value={inputs.vat_reg_no || ""}
                  onChange={handleChange}
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
              </div>
              <div className="col-lg">
                <label>Vat Back Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="vat_reg_back_img"
                  onChange={handleFileChangeVatBack}
                  placeholder="Input vat back image"
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
              </div>
              <div className="col-lg">
                <label>TIN Back Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="tin_back_img"
                  onChange={handleFileChangeTinBack}
                  placeholder="Input tin back image"
                />
              </div>
              <div className="col-lg">
                <label>Minimum Stock Value</label>
                <input
                  type="text"
                  className="form-control"
                  name="minimum_stock_value"
                  onChange={handleChange}
                  placeholder="Minimum Stock Value"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Agreement Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="agreement_img"
                  onChange={handleFileChangeAgreement}
                />
                {displayError("agreement_img")}
              </div>
              <div className="col-lg">
                <label>Agreement Back Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="agreement_back_img"
                  onChange={handleFileChangeAgreementBack}
                />
                {displayError("agreement_back_img")}
              </div>
              <div className="col-lg">
                <label>Opening Form Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="openingform_img"
                  onChange={handleFileChangeOpeningForm}
                />
                {displayError("openingform_img")}
              </div>
              <div className="col-lg">
                <label>Opening Form Back Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="openingform_back_img"
                  onChange={handleFileChangeOpeningFormBack}
                />
                {displayError("openingform_back_img")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>No Transaction Form</label>
                <input
                  type="file"
                  className="form-control"
                  name="no_transaction_from"
                  onChange={handleFileChangeNoTransection}
                />
                {displayError("no_transaction_from")}
              </div>
              <div className="col-lg">
                <label>No Transaction Form Back</label>
                <input
                  type="file"
                  className="form-control"
                  name="no_transaction_from_back"
                  onChange={handleFileChangeNoTransectionBack}
                />
                {displayError("no_transaction_from_back")}
              </div>
              <div className="col-lg">
                <label>Base Taken From</label>
                <input
                  type="file"
                  className="form-control"
                  name="base_taken_from"
                  onChange={handleFileChangeBaseTaken}
                />
                {displayError("base_taken_from")}
              </div>
              <div className="col-lg">
                <label>Base Taken From Back</label>
                <input
                  type="file"
                  className="form-control"
                  name="base_taken_from_back"
                  onChange={handleFileChangeBaseTakenBack}
                />
                {displayError("base_taken_from_back")}
              </div>
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
