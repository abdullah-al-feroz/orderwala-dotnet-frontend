import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import useDeleteData from "../../../../hooks/useDeleteData";
import Alert from "../../../Common/Alert";
import HttpHR from "../../../Common/HttpHR";
import HttpSupplyChain from "../../../Common/HttpSupplyChain";
import HttpUser from "../../../Common/HttpUser";
import IsLogin from "../../../Common/IsLogin";
import ReactDataTable from "../../../Common/ReactPaginateDataTable";
import axios from "axios";
import useDebounce from "../../../../Utils/useDebounce";
import { latestSalaryStructure } from "../../../../Utils/StaffSalaryStructureUtils";

const EmployeeType = [
  { value: 1, label: "Permanent" },
  { value: 2, label: "Contractual" },
  { value: 3, label: "Internship" },
  { value: 4, label: "Casual" }
];

const RoasterGroupLabels = {
  1: "Group A",
  2: "Group B",
};

// Staff user types that get a Route Plan. Mirrors the retail ERP condition
// (so / dsr / rsm / cdm / am) translated to the numeric UserType enum, and
// deliberately excludes BP - there that slot is the MDO assign action instead.
const ROUTE_PLAN_USER_TYPES = [3, 4, 6, 7, 23];

const roasterGroupBodyTemplate = (rowData) => {
  const value = rowData.roasterGroup;
  return value ? RoasterGroupLabels[value] || value : "";
};

const workplaceNameTemplate = (rowData) => {
  const workplace =
    rowData.base?.name || rowData.area?.name || rowData.region?.name || rowData.zone?.name;
  return workplace ?? "";
};

const cols = [
  { field: "cardNo", header: "Card No" },
  { field: "name", header: "Name" },
  { field: "email", header: "Email" },
  { field: "mobile", header: "Mobile" },
  { field: "workplaceName", header: "Workplace", body: workplaceNameTemplate },
  { field: "designationName", header: "Designation" },
  { field: "departmentName", header: "Department" },
  { field: "companyLocationName", header: "Location" },
  { field: "workplaceType", header: "Workplace Type" },
  { field: "bloodGroup", header: "Blood Group" },
  { field: "dateOfBirth", header: "Date Of Birth" },
  { field: "type", header: "Type" },
  { field: "roasterGroup", header: "Roaster Group", body: roasterGroupBodyTemplate },
  { field: "status", header: " Status " },
  { field: "joiningDate", header: "Joining Date" },
  {
    field: "staffSalaryStructures",
    header: "Gross Salary",
    body: (rowData) => latestSalaryStructure(rowData.staffSalaryStructures).gross ?? ""
  },
];

