import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import Select from "react-select";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({ mushok_6_4_show: true });
  const [unit, setUnit] = useState({});
  const [unitSupply, setUnitSupply] = useState([]);
  const [category, setCategory] = useState({});
  const [error, setError] = useState({});
  const [showAccountsForm, setShowAccountsForm] = useState(false);

  const [selectedUnitOption, setSelectedUnitOption] = useState(null);
  const [selectedUnitSupplyOption, setSelectedUnitSupplyOption] =
    useState(null);
  const [selectProductCatOption, setSelectProductCatOption] = useState(null);

  const fetchData = () => {
    Http.get("/product/" + id + "/edit").then((res) => {
      console.log(res.data);
      setInputs({
        code: res.data.code,
        name: res.data.name,
        unit_id: res.data.unit_id,
        price: res.data.price,
        sku: res.data.sku,
        pack_size: res.data.pack_size,
        stock: res.data.stock,
        type: res.data.type,
        category_id: res.data.category_id,
        notes: res.data.notes,
        vat: res.data.vat,
        status: res.data.status,
        std_price_accounts: res.data.std_price_accounts,
        vat_value_accounts: res.data.vat_value_accounts,
        sdv_inv: res.data.sdv_inv,
        sd_inv: res.data.sd_inv,
        vat_inv: res.data.vat_inv,
        unit_supply: res.data.unit_supply,
        unit_supply_qty: res.data.unit_supply_qty,
        mushok_6_4_show: res.data.mushok_6_4_show,
      });

      setSelectedUnitOption({
        label: res.data.unit.name,
        value: res.data.unit.id,
      });

      setSelectedUnitSupplyOption({
        label: res.data.unit_supply_id.name,
        value: res.data.unit_supply_id.id,
      });

      setSelectProductCatOption({
        label: res.data.category.name,
        value: res.data.category.id,
      });
    });

    Http.get("/unitSelect2").then((res) => {
      setUnit(res.data);
    });

    Http.get("/productCatSelect2").then((res) => {
      setCategory(res.data);
    });

    Http.get("/unitSelect2").then((res) => {
      setUnitSupply(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (inputs.type === "finished_goods") {
      setShowAccountsForm(true);
    } else {
      setShowAccountsForm(false);
    }
  }, [inputs.type]);

  const selectHandleChange = (selectedOption, actionMeta) => {
    if (actionMeta.name === "unit_id") {
      setSelectedUnitOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (actionMeta.name === "category_id") {
      setSelectProductCatOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    if (actionMeta.name === "unit_supply") {
      setSelectedUnitSupplyOption({
        label: selectedOption.label,
        value: selectedOption.value,
      });
    }

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    console.log(inputs);
    Http.put("/product/" + id, inputs)
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
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Product Form</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Product Form</h6>
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
                  defaultValue={selectedUnitOption}
                  value={selectedUnitOption}
                  onChange={selectHandleChange}
                  name="unit_id"
                  options={unit}
                />
              </div>
              <div className="col-lg">
                <label>
                  Price <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="price"
                  value={inputs.price || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
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
                <label>Pack Size</label>
                <input
                  type="text"
                  className="form-control"
                  name="pack_size"
                  value={inputs.pack_size || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Stock</label>
                <input
                  type="text"
                  className="form-control"
                  name="stock"
                  value={inputs.stock || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>
                  Type <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option
                    value="raw_materials"
                    selected={inputs.type === "raw_materials" ? true : false}
                  >
                    Raw Materials
                  </option>
                  <option
                    value="packing_materials"
                    selected={
                      inputs.type === "packing_materials" ? true : false
                    }
                  >
                    Packing Materials
                  </option>
                  <option
                    value="finished_goods"
                    selected={inputs.type === "finished_goods" ? true : false}
                  >
                    Finished Goods
                  </option>
                </select>
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
                  defaultValue={selectProductCatOption}
                  value={selectProductCatOption}
                  onChange={selectHandleChange}
                  name="category_id"
                  options={category}
                />
              </div>
              <div className="col-lg">
                <label>Vat</label>
                <input
                  type="text"
                  className="form-control"
                  name="vat"
                  value={inputs.vat || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  value={inputs.notes || ""}
                  onChange={handleChange}
                  placeholder="Notes"
                />
              </div>
              <div className="col-lg">
                <label>Status</label>
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
            {showAccountsForm && (
              <>
                <div className="row mt-5">
                  <div className="col-md-12 mb-3">
                    <h4 className="text-center">Accounts</h4>
                    <hr />
                  </div>

                  <div className="col-lg-6">
                    <label>STD For Accounts:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="std_price_accounts"
                      value={inputs.std_price_accounts || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Vat For Accounts:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vat_value_accounts"
                      value={inputs.vat_value_accounts || ""}
                      onChange={handleChange}
                    />
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
                  <div className="col-lg">
                    <label>
                      সরবরাহের একক: <i className="fa fa-star required"></i>
                    </label>
                    {/* <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={unitSupply[0]}
                      name="unit_supply"
                      options={unitSupply}
                      onChange={selectHandleChange}
                    /> */}

                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={selectedUnitSupplyOption}
                      value={selectedUnitSupplyOption}
                      onChange={selectHandleChange}
                      name="unit_supply"
                      options={unitSupply}
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
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
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

export default Edit;
