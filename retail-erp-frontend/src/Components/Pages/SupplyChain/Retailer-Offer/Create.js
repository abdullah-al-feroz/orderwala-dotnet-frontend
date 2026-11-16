import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import { el } from "date-fns/locale";

const Create = () => {
  const navigate = useNavigate();
  const { checkRequiredFields } = useRequiredFields();
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [rateOrQty, setRateOrQty] = useState("");
  const [offerExists, setOfferExists] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [outSideCompany, setOutSideCompany] = useState([]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleRateOrQtyChange = (e) => {
    setRateOrQty(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
  };
  const [inputs, setInputs] = useState({
    start_date: getTodayDate(), // Set default date
    end_date: getTodayDate(), // Set default date
    items: [], // Initialize items as an empty array
  });
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [category, setCategory] = useState({});
  const [list, setList] = useState([
    {
      product_id: "",
      price: "",
      up_to_amount: "",
      qty: "",
      invoiceAvailable: false,
      invoices: [],
    },
  ]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [route, setRoute] = useState([]);
  const [distributor, setDistributor] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [offer, setOffer] = useState([]);
  const [offerMsg, setOfferMsg] = useState(null);
  const [invoice, setInvoice] = useState([]);
  const [allBases, setAllBases] = useState([]);
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRateOrQty("rate");

    setInputs((values) => {
      const updatedInputs = { ...values, [name]: value };
      if (name != "title" && name != "description") {
        offerCheck({ ...updatedInputs, items: list });
      }
      return updatedInputs;
    });

    if (value == "registration") {
      Http.get("/select2/Hr.WorkPlaceBase/id,name").then((res) => {
        setAllBases(res.data);
      });
    }
  };
  const toggleChange = (e) => {
    const name = e.target.name; // Chanages Input Name
    const value = !e.target.value; // Changes Input Value
    setInputs((values) => ({ ...values, [name]: value })); // Set Input With Value and Name in State
  };

  const selectWorkplaceChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;

    setInputs((values) => {
      const updatedInputs = { ...values, [name]: value };
      offerCheck({ ...updatedInputs, items: list });
      return updatedInputs;
    });

    if (name == "region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => {
        setArea(res.data);
        setBase(null);
        setRoute(null);
      });
    }
    if (name == "area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
      ).then((res) => {
        setBase(res.data);
        setRoute(res.data);
      });
    }
    if (name == "base_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRoute/id,name/work_place_base_id:" + value
      ).then((res) => {
        setRoute(res.data);
      });
    }

    if (name == "region_id" || name == "area_id" || name == "base_id") {
      Http.post("/distributor-based-on-workplace", inputs)
        .then((res) => {
          setDistributor(res.data);
        })
        .catch((e) => {
          setError(e.response.data.errors);
        });
    }
  };

  const fetchProductDetails = async (productId, index, callback) => {
    try {
      const response = await Http.get(`/product/${productId}`);
      const productDetails = response.data;

      // Determine if invoice is available for this product
      const invoiceResponse = await Http.get(
        `/invoice-no-available-distributor-id-and-product-id-wise/${productId}/${inputs.distributor_id}`
      );
      const invoiceAvailable = invoiceResponse.data.list.length > 0;

      setList((currentList) => {
        const updatedList = currentList.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              product_id: productId,
              price: productDetails.price,
              invoiceAvailable: invoiceAvailable,
              invoices: invoiceResponse.data.list,
            };
          }
          return item;
        });
        return updatedList;
      });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const selectHandleChange = (selectedOption, actionMeta, index) => {
    // const productId = selectedOption.value;
    // fetchProductDetails(productId, index, () => {
    //   offerCheck({ ...inputs, items: list });
    // });

    const selectedId = selectedOption.value;

    if (
      inputs.offer_type === "category_percentage_offer" ||
      inputs.offer_type ===
        "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer"
    ) {
      console.log(selectedOption, "selectedOption");
      console.log(actionMeta, "actionMeta");

      setList((currentList) => {
        const updatedList = currentList.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              category_id: selectedId, // ✅ Use category_id here
            };
          }
          return item;
        });
        return updatedList;
      });
    } else {
      fetchProductDetails(selectedId, index, () => {
        offerCheck({ ...inputs, items: list });
      });
    }
  };

  const selectHandleTradeOfferChange = (selectedOption, actionMeta, index) => {
    const value = selectedOption.value;
    const inputInfo = [...list];
    inputInfo[index]["trade_offer_product_id"] = value;
    setList(inputInfo);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const inputInfo = [...list];
    inputInfo[index][name] = value;
    setList(inputInfo);

    offerCheck({ ...inputs, items: inputInfo });
  };
  const handleInvoiceChange = (selectedValues, index) => {
    // Update the 'list' state
    setList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index].invoice = selectedValues; // Update the invoice field with selected values
      return updatedList;
    });

    // Ensure that 'inputs.items' is properly initialized
    setInputs((prevInputs) => {
      const updatedItems = prevInputs.items ? [...prevInputs.items] : [];

      // Initialize the item at the current index if undefined
      if (!updatedItems[index]) {
        updatedItems[index] = { invoice: [] };
      }

      updatedItems[index].invoice = selectedValues; // Set the selected values for invoices in the correct index
      return { ...prevInputs, items: updatedItems };
    });
  };

  const selectVendorChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;

    setInputs((values) => {
      const updatedInputs = { ...values, [name]: value };
      offerCheck(updatedInputs);
      return updatedInputs;
    });
  };

  const fetchData = async () => {
    try {
      const userResponse = await Http.get("/me");
      setOutSideCompany(userResponse.data);

      // const res = await Http.get("/productSelect2");
      // setProduct(res.data);

      Http.get(
        "/select2/SupplyChainPurchaseManagement.ProductCategory/id,name"
      ).then((res) => {
        setCategory(res.data);
      });

      Http.get("/select2/Hr.WorkPlaceRegion/id,name").then((res) => {
        setRegion(res.data);
      });
      if (userResponse.data?.data?.user_type === "other-company") {
        Http.get(
          "/select2/SaleDistribution.Distributor/id,name/vendor_id:" +
            userResponse.data?.data?.id
        ).then((res) => {
          setDistributor(res.data);
        });

        const resProd = await Http.get(
          "/select2/SupplyChainPurchaseManagement.Product/id,name/vendor_id:" +
            userResponse.data?.data?.id
        );
        setProduct(resProd.data);
      } else {
        Http.get("/select2/SaleDistribution.Distributor/id,name").then(
          (res) => {
            setDistributor(res.data);
          }
        );
        const resProd = await Http.get(
          "/select2/SupplyChainPurchaseManagement.Product/id,name"
        );
        setProduct(resProd.data);
      }

      Http.get("/select2/SupplyChainPurchaseManagement.Vendor/id,name").then(
        (res) => {
          setVendor(res.data);
        }
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      inputs.offer_type === "category_percentage_offer" ||
      inputs.offer_type ===
        "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer"
    ) {
      setList([
        {
          category_id: "",
          price: "",
          up_to_amount: "",
          qty: "",
          invoiceAvailable: false,
          invoices: [],
        },
      ]);
    } else {
      setList([
        {
          product_id: "",
          price: "",
          up_to_amount: "",
          qty: "",
          invoiceAvailable: false,
          invoices: [],
        },
      ]);
    }
  }, [inputs.offer_type]);

  const addMoreList = () => {
    if (
      inputs.offer_type === "category_percentage_offer" ||
      inputs.offer_type ===
        "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer"
    ) {
      setList([
        ...list,
        {
          category_id: "",
          price: "",
          up_to_amount: "",
          qty: "",
          invoiceAvailable: false,
          invoices: [],
        },
      ]);
    } else {
      setList([
        ...list,
        {
          product_id: "",
          price: "",
          up_to_amount: "",
          qty: "",
          invoiceAvailable: false,
          invoices: [],
        },
      ]);
    }
  };

  const removeList = (index) => {
    const inputInfo = [...list];
    inputInfo.splice(index, 1);
    setList(inputInfo);
  };

  function offerCheck(updatedInputs) {
    updatedInputs.rate_or_qty = rateOrQty;
    Http.post("/retailer-offer-used-check", updatedInputs)
      .then((res) => {
        if (res.data.offerExists) {
          setOfferMsg(res.data.message);
          setOfferExists(true);
        } else {
          setOfferMsg(null);
          setOfferExists(false);
        }
      })
      .catch((e) => {
        setError(e.response.data.errors);
      });
  }

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const formData = new FormData();

      let validItems = [];

      if (
        inputs.offer_type === "category_percentage_offer" ||
        inputs.offer_type ===
          "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer"
      ) {
        validItems = list.filter((item) => item.category_id);
      } else {
        validItems = list.filter((item) => item.product_id);
      }

      // Append all other input fields to formData
      Object.keys(inputs).forEach((key) => {
        if (key === "items") {
          if (validItems.length > 0) {
            formData.append(key, JSON.stringify(validItems)); // Append valid items as a JSON string
          }
        } else if (key === "selected_products") {
          // Only append the array version of selected_products
          formData.append(key, JSON.stringify(inputs.selected_products));
        } else {
          formData.append(key, inputs[key]);
        }
      });

      // Append selected file if it exists
      if (selectedFile) {
        formData.append("thumb_image", selectedFile);
      }

      console.log("Form Data Entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      Http.post("/retailer-offer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          navigate("/retailer-offer", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch((e) => {
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
          <h5 className="am-title">Create Retailer Offer</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row mt-3">
              {outSideCompany?.data?.user_type !== "other-company" && (
                <>
                  <div className="col-lg">
                    <label htmlFor="">Region</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="region_id"
                      options={region}
                      onChange={selectWorkplaceChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Area</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="area_id"
                      options={area}
                      onChange={selectWorkplaceChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="">Base</label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="base_id"
                      options={base}
                      onChange={selectWorkplaceChange}
                    />
                  </div>
                </>
              )}
              <div className="col-lg">
                <label htmlFor="">Distributor</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="distributor_id"
                  options={distributor}
                  onChange={selectWorkplaceChange}
                />
              </div>
              {/* <div className="col-lg">
                <label htmlFor="">Company</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="vendor_id"
                  options={vendor}
                  onChange={selectVendorChange}
                />
              </div> */}
              <div className="col-lg">
                <label htmlFor="">Company</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="vendor_id"
                  options={
                    outSideCompany?.data?.user_type === "other-company"
                      ? vendor.filter((v) => v.value === outSideCompany.data.id)
                      : vendor
                  }
                  onChange={selectVendorChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">
                  Circular Number <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="circular_number"
                  defaultValue={inputs.circular_number || ""}
                  onChange={handleChange}
                  placeholder="Circular Number"
                  data-required
                />
                {displayError("circular_number")}
              </div>
              <div className="col-lg">
                <label>
                  Offer Type <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="offer_type"
                  value={inputs.offer_type || ""}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange(e); // Update the `offer_type` as usual

                    // Automatically set or reset `discount_type` based on `offer_type`
                    if (
                      value ===
                        "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer" ||
                      value ===
                        "multiple_product_wise_fixed_amount_purchase_offer"
                    ) {
                      setInputs((prevInputs) => ({
                        ...prevInputs,
                        discount_type: "fixed",
                      }));
                    } else if (value === "category_percentage_offer") {
                      setInputs((prevInputs) => ({
                        ...prevInputs,
                        discount_type: "percentage",
                      }));
                    } else if (value === "minimum_purchase_product_free") {
                      setInputs((prevInputs) => ({
                        ...prevInputs,
                        discount_type: "fixed",
                      }));
                    } else {
                      setInputs((prevInputs) => ({
                        ...prevInputs,
                        discount_type: "",
                      }));
                    }
                  }}
                >
                  <option value="">Select Offer Type</option>
                  {outSideCompany?.data?.user_type !== "other-company" && (
                    <option value="registration">Registration</option>
                  )}
                  <option value="discount">Discount By Product</option>
                  <option value="basket">Basket</option>
                  <option value="coupon">Coupon</option>
                  <option value="one_percent">(%)Percentage Offer</option>
                  <option value="product_percent_offer">
                    (%)Percentage Offer Product Wise
                  </option>
                  <option value="conditional_perentage_offer">
                    (%)Conditional Percentage Offer
                  </option>
                  <option value="category_percentage_offer">
                    Category Wise (%) Percentage Offer
                  </option>
                  <option value="fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer">
                    Category Wise Fixed Amount Offer
                  </option>
                  <option value="multiple_product_wise_fixed_amount_purchase_offer">
                    Product Wise Fixed Amount Offer
                  </option>
                  <option value="minimum_purchase_multi_product_discount">
                    Minimum Purchase Multi-Product Discount(Ex: 1700Tk Purchase
                    from any selected 5 products user will get 3% discount on
                    that particular product total price)
                  </option>
                  <option value="minimum_purchase_product_free">
                    Minimum purchase product free
                  </option>
                </select>
              </div>
              <div className="col-lg">
                <label>
                  Discount Type<i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="discount_type"
                  value={inputs.discount_type || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Discount Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div className="col-lg">
                <label>
                  Title <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={inputs.title || ""}
                  onChange={handleChange}
                  data-required
                  placeholder="Title"
                />
                {displayError("title")}
              </div>
              <div className="col-lg mt-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="stock_wise_offer"
                    value={inputs.stock_wise_offer || ""}
                    onChange={toggleChange}
                    id="stock_wise_offer"
                  />
                  <label className="form-check-label" for="stock_wise_offer">
                    Stock Wise Offer
                  </label>
                  {displayError("stock_wise_offer")}
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="available_for_mdo"
                    value={inputs.available_for_mdo || ""}
                    onChange={toggleChange}
                    id="available_for_mdo"
                  />
                  <label className="form-check-label" for="available_for_mdo">
                    Available for MDO
                  </label>
                  {displayError("available_for_mdo")}
                </div>
              </div>
              {inputs.offer_type === "basket" ? (
                <>
                  <div className="col-lg">
                    <label>
                      Offer Image <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={inputs.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={inputs.end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={inputs.description || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            {inputs.offer_type === "basket" ? (
              <>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label>
                      Primary Price <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="primary_price"
                      value={inputs.primary_price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      Secondary Price <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="secondary_price"
                      value={inputs.secondary_price}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      MRP <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="mrp"
                      value={inputs.mrp}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className="row mt-4">
              {inputs.offer_type === "coupon" && (
                <div className="col-lg">
                  <label>Coupon Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="coupon_code"
                    value={inputs.coupon_code || ""}
                    onChange={handleChange}
                  />
                </div>
              )}
              {(inputs.offer_type === "registration" ||
                inputs.offer_type === "one_percent" ||
                inputs.offer_type === "two_percent" ||
                inputs.offer_type === "minimum_purchase_product_free" ||
                inputs.offer_type ===
                  "minimum_purchase_multi_product_discount" ||
                inputs.offer_type ===
                  "multiple_product_wise_fixed_amount_purchase_offer") && (
                <div className="col-lg">
                  <label>
                    Minimum Purchase Amount{" "}
                    <i className="fa fa-star required"></i>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="minimum_purchase"
                    value={inputs.minimum_purchase || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {(inputs.offer_type === "coupon" ||
                inputs.offer_type === "registration" ||
                inputs.offer_type === "one_percent" ||
                inputs.offer_type === "two_percent" ||
                inputs.offer_type ===
                  "minimum_purchase_multi_product_discount" ||
                inputs.offer_type ===
                  "multiple_product_wise_fixed_amount_purchase_offer") && (
                <>
                  <div className="col-lg">
                    <label>
                      Discount Value (
                      {inputs.discount_type === "percentage"
                        ? "Percentage(%)"
                        : "Fixed Amount"}
                      )<i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="discount_value"
                      value={inputs.discount_value || ""}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div className="col-lg"></div>
                </>
              )}
            </div>

            {inputs.offer_type == "conditional_perentage_offer" ? (
              <>
                <div className="row">
                  <div className="col-lg">
                    <label>
                      Minimum Number of Purchases Required
                      <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="required_purchase_count"
                      value={inputs.required_purchase_count || ""}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      Minimum Amount Per Purchase
                      <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="minimum_purchase"
                      value={inputs.minimum_purchase || ""}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      Discount Percentage (%)
                      <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="discount_value"
                      value={inputs.discount_value || ""}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                    />
                  </div>
                  <div className="col-lg">
                    <label>
                      Purchase Frequency Period
                      <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="required_purchase_frequency"
                      value={inputs.required_purchase_frequency || ""}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                    />
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {inputs.discount_type === "percentage" &&
              inputs.offer_type !== "discount" && (
                <>
                  <div className="row mt-3 mb-3">
                    <div className="col-lg-4">
                      <label>Up to Amount</label>
                      <input
                        type="text"
                        className="form-control"
                        name="up_to_amount"
                        value={inputs.up_to_amount || ""}
                        onChange={handleChange}
                        placeholder="Ex: 100"
                      />
                    </div>
                  </div>
                </>
              )}

            {inputs.offer_type !== "coupon" &&
              inputs.offer_type !== "conditional_perentage_offer" &&
              // inputs.offer_type !== "registration" &&
              // inputs.offer_type !== "one_percent" &&
              inputs.offer_type !== "two_percent" &&
              offer.length == 0 && (
                <>
                  {inputs.offer_type === "discount" && (
                    <div className="row mt-4">
                      <div className="col-lg">
                        <label>
                          Choose Rate or Qty{" "}
                          <i className="fa fa-star required"></i>
                        </label>
                        <select
                          className="form-control"
                          value={rateOrQty}
                          onChange={handleRateOrQtyChange}
                          name="rate_or_qty"
                        >
                          <option value="rate">Rate</option>
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="row mt-3 product_section">
                    <div className="col-10"></div>
                    <div className="col-2">
                      {inputs.offer_type !== "one_percent" &&
                        inputs.offer_type !==
                          "multiple_product_wise_fixed_amount_purchase_offer" && (
                          <button
                            className="btn btn-info btn-block mg-b-10"
                            onClick={addMoreList}
                          >
                            <i className="fa fa-plus mg-r-10"></i> ADD More
                          </button>
                        )}
                    </div>
                    <div className="col-12">
                      <table className="table table-sm align-items-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                              Product Or Category
                            </th>
                            {inputs.offer_type == "product_percent_offer" ? (
                              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                Minimum Purchase Amount
                              </th>
                            ) : (
                              ""
                            )}
                            {inputs.offer_type ===
                              "category_percentage_offer" ||
                            inputs.offer_type ===
                              "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer" ? (
                              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                Minimum Purchase Amount
                              </th>
                            ) : (
                              ""
                            )}
                            {rateOrQty === "rate" &&
                            inputs.offer_type !== "basket" &&
                            inputs.offer_type !== "one_percent" &&
                            inputs.offer_type !== "registration" &&
                            inputs.offer_type !==
                              "minimum_purchase_product_free" &&
                            inputs.offer_type !==
                              "minimum_purchase_multi_product_discount" &&
                            inputs.offer_type !==
                              "multiple_product_wise_fixed_amount_purchase_offer" ? (
                              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                {inputs.offer_type === "discount_category" ||
                                inputs.offer_type === "discount" ||
                                inputs.offer_type === "product_percent_offer" ||
                                inputs.offer_type ===
                                  "category_percentage_offer"
                                  ? "Percentage"
                                  : inputs.offer_type ===
                                    "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer"
                                  ? "Fixed Amount"
                                  : "Price"}
                              </th>
                            ) : (
                              ""
                            )}

                            {inputs.offer_type === "discount" ? (
                              inputs.discount_type === "percentage" ? (
                                <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                  Up to Amount
                                </th>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )}
                            {inputs.offer_type === "discount" ? (
                              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                {inputs.offer_type === "discount"
                                  ? "Invoice No."
                                  : ""}
                              </th>
                            ) : (
                              ""
                            )}
                            {inputs.offer_type === "basket" ||
                            rateOrQty === "qty" ? (
                              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                {rateOrQty === "qty" ? "Actual Qty" : "Qty"}
                              </th>
                            ) : (
                              ""
                            )}
                            {inputs.offer_type ===
                            "minimum_purchase_product_free" ? (
                              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                {"Qty"}
                              </th>
                            ) : (
                              ""
                            )}
                            {rateOrQty === "qty" ? (
                              <>
                                <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                  Select Trade Offer FG
                                </th>
                                <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                  Trade Offer Qty
                                </th>
                              </>
                            ) : (
                              ""
                            )}
                            {inputs.offer_type !== "one_percent" &&
                              inputs.offer_type !== "registration" &&
                              inputs.offer_type !==
                                "multiple_product_wise_fixed_amount_purchase_offer" && (
                                <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                  Action
                                </th>
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(list).map((x, i) => (
                            <tr key={i}>
                              <td>
                                {inputs.offer_type === "discount_category" ? (
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="category_id"
                                    options={category}
                                    onChange={(selectedOption, actionMeta) =>
                                      selectHandleChange(
                                        selectedOption,
                                        actionMeta,
                                        i
                                      )
                                    }
                                  />
                                ) : inputs.offer_type === "registration" ? (
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="base_list_id"
                                    options={allBases}
                                    isMulti
                                    onChange={(selectedOptions) => {
                                      const selectedValues =
                                        selectedOptions.map(
                                          (option) => option.value
                                        );
                                      setInputs((values) => ({
                                        ...values,
                                        workplace_ids: selectedValues,
                                        base_list_id: selectedValues,
                                      }));
                                    }}
                                  />
                                ) : inputs.offer_type ===
                                    "category_percentage_offer" ||
                                  inputs.offer_type ===
                                    "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer" ? (
                                  <>
                                    <Select
                                      className="basic-single"
                                      classNamePrefix="select"
                                      name="category_id"
                                      options={category}
                                      onChange={(selectedOption, actionMeta) =>
                                        selectHandleChange(
                                          selectedOption,
                                          actionMeta,
                                          i
                                        )
                                      }
                                    />
                                  </>
                                ) : (
                                  <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isMulti={
                                      inputs.offer_type === "one_percent" ||
                                      inputs.offer_type ===
                                        "multiple_product_wise_fixed_amount_purchase_offer"
                                    }
                                    name="product_id"
                                    options={product}
                                    onChange={
                                      inputs.offer_type === "one_percent" ||
                                      inputs.offer_type ===
                                        "multiple_product_wise_fixed_amount_purchase_offer"
                                        ? (selectedOption) => {
                                            // Update the selected products in the state as an array of objects
                                            const selectedProducts =
                                              selectedOption.map((option) => ({
                                                product_id: option.value,
                                              }));

                                            setInputs((prevInputs) => ({
                                              ...prevInputs,
                                              selected_products:
                                                selectedProducts, // Update the selected_products array
                                            }));
                                          }
                                        : (selectedOption, actionMeta) =>
                                            selectHandleChange(
                                              selectedOption,
                                              actionMeta,
                                              i
                                            )
                                    }
                                  />
                                )}
                              </td>
                              {inputs.offer_type === "product_percent_offer" ||
                              inputs.offer_type ===
                                "category_percentage_offer" ||
                              inputs.offer_type ===
                                "fixed_amount_and_fixed_order_count_specific_category_wise_fixed_amount_offer" ? (
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="minimum_purchase"
                                    value={x.minimum_purchase || ""}
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {rateOrQty === "rate" &&
                              inputs.offer_type !== "basket" &&
                              inputs.offer_type !== "one_percent" &&
                              inputs.offer_type !==
                                "minimum_purchase_product_free" &&
                              inputs.offer_type !==
                                "minimum_purchase_multi_product_discount" &&
                              inputs.offer_type !== "registration" &&
                              inputs.offer_type !==
                                "multiple_product_wise_fixed_amount_purchase_offer" ? (
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="price"
                                    value={x.price || ""}
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {inputs.offer_type === "discount" ? (
                                inputs.discount_type === "percentage" ? (
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="up_to_amount"
                                      value={x.up_to_amount || ""}
                                      onChange={(e) => handleInputChange(e, i)}
                                    />
                                  </td>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )}
                              {inputs.offer_type ===
                              "minimum_purchase_product_free" ? (
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="qty"
                                    value={x.qty || ""}
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {inputs.offer_type === "discount" ? (
                                <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                                  {x.invoiceAvailable ? (
                                    <Select
                                      className="basic-single"
                                      classNamePrefix="select"
                                      name="invoice"
                                      options={x.invoices}
                                      isMulti
                                      onChange={(selectedOptions) => {
                                        const selectedValues = selectedOptions
                                          ? selectedOptions.map(
                                              (option) => option.value
                                            )
                                          : [];
                                        handleInvoiceChange(selectedValues, i);
                                      }}
                                    />
                                  ) : (
                                    <></>
                                  )}
                                </th>
                              ) : (
                                ""
                              )}
                              {inputs.offer_type === "basket" ||
                              rateOrQty === "qty" ? (
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="qty"
                                    value={x.qty || ""}
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </td>
                              ) : (
                                ""
                              )}
                              {rateOrQty === "qty" ? (
                                <>
                                  <td>
                                    <Select
                                      className="basic-single"
                                      classNamePrefix="select"
                                      name="trade_offer_product_id"
                                      options={product}
                                      onChange={(selectedOption, actionMeta) =>
                                        selectHandleTradeOfferChange(
                                          selectedOption,
                                          actionMeta,
                                          i
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="trade_offer_qty"
                                      value={x.trade_offer_qty || ""}
                                      onChange={(e) => handleInputChange(e, i)}
                                    />
                                  </td>
                                </>
                              ) : (
                                ""
                              )}
                              {inputs.offer_type !== "one_percent" && (
                                <td>
                                  {list.length > 1 ? (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => removeList(i)}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            <h6
              style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
              className="mt-4"
            >
              {offerMsg}
            </h6>
            <hr></hr>
            {offer.length > 0 ? (
              <div>
                <div className="col-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Offer Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Distributor</th>
                        <th>Region</th>
                        <th>Area</th>
                        <th>Base</th>
                        <th>Route</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offer.map((x, i) => (
                        <tr key={i}>
                          <td>{x.title}</td>
                          <td>{x.offer_type}</td>
                          <td>{x.start_date}</td>
                          <td>{x.end_date}</td>
                          <td>
                            {x.distributor
                              ? x.distributor.code + " - " + x.distributor.name
                              : ""}
                          </td>
                          <td>{x.region ? x.region.name : ""}</td>
                          <td>{x.area ? x.area.name : ""}</td>
                          <td>{x.base ? x.base.name : ""}</td>
                          <td>{x.route ? x.route.name : ""}</td>
                          <td>{x.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              ""
            )}
            {offerExists == false ? (
              <div className="row mt-4">
                <div className="col-3">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Create
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
