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
  const [location, setLocation] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const [selectedOption, setSelectedOption] = useState(null);

  const fetchData = () => {
    Http.get("/factory/" + id + "/edit").then((res) => {
      setInputs({
        location_id: res.data.location_id,
        name: res.data.name,
        email: res.data.hr_staff.email,
        status: res.data.status,
      });
      setSelectedOption({
        label: res.data.location.name,
        value: res.data.location.id,
      });
    });

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

  const selectHandleChange = (selectedOption, actionMeta) => {
    setSelectedOption({
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

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.put("/factory/" + id, inputs)
        .then((res) => {
          navigate("/factory", {
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
          <h5 className="am-title">Create Depo</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Depo Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">Location</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedOption}
                  value={selectedOption}
                  onChange={selectHandleChange}
                  name="location_id"
                  options={location}
                  // options={Array.from(location).map((item, index) => {
                  //   return { ...item, key: index };
                  // })}
                  // onChange={selectHandleChange}
                />

                {/* <select
                  className="form-control"
                  name="location_id"
                  onChange={handleChange}
                >
                  <option value="">Select Location</option>
                  {Array.from(location).map((item, index) => (
                    <option
                      value={item.id}
                      selected={inputs.location_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
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
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  name="password"
                  value={inputs.password || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">Status</label>
                <select
                  className="form-control"
                  name="status"
                  onChange={handleChange}
                >
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
                    inactive
                  </option>
                </select>
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
