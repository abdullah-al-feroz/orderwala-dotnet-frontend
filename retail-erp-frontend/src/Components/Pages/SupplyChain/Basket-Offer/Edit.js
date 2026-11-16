import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [product, setProduct] = useState([]);
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

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async () => {
    Http.get("/productSelect2").then((res) => {
      setProduct(res.data);
    });

    Http.get(`/coupon-offer/${id}`).then((res) => {
      setInputs(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const toggleChange = (e) => {
    const name = e.target.name;
    const value = !e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    // if (checkRequiredFields()) {
    Http.put(`/coupon-offer/${id}`, inputs)
      .then((res) => {
        navigate("/coupon-offer", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
    // }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Coupon Offer</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Coupon Offer Form
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
                <label htmlFor="">
                  Discount Value <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="discount_value"
                  value={inputs.discount_value || ""}
                  onChange={handleChange}
                  placeholder="Discount Value"
                  data-required
                />
                {displayError("discount_value")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Minimum Purchase <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="minimum_purchase"
                  value={inputs.minimum_purchase || ""}
                  onChange={handleChange}
                  placeholder="Minimum Purchase"
                  data-required
                />
                {displayError("minimum_purchase")}
              </div>
              <div className="col-lg">
                <label>
                  Minimum Coupon Amount <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="minimum_coupon_amount"
                  value={inputs.minimum_coupon_amount || ""}
                  onChange={handleChange}
                  placeholder="Minimum Coupon Amount"
                  data-required
                />
                {displayError("minimum_coupon_amount")}
              </div>
              <div className="col-lg">
                <label>Description</label>
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
              <div className="col-lg-2 mt-5">
                <label className="mr-2">Available for MDO</label>
                <input
                  type="checkbox"
                  name="available_for_mdo"
                  checked={inputs.available_for_mdo === 1}
                  value={inputs.available_for_mdo || ""}
                  onChange={toggleChange}
                />
                {displayError("available_for_mdo")}
              </div>
              <div className="col-lg mt-5"></div>
            </div>

            <div className="row mt-3">
              <div className="col-lg-12">
                <label>
                  Coupon Offer Items <i className="fa fa-star required"></i>
                </label>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inputs.coupon_offer_items &&
                        inputs.coupon_offer_items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={product.find(
                                  (p) => p.value === item.product_id
                                )}
                                name={`coupon_offer_items[${index}].product_id`}
                                options={product}
                                onChange={(selectedOption) => {
                                  const newItems = [
                                    ...inputs.coupon_offer_items,
                                  ];
                                  newItems[index].product_id =
                                    selectedOption.value;
                                  setInputs({
                                    ...inputs,
                                    coupon_offer_items: newItems,
                                  });
                                }}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                name={`coupon_offer_items[${index}].qty`}
                                value={item.qty || ""}
                                onChange={(e) => {
                                  const newItems = [
                                    ...inputs.coupon_offer_items,
                                  ];
                                  newItems[index].qty = e.target.value;
                                  setInputs({
                                    ...inputs,
                                    coupon_offer_items: newItems,
                                  });
                                }}
                                placeholder="Quantity"
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  const newItems =
                                    inputs.coupon_offer_items.filter(
                                      (_, i) => i !== index
                                    );
                                  setInputs({
                                    ...inputs,
                                    coupon_offer_items: newItems,
                                  });
                                }}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => {
                    const items = inputs.coupon_offer_items || [];
                    setInputs({
                      ...inputs,
                      coupon_offer_items: [
                        ...items,
                        { product_id: "", qty: "" },
                      ],
                    });
                  }}
                >
                  <i className="fa fa-plus"></i> Add Item
                </button>
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
        </div>
      </div>
    </div>
  );
};

export default Edit;
