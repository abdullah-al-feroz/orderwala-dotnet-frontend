import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const regionId = parseInt(id);
  const [error, setError] = useState({});
  const [zones, setZones] = useState([]);
  const [search, setSearch] = useState("");
  const timerRef = useRef(null);
  const { checkRequiredFields } = useRequiredFields();

  const fetchData = () => {
    HttpSupplyChain.get("/Region/GetById/" + regionId).then((res) => {
      const d = res?.data?.data || {};
      const zoneIdVal = d.zoneId ?? d.work_place_zone_id ?? d.zone?.id ?? "";
      setInputs({
        work_place_zone_id: String(zoneIdVal || ""),
        name: d.name,
        started_from: d.startedFrom?.split("T")[0],
        remarks: d.remarks,
        status: d.status === 1 ? "active" : "inactive",
      });
    });
    fetchZones("");
  };

  const fetchZones = (filter) => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Zone/paginated?Page=1&PageSize=10${filterParam}`)
      .then((res) => {
        setZones(res?.data?.data || []);
      })
      .catch((e) => {
        setError(e?.response?.data?.message || "Failed to load zones");
      });
  };

  const handleZoneInputChange = (inputValue) => {
    setSearch(inputValue);
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
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        zoneId: parseInt(inputs.work_place_zone_id),
        name: inputs.name || "",
        startedFrom: inputs.started_from || new Date().toISOString(),
        // status: typeof inputs.status === "number" ? inputs.status : parseInt(inputs.status || 0, 10),
        status: typeof inputs.status === "number" ? inputs.status : inputs.status === "active" ? 1 : 0,
        remarks: inputs.remarks || "",
        id: regionId,
        updatedAt: new Date().toISOString(),
      };

      HttpSupplyChain.put("/Region/Update/" + regionId, payload)
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

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Region</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Region Form</h6>
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
                      .find((opt) => opt.value === inputs.work_place_zone_id) || null
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
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label htmlFor="">
                  Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control select2"
                  name="started_from"
                  value={inputs.started_from || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                  data-required
                />
              </div>

              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label htmlFor="">Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={inputs.status || "active"}
                  onChange={handleChange}
                >
                  <option value="active">
                    Active
                  </option>
                  <option value="inactive">
                    InActive
                  </option>
                </select>
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
                  <i className="fa fa-send mg-r-10"></i> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;