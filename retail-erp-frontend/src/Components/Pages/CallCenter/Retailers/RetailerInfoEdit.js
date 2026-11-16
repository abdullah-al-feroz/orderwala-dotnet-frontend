import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const EditRetailer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [places, setPlaces] = useState([]);
  const [shopTypes, setShopTypes] = useState([]);

  useEffect(() => {
    fetchDropdownData();
    fetchRetailerData();
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [divisionsRes, shopTypesRes] = await Promise.all([
        Http.get("/customer-care/get-divisions"),
        Http.get("/customer-care/get-retail-shop-type"),
      ]);

      setDivisions(divisionsRes.data);
      setShopTypes(shopTypesRes.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const fetchRetailerData = async () => {
    try {
      const res = await Http.get(`/customer-care/retailer-info/${id}`);
      setInputs(res.data);

      if (res.data.division_id) await fetchDistricts(res.data.division_id);
      if (res.data.district_id) await fetchThanas(res.data.district_id);
      if (res.data.thana_id) await fetchPlaces(res.data.thana_id);
    } catch (error) {
      console.error("Error fetching retailer data:", error);
    }
  };

  const fetchDistricts = async (divisionId) => {
    try {
      const districtsRes = await Http.get(
        `/customer-care/get-districts/${divisionId}`
      );
      setDistricts(districtsRes.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchThanas = async (districtId) => {
    try {
      const thanasRes = await Http.get(
        `/customer-care/get-thanas/${districtId}`
      );
      setThanas(thanasRes.data);
    } catch (error) {
      console.error("Error fetching thanas:", error);
    }
  };

  const fetchPlaces = async (thanaId) => {
    try {
      const placesRes = await Http.get(`/customer-care/get-places/${thanaId}`);
      setPlaces(placesRes.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });

    if (name === "division_id") {
      fetchDistricts(value);
      setInputs({
        ...inputs,
        district_id: "",
        thana_id: "",
        place_id: "",
        [name]: value,
      });
    }

    if (name === "district_id") {
      fetchThanas(value);
      setInputs({
        ...inputs,
        thana_id: "",
        place_id: "",
        [name]: value,
      });
    }

    if (name === "thana_id") {
      fetchPlaces(value);
      setInputs({
        ...inputs,
        place_id: "",
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Http.put(`/customer-care/retailer-info/${id}`, inputs);
      navigate("/call-center/retailers");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setError(error.response.data.errors);
      }
    }
  };

  return (
    <div>
      <IsLogin />
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Retailer Information</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-sm-40">
            <form onSubmit={handleSubmit}>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-4 form-group">
                    <label>Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code"
                      value={inputs.code || ""}
                      onChange={handleChange}
                    />
                    {error.code && (
                      <div className="text-danger">{error.code}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Owner Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="owner_name"
                      value={inputs.owner_name || ""}
                      onChange={handleChange}
                    />
                    {error.owner_name && (
                      <div className="text-danger">{error.owner_name}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Shop Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="shop_name"
                      value={inputs.shop_name || ""}
                      onChange={handleChange}
                    />
                    {error.shop_name && (
                      <div className="text-danger">{error.shop_name}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={inputs.phone || ""}
                      onChange={handleChange}
                    />
                    {error.phone && (
                      <div className="text-danger">{error.phone}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={inputs.email || ""}
                      onChange={handleChange}
                    />
                    {error.email && (
                      <div className="text-danger">{error.email}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={inputs.address || ""}
                      onChange={handleChange}
                    />
                    {error.address && (
                      <div className="text-danger">{error.address}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Division</label>
                    <select
                      className="form-control"
                      name="division_id"
                      value={inputs.division_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Division</option>
                      {divisions.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                    </select>
                    {error.division_id && (
                      <div className="text-danger">{error.division_id}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>District</label>
                    <select
                      className="form-control"
                      name="district_id"
                      value={inputs.district_id || ""}
                      onChange={handleChange}
                      disabled={!inputs.division_id}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {error.district_id && (
                      <div className="text-danger">{error.district_id}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Thana</label>
                    <select
                      className="form-control"
                      name="thana_id"
                      value={inputs.thana_id || ""}
                      onChange={handleChange}
                      disabled={!inputs.district_id}
                    >
                      <option value="">Select Thana</option>
                      {thanas.map((thana) => (
                        <option key={thana.id} value={thana.id}>
                          {thana.name}
                        </option>
                      ))}
                    </select>
                    {error.thana_id && (
                      <div className="text-danger">{error.thana_id}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Place</label>
                    <select
                      className="form-control"
                      name="place_id"
                      value={inputs.place_id || ""}
                      onChange={handleChange}
                      disabled={!inputs.thana_id}
                    >
                      <option value="">Select Place</option>
                      {places.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                    {error.place_id && (
                      <div className="text-danger">{error.place_id}</div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>Retailer Shop Type</label>
                    <select
                      className="form-control"
                      name="retailer_shop_type_id"
                      value={inputs.retailer_shop_type_id || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Shop Type</option>
                      {shopTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {error.retailer_shop_type_id && (
                      <div className="text-danger">
                        {error.retailer_shop_type_id}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 form-group">
                    <label>New Password (leave blank if not changing)</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={inputs.password || ""}
                      onChange={handleChange}
                    />
                    {error.password && (
                      <div className="text-danger">{error.password}</div>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary float-right">
                Save Changes
              </button>
            </form>
          </div>
        </div>
        <div className="am-footer">
          <span>
            Copyright ©. All Rights Reserved.{" "}
            <a href="http://limerickbd.com/">Limerick Resources Limited</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditRetailer;
