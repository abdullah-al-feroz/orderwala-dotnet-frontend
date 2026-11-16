import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [machineries, setMachineries] = useState({});
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/factory-machineries/" + id + "/edit").then((res) => {
      setInputs({
        machineries_id: res.data.machineries_id,
        amount: res.data.amount,
        depreciation_rate: res.data.depreciation_rate,
        started_from: res.data.started_from,
        closed_from: res.data.closed_from,
      });
    });
    Http.get("/machineries").then((res) => {
      setMachineries(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    console.log(inputs);
    Http.put("/factory-machineries/" + id, inputs)
      .then((res) => {
        navigate("/factory-machineries", {
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
          <h5 className="am-title">Create Machineries</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Machineries Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Machineries <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="machineries_id"
                  onChange={handleChange}
                >
                  <option value="">Select Machineries</option>
                  {Array.from(machineries).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.machineries_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label>
                  Amount <i class="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  value={inputs.amount || ""}
                  onChange={handleChange}
                  placeholder="Input Amount"
                />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Depreciation Rate <i class="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="depreciation_rate"
                  value={inputs.depreciation_rate || ""}
                  onChange={handleChange}
                  placeholder="Input Depreciation Rate"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Started From <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="started_from"
                  value={inputs.started_from || ""}
                  onChange={handleChange}
                  placeholder="Input Started From"
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Closed From</label>
                <input
                  type="date"
                  className="form-control"
                  name="closed_from"
                  value={inputs.closed_from || ""}
                  onChange={handleChange}
                  placeholder="Input Closed From"
                />
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
