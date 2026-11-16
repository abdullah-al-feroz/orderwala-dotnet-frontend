import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../../Common/Http";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [region, setRegion] = useState({});
  const [area, setArea] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const [selectedRegionOption, setSelectedRegionOption] = useState(null);

  // Area Load Region Change Wise
  const areaRegionWise = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    Http.get("/region-wise-area/" + value).then((res) => {
      setArea(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = () => {
    Http.get("/base/" + id + "/edit").then((res) => {
      setInputs({
        work_place_region_id: res.data.work_place_region_id,
        work_place_area_id: res.data.work_place_area_id,
        name: res.data.name,
        started_from: res.data.started_from,
        status: res.data.status,
        remarks: res.data.remarks,
      });

      setSelectedRegionOption({
        label: res.data.region.name,
        value: res.data.region.id,
      });

      // Deafault Area Data Load
      Http.get("/region-wise-area/" + res.data.work_place_region_id).then(
        (res) => {
          setArea(res.data);
        }
      );
    });

    // Default Region Data Load
    // Http.get("/region").then((res) => {
    //   setRegion(res.data);
    // });

    Http.get("/regionSelect2").then((res) => {
      setRegion(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    setSelectedRegionOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });

    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    Http.get("/region-wise-area/" + value).then((res) => {
      setArea(res.data);
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      Http.put("/base/" + id, inputs)
        .then((res) => {
          navigate("/base", {
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
          <h5 className="am-title">Edit Base</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Base Form</h6>
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
                  defaultValue={selectedRegionOption}
                  value={selectedRegionOption}
                  onChange={selectHandleChange}
                  name="work_place_region_id"
                  options={region}
                />

                {/* <select
                  className="form-control"
                  name="work_place_region_id"
                  onChange={areaRegionWise}
                >
                  <option value="">Select Region</option>
                  {Array.from(region).map((item, index) => (
                    <option
                      value={item.id}
                      selected={
                        (inputs.work_place_region_id = item.id ? true : false)
                      }
                    >
                      {item.name}
                    </option>
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
                    <option
                      value={item.id}
                      selected={
                        inputs.work_place_area_id === item.id ? true : false
                      }
                    >
                      {item.name}
                    </option>
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

              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label for="">Status</label>
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
              <div className="col-lg">
                <label for="">Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  onChange={handleChange}
                  placeholder="Remarks"
                  value={inputs.remarks || ""}
                ></textarea>
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
