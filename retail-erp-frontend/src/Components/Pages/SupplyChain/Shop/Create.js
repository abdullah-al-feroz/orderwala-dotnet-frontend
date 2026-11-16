import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [customerCode, setCustomerCode] = useState();
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [place, setPlace] = useState([]);
  const { checkRequiredFields } = useRequiredFields();

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

    Http.post("/customer", inputs)
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
          <h5 className="am-title">Create Customer</h5>
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
                  defaultValue={division[0]}
                  name="division_id"
                  options={division}
                  onChange={selectHandleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  District <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={district[0]}
                  name="district_id"
                  options={district}
                  onChange={selectHandleChange}
                />
              </div>

              <div className="col-lg">
                <label htmlFor="">
                  Thana <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={thana[0]}
                  name="thana_id"
                  options={thana}
                  onChange={selectHandleChange}
                />
              </div>

              <div className="col-lg">
                <label htmlFor="">
                  Place <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={place[0]}
                  name="place_id"
                  options={place}
                  onChange={selectHandleChange}
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
