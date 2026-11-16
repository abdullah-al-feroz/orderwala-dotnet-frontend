import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const DistributorStockEdit = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [inputs, setInputs] = useState([]); // initialized type from useParams
  const [unit, setUnit] = useState([]);
  const [selectedUnit, setselectedUnit] = useState([]);
  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [unitSupply, setUnitSupply] = useState([]);
  const [selectedUnitSupply, setSelectedUnitSupply] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
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
  const [selectProductCatOption, setSelectProductCatOption] = useState(null);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (name == "unit_id") {
      setselectedUnit({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name == "brand_id") {
      setSelectedBrand({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name == "category_id") {
      setSelectedCategory({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name == "company_id") {
      setSelectedCompany({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    } else if (name == "unit_supply") {
      setSelectedUnitSupply({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }
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

  // Default Load
  const fetchData = async () => {
    Http.get("/product/" + id + "/edit").then((res) => {
      setInputs({
        code: res.data.code,
        name_en: res.data.name_en,
        name: res.data.name,
        unit_id: res.data.unit_id,
        brand_id: res.data.brand_id,
        category_id: res.data.category_id,
        company_id: res.data.vendor_id,
        purchase_price: res.data.purchase_price,
        primary_price: res.data.primary_price,
        secondary_price: res.data.secondary_price,
        mrp: res.data.mrp,
        sku: res.data.sku,
        pack_size: res.data.pack_size,
        commission_rate: res.data.commission_rate,
        weight: res.data.weight,
        height: res.data.height,
        width: res.data.width,
        length: res.data.length,
        description_en: res.data.description_en,
        description: res.data.description,
        created_by: res.data.created_by,
        updated_by: res.data.updated_by,
        sdv_inv: res.data.sdv_inv,
        sd_inv: res.data.sd_inv,
        vat_inv: res.data.vat_inv,
        unit_supply: res.data.unit_supply,
        unit_supply_qty: res.data.unit_supply_qty,
        mushok_6_4_show: res.data.mushok_6_4_show,
        status: res.data.status,
      });

      setselectedUnit({
        label: res.data.unit.name,
        value: res.data.unit.id,
      });
      setSelectedBrand({
        label: res.data.brand.name,
        value: res.data.brand.id,
      });
      setSelectedCategory({
        label: res.data.category.name,
        value: res.data.category.id,
      });
      setSelectedCompany({
        label: res.data.company.name,
        value: res.data.company.id,
      });
      setSelectedUnitSupply({
        label: res.data.unit_supplys.name,
        value: res.data.unit_supplys.id,
      });

      let tag = [];
      Object.keys(res.data.tags).forEach((key) => {
        tag.push({
          label: res.data.tags[key].name,
          value: res.data.tags[key].id,
        });
      });
      setSelectedTag(tag);

      Http.get(
        "/select2/SupplyChainPurchaseManagement.Setting.Brand/id,name/vendor_id:" +
          res.data.vendor_id
      ).then((res) => {
        setBrand(res.data);
      });
    });
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
    // Http.get(
    //   "/select2/SupplyChainPurchaseManagement.Setting.Brand/id,name"
    // ).then((res) => {
    //   setBrand(res.data);
    // });
    Http.get(
      "/select2/SupplyChainPurchaseManagement.ProductCategory/id,name"
    ).then((res) => {
      setCategory(res.data);
    });
    const unitData = await Http.get("/unitSelect2");
    // const categoryData = await Http.get("/productCatSelect2");
    // const codeData = await Http.get(
    //   "/last-code-increment-by-one/products/code/P"
    // );

    setUnit(unitData.data);
    setUnitSupply(unitData.data);
    // setCategory(categoryData.data);
    // setInputs((prevInputs) => ({
    //   ...prevInputs,
    //   code: codeData.data,
    // }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*const formSubmit = () => {
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

    // setInputs((prevInputs) => ({ ...prevInputs, type: type }));
    // inputs.tag = selectedTag;

    inputs.tag = JSON.stringify(selectedTag);

    Http.put("/product/" + id, inputs, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        navigate("/product", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };*/

  const formSubmit = () => {
    const formData = new FormData();

    // Append all text inputs to the formData
    Object.keys(inputs).forEach((key) => {
      formData.append(key, inputs[key]);
    });

    // Append the file to formData
    if (selectedFile) {
      formData.append("thumb_image", selectedFile, selectedFile.name);
    }
    if (selectedFile1) {
      formData.append("image_1", selectedFile1, selectedFile1.name);
      inputs.image_1 = selectedFile1;
    }
    if (selectedFile2) {
      formData.append("image_2", selectedFile2, selectedFile2.name);
      inputs.image_2 = selectedFile2;
    }
    if (selectedFile3) {
      formData.append("image_3", selectedFile3, selectedFile3.name);
      inputs.image_3 = selectedFile3;
    }

    // setInputs((prevInputs) => ({ ...prevInputs, type: type }));
    // inputs.tag = selectedTag;

    // inputs.tag = JSON.stringify(selectedTag);
    formData.append("tag", JSON.stringify(selectedTag));

    // Send the request with formData
    // Using POST request with '_method' set to 'PUT' as a workaround for PUT with FormData
    formData.append("_method", "PUT");

    Http.post("/product/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        navigate("/product", {
          state: { message: res.data.message, type: res.data.type },
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
                />
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
                />
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
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Unit <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedUnit}
                  value={selectedUnit}
                  onChange={selectHandleChange}
                  name="unit_id"
                  options={unit}
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
                  defaultValue={selectedCategory}
                  value={selectedCategory}
                  onChange={selectHandleChange}
                  name="category_id"
                  options={category}
                />
              </div>

              <div className="col-lg">
                <label htmlFor="">
                  Company <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedCompany}
                  value={selectedCompany}
                  onChange={selectHandleChange}
                  name="company_id"
                  options={company}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Brand <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedBrand}
                  value={selectedBrand}
                  onChange={selectHandleChange}
                  name="brand_id"
                  options={brand}
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
                />
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
                />
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
                />
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
                />
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
                />
              </div>
              <div className="col-lg">
                <label>Weight</label>
                <input
                  type="text"
                  className="form-control"
                  name="weight"
                  value={inputs.weight || ""}
                  onChange={handleChange}
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
                  type="text"
                  className="form-control"
                  name="pack_size"
                  value={inputs.pack_size || ""}
                  onChange={handleChange}
                />
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
                />
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
                <label>Thumb Image</label>
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
            </div>
            <div className="row mt-3">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">TAG</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  value={selectedTag} // Set the selected value here
                  name="tag"
                  options={tag}
                  text="Please select tags."
                  isMulti="yes"
                  onChange={selectHandleTag}
                  {...(isRequired && {
                    styles: {
                      control: (tag, { menuIsOpen, hasValue }) => {
                        const borderColor = hasValue
                          ? "#ccc"
                          : menuIsOpen
                          ? "#ccc"
                          : "red";
                        return { ...tag, borderColor };
                      },
                    },
                  })}
                />
              </div>
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

            <div className="row mt-3">
              <div class="col-md-12 mt-5">
                <h4 class="text-center">চালান</h4>
                <hr />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>একক মূল্য(টাকায়):</label>
                <input
                  type="text"
                  className="form-control"
                  name="sdv_inv"
                  value={inputs.sdv_inv || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>সম্পুরক শুল্কের হার:</label>
                <input
                  type="text"
                  className="form-control"
                  name="sd_inv"
                  value={inputs.sd_inv || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>মূল্য সংযোজন করের হার/সুনির্দিষ্ট কর:</label>
                <input
                  type="text"
                  className="form-control"
                  name="vat_inv"
                  value={inputs.vat_inv || ""}
                  onChange={handleChange}
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
                  defaultValue={selectedUnitSupply}
                  value={selectedUnitSupply}
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
                  type="text"
                  className="form-control"
                  name="unit_supply_qty"
                  value={inputs.unit_supply_qty || ""}
                  onChange={handleChange}
                />
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
                  <label className="form-check-label" for="flexCheckChecked">
                    Mushok 6.4 Show
                  </label>
                </div>
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

export default DistributorStockEdit;
