import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";
import useRequiredFields from "../../../../hooks/useRequiredFields";

const Create = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { checkRequiredFields } = useRequiredFields();
  const [inputs, setInputs] = useState({
    type,
    mushok_6_4_show: true,
    status: "active",
  }); // initialized type from useParams
  const [unit, setUnit] = useState([]);
  const [company, setCompany] = useState([]);
  const [brand, setBrand] = useState([]);
  const [unitSupply, setUnitSupply] = useState([]);
  const [category, setCategory] = useState([]);
  const [error, setError] = useState({});
  const [tag, setTag] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [isRequired, setIsRequired] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState();
  const [isSelected1, setIsSelected1] = useState(false);
  const [selectedFile2, setSelectedFile2] = useState();
  const [isSelected2, setIsSelected2] = useState(false);
  const [selectedFile3, setSelectedFile3] = useState();
  const [isSelected3, setIsSelected3] = useState(false);
  const [outSideCompany, setOutSideCompany] = useState([]);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (name == "company_id") {
      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Brand/id,name/vendor_id:" +
          value
      ).then((res) => {
        setBrand(res.data);
      });
    }
  };
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
  };
  const handleFileChange1 = (e) => {
    setSelectedFile1(e.target.files[0]);
    setIsSelected1(true);
  };
  const handleFileChange2 = (e) => {
    setSelectedFile2(e.target.files[0]);
    setIsSelected2(true);
  };
  const handleFileChange3 = (e) => {
    setSelectedFile3(e.target.files[0]);
    setIsSelected3(true);
  };

  const selectHandleTag = (selectedValues) => {
    setSelectedTag(selectedValues);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Default Load
  const fetchData = async () => {
    const outsideCompanyResponse = await Http.get("/me");
    setOutSideCompany(outsideCompanyResponse.data);

    Http.get("/select2/SupplyChainPurchaseManagement.Setting.Tag/id,name").then(
      (res) => {
        setTag(res.data);
      }
    );

    Http.get("/select2/SupplyChainPurchaseManagement.Vendor/id,name").then(
      (res) => {
        setCompany(res.data);
      }
    );

    if (outsideCompanyResponse.data.data.user_type === "other-company") {
      Http.get(
        `/select2/SupplyChainPurchaseManagement.Setting.Brand/id,name/vendor_id:${outsideCompanyResponse.data.data.id}`
      ).then((res) => {
        setBrand(res.data);
      });
    }

    Http.get(
      "/select2/SupplyChainPurchaseManagement.ProductCategory/id,name"
    ).then((res) => {
      setCategory(res.data);
    });

    const unitData = await Http.get("/unitSelect2");
    const codeData = await Http.get(
      "/last-code-increment-by-one/products/code/P"
    );

    setUnit(unitData.data);
    setUnitSupply(unitData.data);
    setInputs((prevInputs) => ({
      ...prevInputs,
      code: codeData.data,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formSubmit = () => {
    if (checkRequiredFields()) {
      if (selectedFile) {
        inputs.thumb_image = selectedFile;
      }
      if (selectedFile1) {
        inputs.image_1 = selectedFile1;
      }
      if (selectedFile2) {
        inputs.image_2 = selectedFile2;
      }
      if (selectedFile3) {
        inputs.image_3 = selectedFile3;
      }

      setInputs((prevInputs) => ({
        ...prevInputs,
        type: type,
      }));
      inputs.tag = JSON.stringify(selectedTag);

      Http.post("/product", inputs, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          navigate("/product", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Product</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
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
                  placeholder="Code"
                  data-required
                />
                {displayError("code")}
              </div>
              <div className="col-lg">
                <label>
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name_en"
                  value={inputs.name_en || ""}
                  onChange={handleChange}
                  placeholder="Name"
                  data-required
                />
                {displayError("name")}
              </div>
              <div className="col-lg">
                <label>
                  Name (Bangla) <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Name (Bangla)"
                  data-required
                />
                {displayError("name")}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Unit <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={unit[0]}
                  name="unit_id"
                  options={unit}
                  onChange={selectHandleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Category <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={category[0]}
                  name="category_id"
                  options={category}
                  onChange={selectHandleChange}
                />
              </div>
              {outSideCompany?.data?.user_type !== "other-company" && (
                <div className="col-lg">
                  <label htmlFor="">
                    Company <i className="fa fa-star required"></i>
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={company[0]}
                    name="company_id"
                    options={company}
                    onChange={selectHandleChange}
                  />
                </div>
              )}

              <div className="col-lg">
                <label htmlFor="">
                  Brand <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={brand[0]}
                  name="brand_id"
                  options={brand}
                  onChange={selectHandleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Purchase Price (PP) <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="purchase_price"
                  value={inputs.purchase_price || ""}
                  onChange={handleChange}
                  placeholder="Purchase Price (PP)"
                  data-required
                />
                {displayError("purchase_price")}
              </div>
              <div className="col-lg">
                <label>
                  Distributor Price (DP) <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="primary_price"
                  value={inputs.primary_price || ""}
                  onChange={handleChange}
                  placeholder="Distributor Price (DP)"
                  data-required
                />
                {displayError("primary_price")}
              </div>
              <div className="col-lg">
                <label>
                  Secondary Price (TP) <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="secondary_price"
                  value={inputs.secondary_price || ""}
                  onChange={handleChange}
                  placeholder="Secondary Price (TP)"
                  data-required
                />
                {displayError("secondary_price")}
              </div>
              <div className="col-lg">
                <label>
                  MRP <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="mrp"
                  value={inputs.mrp || ""}
                  onChange={handleChange}
                  placeholder="MRP"
                  data-required
                />
                {displayError("mrp")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Commission Rate % <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="commission_rate"
                  value={inputs.commission_rate || ""}
                  onChange={handleChange}
                  placeholder="Commission Rate %"
                  data-required
                />
                {displayError("commission_rate")}
              </div>
              <div className="col-lg">
                <label>Weight</label>
                <input
                  type="text"
                  className="form-control"
                  name="weight"
                  value={inputs.weight || ""}
                  onChange={handleChange}
                  placeholder="Weight"
                />
              </div>
              <div className="col-lg">
                <label>Height</label>
                <input
                  type="text"
                  className="form-control"
                  name="height"
                  value={inputs.height || ""}
                  onChange={handleChange}
                  placeholder="Height"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Width</label>
                <input
                  type="text"
                  className="form-control"
                  name="width"
                  value={inputs.width || ""}
                  onChange={handleChange}
                  placeholder="Width"
                />
              </div>
              <div className="col-lg">
                <label>Length</label>
                <input
                  type="text"
                  className="form-control"
                  name="length"
                  value={inputs.length || ""}
                  onChange={handleChange}
                  placeholder="Length"
                />
              </div>
              <div className="col-lg">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description_en"
                  value={inputs.description_en || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-lg">
                <label>Description (Bangla)</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={inputs.description || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Pack Size <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="pack_size"
                  value={inputs.pack_size || ""}
                  onChange={handleChange}
                  placeholder="Pack Size"
                  data-required
                />
                {displayError("pack_size")}
              </div>
              <div className="col-lg">
                <label>
                  SKU <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="sku"
                  value={inputs.sku || ""}
                  onChange={handleChange}
                  placeholder="SKU"
                  data-required
                />
                {displayError("sku")}
              </div>
              <div className="col-lg">
                <label>
                  Status <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
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
                    Inactive
                  </option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Thumb Image <i className="fa fa-star required"></i>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="thumb_image"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-lg">
                <label>Product Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="product_image_1"
                  onChange={handleFileChange1}
                />
              </div>
              <div className="col-lg">
                <label>Product Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="product_image_2"
                  onChange={handleFileChange2}
                />
              </div>
              <div className="col-lg">
                <label>Product Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="product_image_3"
                  multiple
                  onChange={handleFileChange3}
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">TAG</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={tag[0]}
                  name="tag"
                  options={tag}
                  text="Please select Tags."
                  isMulti="yes"
                  onChange={selectHandleTag}
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
              <div className="col-lg mt-5">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="direct_sale_allowed"
                    className="form-check-input"
                    checked={inputs.direct_sale_allowed || false}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" for="flexCheckChecked">
                    Direct Sale Allowed
                  </label>
                </div>
              </div>
            </div>

            {outSideCompany?.data?.user_type !== "other-company" && (
              <>
                <div className="row mt-3">
                  <div className="col-md-12 mt-5">
                    <h4 className="text-center">চালান</h4>
                    <hr />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label>একক মূল্য(টাকায়):</label>
                    <input
                      type="number"
                      className="form-control"
                      name="sdv_inv"
                      value={inputs.sdv_inv || ""}
                      onChange={handleChange}
                      placeholder="একক মূল্য(টাকায়):"
                    />
                  </div>
                  <div className="col-lg">
                    <label>সম্পুরক শুল্কের হার:</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="sd_inv"
                      value={inputs.sd_inv || ""}
                      onChange={handleChange}
                      placeholder="সম্পুরক শুল্কের হার:"
                    />
                  </div>
                  <div className="col-lg">
                    <label>মূল্য সংযোজন করের হার/সুনির্দিষ্ট কর:</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      name="vat_inv"
                      value={inputs.vat_inv || ""}
                      onChange={handleChange}
                      placeholder="মূল্য সংযোজন করের হার/সুনির্দিষ্ট কর:"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label>
                      সরবরাহের একক: <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={unitSupply[0]}
                      name="unit_supply"
                      options={unitSupply}
                      onChange={selectHandleChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      পরিমাণ: <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="unit_supply_qty"
                      value={inputs.unit_supply_qty || ""}
                      onChange={handleChange}
                      placeholder="পরিমাণ:"
                      data-required
                    />
                    {displayError("unit_supply_qty")}
                  </div>
                  <div className="col-lg mt-5">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        name="mushok_6_4_show"
                        className="form-check-input"
                        checked={inputs.mushok_6_4_show || false}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        for="flexCheckChecked"
                      >
                        Mushok 6.4 Show
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

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
