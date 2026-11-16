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
  };

  useEffect(() => {
    fetchData();
  }, []);
  const toggleChange = (e) => {
    const name = e.target.name; // Chanages Input Name
    const value = !e.target.value; // Changes Input Value
    setInputs((values) => ({ ...values, [name]: value })); // Set Input With Value and Name in State
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.post("/trade-offer", inputs)
        .then((res) => {
          navigate("/trade-offer", {
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
          <h5 className="am-title">Create Trade Offer</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Trade Offer Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Product <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={product[0]}
                  name="product_id"
                  options={product}
                  onChange={selectHandleChange}
                />
              </div>
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
                <label htmlFor="">Trade Offer Product</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={product[0]}
                  name="trade_offer_product_id"
                  options={product}
                  onChange={selectHandleChange}
                />
              </div>

              <div className="col-lg">
                <label>
                  Actual Qty <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="actual_qty"
                  value={inputs.actual_qty || ""}
                  onChange={handleChange}
                  placeholder="Input actual qty"
                  data-required
                />
                {displayError("actual_qty")}
              </div>
              <div className="col-lg">
                <label>
                  Trade Offer Qty <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="trade_offer_qty"
                  value={inputs.trade_offer_qty || ""}
                  onChange={handleChange}
                  placeholder="Input trade offer qty"
                  data-required
                />
                {displayError("trade_offer_qty")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg-3">
                <label>
                  Active From <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="active_from"
                  value={inputs.active_from || ""}
                  onChange={handleChange}
                  placeholder="Input Active From"
                  data-required
                />
                {displayError("active_from")}
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
                  placeholder="Input Active From"
                  data-required
                />
                {displayError("end_date")}
              </div>
              <div className="col-lg-2 mt-5">
                <label className="mr-2">Stock Wise Offer</label>
                <input
                  type="checkbox"
                  name="stock_wise_offer"
                  value={inputs.stock_wise_offer || ""}
                  onChange={toggleChange}
                />
                {displayError("stock_wise_offer")}
              </div>
              <div className="col-lg-1 mt-5">
                <label className="mr-2">Special Offer</label>
                <input
                  type="checkbox"
                  name="is_special_offer"
                  value={inputs.is_special_offer || ""}
                  onChange={toggleChange}
                />
                {displayError("is_special_offer")}
              </div>
              <div className="col-lg mt-5"></div>
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
