import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const { checkRequiredFields } = useRequiredFields();
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [rateOrQty, setRateOrQty] = useState("");
  const [offerExists, setOfferExists] = useState(false);
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
  });
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [category, setCategory] = useState({});
  const [list, setList] = useState([{ product_id: "", price: "" }]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [route, setRoute] = useState([]);
  const [distributor, setDistributor] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [offer, setOffer] = useState([]);
  const [offerMsg, setOfferMsg] = useState(null);

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // setInputs((values) => ({ ...values, [name]: value }));
    // const updatedInputs = { ...inputs, [name]: value };

    // if (name == "start_date" || name == "end_date" || name == "offer_type") {
    //   offerCheck(updatedInputs);
    // }
    setRateOrQty("rate");

    setInputs((values) => {
      const updatedInputs = { ...values, [name]: value };
      // Immediately after updating the state, call offerCheck with updated inputs
      if (name != "title" && name != "description") {
        // offerCheck(updatedInputs);
        offerCheck({ ...updatedInputs, items: list });
      }
      return updatedInputs;
    });
  };
  const selectWorkplaceChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    // setInputs((values) => ({ ...values, [name]: value }));
    // const updatedInputs = { ...inputs, [name]: value };

    // setInputs((values) => {
    //   const updatedInputs = { ...values, [name]: value };
    //   // Call offerCheck with updatedInputs
    //   offerCheck(updatedInputs);
    //   return updatedInputs;
    // });

    setInputs((values) => {
      const updatedInputs = { ...values, [name]: value };
      // Immediately after updating the state, call offerCheck with updated inputs
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
  const selectHandleChange = (selectedOption, actionMeta, index) => {
    const productId = selectedOption.value;
    // fetchProductDetails(productId, index);
    fetchProductDetails(productId, index, () => {
      // Call offerCheck with the updated inputs and list after the state has been updated
      offerCheck({ ...inputs, items: list });
    });
  };
  const selectHandleTradeOfferChange = (selectedOption, actionMeta, index) => {
    // const productId = selectedOption.value;
    // fetchProductDetails(productId, index);
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

  const selectVendorChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    // setInputs((values) => ({ ...values, [name]: value }));

    setInputs((values) => {
      const updatedInputs = { ...values, [name]: value };
      // Call offerCheck with updatedInputs
      offerCheck(updatedInputs);
      return updatedInputs;
    });
  };

  const fetchData = async () => {
    try {
      const res = await Http.get("/productSelect2");
      setProduct(res.data);

      Http.get(
        "/select2/SupplyChainPurchaseManagement.ProductCategory/id,name"
      ).then((res) => {
        setCategory(res.data);
      });

      Http.get("/select2/Hr.WorkPlaceRegion/id,name").then((res) => {
        setRegion(res.data);
      });
      Http.get("/select2/SaleDistribution.Distributor/id,name").then((res) => {
        setDistributor(res.data);
      });
      Http.get("/select2/SupplyChainPurchaseManagement.Vendor/id,name").then(
        (res) => {
          setVendor(res.data);
        }
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      // Handle error appropriately
    }
  };

  const fetchProductDetails = async (productId, index, callback) => {
    try {
      const response = await Http.get(`/product/${productId}`);
      const productDetails = response.data;

      setList((currentList) => {
        const updatedList = currentList.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              product_id: productId,
              // Assuming you update the item with details fetched
              // Adjust according to your actual data structure
              price: productDetails.price, // Example property
              // other details...
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
      // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addMoreList = () => {
    setList([...list, { product_id: "", price: "" }]);
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
        // setOffer(res.data.list);
      })
      .catch((e) => {
        setError(e.response.data.errors);
      });
  }

  const formSubmit = () => {
    if (checkRequiredFields()) {
      // Filter out list items that are not properly filled
      /*const filteredList = list.filter((item) => item.product_id && item.price);

      // Only add items to inputs if the filtered list is not empty
      if (filteredList.length > 0) {
        inputs.items = filteredList;
      }
      inputs.image = selectedFile;

      Http.post("/retailer-offer", inputs, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })*/
      // Only add items to inputs if the filtered list is not empty
      inputs.items = list;
      inputs.rate_or_qty = rateOrQty;
      Http.post("/retailer-offer", inputs)
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
          <h5 className="am-title">Create Offer</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row mt-3">
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

              {/* <div className="col-lg">
                <label htmlFor="">Route</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="route_id"
                  options={route}
                  onChange={selectWorkplaceChange}
                />
              </div> */}

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
              <div className="col-lg">
                <label htmlFor="">Company</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="vendor_id"
                  options={vendor}
                  onChange={selectVendorChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Offer Type <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="offer_type"
                  value={inputs.offer_type || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Offer Type</option>
                  <option value="discount">Discount By Product</option>
                  {/* <option value="discount_category">
                    Discount By Category
                  </option> */}
                  <option value="basket">Basket</option>
                  {/* <option value="free_delivery">Free Delivery</option> */}
                  <option value="coupon">Coupon</option>
                  <option value="registration">Registration</option>
                  <option value="one_percent">(%)Percentage Offer</option>
                  <option value="product_percent_offer">
                    (%)Percentage Offer Product Wise
                  </option>
                  {/* <option value="two_percent">Two Percent</option> */}
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

              {/* <div className="col-lg">
                <label>
                  Offer Image <i className="fa fa-star required"></i>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                />
              </div> */}
            </div>
            <div className="row mt-3">
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
            {inputs.offer_type == "basket" ? (
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
                inputs.offer_type === "two_percent") && (
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
                inputs.offer_type === "two_percent") && (
                <>
                  {/* <div className="col-lg">
                    <label>Discount Type</label>
                    <select
                      className="form-control"
                      name="discount_type"
                      value={inputs.discount_type || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select Discount Type</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div> */}
                  <div className="col-lg">
                    <label>
                      Discount Percentage (%){" "}
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
                  <div className="col-lg"></div>
                </>
              )}
            </div>

            {inputs.offer_type !== "coupon" &&
              inputs.offer_type !== "registration" &&
              inputs.offer_type !== "one_percent" &&
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
                          {/* <option value="qty">Qty</option> */}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className="row mt-3 product_section">
                    <div className="col-10"></div>
                    <div className="col-2">
                      <button
                        className="btn btn-info btn-block mg-b-10"
                        onClick={addMoreList}
                      >
                        <i className="fa fa-plus mg-r-10"></i> ADD More
                      </button>
                    </div>
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
                          {rateOrQty === "rate" &&
                          inputs.offer_type != "basket" ? (
                            <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                              {inputs.offer_type == "discount_category" ||
                              inputs.offer_type == "discount" ||
                              inputs.offer_type == "product_percent_offer"
                                ? "Percentage"
                                : "Price"}
                            </th>
                          ) : (
                            ""
                          )}
                          {inputs.offer_type == "basket" ||
                          rateOrQty === "qty" ? (
                            <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                              {rateOrQty === "qty" ? "Actual Qty" : "Qty"}
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
                          <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(list).map((x, i) => (
                          <tr key={i}>
                            <td>
                              {inputs.offer_type == "discount_category" ? (
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
                              ) : (
                                <Select
                                  className="basic-single"
                                  classNamePrefix="select"
                                  name="product_id"
                                  options={product}
                                  onChange={(selectedOption, actionMeta) =>
                                    selectHandleChange(
                                      selectedOption,
                                      actionMeta,
                                      i
                                    )
                                  }
                                />
                              )}
                            </td>
                            {inputs.offer_type == "product_percent_offer" ? (
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
                            inputs.offer_type != "basket" ? (
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
                            {inputs.offer_type == "basket" ||
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
