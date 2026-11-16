import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [region, setRegion] = useState({});
  const [area, setArea] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["started_from"]: shortDate }));
  };

  // Default Load
  const fetchData = () => {
    // Http.get("/region").then((res) => {
    //   setRegion(res.data);
    // });

    Http.get("/regionSelect2").then((res) => {
      setRegion(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);
  // End Default Load

  // Area Load Region Change Wise
  const areaRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    Http.get("/region-wise-area/" + value).then((res) => {
      setArea(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;

    setInputs((values) => ({ ...values, [name]: value }));

    Http.get("/region-wise-area/" + value).then((res) => {
      setArea(res.data);
    });
  };

  //  Set Input Value with state
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Form Submit
  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.post("/base", inputs)
        .then((res) => {
          navigate("/base", {
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
          <h5 className="am-title">Create Base</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Base Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label for="">
                  Select Region <i class="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={region[0]}
                  name="work_place_region_id"
                  options={region}
                  onChange={selectHandleChange}
                />

                {/* <select
                  className="form-control"
                  name="work_place_region_id"
                  onChange={areaRegionWise}
                >
                  <option value="">Select Region</option>
                  {Array.from(region).map((item, index) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label for="">
                  Select Area <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="work_place_area_id"
                  onChange={handleChange}
                >
                  <option value="">Select Area</option>
                  {Array.from(area).map((item, index) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label for="">
                  Name <i class="fa fa-star required"></i>
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
                <label for="">
                  Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="started_from"
                  value={inputs.started_from || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg mt-3">
                <label for="">Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                  placeholder="Remarks"
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
