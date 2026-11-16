import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import FormValidation from "../../../../Common/FormValidation";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import Select from "react-select";

const EditArea = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [region, setRegion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const { id } = useParams();
  const areaId = parseInt(id);
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const fetchData = async (filter = "") => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        HttpSupplyChain.get(`/Area/GetById/${areaId}`),
        HttpSupplyChain.get(`/Region/paginated?Page=1&PageSize=10&Status=1&Filter=${filter}`)
      ]);

      const areaData = res1?.data?.data || {};

      setInputs({
        work_place_region_id: areaData.region?.id,
        name: areaData.name,
        started_from: areaData.startedFrom ? areaData.startedFrom.split("T")[0] : "",
        status: areaData.status === 1 ? "active" : "inactive",
        remarks: areaData.remarks,
        region: { value: areaData.region?.id, label: areaData.region?.name }
      });

      if (areaData.region) {
        setSelectedRegion({ value: String(areaData.region.id), label: areaData.region.name });
      }

      const formattedRegion = (res2?.data?.data || []).map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setRegion(formattedRegion);

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchRegions = (filter = "") => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Region/paginated?Page=1&PageSize=10&Status=1${filterParam}`)
      .then((res) => {
        const formatted = (res?.data?.data || []).map((item) => ({ value: item.id, label: item.name }));
        setRegion(formatted);
      })
      .catch((e) => {
        console.error("Failed to load regions", e);
      });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {

      const payload = {
        regionId: parseInt(inputs.work_place_region_id),
        name: inputs.name || "",
        startedFrom: inputs.started_from || new Date().toISOString(),
        status: inputs.status === "active" ? 1 : 0,
        remarks: inputs.remarks || "",
        id: areaId,
        updatedAt: new Date().toISOString(),
      };

      HttpSupplyChain.put("/Area/Update/" + areaId, payload)
        .then((res) => {
          navigate("/area", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          setError(e.response.data.message);
        });
    }
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

  return (
    <div>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Designation</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            {error && Object.keys(error).length > 0 && (
              <div className="row">
                <div className="col-lg">
                  <FormValidation error={error} />
                </div>
              </div>
            )}
            {loading ? (
              <ProgressSpinner />
            ) : (
              <>
                <div className="row">
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
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
                    <label className="font-weight-bold" htmlFor="">
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
                  options={region.map((item) => ({ value: item.id, label: item.name }))}
                  value={selectedRegion || inputs.region || null}
                />
                  </div>
                  {/* col */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="">
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
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
                      Remarks
                    </label>
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
                    <button className="btn btn-primary btn-block mg-b-10" onClick={formSubmit}>
                      <i className="fa fa-send mg-r-10"></i> Update
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArea;