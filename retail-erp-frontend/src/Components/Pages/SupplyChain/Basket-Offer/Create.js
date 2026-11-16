import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [product, setProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedPriorityProducts, setSelectedPriorityProducts] = useState([]);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedBases, setSelectedBases] = useState([]);
  const [validationMessages, setValidationMessages] = useState({
    work_place_zone_id: "",
    work_place_region_id: "",
    work_place_area_id: "",
    work_place_base_id: "",
  });

  const [templates, setTemplates] = useState([
    { name: "", value: "", offerName: [], offer_key: "", offer_value: "" }
  ]);
  const [bottomOption, setBottomOption] = useState({
    offer_key: "",
    offer_value: ""
  });
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const selectHandleProduct = (selectedOptions) => {
    const selected = selectedOptions || [];
    setSelectedProducts(selected);
    setInputs((values) => ({
      ...values,
      excluded_product_ids: selected.map((item) => item.value),
    }));
  };

  const selectHandlePriorityProduct = (selectedOptions) => {
    const selected = selectedOptions || [];
    setSelectedPriorityProducts(selected);
    setInputs((values) => ({
      ...values,
      priority_product_ids: selected.map((item) => item.value),
    }));
  };

  const fetchData = async () => {
    Http.get("/productSelect2").then((res) => {
      setProduct(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getExcludedProductOptions = () => {
    if (!product) return [];
    const priorityIds = selectedPriorityProducts.map((item) => item.value);
    return product.filter((item) => !priorityIds.includes(item.value));
  };

  const getPriorityProductOptions = () => {
    if (!product) return [];
    const excludedIds = selectedProducts.map((item) => item.value);
    return product.filter((item) => !excludedIds.includes(item.value));
  };

  const toggleChange = (e) => {
    const name = e.target.name;
    const value = !e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    const formData = { ...inputs };
    formData.templates = templates;
    formData.global_offer = bottomOption;

    const mergedProducts = [
      ...selectedProducts.map((item) => ({
        product_id: item.value,
        type: "exclude"
      })),
      ...selectedPriorityProducts.map((item) => ({
        product_id: item.value,
        type: "priority"
      }))
    ];
    formData.products = mergedProducts;

    delete formData.excluded_product_ids;
    delete formData.priority_product_ids;

    const newErrors = {};
    
    templates.forEach((item, index) => {
      if (!item.name || item.name.trim() === "") {
        newErrors[`template_name_${index}`] = "Name is required";
      }
      if (!item.value || item.value.trim() === "") {
        newErrors[`template_value_${index}`] = "Value is required";
      }
      (item.offerName || []).forEach((subName, subIndex) => {
        if (!subName || subName.trim() === "") {
          newErrors[`template_sub_name_${index}_${subIndex}`] =
            "Name is required";
        }
      });
    });


    const requiredFields = document.querySelectorAll("[data-required]");
    requiredFields.forEach((field) => {
      const fieldName = field.getAttribute("name");
      if (!fieldName) return;
      if (!field.value || field.value.toString().trim() === "") {
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = "This field is required";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setError((prev) => ({ ...prev, ...newErrors }));
      return;
    }
    if (checkRequiredFields()) {
      Http.post("/retailer/basket/store", formData)
        .then((res) => {
          navigate("/basket-offer", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };
  // Default Load
  const fetchData2 = () => {
    Http.get("/select2/Hr.WorkPlaceZone/id,name").then((res) => {
      setZone(res.data);
    });

  };
  useEffect(() => {
    fetchData2(); 
  }, []);
  const selectHandleChange = (selectedOptions, actionMeta) => {
    const name = actionMeta.name;
    const selected = selectedOptions || [];
    const values = selected.map((item) => item.value);
    
    setInputs((prev) => ({ ...prev, [name]: values }));
    
    if (name === "work_place_zone_id") {
      setSelectedZones(selected);
      if (values.length > 0) {
        Promise.all(
          values.map((zoneId) =>
            Http.get(
              "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + zoneId
            )
          )
        ).then((responses) => {
          const allRegions = [];
          const seenIds = new Set();
          
          responses.forEach((res) => {
            if (res.data && Array.isArray(res.data)) {
              res.data.forEach((item) => {
                if (!seenIds.has(item.value)) {
                  seenIds.add(item.value);
                  allRegions.push(item);
                }
              });
            }
          });
          
          setRegion(allRegions);
        });
      } else {
        setRegion({});
        setSelectedRegions([]);
        setArea({});
        setSelectedAreas([]);
        setBase({});
        setSelectedBases([]);
      }
    }
    
    if (name === "work_place_region_id") {
      setSelectedRegions(selected);
      if (values.length > 0) {
        // Fetch areas for each selected region and merge results
        Promise.all(
          values.map((regionId) =>
            Http.get(
              "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + regionId
            )
          )
        ).then((responses) => {
          const allAreas = [];
          const seenIds = new Set();
          
          responses.forEach((res) => {
            if (res.data && Array.isArray(res.data)) {
              res.data.forEach((item) => {
                if (!seenIds.has(item.value)) {
                  seenIds.add(item.value);
                  allAreas.push(item);
                }
              });
            }
          });
          
          setArea(allAreas);
        });
      } else {
        setArea({});
        setSelectedAreas([]);
        setBase({});
        setSelectedBases([]);
      }
    }
    
    if (name === "work_place_area_id") {
      setSelectedAreas(selected);
      if (values.length > 0) {
        // Fetch bases for each selected area and merge results
        Promise.all(
          values.map((areaId) =>
            Http.get(
              "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + areaId
            )
          )
        ).then((responses) => {
          const allBases = [];
          const seenIds = new Set();
          
          responses.forEach((res) => {
            if (res.data && Array.isArray(res.data)) {
              res.data.forEach((item) => {
                if (!seenIds.has(item.value)) {
                  seenIds.add(item.value);
                  allBases.push(item);
                }
              });
            }
          });
          
          setBase(allBases);
        });
      } else {
        setBase({});
        setSelectedBases([]);
      }
    }
    
    if (name === "work_place_base_id") {
      setSelectedBases(selected);
    }
  };  
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Basket Offer</h5>
        </div>
        <div className="am-pagebody">
          {/* campaign form  */}
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Basket Offer Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Title <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={inputs.title || ""}
                  onChange={handleChange}
                  placeholder="Title"
                  data-required
                />
                {displayError("title")}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Circular Number <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="circular_number"
                  value={inputs.circular_number || ""}
                  onChange={handleChange}
                  placeholder="Circular Number"
                  data-required
                />
                {displayError("circular_number")}
              </div>
              <div className="col-lg">
                <label>
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={inputs.description || ""}
                  onChange={handleChange}
                  placeholder="Description"
                />
                {displayError("description")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Zone
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_zone_id"
                  options={zone}
                  value={selectedZones}
                  isMulti={true}
                  onChange={selectHandleChange}
                />
                {validationMessages.work_place_zone_id && (
                  <div className="error-message">
                    {validationMessages.work_place_zone_id}
                  </div>
                )}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Region
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_region_id"
                  options={region}
                  value={selectedRegions}
                  isMulti={true}
                  onChange={selectHandleChange}
                />
                {validationMessages.work_place_region_id && (
                  <div className="error-message">
                    {validationMessages.work_place_region_id}
                  </div>
                )}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Select Area
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_area_id"
                  options={area}
                  value={selectedAreas}
                  isMulti={true}
                  onChange={selectHandleChange}
                />
                {validationMessages.work_place_area_id && (
                  <div className="error-message">
                    {validationMessages.work_place_area_id}
                  </div>
                )}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Select Base
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_base_id"
                  options={base}
                  value={selectedBases}
                  isMulti={true}
                  onChange={selectHandleChange}
                />
                {validationMessages.work_place_base_id && (
                  <div className="error-message">
                    {validationMessages.work_place_base_id}
                  </div>
                )}
              </div>
            </div>

            <div className="row mt-3">


              <div className="col-lg-3">
                <label>
                  Start Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={inputs.start_date || ""}
                  onChange={handleChange}
                  placeholder="Start Date"
                  data-required
                />
                {displayError("start_date")}
              </div>
              <div className="col-lg-3">
                <label>
                  End Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={inputs.end_date || ""}
                  onChange={handleChange}
                  placeholder="End Date"
                  data-required
                />
                {displayError("end_date")}
              </div>
              <div className="col-lg mt-5"></div>
            </div>
          </div>
          {/* template form  */}

          <div className="card pd-20 pd-sm-40">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-body-title mg-sm-b-30">
                Create Basket Template Form
              </h6>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={() =>
                  setTemplates((prev) => [
                    ...prev,
                    { name: "", value: "", offerName: [], offer_key: "", offer_value: "" }
                  ])
                }
              >
                <i className="fa fa-plus-square mg-r-6"></i>Add New
              </button>
            </div>
            {templates.map((row, index) => (
              <>
              <div className="row mt-3" key={`template-${index}`}>
                <div className="col-lg">
                  <label>
                    Name <i className="fa fa-star required"></i>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name={`template_name_${index}`}
                    value={row.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTemplates((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, name: value } : item
                        )
                      );
                    }}
                    placeholder="ex:800 taka"
                    data-required
                  />
                  {displayError(`template_name_${index}`)}
                  {row.offerName && row.offerName.length > 0 && (
                    <div className="mt-2 pl-3">
                      {row.offerName.map((subName, subIndex) => (
                        <div
                          key={`template-${index}-sub-${subIndex}`}
                          className="d-flex align-items-center mt-2"
                        >
                          <div className="col-lg-10">
                            <input
                              type="text"
                              className="form-control"
                              name={`template_sub_name_${index}_${subIndex}`}
                              value={subName}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTemplates((prev) =>
                                  prev.map((item, idx) => {
                                    if (idx !== index) return item;
                                    const nextSubNames = [
                                      ...(item.offerName || [])
                                    ];
                                    nextSubNames[subIndex] = value;
                                    return { ...item, offerName: nextSubNames };
                                  })
                                );
                              }}
                              placeholder={`Offer ${subIndex + 1}`}
                            />
                            {displayError(
                              `template_sub_name_${index}_${subIndex}`
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger ml-2"
                            onClick={() =>
                              setTemplates((prev) =>
                                prev.map((item, idx) => {
                                  if (idx !== index) return item;
                                  const nextSubNames = [
                                    ...(item.offerName || [])
                                  ];
                                  nextSubNames.splice(subIndex, 1);
                                  return { ...item, offerName: nextSubNames };
                                })
                              )
                            }
                            title="Remove"
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col-lg">
                  <label>
                    Value <i className="fa fa-star required"></i>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name={`template_value_${index}`}
                    value={row.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTemplates((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? { ...item, value } : item
                        )
                      );
                    }}
                    placeholder="800"
                    data-required
                  />
                  {displayError(`template_value_${index}`)}
                </div>
                <div className="col-lg-1 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() =>
                      setTemplates((prev) =>
                        prev.map((item, idx) => {
                          if (idx !== index) return item;
                          const nextSubNames = [...(item.offerName || [])];
                          nextSubNames.push("");
                          return { ...item, offerName: nextSubNames };
                        })
                      )
                    }
                    title="Add new row"
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger ml-2"
                    onClick={() =>
                      setTemplates((prev) => {
                        if (prev.length <= 1) return prev;
                        const next = [...prev];
                        next.splice(index, 1);
                        return next;
                      })
                    }
                    title="Remove"
                    disabled={templates.length <= 1}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="row mt-2" key={`template-radio-${index}`}>
                <div className="col-lg">
                  <label>
                    Option
                  </label>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="form-check mr-4">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`radio_option1_${index}`}
                        name={`template_radio_${index}`}
                        value="fixed_amount"
                        checked={row.offer_key === "fixed_amount"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTemplates((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, offer_key: value } : item
                            )
                          );
                        }}
                      />
                      <label className="" htmlFor={`radio_option1_${index}`}>
                        fixed amount  
                      </label>
                    </div>
                    <div className="form-check mr-4">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`radio_option2_${index}`}
                        name={`template_radio_${index}`}
                        value="percentage"
                        checked={row.offer_key === "percentage"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTemplates((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, offer_key: value } : item
                            )
                          );
                        }}
                      />
                      <label className="" htmlFor={`radio_option2_${index}`}>
                        percentage
                      </label>
                    </div>
                    <div className="form-check mr-4">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`radio_option3_${index}`}
                        name={`template_radio_${index}`}
                        value="free_product"
                        checked={row.offer_key === "free_product"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTemplates((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, offer_key: value } : item
                            )
                          );
                        }}
                      />
                      <label className="" htmlFor={`radio_option3_${index}`}>
                        free product
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id={`radio_option4_${index}`}
                        name={`template_radio_${index}`}
                        value="coupon_gift"
                        checked={row.offer_key === "coupon_gift"}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTemplates((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, offer_key: value } : item
                            )
                          );
                        }}
                      />
                      <label className="" htmlFor={`radio_option4_${index}`}>
                        coupon/gift
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {row.offer_key && row.offer_key !== "coupon_gift" && (
                <div className="row mt-2" key={`template-offer-value-${index}`}>
                  <div className="col-lg">
                    <label>Offer Value</label>
                    {row.offer_key === "free_product" ? (
                      <Select
                        classNamePrefix="select"
                        className="select"
                        name={`offer_value_${index}`}
                        options={product}
                        value={
                          row.offer_value
                            ? product.find((p) => p.value.toString() === row.offer_value.toString())
                            : null
                        }
                        isMulti={false}
                        onChange={(selectedOption) => {
                          const selected = selectedOption || null;
                          const id = selected ? selected.value : "";
                          setTemplates((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, offer_value: id } : item
                            )
                          );
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter offer value"
                        value={row.offer_value}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTemplates((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, offer_value: value } : item
                            )
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
              </>
            ))}
          </div>
          {/* exclude include products  */}
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Add Priority And Excluded Product
            </h6>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Excluded Product
                </label>
                <Select
                  classNamePrefix="select"
                  className="select"
                  name="excluded_product_ids"
                  options={getExcludedProductOptions()}
                  value={selectedProducts}
                  isMulti={true}
                  onChange={selectHandleProduct}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Priority Product
                </label>
                <Select
                  classNamePrefix="select"
                  className="select"
                  name="priority_product_ids"
                  options={getPriorityProductOptions()}
                  value={selectedPriorityProducts}
                  isMulti={true}
                  onChange={selectHandlePriorityProduct}
                />
              </div>
            </div>
          </div>

          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Offer Options
            </h6>
            <div className="row mt-2">
              <div className="col-lg">
                <label>
                  Option
                </label>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="form-check mr-4">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="bottom_radio_option1"
                      name="bottom_template_radio"
                      value="fixed_amount"
                      checked={bottomOption.offer_key === "fixed_amount"}
                      onChange={(e) => {
                        setBottomOption({ ...bottomOption, offer_key: e.target.value, offer_value: "" });
                      }}
                    />
                    <label className="" htmlFor="bottom_radio_option1">
                      fixed amount
                    </label>
                  </div>
                  <div className="form-check mr-4">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="bottom_radio_option2"
                      name="bottom_template_radio"
                      value="percentage"
                      checked={bottomOption.offer_key === "percentage"}
                      onChange={(e) => {
                        setBottomOption({ ...bottomOption, offer_key: e.target.value, offer_value: "" });
                      }}
                    />
                    <label className="" htmlFor="bottom_radio_option2">
                      percentage
                    </label>
                  </div>
                  <div className="form-check mr-4">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="bottom_radio_option3"
                      name="bottom_template_radio"
                      value="free_product"
                      checked={bottomOption.offer_key === "free_product"}
                      onChange={(e) => {
                        setBottomOption({ ...bottomOption, offer_key: e.target.value, offer_value: "" });
                      }}
                    />
                    <label className="" htmlFor="bottom_radio_option3">
                      free product
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="bottom_radio_option4"
                      name="bottom_template_radio"
                      value="coupon_gift"
                      checked={bottomOption.offer_key === "coupon_gift"}
                      onChange={(e) => {
                        setBottomOption({ ...bottomOption, offer_key: e.target.value, offer_value: "" });
                      }}
                    />
                    <label className="" htmlFor="bottom_radio_option4">
                      coupon/gift
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {bottomOption.offer_key && bottomOption.offer_key !== "coupon_gift" && (
              <div className="row mt-2">
                <div className="col-lg">
                  <label>Offer Value</label>
                  {bottomOption.offer_key === "free_product" ? (
                    <Select
                      classNamePrefix="select"
                      className="select"
                      name="bottom_offer_value"
                      options={product}
                      value={
                        bottomOption.offer_value
                          ? product.find((p) => p.value.toString() === bottomOption.offer_value.toString())
                          : null
                      }
                      isMulti={false}
                      onChange={(selectedOption) => {
                        const selected = selectedOption || null;
                        const id = selected ? selected.value : "";
                        setBottomOption({ ...bottomOption, offer_value: id });
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter offer value"
                      value={bottomOption.offer_value}
                      onChange={(e) => {
                        setBottomOption({ ...bottomOption, offer_value: e.target.value });
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

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

      </div>


    </div>
  );
};

export default Create;