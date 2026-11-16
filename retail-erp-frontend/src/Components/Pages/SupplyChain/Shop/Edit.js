import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [customerCode, setCustomerCode] = useState();
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [area, setArea] = useState([]);
  const [ward, setWard] = useState([]);
  const { checkRequiredFields } = useRequiredFields();
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // if upload has any File
  const [selectedFile1, setSelectedFile1] = useState();
  const [selectedFile2, setSelectedFile2] = useState();
  const [selectedFile3, setSelectedFile3] = useState();

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

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
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
      setSelectedArea([]);
      setSelectedWard([]);
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
        "/select2/SupplyChainPurchaseManagement.Setting.Area/id,name/district_id:" +
          value
      ).then((res) => {
        setArea(res.data);
      });

      setSelectedArea([]);
      setSelectedWard([]);
    } else if (name == "area_id") {
      setSelectedArea({
        label: selectedOption.label,
        value: selectedOption.value,
      });

      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Ward/id,name/area_id:" +
          value
      ).then((res) => {
        setWard(res.data);
      });
      setSelectedWard([]);
    } else if (name == "ward_id") {
      setSelectedWard({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }
  };

  // Default Load
  const fetchData = () => {
    Http.get(
      "/select2/SupplyChainPurchaseManagement.Setting.Division/id,name"
    ).then((res) => {
      setDivision(res.data);
    });
    Http.get("/last-code-increment-by-one/customers/code/C").then((res) => {
      setCustomerCode(res.data);
    });
    Http.get("/customer/" + id + "/edit").then((res) => {
      setInputs({
        code: res.data.code,
        image: res.data.image,
        owner_name: res.data.owner_name,
        shop_name: res.data.shop_name,
        phone: res.data.phone,
        email: res.data.email,
        address: res.data.address,
        nid_no: res.data.nid_no,
        nid_image: res.data.nid_image,
        trade_license_no: res.data.trade_license_no,
        trade_license_image: res.data.trade_license_image,
        division_id: res.data.division_id,
        district_id: res.data.district_id,
        area_id: res.data.area_id,
        ward_id: res.data.ward_id,
        status: res.data.status,
      });

      setSelectedDivision({
        label: res.data.division.name,
        value: res.data.division.id,
      });

      setSelectedDistrict({
        label: res.data.district.name,
        value: res.data.district.id,
      });

      setSelectedArea({
        label: res.data.area.name,
        value: res.data.area.id,
      });

      setSelectedWard({
        label: res.data.ward.name,
        value: res.data.ward.id,
      });

      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.District/id,name/division_id:" +
          res.data.division_id
      ).then((res) => {
        setDistrict(res.data);
      });

      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Area/id,name/district_id:" +
          res.data.district_id
      ).then((res) => {
        setArea(res.data);
      });

      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Ward/id,name/area_id:" +
          res.data.area_id
      ).then((res) => {
        setWard(res.data);
      });
    });
  };
  useEffect(() => {
    fetchData(); // Get All Fetch Info/Data
  }, []);
  // End Default Load

  const formSubmit = () => {
    checkRequiredFields();
    inputs.code = customerCode;
    inputs.image = selectedFile1;
    inputs.nid_image = selectedFile2;
    inputs.trade_license_image = selectedFile3;

    Http.put("/customer/" + id, inputs)
      .then((res) => {
        navigate("/shop", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Customer</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Code <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={customerCode || ""}
                  onChange={handleChange}
                  placeholder="Input Code"
                />
                {displayError("code")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  Owner Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="owner_name"
                  value={inputs.owner_name || ""}
                  onChange={handleChange}
                  placeholder="Input Owner Name"
                  data-required
                />
                {displayError("owner_name")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  Shop Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="shop_name"
                  value={inputs.shop_name || ""}
                  onChange={handleChange}
                  placeholder="Input Shop Name"
                  data-required
                />
                {displayError("shop_name")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  Phone <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={inputs.phone || ""}
                  onChange={handleChange}
                  placeholder="Input Phone"
                  data-required
                />
                {displayError("phone")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  Email <i className="fa fa-star required"></i>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  placeholder="Input Email"
                  data-required
                />
                {displayError("email")}
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  address <i className="fa fa-star required"></i>
                </label>
                <input
                  type="address"
                  className="form-control"
                  name="address"
                  value={inputs.address || ""}
                  onChange={handleChange}
                  placeholder="Input Address"
                  data-required
                />
                {displayError("address")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Division <i className="fa fa-star required"></i>
                </label>
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
              <div className="col-lg">
                <label htmlFor="">
                  District <i className="fa fa-star required"></i>
                </label>
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
              <div className="col-lg">
                <label htmlFor="">
                  Thana <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedArea}
                  value={selectedArea}
                  onChange={selectHandleChange}
                  name="area_id"
                  options={area}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Place <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedWard}
                  value={selectedWard}
                  onChange={selectHandleChange}
                  name="ward_id"
                  options={ward}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange1}
                  placeholder="Input Shop Image"
                />
              </div>
            </div>

            {/* NID */}
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  NID No <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nid_no"
                  value={inputs.nid_no || ""}
                  onChange={handleChange}
                  placeholder="Input NID no"
                />
              </div>
              <div className="col-lg">
                <label>NID Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="nid_image"
                  onChange={handleFileChange2}
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
                  name="trade_license_no"
                  value={inputs.trade_license_no || ""}
                  onChange={handleChange}
                  placeholder="Input license no"
                />
              </div>
              <div className="col-lg">
                <label>License Img</label>
                <input
                  type="file"
                  className="form-control"
                  name="trade_license_image"
                  onChange={handleFileChange3}
                  placeholder="Input license no"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-9"></div>
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Edit
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
