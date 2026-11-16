import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import HttpHR from "../../../Common/HttpHR";
import HttpSupplyChain from "../../../Common/HttpSupplyChain";
import HttpUser from "../../../Common/HttpUser";
import HttpHrShift from "../../../Common/HttpHrShift";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";

const CreateStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    user_type: "so",
    basic: 0,
    house_rent: 0,
    medical: 0,
    conveyence: 0,
    entertainment: 0,
    ta_da: 0,
    holiday: 0,
    insurance: 0,
    income_tax: 0,
    other_allowance: 0,
    canteen_bill: 0,
    phone_bill_limit: 0,
    insurance_rate: 0,
    gross: 0,
    department_head: false,
    approved_by: false,
    is_vacant: false,
    is_trainee: false,
  });

  const [grossSalary, setGrossSalary] = useState(0);
  const [error, setError] = useState({});
  const [mdo, setMdo] = useState([]);
  const [showMdoList, setShowMdoList] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [validationMessages, setValidationMessages] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [experience, setExperience] = useState([
    { company_name: "", start_date: "", end_date: "", year_of_experience: "" },
    { company_name: "", start_date: "", end_date: "", year_of_experience: "" },
  ]);

  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [selectedCompanyLocation, setSelectedCompanyLocation] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedMdo, setSelectedMdo] = useState(null);
  // const [shift, setShift] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- API Loaders with debounce ---
  const loadGrades = useCallback(debounce((inputValue, callback) => {
    HttpHR.get(`/Grades/paginated?Filter=${inputValue}&Page=1&PageSize=10`)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  }, 500), []);

  const loadDepartments = useCallback(debounce((inputValue, callback) => {
    HttpHR.get(`/Departments/paginated?Filter=${inputValue}&Page=1&PageSize=10`)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  }, 500), []);

  const loadDesignations = useCallback(debounce((inputValue, callback) => {
    HttpHR.get(`/Designations/paginated?Filter=${inputValue}&Page=1&PageSize=10`)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  }, 500), []);

  const loadCompanyLocations = useCallback(debounce((inputValue, callback) => {
    HttpSupplyChain.get(`/CompanyLocation/paginated?Filter=${inputValue}&Page=1&PageSize=10&Status=1`)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  }, 500), []);

  const loadZones = (inputValue, callback) => {
    const url = inputValue
      ? `/Zone/paginated?Filter=${inputValue}&Page=1&PageSize=10`
      : `/Zone/paginated?Page=1&PageSize=10`;
    HttpSupplyChain.get(url)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  };
  const debouncedLoadZones = useCallback(debounce(loadZones, 500), []);

  const loadRegions = (inputValue, callback, zoneId) => {
    let url = `/Region/paginated?Page=1&PageSize=10`;
    if (zoneId) url += `&ZoneId=${zoneId}`;
    if (inputValue) url += `&Filter=${inputValue}`;
    HttpSupplyChain.get(url)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  };
  const debouncedLoadRegions = useCallback(debounce(loadRegions, 500), []);

  const loadAreas = (inputValue, callback, regionId) => {
    let url = `/Area/paginated?Page=1&PageSize=10`;
    if (regionId) url += `&RegionId=${regionId}`;
    if (inputValue) url += `&Filter=${inputValue}`;
    HttpSupplyChain.get(url)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  };
  const debouncedLoadAreas = useCallback(debounce(loadAreas, 500), []);

  const loadBases = (inputValue, callback, areaId) => {
    let url = `/WorkplaceBase/paginated?Page=1&PageSize=10`;
    if (areaId) url += `&AreaId=${areaId}`;
    if (inputValue) url += `&Filter=${inputValue}`;
    HttpSupplyChain.get(url)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  };
  const debouncedLoadBases = useCallback(debounce(loadBases, 500), []);


  const loadShifts = useCallback(debounce((inputValue, callback) => {
    HttpHrShift.get(`/Shift/paginated?Filter=${inputValue}&Page=1&PageSize=10`)
      .then(res => callback(res.data.data.map(item => ({ value: item.id, label: item.name, ...item }))))
      .catch(() => callback([]));
  }, 500), []);

  // --- Fetch initial data ---
  const fetchData = () => {
    if (id) {
      HttpHR.get(`/Candidate/GetById/${id}`).then(res => {
        setInputs(prev => ({ ...prev, name: res.data.data.name, email: res.data.data.email, mobile: res.data.data.mobile, candidate_id: res.data.data.id }));
      });
    }

    // Card number is generated once on load and deliberately not re-fetched after that.
    HttpUser.get(`/last-code-increment-by-one/Hr_StaffBasicInfos/CardNo/S`)
      .then(res => {
        setInputs(prev => ({
          ...prev,
          card_no: res.data.data
        }));
      })
      .catch(console.error);

    HttpHR.get("/app/get-mdo-list")
      .then(res => setMdo(res.data || []))
      .catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  // Which workplace level the backend uses for each role (same mapping as RegisterAsync).
const getWorkplaceForRole = () => {
  switch (inputs.user_type) {
    case "so":
    case "dsr":
    case "bp":
      return { type: "App\\Models\\Hr\\WorkPlaceBase", id: selectedBase?.value };
    case "am":
      return { type: "App\\Models\\Hr\\WorkPlaceArea", id: selectedArea?.value };
    case "rsm":
      return { type: "App\\Models\\Hr\\WorkPlaceRegion", id: selectedRegion?.value };
    case "cdm":
      return { type: "App\\Models\\Hr\\WorkPlaceZone", id: selectedZone?.value };
    default:
      return null; // roles without a workplace: nothing to look up
  }
};

useEffect(() => {
  const workplace = getWorkplaceForRole();
  if (!workplace || !workplace.id) return;

  HttpUser.get("/previous-staff-contact", {
    params: {
      userType: getUserTypeEnum(inputs.user_type),
      workplaceType: workplace.type,   // axios URL-encodes the backslashes
      workplaceId: workplace.id,
    },
  })
    .then((res) => {
      const contact = res.data?.data ?? res.data;
      if (!contact) return;
      setInputs((prev) => ({
        ...prev,
        email: contact.email ?? prev.email,
        mobile: contact.mobile ?? prev.mobile,
      }));
    })
    .catch(() => {
      // 404 = no previous staff on this workplace, nothing to prefill
    });
}, [inputs.user_type, selectedZone, selectedRegion, selectedArea, selectedBase]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "user_type") {
      if (value === "bp") {
        setShowMdoList(true);
        setShowDepartment(false);
      }
      else if (value === "hmo") {
        setShowDepartment(true);
        // setShowMdoList(false);
      }
      else {
        setShowDepartment(false);
        setShowMdoList(false);
        setInputs(prev => ({ ...prev, mdo_id: null }));
      }

      setInputs(prev => ({
        ...prev,
        user_type: value
      }));

      return;
    }

    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const toggleChange = e => {
    const { name, checked } = e.target;
    setInputs(prev => ({ ...prev, [name]: checked }));
  };

  const SALARY_FIELDS = ["basic", "house_rent", "medical", "conveyence", "entertainment", "ta_da", "holiday", "other_allowance", "canteen_bill"];

  const calcGross = (values) =>
    SALARY_FIELDS.reduce((acc, key) => acc + parseInt(values[key] || 0, 10), 0);

  const handleGradeChange = option => {
    setSelectedGrade(option);
    const updated = {
      ...inputs,
      grade_id: option?.value,
      basic: option?.basicSalary || 0,
      house_rent: option?.houseRent || 0,
      medical: option?.medicalAllowance || 0,
      conveyence: option?.conveyanceAllowance || 0,
      entertainment: option?.entertainmentAllowance || 0,
      ta_da: option?.tadaAllowance || 0,
      holiday: option?.holidayRate || 0,
      insurance: option?.insuranceRate || 0,
      income_tax: option?.incomeTax || 0,
      other_allowance: option?.otherAllowance || 0,
      canteen_bill: option?.canteenBill || 0,
      phone_bill_limit: option?.phoneBillLimit || 0,
      insurance_rate: option?.insuranceRate || 0,
    };
    setInputs(updated);
    setGrossSalary(calcGross(updated));
  };

  const handleDepartmentChange = option => { setSelectedDepartment(option); setInputs(prev => ({ ...prev, department_id: option?.value })); };
  const handleDesignationChange = option => { setSelectedDesignation(option); setInputs(prev => ({ ...prev, designation_id: option?.value })); };
  const handleCompanyLocationChange = option => { setSelectedCompanyLocation(option); setInputs(prev => ({ ...prev, company_location_id: option?.value })); };
  const handleShiftChange = option => { setSelectedShift(option); setInputs(prev => ({ ...prev, shift_id: option?.value })); };

  const handleMdoChange = option => {
    setSelectedMdo(option);
    setInputs(prev => ({ ...prev, mdo_id: option?.value || null }));
  };

  const handleZoneChange = option => {
    setSelectedZone(option);
    setInputs(prev => ({
      ...prev,
      work_place_zone_id: option?.value || null,
      work_place_region_id: null,
      work_place_area_id: null,
      work_place_base_id: null
    }));
    setSelectedRegion(null);
    setSelectedArea(null);
    setSelectedBase(null);
  };

  const handleRegionChange = option => {
    setSelectedRegion(option);
    setInputs(prev => ({
      ...prev,
      work_place_region_id: option?.value || null,
      work_place_area_id: null,
      work_place_base_id: null
    }));
    setSelectedArea(null);
    setSelectedBase(null);
  };

  const handleAreaChange = option => {
    setSelectedArea(option);
    setInputs(prev => ({
      ...prev,
      work_place_area_id: option?.value || null,
      work_place_base_id: null
    }));
    setSelectedBase(null);
  };

  const handleBaseChange = option => {
    setSelectedBase(option);
    setInputs(prev => ({
      ...prev,
      work_place_base_id: option?.value || null
    }));
  };

  const addMoreExperience = () => setExperience([...experience, { company_name: "", start_date: "", end_date: "", year_of_experience: "" }]);
  const removeExperience = index => { const list = [...experience]; list.splice(index, 1); setExperience(list); };
  const handleInputChange = (e, index) => { const { name, value } = e.target; const list = [...experience]; list[index][name] = value; setExperience(list); };

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      Swal.fire("Warning!", "Only JPG, PNG, WEBP or GIF image is allowed.", "warning");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      Swal.fire("Warning!", "Image size must be 2 MB or less.", "warning");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const salaryChk = e => {
    const { name, value } = e.target;
    const updated = { ...inputs, [name]: value };
    setInputs(updated);
    setGrossSalary(calcGross(updated));
  };

  const getMissingRequiredFields = () => {
    const requiredFields = [
      ["Card No", inputs.card_no],
      ["Grade", selectedGrade?.value],
      ["Department", selectedDepartment?.value],
      ["Name", inputs.name],
      ["Mobile", inputs.mobile],
      ["Type", inputs.type],
      ["Joining Date", inputs.joining_date],
      ["Email", inputs.email],
      ["Password", inputs.password],
      ["Designation", selectedDesignation?.value],
      ["Company Location", selectedCompanyLocation?.value],
      ["Role", inputs.user_type],
      ["Date Of Birth", inputs.date_of_birth],
      ["Emergency Contact", inputs.emergency_contact],
      ["Present Address", inputs.present_address],
      ["Basic", inputs.basic],
      ["Gross", grossSalary],
    ];

    if (inputs.user_type !== "hmo") {
      requiredFields.push(
        ["Zone", selectedZone?.value],
        ["Region", selectedRegion?.value],
        ["Select Area", selectedArea?.value],
        ["Select Base", selectedBase?.value]
      );
    }

    if (inputs.user_type === "bp") {
      requiredFields.push(["MDO", selectedMdo?.value]);
    }

    return requiredFields
      .filter(([, value]) => value == null || String(value).trim() === "")
      .map(([label]) => label);
  };


  const RoasterGroup = Object.freeze({
    GroupA: 1,
    GroupB: 2
  });

  const UserTypeEnum = Object.freeze({
    CUSTOMER_CARE: 1,
    STAFF: 2,
    DSR: 3,
    SO: 4,
    ADMIN: 5,
    AM: 6,
    RSM: 7,
    HOS: 8,
    HR: 9,
    ACCOUNTS: 10,
    CENTRAL_WAREHOUSE: 11,
    DEPOT: 12,
    SD: 13,
    QC: 14,
    DISTRIBUTOR_MANAGER: 15,
    SUPPLY_CHAIN: 16,
    PRODUCTION: 17,
    PPIC: 18,
    RM_PM: 19,
    REPORTS: 20,
    AREA_MANAGER: 21,
    MOO: 22,
    CDM: 23,
    HMO: 24,
    BP: 25,
    CLUSTER: 26,
    MD: 27
  });

  const getUserTypeEnum = (type) => {
    const map = {
      "customer-care": UserTypeEnum.CUSTOMER_CARE,
      "staff": UserTypeEnum.STAFF,
      "dsr": UserTypeEnum.DSR,
      "so": UserTypeEnum.SO,
      "admin": UserTypeEnum.ADMIN,
      "am": UserTypeEnum.AM,
      "rsm": UserTypeEnum.RSM,
      "hos": UserTypeEnum.HOS,
      "hr": UserTypeEnum.HR,
      "accounts": UserTypeEnum.ACCOUNTS,
      "central_warehouse": UserTypeEnum.CENTRAL_WAREHOUSE,
      "depot": UserTypeEnum.DEPOT,
      "sd": UserTypeEnum.SD,
      "qc": UserTypeEnum.QC,
      "distributor_manager": UserTypeEnum.DISTRIBUTOR_MANAGER,
      "supply_chain": UserTypeEnum.SUPPLY_CHAIN,
      "production": UserTypeEnum.PRODUCTION,
      "ppic": UserTypeEnum.PPIC,
      "rm_pm": UserTypeEnum.RM_PM,
      "reports": UserTypeEnum.REPORTS,
      "area_manager": UserTypeEnum.AREA_MANAGER,
      "moo": UserTypeEnum.MOO,
      "cdm": UserTypeEnum.CDM,
      "hmo": UserTypeEnum.HMO,
      "bp": UserTypeEnum.BP,
      "cluster": UserTypeEnum.CLUSTER,
      "md": UserTypeEnum.MD
    };
    return map[type] || UserTypeEnum.CUSTOMER_CARE;
  };

  const getEmploymentTypeEnum = type => ({ "permanent": 1, "contractual": 2, "internship": 3 }[type] || 1);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  console.log(selectedMdo?.id);
  
  // --- Submit ---
  const formSubmit = () => {
    const missing = getMissingRequiredFields();
    setMissingFields(missing);
    if (missing.length === 0) {
      const now = new Date().toISOString();

      const formData = new FormData();

      // --- Flat fields ---
      formData.append("Name", inputs.name || "");
      formData.append("CandidateId", inputs.candidate_id || "");
      formData.append("UserId", inputs.user_id || "");
      formData.append("RoasterGroup", 1);
      formData.append("UserType", getUserTypeEnum(inputs.user_type));
      formData.append("DepotId", inputs.depotId || 0);
      formData.append("ShiftId", 1);
      formData.append("CardNo", inputs.card_no || "");
      formData.append("Email", inputs.email || "");
      formData.append("Password", inputs.password || "");
      formData.append("Mobile", inputs.mobile || "");
      formData.append("Type", getEmploymentTypeEnum(inputs.type));
      formData.append("Status", 1);
      formData.append("JoiningDate", inputs.joining_date || "");
      formData.append("InactiveDate", inputs.inactive_date || "");
      formData.append("BankAccount", inputs.bank_account || "");
      formData.append("BloodGroup", inputs.blood_group || "");
      formData.append("DateOfBirth", inputs.date_of_birth || "");
      formData.append("PresentAddress", inputs.present_address || "");
      formData.append("PermanentAddress", inputs.permanent_address || "");
      formData.append("EmergencyContact", inputs.emergency_contact || "");
      formData.append("Reference", inputs.reference || "");
      formData.append("GradeId", inputs.grade_id || 0);
      formData.append("DesignationId", inputs.designation_id || 0);
      formData.append("DepartmentId", inputs.department_id || 0);
      formData.append("CompanyLocationId", inputs.company_location_id || 0);
      formData.append("WorkplaceBaseId", inputs.work_place_base_id || "");
      formData.append("WorkplaceAreaId", inputs.work_place_area_id || "");
      formData.append("WorkplaceRegionId", inputs.work_place_region_id || "");
      formData.append("WorkplaceZoneId", inputs.work_place_zone_id || "");
      formData.append("WorkplaceType", inputs.workplace_type || "");
      formData.append("Notes", inputs.notes || "");
      formData.append("IsDepartmentHead", inputs.department_head);
      formData.append("ApprovedBy", 1);
      formData.append("IsTrainee", inputs.is_trainee);
      formData.append("IsVacant", inputs.is_vacant);
      formData.append("CreatedAt", now);
      formData.append("MdoId", selectedMdo?.id || 0);

      // --- Nested salary structure ---
      formData.append("StaffSalaryStructure.GradeId", inputs.grade_id || 0);
      formData.append("StaffSalaryStructure.DesignationId", inputs.designation_id || 0);
      formData.append("StaffSalaryStructure.Basic", inputs.basic || 0);
      formData.append("StaffSalaryStructure.HouseRent", inputs.house_rent || 0);
      formData.append("StaffSalaryStructure.Medical", inputs.medical || 0);
      formData.append("StaffSalaryStructure.Conveyence", inputs.conveyence || 0);
      formData.append("StaffSalaryStructure.Entertainment", inputs.entertainment || 0);
      formData.append("StaffSalaryStructure.TaDa", inputs.ta_da || 0);
      formData.append("StaffSalaryStructure.Holiday", inputs.holiday || 0);
      formData.append("StaffSalaryStructure.Insurance", inputs.insurance || 0);
      formData.append("StaffSalaryStructure.IncomeTax", inputs.income_tax || 0);
      formData.append("StaffSalaryStructure.OtherAllowance", inputs.other_allowance || 0);
      formData.append("StaffSalaryStructure.CanteenBill", inputs.canteen_bill || 0);
      formData.append("StaffSalaryStructure.PhoneBillLimit", inputs.phone_bill_limit || 0);
      formData.append("StaffSalaryStructure.InsuranceRate", inputs.insurance_rate || 0);
      formData.append("StaffSalaryStructure.Gross", grossSalary || 0);
      formData.append("StaffSalaryStructure.CreatedAt", now);

      // --- Nested working experiences ---
      experience
        .filter((exp) => exp.company_name)
        .forEach((exp, index) => {
          formData.append(`WorkingExperiences[${index}].CompanyName`, exp.company_name);
          formData.append(`WorkingExperiences[${index}].StartDate`, exp.start_date || "");
          formData.append(`WorkingExperiences[${index}].EndDate`, exp.end_date || "");
          formData.append(`WorkingExperiences[${index}].YearsOfExperience`, exp.year_of_experience || "");
          formData.append(`WorkingExperiences[${index}].CreatedAt`, now);
        });

      // --- Profile image ---
      if (selectedImage) {
        formData.append("ProfileImageFile", selectedImage);
      }

      HttpUser.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(() => navigate("/staff", { state: { message: "Staff created successfully", type: "success" } }))
        .catch(e => { Swal.fire("Warning!", e.response?.data?.message || "Error", "warning"); setError(e.response?.data?.message || {}); });
    }
  };

  console.log("Inputs", inputs)

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Staff</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Basic Information</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
                {missingFields.length > 0 && (
                  <div className="alert alert-danger" role="alert">
                    Please complete the following required fields: {missingFields.join(", ")}.
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Card No <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Card No"
                  name="card_no"
                  value={inputs.card_no || ""}
                  onChange={handleChange}
                  data-required
                  readOnly
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Grade <i className="fa fa-star required"></i>
                </label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadGrades}
                  value={selectedGrade}
                  onChange={handleGradeChange}
                  placeholder="Search grade..."
                  isClearable
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Department <i className="fa fa-star required"></i>
                </label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadDepartments}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  placeholder="Search department..."
                  isClearable
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Mobile <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="mobile"
                  name="mobile"
                  value={inputs.mobile || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Type <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="permanent">Permanent</option>
                  <option value="contractual">Contractual</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Joining Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Joining Date"
                  name="joining_date"
                  value={inputs.joining_date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Inactive Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Inactive Date"
                  name="inactive_date"
                  value={inputs.inactive_date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Email <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Password <i className="fa fa-star required"></i>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  name="password"
                  value={inputs.password || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Designation <i className="fa fa-star required"></i>
                </label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadDesignations}
                  value={selectedDesignation}
                  onChange={handleDesignationChange}
                  placeholder="Search designation..."
                  isClearable
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Company Location <i className="fa fa-star required"></i>
                </label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadCompanyLocations}
                  value={selectedCompanyLocation}
                  onChange={handleCompanyLocationChange}
                  placeholder="Search location..."
                  isClearable
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  ROLE <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="user_type"
                  value={inputs.user_type}
                  onChange={handleChange}
                  required
                >
                  <option value="customer-care">Customer Care</option>
                  <option value="so">MDO</option>
                  <option value="staff">staff</option>
                  <option value="dsr">dsr</option>
                  <option value="admin">admin</option>
                  <option value="am">am</option>
                  <option value="rsm">rsm</option>
                  <option value="hos">hos</option>
                  <option value="hmo">Bengal In Charge</option>
                  <option value="hr">hr</option>
                  <option value="accounts">accounts</option>
                  <option value="central_warehouse">central_warehouse</option>
                  <option value="depot">depot</option>
                  <option value="sd">sd</option>
                  <option value="qc">qc</option>
                  <option value="distributor_manager">
                    distributor_manager
                  </option>
                  <option value="supply_chain">supply_chain</option>
                  <option value="production">production</option>
                  <option value="ppic">ppic</option>
                  <option value="rm_pm">rm_pm</option>
                  <option value="reports">reports</option>
                  <option value="area_manager">area_manager</option>
                  <option value="moo">MOO</option>
                  <option value="cdm">CDM</option>
                  <option value="bp">Brand Promoter (BP)</option>
                  <option value="md">MD</option>
                </select>
              </div>
              {showDepartment === false ? (
                <>
                  <div className="col-lg">
                    <label htmlFor="">
                      Zone <i className="fa fa-star required"></i>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={debouncedLoadZones}
                      value={selectedZone}
                      onChange={handleZoneChange}
                      placeholder="Search zone..."
                      isClearable
                    />
                    {validationMessages.work_place_zone_id && (
                      <div className="error-message">
                        {validationMessages.work_place_zone_id}
                      </div>
                    )}
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">
                      Region <i className="fa fa-star required"></i>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue, callback) =>
                        debouncedLoadRegions(inputValue, callback, selectedZone?.value)
                      }
                      value={selectedRegion}
                      onChange={handleRegionChange}
                      placeholder="Search region..."
                      isClearable
                      isDisabled={!selectedZone}
                      key={selectedZone?.value || 'no-zone'}
                    />
                    {validationMessages.work_place_region_id && (
                      <div className="error-message">
                        {validationMessages.work_place_region_id}
                      </div>
                    )}
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">
                      Select Area <i className="fa fa-star required"></i>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue, callback) =>
                        debouncedLoadAreas(inputValue, callback, selectedRegion?.value)
                      }
                      value={selectedArea}
                      onChange={handleAreaChange}
                      placeholder="Search area..."
                      isClearable
                      isDisabled={!selectedRegion}
                      key={selectedRegion?.value || 'no-region'}
                    />
                    {validationMessages.work_place_area_id && (
                      <div className="error-message">
                        {validationMessages.work_place_area_id}
                      </div>
                    )}
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">
                      Select Base <i className="fa fa-star required"></i>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue, callback) =>
                        debouncedLoadBases(inputValue, callback, selectedArea?.value)
                      }
                      value={selectedBase}
                      onChange={handleBaseChange}
                      placeholder="Search base..."
                      isClearable
                      isDisabled={!selectedArea}
                      key={selectedArea?.value || 'no-area'}
                    />
                    {validationMessages.work_place_base_id && (
                      <div className="error-message">
                        {validationMessages.work_place_base_id}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="col-lg">
                    <label htmlFor="">
                      Zone
                    </label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={debouncedLoadZones}
                      onChange={(option) => handleZoneChange(option, "work_place_zone_id_1")}
                      placeholder="Search zone..."
                      isClearable
                    />
                    {validationMessages.work_place_zone_id_1 && (
                      <div className="error-message">
                        {validationMessages.work_place_zone_id_1}
                      </div>
                    )}
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Zone</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={debouncedLoadZones}
                      onChange={(option) => handleZoneChange(option, "work_place_zone_id_2")}
                      placeholder="Search zone..."
                      isClearable
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Zone</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={debouncedLoadZones}
                      onChange={(option) => handleZoneChange(option, "work_place_zone_id_3")}
                      placeholder="Search zone..."
                      isClearable
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Zone</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={debouncedLoadZones}
                      onChange={(option) => handleZoneChange(option, "work_place_zone_id_4")}
                      placeholder="Search zone..."
                      isClearable
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Zone</label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={debouncedLoadZones}
                      onChange={(option) => handleZoneChange(option, "work_place_zone_id_5")}
                      placeholder="Search zone..."
                      isClearable
                    />
                  </div>
                </>
              )}

              <div className="col-lg mt-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_trainee"
                    className="form-check-input"
                    checked={inputs.is_trainee}
                    onChange={toggleChange}
                    id="is_trainee"
                  />
                  <label className="form-check-label" htmlFor="is_trainee">
                    Trainee
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_vacant"
                    className="form-check-input"
                    checked={inputs.is_vacant}
                    onChange={toggleChange}
                    id="is_vacant"
                  />
                  <label className="form-check-label" htmlFor="is_vacant">
                    Vacant
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="department_head"
                    className="form-check-input"
                    checked={inputs.department_head}
                    onChange={toggleChange}
                    id="department_head"
                  />
                  <label className="form-check-label" htmlFor="department_head">
                    Department Head
                  </label>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Bank Account</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bank Account"
                  name="bank_account"
                  value={inputs.bank_account || ""}
                  onChange={handleChange}
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
                  Date Of Birth <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Date of Birth"
                  name="date_of_birth"
                  value={inputs.date_of_birth || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Emergency Contact <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Emergency Contact"
                  name="emergency_contact"
                  value={inputs.emergency_contact || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Reference</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Referrence"
                  name="reference"
                  value={inputs.reference || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Permanent Address</label>
                <textarea
                  className="form-control"
                  placeholder="Permanent Address"
                  name="permanent_address"
                  value={inputs.permanent_address || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Present Address <i className="fa fa-star required"></i>
                </label>
                <textarea
                  className="form-control"
                  placeholder="Present Address"
                  name="present_address"
                  value={inputs.present_address || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Notes</label>
                <textarea
                  className="form-control"
                  placeholder="Notes"
                  name="notes"
                  value={inputs.notes || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              {/* <div className="col-lg-3">
                <label htmlFor="">
                  Shift <i className="fa fa-star required"></i>
                </label>
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  loadOptions={loadShifts}
                  value={selectedShift}
                  onChange={handleShiftChange}
                  placeholder="Search shift..."
                  isClearable
                />
              </div> */}

              {/* <div className="col-lg-3">
                <label htmlFor="">
                  Biometric UserId
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="BiometricUserId"
                  name="user_id"
                  value={inputs.user_id || ""}
                  onChange={handleChange}
                />
              </div> */}

              {/* <div className="col-lg-3">
                <label htmlFor="">
                  Roaster Group <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="roasterGroup"
                  value={inputs.roasterGroup || ""}
                  onChange={handleChange}
                  data-required
                >
                  <option value="">Select Roaster Group</option>
                  <option value={RoasterGroup.GroupA}>Group A</option>
                  <option value={RoasterGroup.GroupB}>Group B</option>
                </select>
              </div> */}

              <div className="col-lg-3">
                <label htmlFor="">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="profile_image"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp, image/gif"
                />
                {imagePreview && (
                  <div className="mt-2" style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      style={{
                        width: "110px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd"
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      onClick={removeImage}
                      title="Remove image"
                      style={{ position: "absolute", top: "2px", right: "2px" }}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              {showMdoList && (
                <div className="col-lg">
                  <label>
                    Mdo <i className="fa fa-star required"></i>
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="mdo_id"
                    options={mdo}
                    getOptionLabel={(option) => `${option.name}`}
                    getOptionValue={(option) => option.id}
                    value={selectedMdo}
                    onChange={handleMdoChange}
                    data-required
                  />
                </div>
              )}
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <h6 className="card-body-title mg-sm-b-30">Work Experience</h6>
              </div>
              <div className="col-lg">
                <label htmlFor=""></label>
                <button
                  className="btn btn-info float-right"
                  onClick={addMoreExperience}
                >
                  +
                </button>
              </div>
              <hr></hr>
            </div>
            {Array.from(experience).map((x, i) => (
              <div className="row mt-3" key={i}>
                <div className="col-lg">
                  <label htmlFor="">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    name="company_name"
                    value={x.company_name || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Start Date"
                    name="start_date"
                    value={x.start_date || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="End Date"
                    name="end_date"
                    value={x.end_date || ""}
                    onChange={(e) => handleInputChange(e, i)}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Year Of Experience</label>
                  <div className="row">
                    <div className="col-lg-9">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Year Of Experience"
                        name="year_of_experience"
                        value={x.year_of_experience || ""}
                        onChange={(e) => handleInputChange(e, i)}
                      />
                    </div>
                    <div className="col-lg-3">
                      {experience.length > 1 ? (
                        <button
                          className="btn btn-danger float-right"
                          onClick={() => removeExperience(i)}
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="row mt-5">
              <div className="col-lg">
                <h6 className="card-body-title mg-sm-b-30">Salary Structure</h6>
              </div>
              <hr></hr>
            </div>
            <div className="row mt-5">
              <div className="col-lg">
                <label htmlFor="">
                  Basic <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Basic"
                  name="basic"
                  value={inputs.basic || ""}
                  onChange={salaryChk}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">House Rent</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="House Rent"
                  name="house_rent"
                  value={inputs.house_rent || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Medical</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Medical"
                  name="medical"
                  value={inputs.medical || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Conveyence</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Conveyence"
                  name="conveyence"
                  value={inputs.conveyence || ""}
                  onChange={salaryChk}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Entertainment</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Entertainment"
                  name="entertainment"
                  value={inputs.entertainment || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Ta Da</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Ta Da"
                  name="ta_da"
                  value={inputs.ta_da || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Holiday</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Holiday"
                  name="holiday"
                  value={inputs.holiday || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Insurance</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Insurance"
                  name="insurance"
                  value={inputs.insurance || ""}
                  onChange={salaryChk}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Income Tax</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Income Tax"
                  name="income_tax"
                  value={inputs.income_tax || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Other Allowance</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Other Allowance"
                  name="other_allowance"
                  value={inputs.other_allowance || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Canteen Bill</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Canteen Bill"
                  name="canteen_bill"
                  value={inputs.canteen_bill || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Phone Bill Limit</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Phone Bill Limit"
                  name="phone_bill_limit"
                  value={inputs.phone_bill_limit || ""}
                  onChange={salaryChk}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Insurance Rate</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Insurance Rate"
                  name="insurance_rate"
                  value={inputs.insurance_rate || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Gross <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  disabled
                  className="form-control"
                  placeholder="Gross"
                  name="gross"
                  value={grossSalary}
                  onChange={salaryChk}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;