import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import HttpHR from "../../../Common/HttpHR";
import HttpSupplyChain from "../../../Common/HttpSupplyChain";
import HttpUser from "../../../Common/HttpUser";
import HttpHrShift from "../../../Common/HttpHrShift";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { latestSalaryStructure } from "../../../../Utils/StaffSalaryStructureUtils";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";

const UserTypeEnum = Object.freeze({
  CUSTOMER_CARE: 1, STAFF: 2, DSR: 3, SO: 4, ADMIN: 5, AM: 6, RSM: 7,
  HOS: 8, HR: 9, ACCOUNTS: 10, CENTRAL_WAREHOUSE: 11, DEPOT: 12,
  SD: 13, QC: 14, DISTRIBUTOR_MANAGER: 15, SUPPLY_CHAIN: 16, PRODUCTION: 17,
  PPIC: 18, RM_PM: 19, REPORTS: 20, AREA_MANAGER: 21, MOO: 22, CDM: 23, HMO: 24, BP: 25, CLUSTER: 26, MD: 27
});

const RoasterGroup = Object.freeze({
  GroupA: 1,
  GroupB: 2
});

const userTypeStringToEnum = {
  "customer-care": 1, "staff": 2, "dsr": 3, "so": 4, "admin": 5, "am": 6,
  "rsm": 7, "hos": 8, "hr": 9, "accounts": 10, "central_warehouse": 11,
  "depot": 12, "sd": 13, "qc": 14, "distributor_manager": 15, "supply_chain": 16,
  "production": 17, "ppic": 18, "rm_pm": 19, "reports": 20, "area_manager": 21,
  "moo": 22, "cdm": 23, "hmo": 24, "bp": 25, "cluster": 26, "md": 27
};

const enumToUserTypeString = Object.fromEntries(Object.entries(userTypeStringToEnum).map(([k, v]) => [v, k]));

const employmentTypeEnumToString = { 1: "permanent", 2: "contractual", 3: "internship" };
const getEmploymentTypeEnum = type => ({ "permanent": 1, "contractual": 2, "internship": 3 }[type] || 1);

const EditStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { checkRequiredFields } = useRequiredFields();

  const [inputs, setInputs] = useState({
    user_type: "so", basic: 0, house_rent: 0, medical: 0, conveyence: 0,
    entertainment: 0, ta_da: 0, holiday: 0, insurance: 0, income_tax: 0,
    other_allowance: 0, canteen_bill: 0, phone_bill_limit: 0, insurance_rate: 0,
    gross: 0, department_head: false, approved_by: false, is_vacant: false, is_trainee: false,
  });

  const [grossSalary, setGrossSalary] = useState(0);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const [validationMessages, setValidationMessages] = useState({});
  const [experience, setExperience] = useState([
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

  const [showMdoList, setShowMdoList] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [imageCleared, setImageCleared] = useState(false);

  const toLocalDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  };

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

  useEffect(() => {
    setLoading(true);
    HttpUser.get(`/GetById/${id}`)
      .then(res => {
        const d = res.data.data;
        const salary = latestSalaryStructure(d.staffSalaryStructures);
        const userTypeStr = enumToUserTypeString[d.userType] || "staff";

        setInputs({
          card_no: d.cardNo || "",
          name: d.name || "",
          email: d.email || "",
          mobile: d.mobile || "",
          type: employmentTypeEnumToString[d.type] || "permanent",
          joining_date: toLocalDate(d.joiningDate),
          inactive_date: toLocalDate(d.inactiveDate),
          department_id: d.departmentId || null,
          designation_id: d.designationId || null,
          grade_id: d.gradeId || null,
          company_location_id: d.companyLocationId || null,
          bank_account: d.bankAccount || "",
          blood_group: d.bloodGroup || "",
          date_of_birth: toLocalDate(d.dateOfBirth),
          emergency_contact: d.emergencyContact || "",
          reference: d.reference || "",
          permanent_address: d.permanentAddress || "",
          present_address: d.presentAddress || "",
          notes: d.notes || "",
          department_head: d.isDepartmentHead || false,
          is_trainee: d.isTrainee || false,
          is_vacant: d.isVacant || false,
          user_type: userTypeStr,
          shift_id: d.shiftId || null,
          workplace_id: d.workplaceId || null,
          workplace_type: d.workplaceType || "",
          work_place_zone_id: d.workplaceZoneId || null,
          work_place_region_id: d.workplaceRegionId || null,
          work_place_area_id: d.workplaceAreaId || null,
          work_place_base_id: d.workplaceBaseId || null,
          depot_id: d.depotId || 0,
          roaster_group_id: d.roasterGroup || 0,
          basic: salary.basic || 0,
          house_rent: salary.houseRent || 0,
          medical: salary.medical || 0,
          conveyence: salary.conveyence || 0,
          entertainment: salary.entertainment || 0,
          ta_da: salary.taDa || 0,
          holiday: salary.holiday || 0,
          insurance: salary.insurance || 0,
          income_tax: salary.incomeTax || 0,
          other_allowance: salary.otherAllowance || 0,
          canteen_bill: salary.canteenBill || 0,
          phone_bill_limit: salary.phoneBillLimit || 0,
          insurance_rate: salary.insuranceRate || 0,
          gross: salary.gross || 0,
          status: d.status === 1 ? "active" : "inactive",
        });

        setGrossSalary(salary.gross || 0);
        setExistingImage(d.profileImage || null);

        if (d.gradeId && d.gradeName) {
          setSelectedGrade({ value: d.gradeId, label: d.gradeName });
        }
        if (d.departmentId && d.departmentName) {
          setSelectedDepartment({ value: d.departmentId, label: d.departmentName });
        }
        if (d.designationId && d.designationName) {
          setSelectedDesignation({ value: d.designationId, label: d.designationName });
        }
        if (d.companyLocationId && d.companyLocationName) {
          setSelectedCompanyLocation({ value: d.companyLocationId, label: d.companyLocationName });
        }
        if (d.shiftId) {
          setSelectedShift({ value: d.shiftId, label: d.shift?.name || `Shift ${d.shiftId}` });
        }

        // Pre-select the hierarchy (zone -> region -> area -> base) the staff member
        // is attached to, mirroring the PHP edit() workplace resolution.
        setSelectedZone(d.zone ? { value: d.zone.id, label: d.zone.name } : null);
        setSelectedRegion(d.region ? { value: d.region.id, label: d.region.name } : null);
        setSelectedArea(d.area ? { value: d.area.id, label: d.area.name } : null);
        setSelectedBase(d.base ? { value: d.base.id, label: d.base.name } : null);

        if (userTypeStr === "bp") {
          setShowMdoList(true);
          setShowDepartment(false);
        } else if (userTypeStr === "hmo") {
          setShowDepartment(true);
          setShowMdoList(false);
        }

        if (d.workingExperiences && d.workingExperiences.length > 0) {
          setExperience(d.workingExperiences.map(exp => ({
            id: exp.id,
            company_name: exp.companyName || "",
            start_date: toLocalDate(exp.startDate),
            end_date: toLocalDate(exp.endDate),
            year_of_experience: exp.yearsOfExperience || "",
          })));
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        Swal.fire("Error", "Failed to load staff data", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "user_type") {
      if (value === "bp") {
        setShowMdoList(true);
        setShowDepartment(false);
      } else if (value === "hmo") {
        setShowDepartment(true);
        setShowMdoList(false);
      } else {
        setShowDepartment(false);
        setShowMdoList(false);
      }
      setInputs(prev => ({ ...prev, user_type: value }));
      return;
    }

    setInputs(prev => ({ ...prev, [name]: value }));
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

  const handleZoneChange = option => {
    setSelectedZone(option);
    setInputs(prev => ({ ...prev, work_place_zone_id: option?.value || null, work_place_region_id: null, work_place_area_id: null, work_place_base_id: null }));
    setSelectedRegion(null); setSelectedArea(null); setSelectedBase(null);
  };
  const handleRegionChange = option => {
    setSelectedRegion(option);
    setInputs(prev => ({ ...prev, work_place_region_id: option?.value || null, work_place_area_id: null, work_place_base_id: null }));
    setSelectedArea(null); setSelectedBase(null);
  };
  const handleAreaChange = option => {
    setSelectedArea(option);
    setInputs(prev => ({ ...prev, work_place_area_id: option?.value || null, work_place_base_id: null }));
    setSelectedBase(null);
  };
  const handleBaseChange = option => {
    setSelectedBase(option);
    setInputs(prev => ({ ...prev, work_place_base_id: option?.value || null }));
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
    // Picking a file cancels a pending removal - the new photo replaces the old one.
    setImageCleared(false);
  };

  // Two meanings, depending on what is on screen:
  //  - a new file is staged  -> drop it and fall back to the stored photo
  //  - only the stored photo -> flag it for removal so the server clears it too
  const removeImage = () => {
    if (selectedImage) {
      setSelectedImage(null);
      setImagePreview(null);
      return;
    }
    setImageCleared(true);
  };

  // Revokes the superseded object URL on every change and on unmount.
  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  const salaryChk = e => {
    const { name, value } = e.target;
    const updated = { ...inputs, [name]: value };
    setInputs(updated);
    setGrossSalary(calcGross(updated));
  };

  const validateSelectFields = () => {
    let isValid = true;
    let messages = {};
    if (!inputs.work_place_zone_id) { messages.work_place_zone_id = "Zone is required"; isValid = false; }
    if (!inputs.work_place_region_id) { messages.work_place_region_id = "Region is required"; isValid = false; }
    if (!inputs.work_place_area_id) { messages.work_place_area_id = "Area is required"; isValid = false; }
    if (!inputs.work_place_base_id) { messages.work_place_base_id = "Base is required"; isValid = false; }
    setValidationMessages(messages);
    return isValid;
  };

  const formSubmit = () => {
    // const isSelectFieldsValid = validateSelectFields();
    // if (checkRequiredFields() && isSelectFieldsValid) {
      const now = new Date().toISOString();
      const formData = new FormData();

      formData.append("Id", parseInt(id));
      formData.append("Name", inputs.name || "");
      formData.append("RoasterGroup", 1);
      formData.append("UserType", userTypeStringToEnum[inputs.user_type] || 3);
      formData.append("DepotId", inputs.depot_id || 0);
      formData.append("ShiftId", 1);
      formData.append("CardNo", inputs.card_no || "");
      formData.append("Email", inputs.email || "");
      formData.append("Password", inputs.password || "");
      formData.append("Mobile", inputs.mobile || "");
      formData.append("Type", getEmploymentTypeEnum(inputs.type));
      formData.append("Status", inputs.status === "active" ? 1 : 0);
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
      formData.append("WorkplaceZoneId", inputs.work_place_zone_id || 0);
      formData.append("WorkplaceRegionId", inputs.work_place_region_id || 0);
      formData.append("WorkplaceAreaId", inputs.work_place_area_id || 0);
      formData.append("WorkplaceBaseId", inputs.work_place_base_id || 0);
      formData.append("WorkplaceId", inputs.work_place_base_id || inputs.workplace_id || 0);
      formData.append("WorkplaceType", inputs.workplace_type || "office");
      formData.append("Notes", inputs.notes || "");
      formData.append("IsDepartmentHead", inputs.department_head);
      formData.append("ApprovedBy", 0);
      formData.append("IsTrainee", inputs.is_trainee);
      formData.append("IsVacant", inputs.is_vacant);
      formData.append("UpdatedAt", now);

      // --- Nested salary structure ---
      // No HrStaffBasicInfoId is posted: the service links the new revision to the
      // staff being edited (salary structures are one-to-many, older rows stay as history).
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
      formData.append("StaffSalaryStructure.UpdatedAt", now);

      // --- Nested working experiences ---
      experience
        .filter(exp => exp.company_name)
        .forEach((exp, index) => {
          formData.append(`WorkingExperiences[${index}].Id`, exp.id || 0);
          formData.append(`WorkingExperiences[${index}].StaffBasicInfoId`, parseInt(id));
          formData.append(`WorkingExperiences[${index}].CompanyName`, exp.company_name);
          formData.append(`WorkingExperiences[${index}].StartDate`, exp.start_date || "");
          formData.append(`WorkingExperiences[${index}].EndDate`, exp.end_date || "");
          formData.append(`WorkingExperiences[${index}].YearsOfExperience`, exp.year_of_experience || "");
          formData.append(`WorkingExperiences[${index}].UpdatedAt`, now);
        });

      // --- Profile image ---
      // Send nothing to keep the stored photo, the file to replace it, or the
      // explicit flag to clear it (the server restores the photo when neither is sent).
      if (imageCleared) {
        formData.append("RemoveProfileImage", "true");
      } else if (selectedImage) {
        formData.append("ProfileImageFile", selectedImage);
      }

      HttpUser.put(`/EditStaff/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(() => navigate("/staff", { state: { message: "Staff updated successfully", type: "success" } }))
        .catch(e => { Swal.fire("Warning!", e.response?.data?.message || "Error", "warning"); setError(e.response?.data?.message || {}); });
    //}
  };

  return (
    <div>
      <IsLogin />
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Staff</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Basic Information</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5"><LoaderComponent /></div>
            ) : (
              <>
                <div className="row">
                  <div className="col-lg">
                    <label htmlFor="">Card No <i className="fa fa-star required"></i></label>
                    <input type="text" className="form-control" placeholder="Card No" name="card_no" value={inputs.card_no || ""} onChange={handleChange} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Grade <i className="fa fa-star required"></i></label>
                    <AsyncSelect cacheOptions defaultOptions loadOptions={loadGrades} value={selectedGrade} onChange={handleGradeChange} placeholder="Search grade..." isClearable />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Department <i className="fa fa-star required"></i></label>
                    <AsyncSelect cacheOptions defaultOptions loadOptions={loadDepartments} value={selectedDepartment} onChange={handleDepartmentChange} placeholder="Search department..." isClearable />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Name <i className="fa fa-star required"></i></label>
                    <input type="text" className="form-control" placeholder="Name" name="name" value={inputs.name || ""} onChange={handleChange} data-required />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Mobile <i className="fa fa-star required"></i></label>
                    <input type="text" className="form-control" placeholder="mobile" name="mobile" value={inputs.mobile || ""} onChange={handleChange} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Type <i className="fa fa-star required"></i></label>
                    <select className="form-control" name="type" value={inputs.type || ""} onChange={handleChange} required>
                      <option value="">Select Type</option>
                      <option value="permanent">Permanent</option>
                      <option value="contractual">Contractual</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Joining Date <i className="fa fa-star required"></i></label>
                    <input type="date" className="form-control" name="joining_date" value={inputs.joining_date || ""} onChange={handleChange} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Inactive Date</label>
                    <input type="date" className="form-control" name="inactive_date" value={inputs.inactive_date || ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Email <i className="fa fa-star required"></i></label>
                    <input type="text" className="form-control" placeholder="Email" name="email" value={inputs.email || ""} onChange={handleChange} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Designation <i className="fa fa-star required"></i></label>
                    <AsyncSelect cacheOptions defaultOptions loadOptions={loadDesignations} value={selectedDesignation} onChange={handleDesignationChange} placeholder="Search designation..." isClearable />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Company Location <i className="fa fa-star required"></i></label>
                    <AsyncSelect cacheOptions defaultOptions loadOptions={loadCompanyLocations} value={selectedCompanyLocation} onChange={handleCompanyLocationChange} placeholder="Search location..." isClearable />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">ROLE <i className="fa fa-star required"></i></label>
                    <select className="form-control" name="user_type" value={inputs.user_type} onChange={handleChange} required>
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
                      <option value="distributor_manager">distributor_manager</option>
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
                        <label htmlFor="">Zone <i className="fa fa-star required"></i></label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoadZones} value={selectedZone} onChange={handleZoneChange} placeholder="Search zone..." isClearable />
                        {validationMessages.work_place_zone_id && <div className="error-message">{validationMessages.work_place_zone_id}</div>}
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Region <i className="fa fa-star required"></i></label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={(inputValue, callback) => debouncedLoadRegions(inputValue, callback, selectedZone?.value)} value={selectedRegion} onChange={handleRegionChange} placeholder="Search region..." isClearable isDisabled={!selectedZone} key={selectedZone?.value || 'no-zone'} />
                        {validationMessages.work_place_region_id && <div className="error-message">{validationMessages.work_place_region_id}</div>}
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Select Area <i className="fa fa-star required"></i></label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={(inputValue, callback) => debouncedLoadAreas(inputValue, callback, selectedRegion?.value)} value={selectedArea} onChange={handleAreaChange} placeholder="Search area..." isClearable isDisabled={!selectedRegion} key={selectedRegion?.value || 'no-region'} />
                        {validationMessages.work_place_area_id && <div className="error-message">{validationMessages.work_place_area_id}</div>}
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Select Base <i className="fa fa-star required"></i></label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={(inputValue, callback) => debouncedLoadBases(inputValue, callback, selectedArea?.value)} value={selectedBase} onChange={handleBaseChange} placeholder="Search base..." isClearable isDisabled={!selectedArea} key={selectedArea?.value || 'no-area'} />
                        {validationMessages.work_place_base_id && <div className="error-message">{validationMessages.work_place_base_id}</div>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-lg">
                        <label htmlFor="">Zone <i className="fa fa-star required"></i></label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoadZones} onChange={handleZoneChange} placeholder="Search zone..." isClearable />
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Zone</label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoadZones} onChange={handleZoneChange} placeholder="Search zone..." isClearable />
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Zone</label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoadZones} onChange={handleZoneChange} placeholder="Search zone..." isClearable />
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Zone</label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoadZones} onChange={handleZoneChange} placeholder="Search zone..." isClearable />
                      </div>
                      <div className="col-lg">
                        <label htmlFor="">Zone</label>
                        <AsyncSelect cacheOptions defaultOptions loadOptions={debouncedLoadZones} onChange={handleZoneChange} placeholder="Search zone..." isClearable />
                      </div>
                    </>
                  )}
                  <div className="col-lg mt-2">
                    <div className="form-check">
                      <input type="checkbox" name="is_trainee" className="form-check-input" checked={inputs.is_trainee} onChange={toggleChange} id="is_trainee" />
                      <label className="form-check-label" htmlFor="is_trainee">Trainee</label>
                    </div>
                    <div className="form-check">
                      <input type="checkbox" name="is_vacant" className="form-check-input" checked={inputs.is_vacant} onChange={toggleChange} id="is_vacant" />
                      <label className="form-check-label" htmlFor="is_vacant">Vacant</label>
                    </div>
                    <div className="form-check">
                      <input type="checkbox" name="department_head" className="form-check-input" checked={inputs.department_head} onChange={toggleChange} id="department_head" />
                      <label className="form-check-label" htmlFor="department_head">Department Head</label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Bank Account</label>
                    <input type="text" className="form-control" placeholder="Bank Account" name="bank_account" value={inputs.bank_account || ""} onChange={handleChange} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Blood Group</label>
                    <select className="form-control" name="blood_group" value={inputs.blood_group || ""} onChange={handleChange}>
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
                    <label htmlFor="">Date Of Birth <i className="fa fa-star required"></i></label>
                    <input type="date" className="form-control" name="date_of_birth" value={inputs.date_of_birth || ""} onChange={handleChange} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Emergency Contact <i className="fa fa-star required"></i></label>
                    <input type="text" className="form-control" placeholder="Emergency Contact" name="emergency_contact" value={inputs.emergency_contact || ""} onChange={handleChange} data-required />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Reference</label>
                    <input type="text" className="form-control" placeholder="Referrence" name="reference" value={inputs.reference || ""} onChange={handleChange} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Permanent Address</label>
                    <textarea className="form-control" placeholder="Permanent Address" name="permanent_address" value={inputs.permanent_address || ""} onChange={handleChange} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Present Address <i className="fa fa-star required"></i></label>
                    <textarea className="form-control" placeholder="Present Address" name="present_address" value={inputs.present_address || ""} onChange={handleChange} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Notes</label>
                    <textarea className="form-control" placeholder="Notes" name="notes" value={inputs.notes || ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="row mt-3">
                  {/* <div className="col-lg-3">
                    <label htmlFor="">Shift <i className="fa fa-star required"></i></label>
                    <AsyncSelect cacheOptions defaultOptions loadOptions={loadShifts} value={selectedShift} onChange={handleShiftChange} placeholder="Search shift..." isClearable />
                  </div> */}
                  {/* <div className="col-lg-3">
                    <label htmlFor="">
                      Roaster Group <i className="fa fa-star required"></i>
                    </label>
                    <select
                      className="form-control"
                      name="roaster_group_id"
                      value={inputs.roaster_group_id || ""}
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
                    {!imageCleared && (imagePreview || existingImage) && (
                      <div className="mt-2" style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={imagePreview || existingImage}
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
                          title={imagePreview ? "Discard new image" : "Remove photo"}
                          style={{ position: "absolute", top: "2px", right: "2px" }}
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      </div>
                    )}
                    {imageCleared && (
                      <>
                        <div
                          className="mt-2 d-flex align-items-center justify-content-center"
                          style={{
                            width: "110px",
                            height: "110px",
                            borderRadius: "6px",
                            border: "1px dashed #ccc",
                            color: "#999",
                            fontSize: "12px"
                          }}
                        >
                          No photo
                        </div>
                        <small className="text-muted d-block mt-1">
                          Photo will be removed on update. Choose a file to add a new one.
                        </small>
                      </>
                    )}
                    {!imageCleared && !imagePreview && existingImage && (
                      <small className="text-muted d-block mt-1">Current photo &mdash; choose a file to replace it.</small>
                    )}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-lg">
                    <h6 className="card-body-title mg-sm-b-30">Work Experience</h6>
                  </div>
                  <div className="col-lg">
                    <label htmlFor=""></label>
                    <button className="btn btn-info float-right" onClick={addMoreExperience}>+</button>
                  </div>
                  <hr></hr>
                </div>
                {Array.from(experience).map((x, i) => (
                  <div className="row mt-3" key={i}>
                    <div className="col-lg">
                      <label htmlFor="">Company Name</label>
                      <input type="text" className="form-control" placeholder="Company Name" name="company_name" value={x.company_name || ""} onChange={(e) => handleInputChange(e, i)} />
                    </div>
                    <div className="col-lg">
                      <label htmlFor="">Start Date</label>
                      <input type="date" className="form-control" name="start_date" value={x.start_date || ""} onChange={(e) => handleInputChange(e, i)} />
                    </div>
                    <div className="col-lg">
                      <label htmlFor="">End Date</label>
                      <input type="date" className="form-control" name="end_date" value={x.end_date || ""} onChange={(e) => handleInputChange(e, i)} />
                    </div>
                    <div className="col-lg">
                      <label htmlFor="">Year Of Experience</label>
                      <div className="row">
                        <div className="col-lg-9">
                          <input type="text" className="form-control" placeholder="Year Of Experience" name="year_of_experience" value={x.year_of_experience || ""} onChange={(e) => handleInputChange(e, i)} />
                        </div>
                        <div className="col-lg-3">
                          {experience.length > 1 ? (
                            <button className="btn btn-danger float-right" onClick={() => removeExperience(i)}>Remove</button>
                          ) : ""}
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
                    <label htmlFor="">Basic <i className="fa fa-star required"></i></label>
                    <input type="number" className="form-control" placeholder="Basic" name="basic" value={inputs.basic || ""} onChange={salaryChk} data-required />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">House Rent</label>
                    <input type="number" className="form-control" placeholder="House Rent" name="house_rent" value={inputs.house_rent || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Medical</label>
                    <input type="number" className="form-control" placeholder="Medical" name="medical" value={inputs.medical || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Conveyence</label>
                    <input type="number" className="form-control" placeholder="Conveyence" name="conveyence" value={inputs.conveyence || ""} onChange={salaryChk} />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Entertainment</label>
                    <input type="number" className="form-control" placeholder="Entertainment" name="entertainment" value={inputs.entertainment || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Ta Da</label>
                    <input type="number" className="form-control" placeholder="Ta Da" name="ta_da" value={inputs.ta_da || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Holiday</label>
                    <input type="number" className="form-control" placeholder="Holiday" name="holiday" value={inputs.holiday || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Insurance</label>
                    <input type="number" className="form-control" placeholder="Insurance" name="insurance" value={inputs.insurance || ""} onChange={salaryChk} />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Income Tax</label>
                    <input type="number" className="form-control" placeholder="Income Tax" name="income_tax" value={inputs.income_tax || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Other Allowance</label>
                    <input type="number" className="form-control" placeholder="Other Allowance" name="other_allowance" value={inputs.other_allowance || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Canteen Bill</label>
                    <input type="number" className="form-control" placeholder="Canteen Bill" name="canteen_bill" value={inputs.canteen_bill || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Phone Bill Limit</label>
                    <input type="number" className="form-control" placeholder="Phone Bill Limit" name="phone_bill_limit" value={inputs.phone_bill_limit || ""} onChange={salaryChk} />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label htmlFor="">Insurance Rate</label>
                    <input type="number" className="form-control" placeholder="Insurance Rate" name="insurance_rate" value={inputs.insurance_rate || ""} onChange={salaryChk} />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Gross <i className="fa fa-star required"></i></label>
                    <input type="number" disabled className="form-control" placeholder="Gross" name="gross" value={grossSalary} />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-lg">
                    <label>Status</label>
                    <select className="form-control" name="status" value={inputs.status || "active"} onChange={handleChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-3">
                    <button type="button" className="btn btn-primary btn-block mg-b-10" onClick={formSubmit}>
                      <i className="fa fa-send mg-r-10"></i> Update
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStaff;