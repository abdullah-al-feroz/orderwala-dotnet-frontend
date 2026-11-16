import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import Select from "react-select";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  const [product, setProduct] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTradeOfferProductOption, setSelectedTradeOfferProductOption] =
    useState(null);

  const fetchData = () => {
    Http.get("/productSelect2").then((res) => {
      setProduct(res.data);
    });
    Http.get("/trade-offer/" + id + "/edit").then((res) => {
      setInputs({
        product_id: res.data.product_id,
        trade_offer_product_id: res.data.trade_offer_product_id,
        qty: res.data.qty,
        offer_qty: res.data.offer_qty,
        effective_date: res.data.effective_date,
      });
      if (res.data.product) {
        setSelectedOption({
          label: res.data.product.name,
          value: res.data.product_id,
        });
      }

      if (res.data.trade_offer_product) {
        setSelectedTradeOfferProductOption({
          label: res.data.trade_offer_product.name,
          value: res.data.trade_offer_product_id,
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    setSelectedOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const selectHandleTradeOfferChange = (selectedOption, actionMeta) => {
    setSelectedTradeOfferProductOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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
  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.put("/trade-offer/" + id, inputs)
        .then((res) => {
          navigate("/trade-offer", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Trade Offer</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Trade Offer Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">Product</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedOption}
                  value={selectedOption}
                  onChange={selectHandleChange}
                  name="product_id"
                  options={product}
                />
              </div>
              <div className="col-lg">
                <label>
                  Active From <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="effective_date"
                  value={inputs.effective_date || ""}
                  onChange={handleChange}
                  placeholder="Input Active From"
                  data-required
                />
                {displayError("effective_date")}
              </div>
              <div className="col-lg">
                <label>
                  Actual Qty <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="qty"
                  value={inputs.qty || ""}
                  onChange={handleChange}
                  placeholder="Input qty"
                  data-required
                />
                {displayError("qty")}
              </div>
              <div className="col-lg">
                <label htmlFor="">Trade Offer Product</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedTradeOfferProductOption}
                  value={selectedTradeOfferProductOption}
                  name="trade_offer_product_id"
                  options={product}
                  onChange={selectHandleTradeOfferChange}
                />
              </div>
              <div className="col-lg">
                <label>
                  Trade Offer Qty <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="offer_qty"
                  value={inputs.offer_qty || ""}
                  onChange={handleChange}
                  placeholder="Input offer_qty"
                  data-required
                />
                {displayError("offer_qty")}
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

export default Edit;
