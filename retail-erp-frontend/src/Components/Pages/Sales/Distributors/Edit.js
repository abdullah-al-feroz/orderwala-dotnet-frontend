import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";

const Edit = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [base, setBase] = useState({});
  const [rsm, setRsm] = useState({});
  const [factory, setFactory] = useState({});
  const [selectedBaseOption, setSelectedBaseOption] = useState(null);
  const [selectedSrBase, setSelectedSrBase] = useState([]);
  const { checkRequiredFields } = useRequiredFields();
  const [isRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDesignationOption, setSelectedDesignationOption] =
    useState(null);
  const [designation, setDesignation] = useState([]);
    
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
  const [outSideCompany, setOutSideCompany] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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
  const fetchData = useCallback(async () => {
    const outsideCompanyResponse = await Http.get("/me");
    setOutSideCompany(outsideCompanyResponse.data);
    let data = {};
    data.designation_id = 7;
    Http.post("/staff-filter", data).then((res) => {
      setRsm(res.data);
    });
    Http.get("/base2").then((res) => {
      setBase(res.data);
    });
    Http.get("/factory").then((res) => {
      setFactory(res.data);
    });
    const designationResponse = await Http.get("/department2");
    const designationOptions = Array.from(designationResponse.data || []).map(
      (item) => ({
        label: item.designation_code || item.name || item.title || item.label,
        value: item.id || item.value,
      })
    );
    setDesignation(designationOptions);
    Http.get("/distributor/" + id + "/edit").then((res) => {
      const selectedDesignationId =
        res.data.designation || "";
      setInputs({
        code: res.data.code,
        name: res.data.name,
        contact_person: res.data.contact_person,
        contact_phone: res.data.contact_phone,
        secondary_phone: res.data.secondary_phone,
        email: res.data.email,
        commission: res.data.commission,
        opening_date: res.data.opening_date,
        previous_due: res.data.previous_due,
        present_address: res.data.present_address,
        permanent_address: res.data.permanent_address,
        godown_address: res.data.godown_address,
        business_type: res.data.business_type,
        factory_id: res.data.factory_id,
        base_id: res.data.base_id,
        opened_by: res.data.opened_by,
        status: res.data.status,
        inactive_date: res.data.inactive_date,
        resign_date: res.data.resign_date,
        nid: res.data.nid_number,
        bin_no: res.data.bin_no,
        blood_group: res.data.blood_group || "",
        card_no: res.data.card_no || "",
        designation_id: selectedDesignationId,
        license_no: res.data.distributor_documents
          ? res.data.distributor_documents.license_no
          : "",
        license_no_validaty_date: res.data.distributor_documents
          ? res.data.distributor_documents.license_no_validaty_date
          : "",
        vat_reg_no: res.data.distributor_documents
          ? res.data.distributor_documents.vat_reg_no
          : "",
        vat_reg_no_validaty_date: res.data.distributor_documents
          ? res.data.distributor_documents.vat_reg_no_validaty_date
          : "",
        tin_no: res.data.distributor_documents
          ? res.data.distributor_documents.tin_no
          : "",
        tin_no_validaty_date: res.data.distributor_documents
          ? res.data.distributor_documents.tin_no_validaty_date
          : "",
        minimum_stock_value: res.data.minimum_stock_value,
      });
      let srbase = [];
      Object.keys(res.data.sr_base).forEach((key) => {
        srbase.push({
          label: res.data.sr_base[key].base.name,
          value: res.data.sr_base[key].base.id,
        });
      });
      setSelectedSrBase(srbase);
      setSelectedBaseOption({
        label: res.data.distributor_location
          ? res.data.distributor_location.name
          : "",
        value: res.data.distributor_location ? res.data.base_id : 0,
      });

      if (selectedDesignationId) {
        setSelectedDesignationOption(
          designationOptions.find((item) => item.value === selectedDesignationId) ||
            null
        );
      }
    });
  }, [id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  const formSubmit = async () => {
    if (!checkRequiredFields()) return;
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(inputs || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
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
      formData.append("_method", "PUT");

      const res = await Http.post("/distributor/" + id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/distributors", {
        state: { message: res.data.message, type: res.data.type },
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

  const selectDesignationChange = (selectedOption, actionMeta) => {
    const value = selectedOption?.value ?? "";
    console.log(value);
    
    setSelectedDesignationOption(selectedOption);
    setInputs((values) => ({ ...values, designation_id: value }));
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Distributor</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Distributor Form
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
                />
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
                />
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
                />
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
                  accept="image/*"
                  className="form-control"
                  name="profile_img"
                  onChange={handleFileChangeProfile}
                />
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
                />
              </div>
              <div className="col-lg">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="Password"
                  value={inputs.Password || ""}
                  onChange={handleChange}
                  placeholder="Input Password"
                />
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
              <div className="col-lg">
                <label htmlFor="">Blood Group</label>
                <select
                  className="form-control"
                  name="blood_group"
                  value={inputs.blood_group || ""}
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
                  Designation<i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  value={selectedDesignationOption}
                  onChange={selectDesignationChange}
                  name="designation_id"
                  options={designation}
                />
              </div>
              <div className="col-lg">
                <label>Card No.</label>
                <textarea
                  className="form-control"
                  name="card_no"
                  value={inputs.card_no || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Present Address</label>
                <textarea
                  className="form-control"
                  name="present_address"
                  onChange={handleChange}
                  defaultValue={inputs.present_address}
                ></textarea>
              </div>
              <div className="col-lg">
                <label>Permanent Address</label>
                <textarea
                  className="form-control"
                  name="permanent_address"
                  onChange={handleChange}
                  defaultValue={inputs.permanent_address}
                ></textarea>
              </div>
              <div className="col-lg">
                <label>Godown Address</label>
                <textarea
                  className="form-control"
                  name="godown_address"
                  onChange={handleChange}
                  defaultValue={inputs.godown_address}
                ></textarea>
              </div>
              {outSideCompany?.data?.user_type !== "other-company" && (
                <div className="col-lg">
                  <label>
                    Business Type <i className="fa fa-star required"></i>
                  </label>
                  <select
                    className="form-control"
                    name="business_type"
                    required=""
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option
                      value="retail"
                      selected={
                        inputs.business_type === "retail" ? true : false
                      }
                    >
                      Retail
                    </option>
                    <option
                      value="wholesale"
                      selected={
                        inputs.business_type === "wholesale" ? true : false
                      }
                    >
                      Wholesale
                    </option>
                    <option
                      value="commission"
                      selected={
                        inputs.business_type === "commission" ? true : false
                      }
                    >
                      Commission
                    </option>
                    <option
                      value="institute"
                      selected={
                        inputs.business_type === "institute" ? true : false
                      }
                    >
                      Institute
                    </option>
                    <option
                      value="temporary"
                      selected={
                        inputs.business_type === "temporary" ? true : false
                      }
                    >
                      Temporary
                    </option>
                    <option
                      value="rdso"
                      selected={inputs.business_type === "rdso" ? true : false}
                    >
                      RDSO
                    </option>
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
                      defaultValue={selectedBaseOption}
                      value={selectedBaseOption}
                      onChange={handleSelect2Change}
                      name="base_id"
                      options={base}
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
                        <option
                          value={item.id}
                          key={item.id}
                          selected={inputs.opened_by === item.id ? true : false}
                        >
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
                      value={selectedSrBase} // Set the selected value here
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
                      Commission <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="commission"
                      value={inputs.commission || ""}
                      onChange={handleChange}
                      placeholder="Input Commission Rate"
                    />
                  </div>
                </div>
              </>
            )}
            {/* NID */}
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
                      <option
                        value={item.id}
                        key={item.id}
                        selected={inputs.factory_id === item.id ? true : false}
                      >
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
                  accept="image/*"
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
                  accept="image/*"
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
                  accept="image/*"
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
                  accept="image/*"
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
                  accept="image/*"
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
                  accept="image/*"
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
                  accept="image/*"
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
                  accept="image/*"
                  className="form-control"
                  name="tin_back_img"
                  onChange={handleFileChangeTinBack}
                  placeholder="Input tin back image"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Agreement Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="agreement_img"
                  onChange={handleFileChangeAgreement}
                />
              </div>
              <div className="col-lg">
                <label>Agreement Back Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="agreement_back_img"
                  onChange={handleFileChangeAgreementBack}
                />
              </div>
              <div className="col-lg">
                <label>Opening Form Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="openingform_img"
                  onChange={handleFileChangeOpeningForm}
                />
              </div>
              <div className="col-lg">
                <label>Opening Form Back Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="openingform_back_img"
                  onChange={handleFileChangeOpeningFormBack}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>No Transaction Form</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="no_transaction_from"
                  onChange={handleFileChangeNoTransection}
                />
              </div>
              <div className="col-lg">
                <label>No Transaction Form Back</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="no_transaction_from_back"
                  onChange={handleFileChangeNoTransectionBack}
                />
              </div>
              <div className="col-lg">
                <label>Base Taken From</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="base_taken_from"
                  onChange={handleFileChangeBaseTaken}
                />
              </div>
              <div className="col-lg">
                <label>Base Taken From Back</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="base_taken_from_back"
                  onChange={handleFileChangeBaseTakenBack}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Status <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  required=""
                  onChange={handleChange}
                >
                  <option
                    value="active"
                    selected={inputs.status === "active" ? true : false}
                  >
                    Active
                  </option>
                  <option
                    value="inactive"
                    selected={inputs.status === "inactive" ? true : false}
                  >
                    inactive
                  </option>
                  <option
                    value="resign"
                    selected={inputs.status === "resign" ? true : false}
                  >
                    resign
                  </option>
                </select>
              </div>

              <div className="col-lg">
                <label>Inactive Date (If Status is Inactive)</label>
                <input
                  type="date"
                  className="form-control"
                  name="inactive_date"
                  value={inputs.inactive_date || ""}
                  onChange={handleChange}
                  placeholder="Input inactive_date"
                />
              </div>
              <div className="col-lg">
                <label>Resign Date (If Status is Resign)</label>
                <input
                  type="date"
                  className="form-control"
                  name="resign_date"
                  value={inputs.resign_date || ""}
                  onChange={handleChange}
                  placeholder="Input resign_date"
                />
              </div>
              <div className="col-lg">
                <label>Minimum Stock Value</label>
                <input
                  type="text"
                  className="form-control"
                  name="minimum_stock_value"
                  value={inputs.minimum_stock_value || ""}
                  onChange={handleChange}
                  placeholder="Minimum Stock Value"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                  disabled={loading}
                >
                  <i className="fa fa-send mg-r-10"></i> {loading ? "Updating..." : "Update"}
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
