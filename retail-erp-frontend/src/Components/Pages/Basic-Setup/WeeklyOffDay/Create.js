import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    console.log(inputs);
    if (checkRequiredFields()) {
      Http.post("/weekly-off-day", inputs)
        .then((res) => {
          navigate("/weekly-off-day", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          console.log(e.response);
          // setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Weekly Off Day</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Weekly Off Day Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Year <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Year"
                  name="year"
                  value={inputs.year || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">Day</label>
                <div className="select">
                  <select
                    className="form-control"
                    name="day"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Day</option>
                    <option value="1">Saturday</option>
                    <option value="2">Sunday</option>
                    <option value="3">Monday</option>
                    <option value="4">Tuesday</option>
                    <option value="5">Wednesday</option>
                    <option value="6">Thursday</option>
                    <option value="7">Friday</option>
                  </select>
                </div>
              </div>
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
