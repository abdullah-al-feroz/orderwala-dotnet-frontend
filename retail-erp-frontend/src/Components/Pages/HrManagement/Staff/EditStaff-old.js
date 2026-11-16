import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const EditStaff = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [grade, setGrade] = useState({});
  const [department, setDepartment] = useState({});
  const [designation, setDesignation] = useState({});
  const [companyLocation, setCompanyLocation] = useState({});
  const [grossSalary, setGrossSalary] = useState(0);
  const { id } = useParams();
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const [selectedGradeOption, setSelectedGradeOption] = useState(null);
  const [selectedDepartmentOption, setSelectedDepartmentOption] =
    useState(null);
  const [selectedDesignationOption, setSelectedDesignationOption] =
    useState(null);
  const [selectedLocationOption, setSelectedLocationOption] = useState(null);
  const [selectedRegionOption, setSelectedRegionOption] = useState(null);
  const [selectedAreaOption, setSelectedAreaOption] = useState(null);
  const [selectedBaseOption, setSelectedBaseOption] = useState(null);

  const experienceInitialState = [
    { company_name: "", start_date: "", end_date: "", year_of_experience: "" },
  ];
  const [experience, setExperience] = useState(experienceInitialState);
  const [region, setRegion] = useState({});
  const [area, setArea] = useState({});
  const [base, setBase] = useState({});

  const fetchData = () => {
    Http.get("/staff/" + id + "/edit").then((res) => {
      console.log(res.data.department_head);
      setInputs({
        card_no: res.data.card_no,
        name: res.data.name,
        email: res.data.email,
        mobile: res.data.mobile,
        type: res.data.type,
        joining_date: res.data.joining_date,
        inactive_date: res.data.inactive_date,
        department_id: res.data.department_id,
        designation_id: res.data.designation_id,
        grade_id: res.data.salary_structure_latest.grade_id,
        company_location_id: res.data.company_location_id,
        bank_account: res.data.bank_account,
        blood_group: res.data.blood_group,
        date_of_birth: res.data.date_of_birth,
        emergency_contact: res.data.emergency_contact,
        reference: res.data.reference,
        permanent_address: res.data.permanent_address,
        present_address: res.data.present_address,
        notes: res.data.notes,
        department_head: res.data.department_head === 1 ? true : false,
        approved_by: res.data.approved_by === 1 ? true : false,
        basic: res.data.salary_structure_latest.basic,
        house_rent: res.data.salary_structure_latest.house_rent,
        medical: res.data.salary_structure_latest.medical,
        conveyence: res.data.salary_structure_latest.conveyence,
        entertainment: res.data.salary_structure_latest.entertainment,
        ta_da: res.data.salary_structure_latest.ta_da,
        holiday: res.data.salary_structure_latest.holiday,
        insurance: res.data.salary_structure_latest.insurance,
        income_tax: res.data.salary_structure_latest.income_tax,
        other_allowance: res.data.salary_structure_latest.other_allowance,
        canteen_bill: res.data.salary_structure_latest.canteen_bill,
        phone_bill_limit: res.data.salary_structure_latest.phone_bill_limit,
        insurance_rate: res.data.salary_structure_latest.insurance_rate,
        gross: res.data.salary_structure_latest.gross,
        status: res.data.status,
        user_type: res.data.user_type,
        work_place_region_id: res.data.region_id,
        work_place_area_id: res.data.area_id,
        work_place_base_id: res.data.base_id,
      });
      setGrossSalary(res.data.salary_structure_latest.gross);

      Http.get(
        "/select2/Hr.WorkPlaceRoute/id,name/work_place_region_id:" +
          res.data.region_id
      ).then((res) => {
        setRegion(res.data);
      });

      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_area_id:" +
          res.data.area_id
      ).then((res) => {
        setArea(res.data);
      });

      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_base_id:" +
          res.data.base_id
      ).then((res) => {
        setBase(res.data);
      });

      setSelectedGradeOption({
        label: res.data.grade.name,
        value: res.data.grade.id,
      });

      setSelectedDepartmentOption({
        label: res.data.department.name,
        value: res.data.department.id,
      });

      setSelectedDesignationOption({
        label: res.data.designation.name,
        value: res.data.designation.id,
      });

      setSelectedLocationOption({
        label: res.data.company_location.name,
        value: res.data.company_location.id,
      });

      setSelectedRegionOption({
        label: res.data.region.name,
        value: res.data.region.id,
      });

      setSelectedAreaOption({
        label: res.data.area.name,
        value: res.data.area.id,
      });

      setSelectedBaseOption({
        label: res.data.base.name,
        value: res.data.base.id,
      });

      // Experience State update
      const exper = [];
      Object.keys(res.data.experience).forEach((key) => {
        exper.push({
          company_name: res.data.experience[key]["company_name"],
          start_date: res.data.experience[key]["start_date"],
          end_date: res.data.experience[key]["end_date"],
          year_of_experience: res.data.experience[key]["year_of_experience"],
        });
      });
      setExperience(exper);
    });
    Http.get("/grade").then((res) => {
      setGrade(res.data);
    });
    // Http.get("/region").then((res) => {
    //   setRegion(res.data);
    // });

    // Http.get("/area").then((res) => {
    //   setArea(res.data);
    // });

    Http.get("/base").then((res) => {
      setBase(res.data);
    });

    // Http.get("/gradeSelect2").then((res) => {
    //   setGrade(res.data);
    // });

    // Http.get("/department").then((res) => {
    //   setDepartment(res.data);
    // });

    Http.get("/department2").then((res) => {
      setDepartment(res.data);
    });

    // Http.get("/designation").then((res) => {
    //   setDesignation(res.data);
    // });

    Http.get("/designationSelect2").then((res) => {
      setDesignation(res.data);
    });

    // Http.get("/location").then((res) => {
    //   setCompanyLocation(res.data);
    // });

    Http.get("/locationSelect2").then((res) => {
      setCompanyLocation(res.data);
    });

    // Http.get("/department").then((res) => {
    //   setDepartment(res.data);
    // });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    /*if (actionMeta.name === "grade_id") {
      setSelectedGradeOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });

      Http.get("/editGrade/" + value).then((res) => {
        // Load Salary Structure based on Grade Changes
        setInputs({
          // grade_id: value,
          basic: res.data.basic_salary,
          house_rent: res.data.house_rent,
          medical: res.data.medical_allowance,
          conveyence: res.data.conveyance_allowance,
          entertainment: res.data.entertainment_allowance,
          ta_da: res.data.tada_allowance,
          holiday: res.data.holiday_rate,
          insurance: res.data.insurance_rate,
          income_tax: res.data.income_tax,
          canteen_bill: res.data.canteen_bill,
          phone_bill_limit: res.data.phone_bill_limit,
          insurance_rate: res.data.insurance_rate,
        });
        setGrossSalary(res.data.gross_salary); // Set Gross Salary with Grade Default Information
      });
    }*/

    if (actionMeta.name === "department_id") {
      setSelectedDepartmentOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (actionMeta.name === "designation_id") {
      setSelectedDesignationOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (actionMeta.name === "company_location_id") {
      setSelectedLocationOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const toggleChange = (e) => {
    const name = e.target.name; // Chanages Input Name
    const value = !e.target.value; // Changes Input Value
    setInputs((values) => ({ ...values, [name]: value })); // Set Input With Value and Name in State
  };

  // Area Load Region Change Wise
  const areaRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    Http.get("/region-wise-area/" + value).then((res) => {
      setArea(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Base Load Region Change Wise
  const baseRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    Http.get("/area-wise-base/" + value).then((res) => {
      setBase(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const addMoreExperience = () => {
    setExperience([
      ...experience,
      {
        company_name: "",
        start_date: "",
        end_date: "",
        year_of_experience: "",
      },
    ]);
  };
  // Remove button
  const removeExperience = (index) => {
    const list = [...experience];
    list.splice(index, 1);
    setExperience(list);
  };
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...experience];
    list[index][name] = value;
    setExperience(list);
  };
  const handleGradeChange = (e) => {
    const name = e.target.name; // Chanages Input Name
    const value = e.target.value; // Changes Input Value
    setInputs((values) => ({ ...values, [name]: value })); // Set Input With Value and Name in State

    Http.get("/editGrade/" + value).then((res) => {
      // Load Salary Structure based on Grade Changes

      setInputs((values) => ({ ...values, ["basic"]: res.data.basic_salary }));
      setInputs((values) => ({
        ...values,
        ["house_rent"]: res.data.house_rent,
      }));
      setInputs((values) => ({
        ...values,
        ["medical"]: res.data.medical_allowance,
      }));
      setInputs((values) => ({
        ...values,
        ["conveyence"]: res.data.conveyance_allowance,
      }));
      setInputs((values) => ({
        ...values,
        ["entertainment"]: res.data.entertainment_allowance,
      }));
      setInputs((values) => ({
        ...values,
        ["ta_da"]: res.data.tada_allowance,
      }));
      setInputs((values) => ({
        ...values,
        ["holiday"]: res.data.holiday_rate,
      }));
      setInputs((values) => ({
        ...values,
        ["insurance"]: res.data.insurance_rate,
      }));
      setInputs((values) => ({
        ...values,
        ["income_tax"]: res.data.income_tax,
      }));
      setInputs((values) => ({
        ...values,
        ["canteen_bill"]: res.data.canteen_bill,
      }));
      setInputs((values) => ({
        ...values,
        ["phone_bill_limit"]: res.data.phone_bill_limit,
      }));
      setInputs((values) => ({
        ...values,
        ["insurance_rate"]: res.data.insurance_rate,
      }));
      setGrossSalary(res.data.gross_salary); // Set Gross Salary with Grade Default Information
    });
  };
  const salaryChk = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setGrossSalary(
      parseInt(inputs.basic) +
        parseInt(inputs.house_rent) +
        parseInt(inputs.medical) +
        parseInt(inputs.conveyence) +
        parseInt(inputs.entertainment) +
        parseInt(inputs.ta_da) +
        parseInt(inputs.holiday) +
        parseInt(inputs.insurance) +
        parseInt(inputs.income_tax) +
        parseInt(inputs.other_allowance) +
        parseInt(inputs.canteen_bill) +
        parseInt(inputs.phone_bill_limit) +
        parseInt(inputs.insurance_rate)
    );
  };
  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.experience = experience;
      Http.put("/staff/" + id, inputs)
        .then((res) => {
          navigate("/staff", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
          Swal.fire("Warning!", e.response.data.message, "warning");
        });
    }
  };

  return (
    <div>
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
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Card No<i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Card No"
                  name="card_no"
                  value={inputs.card_no || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Grade<i className="fa fa-star required"></i>
                </label>

                {/* <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedGradeOption}
                  value={selectedGradeOption}
                  onChange={selectHandleChange}
                  name="grade_id"
                  options={grade}
                /> */}

                <select
                  className="form-control"
                  name="grade_id"
                  onChange={handleGradeChange}
                >
                  <option value="">Select Grade</option>
                  {Array.from(grade).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={inputs.grade_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Department<i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedDepartmentOption}
                  value={selectedDepartmentOption}
                  onChange={selectHandleChange}
                  name="department_id"
                  options={department}
                />

                {/* <select
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
                </select> */}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Name<i className="fa fa-star required"></i>
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
                  Email<i className="fa fa-star required"></i>
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
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  name="password"
                  value={inputs.password || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Mobile<i className="fa fa-star required"></i>
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
                  Type<i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option
                    value="permanent"
                    selected={inputs.type === "permanent" ? true : false}
                  >
                    Permanent
                  </option>
                  <option
                    value="contractual"
                    selected={inputs.type === "contractual" ? true : false}
                  >
                    Contractual
                  </option>
                  <option
                    value="internship"
                    selected={inputs.type === "internship" ? true : false}
                  >
                    Internship
                  </option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Joining Date<i className="fa fa-star required"></i>
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
              <div className="col-lg">
                <label htmlFor="">
                  Designation<i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedDesignationOption}
                  value={selectedDesignationOption}
                  onChange={selectHandleChange}
                  name="designation_id"
                  options={designation}
                />

                {/* <select
                  className="form-control"
                  name="designation_id"
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  {Array.from(designation).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.designation_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Company Location<i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedLocationOption}
                  value={selectedLocationOption}
                  onChange={selectHandleChange}
                  name="company_location_id"
                  options={companyLocation}
                />

                {/* <select
                  className="form-control"
                  name="company_location_id"
                  onChange={handleChange}
                >
                  <option value="">Company Location</option>
                  {Array.from(companyLocation).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              {/* <div className="col-lg">
                <label htmlFor=""></label>
                <select className="form-control" name="workplace_id" onChange={handleChange}>
                  <option value="">Base Area </option>
                  {Array.from(workplace).map((item, index) => (
                    <option value={item.id} key={item.id}>{item.name}</option>
                  ))}
                </select>
              </div> */}
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label for="">
                  Select Region <i class="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedRegionOption}
                  value={selectedRegionOption}
                  onChange={selectHandleChange}
                  name="work_place_region_id"
                  options={region}
                />

                {/* <select
                  className="form-control"
                  name="work_place_region_id"
                  onChange={areaRegionWise}
                >
                  <option value="">Select Region</option>
                  {Array.from(region).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.work_place_region_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label for="">
                  Select Area <i class="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedAreaOption}
                  value={selectedAreaOption}
                  onChange={selectHandleChange}
                  name="work_place_area_id"
                  options={area}
                />

                {/* <select
                  className="form-control"
                  name="work_place_area_id"
                  onChange={baseRegionWise}
                >
                  <option value="">Select Area</option>
                  {Array.from(area).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.work_place_area_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              
              <div className="col-lg">
                <label for="">
                  Select Base <i class="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedBaseOption}
                  value={selectedBaseOption}
                  onChange={selectHandleChange}
                  name="work_place_base_id"
                  options={base}
                />

                {/* <select
                  className="form-control"
                  name="work_place_base_id"
                  onChange={handleChange}
                >
                  <option value="">Select Base</option>
                  {Array.from(base).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.work_place_base_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg mt-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="department_head"
                    className="form-check-input"
                    value={inputs.department_head || ""}
                    defaultChecked={inputs.department_head}
                    onChange={toggleChange}
                    id="department_head"
                  />
                  <label className="form-check-label" for="department_head">
                    Department Head
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="approved_by"
                    className="form-check-input"
                    value={inputs.approved_by || ""}
                    defaultChecked={inputs.approved_by}
                    onChange={toggleChange}
                    id="approved_by"
                  />
                  <label className="form-check-label" for="approved_by">
                    Approver
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
                <label htmlFor="">
                  Blood Group<i className="fa fa-star required"></i>
                </label>

                <select
                  className="form-control"
                  name="blood_group"
                  onChange={handleChange}
                >
                  <option value="">Blood Group</option>
                  <option
                    value="A+"
                    selected={inputs.blood_group === "A+" ? true : false}
                  >
                    A+
                  </option>
                  <option
                    value="A-"
                    selected={inputs.blood_group === "A-" ? true : false}
                  >
                    A-
                  </option>
                  <option
                    value="B+"
                    selected={inputs.blood_group === "B+" ? true : false}
                  >
                    B+
                  </option>
                  <option
                    value="B-"
                    selected={inputs.blood_group === "B-" ? true : false}
                  >
                    B-
                  </option>
                  <option
                    value="O+"
                    selected={inputs.blood_group === "O+" ? true : false}
                  >
                    O+
                  </option>
                  <option
                    value="O-"
                    selected={inputs.blood_group === "O-" ? true : false}
                  >
                    O-
                  </option>
                  <option
                    value="AB+"
                    selected={inputs.blood_group === "AB+" ? true : false}
                  >
                    AB+
                  </option>
                  <option
                    value="AB-"
                    selected={inputs.blood_group === "AB-" ? true : false}
                  >
                    AB-
                  </option>
                </select>
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Date Of Birth<i className="fa fa-star required"></i>
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
                  Emergency Contact<i className="fa fa-star required"></i>
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
                  Present Address<i className="fa fa-star required"></i>
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
              <div className="col-lg">
                <label htmlFor="">
                  ROLE <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="user_type"
                  onChange={handleChange}
                  required
                >
                  <option
                    value="staff"
                    selected={inputs.user_type === "staff" ? true : false}
                  >
                    staff
                  </option>
                  <option
                    value="dsr"
                    selected={inputs.user_type === "dsr" ? true : false}
                  >
                    dsr
                  </option>
                  <option
                    value="so"
                    selected={inputs.user_type === "so" ? true : false}
                  >
                    MDO
                  </option>
                  <option
                    value="admin"
                    selected={inputs.user_type === "admin" ? true : false}
                  >
                    admin
                  </option>
                  <option
                    value="am"
                    selected={inputs.user_type === "am" ? true : false}
                  >
                    am
                  </option>
                  <option
                    value="rsm"
                    selected={inputs.user_type === "rsm" ? true : false}
                  >
                    rsm
                  </option>
                  <option
                    value="hos"
                    selected={inputs.user_type === "hos" ? true : false}
                  >
                    hos
                  </option>
                  <option
                    value="hr"
                    selected={inputs.user_type === "hr" ? true : false}
                  >
                    hr
                  </option>
                  <option
                    value="accounts"
                    selected={inputs.user_type === "accounts" ? true : false}
                  >
                    accounts
                  </option>
                  <option
                    value="central_warehouse"
                    selected={
                      inputs.user_type === "central_warehouse" ? true : false
                    }
                  >
                    central_warehouse
                  </option>
                  <option
                    value="depot"
                    selected={inputs.user_type === "depot" ? true : false}
                  >
                    depot
                  </option>
                  <option
                    value="sd"
                    selected={inputs.user_type === "sd" ? true : false}
                  >
                    sd
                  </option>
                  <option
                    value="qc"
                    selected={inputs.user_type === "qc" ? true : false}
                  >
                    qc
                  </option>
                  <option
                    value="distributor_manager"
                    selected={
                      inputs.user_type === "distributor_manager" ? true : false
                    }
                  >
                    distributor_manager
                  </option>
                  <option
                    value="supply_chain"
                    selected={
                      inputs.user_type === "supply_chain" ? true : false
                    }
                  >
                    supply_chain
                  </option>
                  <option
                    value="production"
                    selected={inputs.user_type === "production" ? true : false}
                  >
                    production
                  </option>
                  <option
                    value="ppic"
                    selected={inputs.user_type === "ppic" ? true : false}
                  >
                    ppic
                  </option>
                  <option
                    value="rm_pm"
                    selected={inputs.user_type === "rm_pm" ? true : false}
                  >
                    rm_pm
                  </option>
                  <option
                    value="reports"
                    selected={inputs.user_type === "reports" ? true : false}
                  >
                    reports
                  </option>
                  <option
                    value="area_manager"
                    selected={
                      inputs.user_type === "area_manager" ? true : false
                    }
                  >
                    area_manager
                  </option>
                  <option
                    value="moo"
                    selected={inputs.user_type === "moo" ? true : false}
                  >
                    moo
                  </option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <h6 className="card-body-title mg-sm-b-30">
                  Working Experience
                </h6>
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
                  <label htmlFor="">Comapny Name</label>
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
                          onClick={removeExperience}
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
                  Basic<i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
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
                  type="text"
                  className="form-control"
                  placeholder="Insurance Rate"
                  name="insurance_rate"
                  value={inputs.insurance_rate || ""}
                  onChange={salaryChk}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Gross</label>
                <input
                  type="text"
                  disabled
                  className="form-control"
                  placeholder="Gross"
                  name="gross"
                  value={grossSalary}
                  onChange={salaryChk}
                />
              </div>
            </div>

            <div className=" row mt-3">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Status</label>
                <select
                  className="form-control"
                  name="status"
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
                </select>
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

export default EditStaff;
