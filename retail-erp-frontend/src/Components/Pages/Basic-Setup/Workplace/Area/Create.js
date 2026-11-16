import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import FormValidation from "../../../../Common/FormValidation";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import Select from "react-select";

const CreateArea = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [regions, setRegions] = useState([]);
  const [error, setError] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const timerRef = useRef(null);
  const { checkRequiredFields } = useRequiredFields();

  const getCurrentDateInput = () => {
    const dateObj = new Date();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();
    const shortDate = `${year}-${month}-${day}`;
    setInputs((values) => ({ ...values, ["started_from"]: shortDate }));
  };

  const fetchRegions = (filter = "") => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Region/paginated?Page=1&PageSize=10&Status=1${filterParam}`)
      .then((res) => {
        setRegions(res?.data?.data || []);
      })
      .catch(function (e) {
        setError(e?.response?.data?.message || "Failed to load regions");
      });
  };

  useEffect(() => {
    fetchRegions("");
    getCurrentDateInput();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleRegionInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchRegions(inputValue);
    }, 300);
  };

  const handleRegionChange = (selected) => {
    const val = selected ? String(selected.value) : "";
    setInputs((values) => ({ ...values, work_place_region_id: val }));
    setSelectedRegion(selected);
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {

      const payload = {
        regionId: parseInt(inputs?.work_place_region_id),
        name: inputs?.name || "",
        startedFrom: inputs?.started_from || new Date().toISOString(),
        status: 1,
        remarks: inputs?.remarks || "",
      };

      HttpSupplyChain.post("/Area/Create", payload)
        .then((res) => {
          navigate("/area", {
            state: { message: res?.data?.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e?.response?.data?.message);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title"> Create Area </h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Area Form
            </h6>
            {error && Object.keys(error).length > 0 && (
              <div className="row">
                <div className="col-lg">
                  <FormValidation error={error} />
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Select Region <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_region_id"
                  placeholder="Search and select region..."
                  isClearable
                  isSearchable
                  onInputChange={handleRegionInputChange}
                  onChange={handleRegionChange}
                  options={regions.map((item) => ({ value: String(item.id), label: item.name }))}
                  value={selectedRegion}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
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
                  Date <i className="fa fa-star required"></i>
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
                <label htmlFor="">Remarks</label>
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
        </div>
      </div>
    </div>
  );
};

export default CreateArea;