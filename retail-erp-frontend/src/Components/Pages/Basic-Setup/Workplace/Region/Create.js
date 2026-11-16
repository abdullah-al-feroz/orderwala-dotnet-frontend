import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [zones, setZones] = useState([]);
  const timerRef = useRef(null);
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Default Load
  const fetchData = () => {
    fetchZones("");
  };

  const fetchZones = (filter = "") => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Zone/paginated?Page=1&PageSize=10&Status=1${filterParam}`)
      .then((res) => {
        setZones(res?.data?.data || []);
      })
      .catch(function (e) {
        setError(e?.response?.data?.message || "Failed to load zones");
      });
  };

  const handleZoneInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchZones(inputValue);
    }, 300);
  };

  const handleZoneChange = (selected) => {
    const val = selected ? String(selected.value) : "";
    setInputs((values) => ({ ...values, work_place_zone_id: val }));
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["started_from"]: shortDate }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        zoneId: parseInt(inputs?.work_place_zone_id),
        name: inputs?.name || "",
        startedFrom: inputs?.started_from || new Date().toISOString(),
        status: 1,
        remarks: inputs?.remarks || "",
      };

      HttpSupplyChain.post("/Region/Create", payload)
        .then((res) => {
          navigate("/region", {
            state: { message: res?.data?.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e?.response?.data?.message);
        });
    }
  };

  useEffect(() => {
    getCurrentDateInput();
  }, []);

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Region</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Region Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Select Zone <i className="fa fa-star required"></i>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_zone_id"
                  placeholder="Search and select zone..."
                  isClearable
                  isSearchable
                  onInputChange={handleZoneInputChange}
                  onChange={handleZoneChange}
                  options={zones.map((item) => ({ value: String(item.id), label: item.name }))}
                  value={
                    zones
                      .map((item) => ({ value: String(item.id), label: item.name }))
                      .find((opt) => opt.value === String(inputs.work_place_zone_id)) || null
                  }
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Region Name <i className="fa fa-star required"></i>
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
            <div className="row mt-3">
              <div className="col-lg">
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

export default Create;