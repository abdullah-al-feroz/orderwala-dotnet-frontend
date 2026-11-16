import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { toDate } from "date-fns";
import Select from "react-select";
import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState(null);
  const [singleCustomerData, setSingleCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [data, setData] = useState();
  const [passSuccess, setpPassSuccess] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [user, setUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [place, setPlace] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeName, setRouteName] = useState("");
  const [distributorName, setDistributorName] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const buttonSubmit = (id) => {
    return async () => {
      setLoading(true);
      try {
        const response = await Http.get(
          `/shop-customer-information-by-id/${id}`
        );
        console.log(response);
        setSingleCustomerData(response.data);
        setUser(response.data.id);

        setRouteName(response.data.route.name);
        setDistributorName(response.data.distributor.name);

        setSelectedDivision({
          label: response.data.division.name,
          value: response.data.division.id,
        });

        setSelectedDistrict({
          label: response.data.district.name,
          value: response.data.district.id,
        });

        setSelectedThana({
          label: response.data.thana.name,
          value: response.data.thana.id,
        });

        setSelectedPlace({
          label: response.data.place.name,
          value: response.data.place.id,
        });

        Http.get(
          "/select2/SupplyChainPurchaseManagement.Setting.Division/id,name"
        ).then((res) => {
          setDivision(res.data);
        });

        Http.get(
          "/select2/SupplyChainPurchaseManagement.Setting.District/id,name/division_id:" +
            response.data.division_id
        ).then((res) => {
          setDistrict(res.data);
        });

        Http.get(
          "/select2/SupplyChainPurchaseManagement.Setting.Thana/id,name/district_id:" +
            response.data.district_id
        ).then((res) => {
          setThana(res.data);
        });

        Http.get(
          "/select2/SupplyChainPurchaseManagement.Setting.Place/id,name/thana_id:" +
            response.data.thana_id
        ).then((res) => {
          setPlace(res.data);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error on form submit:", error);
        setLoading(false);
      }
    };
  };

  const formSubmit = async () => {
    setLoading(true);
    try {
      const response = await Http.get(
        `/shop-customer-information?mobile=${inputs.mobile}`
      );
      // console.log(response);
      setReceiveData(response.data);
      setUser(response.data.id);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setLoading(true); // Set loading to true during the API call
      try {
        const response = await Http.post(
          `/retailer/customer-password-changes-by-moo-from-web/${singleCustomerData.id}`,
          {
            newPassword,
            confirmPassword,
          }
        );

        // Access `status` from `response.data`
        if (response.data.status === true) {
          // Optionally reset form fields and errors
          setNewPassword("");
          setConfirmPassword("");
          setErrors({});
          console.log("Password updated successfully!");
          setpPassSuccess(
            response.data.message || "Password updated successfully!"
          );
        } else {
          // Handle failure case
          setErrors({ apiError: response.data.message || "An error occurred" });
          setpPassSuccess(
            response.data.message || "An error occurred. Please try again!"
          );
        }
      } catch (error) {
        console.error("Error updating password:", error);
        setErrors({
          apiError: "Something went wrong. Please try again later.",
        });
        setpPassSuccess("An error occurred. Please try again!");
      } finally {
        setLoading(false); // Always set loading to false after the API call
      }
    }
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "division_id") {
      setSelectedDivision({
        label: selectedOption.label,
        value: selectedOption.value,
      });
      setSelectedDistrict([]);
      setSelectedThana([]);
      setSelectedPlace([]);
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.District/id,name/division_id:" +
          value
      ).then((res) => {
        setDistrict(res.data);
      });
    } else if (name == "district_id") {
      setSelectedDistrict({
        label: selectedOption.label,
        value: selectedOption.value,
      });
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Thana/id,name/district_id:" +
          value
      ).then((res) => {
        setThana(res.data);
      });

      setSelectedThana([]);
      setSelectedPlace([]);
    } else if (name == "thana_id") {
      setSelectedThana({
        label: selectedOption.label,
        value: selectedOption.value,
      });
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Place/id,name/thana_id:" +
          value
      ).then((res) => {
        setPlace(res.data);
      });
    } else if (name == "place_id") {
      setSelectedPlace({
        label: selectedOption.label,
        value: selectedOption.value,
      });
      Http.get("/retailer/customer-route-distributor/" + value).then((res) => {
        setRouteName(res.data.route_name);
        setDistributorName(res.data.distributor_name);
      });
    }
  };

  const handleValidation = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 4) {
      newErrors.newPassword = "Password must be at least 4 characters long";
    }
    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {}, []);

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Http.post(
        `/retailer/customer-info-changes-by-moo-from-web/${singleCustomerData.id}`,
        {
          division_id: selectedDivision.value,
          district_id: selectedDistrict.value,
          thana_id: selectedThana.value,
          place_id: selectedPlace.value,
        }
      );

      console.log("Navigating with message:", response.data.message);
      setLoading(false);

      navigate("/shop-customer-password-modify", {
        state: { message: response.data.message, type: "success" },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const cols = [
    { field: "code", header: "Code" },
    { field: "shop_name", header: "Name" },
    { field: "route.name", header: "Route" },
    { field: "place.name", header: "Place" },
    { field: "thana.name", header: "Thana" },
    { field: "district.name", header: "District" },
    { field: "division.name", header: "Division" },
    { field: "distributor.name", header: "Distributor" },
    { field: "phone", header: "Phone" },
    {
      field: (rowData) => (rowData.available_for_mdo ? "TOW" : "OW"),
      header: "Type",
    },
    // { field: "status", header: "Action" },
  ];

  const actionTemplate = (rowData) => {
    // console.log(role);
    return (
      <div className="text-xs text-nowrap">
        <button
          className="btn btn-primary btn-block mg-b-10"
          onClick={buttonSubmit(rowData.id)}
        >
          Details
        </button>
      </div>
    );
  };

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Customer Searching by Mobile Number</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">
                    <b>Customer Mobile Number</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile"
                    value={inputs.mobile}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg mt-4">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="card pd-sm-40">
                  <div className="card-body">
                    {receiveData ? (
                      <>
                        <ReactDataTable
                          cols={cols}
                          receiveData={receiveData}
                          isLoading={loading}
                          actionTemplate={actionTemplate}
                        />
                      </>
                    ) : (
                      <>
                        <h4 className="text-center text-danger">
                          Please Search Customer By Phone Number
                        </h4>
                      </>
                    )}

                    {singleCustomerData ? (
                      <>
                        <div className="d-flex justify-content-between mt-5 mb-3">
                          <h3 className="text-center">Customer information</h3>
                          <button
                            className="float-end btn btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                        </div>
                        <form onSubmit={handleSubmitInfo}>
                          <table className="table">
                            <tr>
                              <th>Owner Name</th>
                              <td>{singleCustomerData?.owner_name}</td>
                            </tr>
                            <tr>
                              <th>Shop Name</th>
                              <td>{singleCustomerData?.shop_name}</td>
                            </tr>
                            <tr>
                              <th>Phone</th>
                              <td>{singleCustomerData?.phone}</td>
                            </tr>
                            <tr>
                              <th>Email</th>
                              <td>{singleCustomerData?.email}</td>
                            </tr>
                            <tr>
                              <th>Address</th>
                              <td>{singleCustomerData?.address}</td>
                            </tr>
                            <tr>
                              <th>Nid No</th>
                              <td>{singleCustomerData?.nid_no}</td>
                            </tr>
                            <tr>
                              <th>Division</th>
                              <td>
                                <div className="col-lg">
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={selectedDivision}
                                    value={selectedDivision}
                                    onChange={selectHandleChange}
                                    name="division_id"
                                    options={division}
                                  />
                                </div>
                                {/* {receiveData?.division?.name} */}
                              </td>
                            </tr>
                            <tr>
                              <th>District</th>
                              <td>
                                <div className="col-lg">
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={selectedDistrict}
                                    value={selectedDistrict}
                                    onChange={selectHandleChange}
                                    name="district_id"
                                    options={district}
                                  />
                                </div>
                                {/* {receiveData?.district?.name} */}
                              </td>
                            </tr>
                            <tr>
                              <th>Thana</th>
                              <td>
                                <div className="col-lg">
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={selectedThana}
                                    value={selectedThana}
                                    onChange={selectHandleChange}
                                    name="thana_id"
                                    options={thana}
                                  />
                                </div>
                                {/* {receiveData?.thana?.name} */}
                              </td>
                            </tr>
                            <tr>
                              <th>Place</th>
                              <td>
                                <div className="col-lg">
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue={selectedPlace}
                                    value={selectedPlace}
                                    onChange={selectHandleChange}
                                    name="place_id"
                                    options={place}
                                  />
                                </div>
                                {/* {receiveData?.place?.name} */}
                              </td>
                            </tr>
                            <tr>
                              <th>Route</th>
                              {/* <td>{receiveData?.route?.name}</td> */}
                              <td>{routeName}</td>
                            </tr>
                            <tr>
                              <th>Distributor</th>
                              {/* <td>{receiveData?.distributor?.name}</td> */}
                              <td>{distributorName}</td>
                            </tr>
                          </table>
                          <button type="submit" className="btn btn-primary">
                            Update Customer Info
                          </button>
                        </form>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12">
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  Password Changes
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div
                      className={`mb-3 ${
                        errors.newPassword ? "has-error" : ""
                      }`}
                    >
                      <label htmlFor="newPassword" className="form-label">
                        New Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.newPassword ? "is-invalid" : ""
                        }`}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      {errors.newPassword && (
                        <div className="invalid-feedback">
                          {errors.newPassword}
                        </div>
                      )}
                    </div>
                    <div
                      className={`mb-3 ${
                        errors.confirmPassword ? "has-error" : ""
                      }`}
                    >
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                    <h5 className="text-center text-success">{passSuccess}</h5>
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