const Staff = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [grade, setGrade] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [companyLocation, setCompanyLocation] = useState([]);
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [gradeSearch, setGradeSearch] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [designationSearch, setDesignationSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Debounced callbacks for dropdown searches
  const handleDebouncedGradeSearch = useDebounce((value) => {
    fetchGrades(value);
  }, 500);

  const handleDebouncedDepartmentSearch = useDebounce((value) => {
    fetchDepartments(value);
  }, 500);

  const handleDebouncedDesignationSearch = useDebounce((value) => {
    fetchDesignations(value);
  }, 500);

  const handleDebouncedLocationSearch = useDebounce((value) => {
    fetchCompanyLocations(value);
  }, 500);
  
  // Add search debouncer for main search filter
  const handleDebouncedSearch = useDebounce((value) => {
    setSearchFilter(value);
    setCurrentPage(1); // Reset to page 1 when searching
  }, 500);

  // Fetch Grades
  const fetchGrades = async (filter = "") => {
    try {
      const response = await HttpHR.get(`/Grades/paginated?Filter=${filter}&Page=1&PageSize=10`);
      const options = response.data.data.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.gradeCode})`,
      }));
      setGrade(options);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  // Fetch Departments
  const fetchDepartments = async (filter = "") => {
    try {
      const response = await HttpHR.get(`/Departments/paginated?Filter=${filter}&Page=1&PageSize=10`);
      const options = response.data.data.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.departmentCode})`,
      }));
      setDepartment(options);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // Fetch Designations
  const fetchDesignations = async (filter = "") => {
    try {
      const response = await HttpHR.get(`/Designations/paginated?Filter=${filter}&Page=1&PageSize=10`);
      const options = response.data.data.map((item) => ({
        value: item.id,
        label: `${item.name} (${item.designationCode})`,
      }));
      setDesignation(options);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  // Fetch Company Locations
  const fetchCompanyLocations = async (filter = "") => {
    try {
      const response = await HttpSupplyChain.get(`/CompanyLocation/paginated?Filter=${filter}&Page=1&PageSize=10&Status=1`);
      const options = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCompanyLocation(options);
    } catch (error) {
      console.error("Error fetching company locations:", error);
    }
  };

  // Fetch Staff Data
  const fetchStaffData = async (page = 1, size = 10, filters = {}, search = "", showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      // Build query parameters
      let queryParams = `Page=${page}&PageSize=${size}`;

      // Add search filter parameter
      if (search) queryParams += `&Filter=${encodeURIComponent(search)}`;
      
      if (filters.grade_id) queryParams += `&GradeId=${filters.grade_id}`;
      if (filters.designation_id) queryParams += `&DesignationId=${filters.designation_id}`;
      if (filters.department_id) queryParams += `&DepartmentId=${filters.department_id}`;
      if (filters.company_location_id) queryParams += `&CompanyLocationId=${filters.company_location_id}`;
      if (filters.type) queryParams += `&Type=${filters.type}`;
      if (filters.status) queryParams += `&Status=${filters.status}`;

      const response = await HttpUser.get(`/paginated?${queryParams}`);

      var formattedData = response.data.data.map((item) => {
        item.status = item.status === 1 ? "active" : "inactive";
        item.type = EmployeeType.find(t => t.value === item.type)?.label;
        item.dateOfBirth = item.dateOfBirth ? item.dateOfBirth.split("T")[0] : "";
        item.joiningDate = item.joiningDate ? item.joiningDate.split("T")[0] : "";
        return item;
      });

      setReceiveData(formattedData);
      setTotalRecords(response.data.totalRecords);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Fetch error:", error);
      setReceiveData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStaffData();
    fetchGrades();
    fetchDepartments();
    fetchDesignations();
    fetchCompanyLocations();
  }, []);

  // Debounced search effects
  useEffect(() => {
    handleDebouncedGradeSearch(gradeSearch);
  }, [gradeSearch, handleDebouncedGradeSearch]);

  useEffect(() => {
    handleDebouncedDepartmentSearch(departmentSearch);
  }, [departmentSearch, handleDebouncedDepartmentSearch]);

  useEffect(() => {
    handleDebouncedDesignationSearch(designationSearch);
  }, [designationSearch, handleDebouncedDesignationSearch]);

  useEffect(() => {
    handleDebouncedLocationSearch(locationSearch);
  }, [locationSearch, handleDebouncedLocationSearch]);

  // Fetch data when search filter changes
  useEffect(() => {
    const isSearchChange = searchFilter !== "";
    fetchStaffData(currentPage, pageSize, inputs, searchFilter, !isSearchChange);
  }, [searchFilter]);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const deleteData = useDeleteData(fetchStaffData);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption ? selectedOption.value : null;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    setCurrentPage(1); // Reset to page 1 when applying filters
    fetchStaffData(1, pageSize, inputs, searchFilter, true);
  };

  const onPageChange = (event) => {
    const newPage = event.page + 1;
    const newPageSize = event.rows;
    setCurrentPage(newPage);
    setPageSize(newPageSize);
    const isSearchChange = searchFilter !== "";
    fetchStaffData(newPage, newPageSize, inputs, searchFilter, !isSearchChange);
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Staff</h5>
            <Link to="/create-staff" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Staff
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label>Department</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="department_id"
                    options={department}
                    onChange={selectHandleChange}
                    onInputChange={(value) => setDepartmentSearch(value)}
                    isClearable
                    placeholder="Search ..."
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
                <div className="col-lg">
                  <label>Grade</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="grade_id"
                    options={grade}
                    onChange={selectHandleChange}
                    onInputChange={(value) => setGradeSearch(value)}
                    isClearable
                    placeholder="Search ..."
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
                <div className="col-lg">
                  <label>Designation</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="designation_id"
                    options={designation}
                    onChange={selectHandleChange}
                    onInputChange={(value) => setDesignationSearch(value)}
                    isClearable
                    placeholder="Search ..."
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
                <div className="col-lg">
                  <label>Company Location</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="company_location_id"
                    options={companyLocation}
                    onChange={selectHandleChange}
                    onInputChange={(value) => setLocationSearch(value)}
                    isClearable
                    placeholder="Search ..."
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  />
                </div>
                <div className="col-lg">
                  <label>Type</label>
                  <select
                    className="form-control"
                    name="type"
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="permanent">Permanent</option>
                    <option value="contractual">Contractual</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="col-lg">
                  <label>Status</label>
                  <select
                    className="form-control"
                    name="status"
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-lg">
                  <label>.</label>
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <div className="row">
                <ReactDataTable
                  cols={cols}
                  isLoading={loading}
                  receiveData={receiveData}
                  actionTemplate={actionTemplate}
                  deleteData={deleteData}
                  totalRecords={totalRecords}
                  currentPage={currentPage - 1}
                  pageSize={pageSize}
                  onPageChange={onPageChange}
                  lazy={true}
                  onSearch={handleDebouncedSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData) => {
  return (
    <>
      <Link
        to={{ pathname: "/edit-staff/" + rowData.id }}
        className="btn btn-primary btn-sm mx-1"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <Link
        to={{ pathname: "/appointment-letter/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
      <Link
        to={{ pathname: "/idcard/" + rowData.id }}
        className="btn btn-warning btn-sm mx-1"
      >
        <i className="fa fa-id-card" aria-hidden="true"></i>
      </Link>
      {ROUTE_PLAN_USER_TYPES.includes(Number(rowData.userType)) ? (
        <Link
          to={{
            pathname: "/create-route-plan/" + rowData.id,
          }}
          className="btn btn-success btn-sm mx-1"
        >
          <i className="fa fa-map-marker" aria-hidden="true"></i>
        </Link>
      ) : (
        ""
      )}
      <Link
        to={`/profile/${rowData.id}`}
        className="btn btn-success btn-sm mx-1"
        title="Profile"
      >
        <i className="fa fa-user"></i>
      </Link>
      <Link
        to={`/change-password/${rowData.id}`}
        className="btn btn-secondary btn-sm mx-1"
        title="Change Password"
      >
        <i className="fa fa-key" aria-hidden="true"></i>
      </Link>
    </>
  );
};

export default Staff;