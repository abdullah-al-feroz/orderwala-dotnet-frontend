import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [location, setLocation] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  // Default Load
  const fetchData = () => {
    // Http.get("/location").then((res) => {
    //   setLocation(res.data);
    // });
    Http.get("/locationSelect2").then((res) => {
      setLocation(res.data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // End Default Load

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.post("/factory", inputs)
        .then((res) => {
          navigate("/factory", {
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
          <h5 className="am-title">Create Depo</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Depo Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Location <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={location[0]}
                  name="location_id"
                  options={location}
                  onChange={selectHandleChange}
                />
                {/* <select
                  className="form-control select2"
                  name="location_id"
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {Array.from(location).map((item, index) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Email <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Password <i className="fa fa-star required"></i>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  name="password"
                  value={inputs.password || ""}
                  onChange={handleChange}
                  data-required
                />
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
