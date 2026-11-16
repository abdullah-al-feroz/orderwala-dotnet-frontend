import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import FormValidation from "../../../../Common/FormValidation";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import Select from "react-select";

const Edit = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [regionOptions, setRegionOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [baseOptions, setBaseOptions] = useState([]);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  const [loading, setLoading] = useState(false);

  // Fetch regions with filter
  const fetchRegions = useCallback((filter = "") => {
    const url = filter
      ? `/Region/paginated?Filter=${encodeURIComponent(filter)}&Page=1&PageSize=100&Status=1`
      : `/Region/paginated?Page=1&PageSize=100&Status=1`;

    HttpSupplyChain.get(url).then((res) => {
      const formatted = res.data.data?.map((r) => ({
        value: r.id,
        label: r.name,
      })) || [];
      setRegionOptions(formatted);
    });
  }, []);

  // Fetch areas with filter
  const fetchAreas = useCallback((regionId, filter = "") => {
    if (!regionId) {
      setAreaOptions([]);
      return;
    }

    const url = filter
      ? `/Area/paginated?Filter=${encodeURIComponent(filter)}&Page=1&PageSize=100&RegionId=${regionId}`
      : `/Area/paginated?Page=1&PageSize=100&RegionId=${regionId}`;

    HttpSupplyChain.get(url).then((res) => {
      const formatted = res.data.data?.map((a) => ({
        value: a.id,
        label: a.name,
      })) || [];
      setAreaOptions(formatted);
    });
  }, []);

  // Fetch bases with filter
  const fetchBases = useCallback((areaId, filter = "") => {
    if (!areaId) {
      setBaseOptions([]);
      return;
    }

    const url = filter
      ? `/WorkplaceBase/paginated?Filter=${encodeURIComponent(filter)}&Page=1&PageSize=100&AreaId=${areaId}`
      : `/WorkplaceBase/paginated?Page=1&PageSize=100&AreaId=${areaId}`;

    HttpSupplyChain.get(url).then((res) => {
      const formatted = res.data.data?.map((b) => ({
        value: b.id,
        label: b.name,
      })) || [];
      setBaseOptions(formatted);
    });
  }, []);

  // Fetch places independently with filter
  const fetchPlaces = useCallback((filter = "") => {
    const url = filter
      ? `/Place/paginated?Filter=${encodeURIComponent(filter)}&Page=1&PageSize=100`
      : `/Place/paginated?Page=1&PageSize=100`;

    HttpSupplyChain.get(url).then((res) => {
      const formatted = res.data.data?.map((p) => ({
        value: p.id,
        label: p.name,
      })) || [];
      setPlaceOptions(formatted);
    });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const routeRes = await HttpSupplyChain.get(`/Route/GetById/${id}`);
      const routeData = routeRes.data?.data || routeRes.data;

      // Set input values
      setInputs({
        work_place_region_id: routeData.regionId,
        zone_id: routeData.zoneId,
        work_place_area_id: routeData.areaId,
        work_place_base_id: routeData.workplaceBaseId,
        name: routeData.name,
        started_from: routeData.startedFrom ? routeData.startedFrom.split("T")[0] : "",
        status: routeData.status,
        remarks: routeData.remarks,
      });

      // Fetch and set regions
      const regionsRes = await HttpSupplyChain.get(`/Region/paginated?Page=1&PageSize=100&Status=1`);
      const regionsFormatted = regionsRes.data.data?.map((r) => ({
        value: r.id,
        label: r.name,
      })) || [];
      setRegionOptions(regionsFormatted);

      // Pre-populate selected region
      const selectedRegionObj = regionsFormatted.find((r) => r.value === routeData.regionId);
      setSelectedRegion(selectedRegionObj || null);

      // Fetch and set areas
      if (routeData.regionId) {
        const areasRes = await HttpSupplyChain.get(`/Area/paginated?Page=1&PageSize=100&RegionId=${routeData.regionId}`);
        const areasFormatted = areasRes.data.data?.map((a) => ({
          value: a.id,
          label: a.name,
        })) || [];
        setAreaOptions(areasFormatted);

        const selectedAreaObj = areasFormatted.find((a) => a.value === routeData.areaId);
        setSelectedArea(selectedAreaObj || null);
      }

      // Fetch and set bases
      if (routeData.areaId) {
        const basesRes = await HttpSupplyChain.get(`/WorkplaceBase/paginated?Page=1&PageSize=100&AreaId=${routeData.areaId}`);
        const basesFormatted = basesRes.data.data?.map((b) => ({
          value: b.id,
          label: b.name,
        })) || [];
        setBaseOptions(basesFormatted);

        const selectedBaseObj = basesFormatted.find((b) => b.value === routeData.workplaceBaseId);
        setSelectedBase(selectedBaseObj || null);
      }

      // Fetch places
      const placesRes = await HttpSupplyChain.get(`/Place/paginated?Page=1&PageSize=100`);
      const placesFormatted = placesRes.data.data?.map((p) => ({
        value: p.id,
        label: p.name,
      })) || [];
      setPlaceOptions(placesFormatted);

      // Pre-populate selected places - match by placeId from workplaceRoutesPlaces
      if (routeData.workplaceRoutesPlaces && Array.isArray(routeData.workplaceRoutesPlaces) && routeData.workplaceRoutesPlaces.length > 0) {
        const selectedPlacesArr = routeData.workplaceRoutesPlaces
          .map((routePlace) => {
            // Find matching place in placesFormatted by comparing placeId with value
            const matchedPlace = placesFormatted.find((p) => p.value === routePlace.placeId);
            return matchedPlace;
          })
          .filter((p) => p !== undefined && p !== null);
        setSelectedPlaces(selectedPlacesArr);
      } else {
        setSelectedPlaces([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Handle region change
  const handleRegionChange = (selectedOption) => {
    setSelectedRegion(selectedOption);
    setInputs((values) => ({ ...values, work_place_region_id: selectedOption?.value }));
    setSelectedArea(null);
    setSelectedBase(null);
    setAreaOptions([]);
    setBaseOptions([]);
    if (selectedOption?.value) {
      fetchAreas(selectedOption.value);
    }
  };

  // Handle area change
  const handleAreaChange = (selectedOption) => {
    setSelectedArea(selectedOption);
    setInputs((values) => ({ ...values, work_place_area_id: selectedOption?.value }));
    setSelectedBase(null);
    setBaseOptions([]);
    if (selectedOption?.value) {
      fetchBases(selectedOption.value);
    }
  };

  // Handle base change
  const handleBaseChange = (selectedOption) => {
    setSelectedBase(selectedOption);
    setInputs((values) => ({ ...values, work_place_base_id: selectedOption?.value }));
  };

  // Handle place change (multi-select)
  const handlePlaceChange = (selectedOptions) => {
    setSelectedPlaces(selectedOptions || []);
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        id: parseInt(id),
        regionId: parseInt(inputs.work_place_region_id) || 0,
        zoneId: parseInt(inputs.zone_id) || 0,
        areaId: parseInt(inputs.work_place_area_id) || 0,
        workplaceBaseId: parseInt(inputs.work_place_base_id) || 0,
        name: inputs.name || "",
        startedFrom: inputs.started_from || "",
        remarks: inputs.remarks || "",
        status: parseInt(inputs.status) || 0,
        places: selectedPlaces.map((p) => ({ value: parseInt(p.value) })) || [],
        updatedAt: new Date().toISOString(),
      };

      HttpSupplyChain.put(`/Route/Update/${id}`, payload)
        .then((res) => {
          navigate("/route", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response?.data?.message || { general: "An error occurred" });
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Route</h5>
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
                      Region <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      classNamePrefix="select"
                      name="region"
                      options={regionOptions}
                      onChange={handleRegionChange}
                      onInputChange={(inputValue) => {
                        if (inputValue) fetchRegions(inputValue);
                      }}
                      value={selectedRegion}
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select Region..."
                      data-required
                    />
                  </div>
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
                      Select Area <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      classNamePrefix="select"
                      name="area"
                      options={areaOptions}
                      onChange={handleAreaChange}
                      onInputChange={(inputValue) => {
                        if (inputValue && selectedRegion?.value) fetchAreas(selectedRegion.value, inputValue);
                      }}
                      value={selectedArea}
                      isClearable={true}
                      isSearchable={true}
                      isDisabled={!selectedRegion}
                      placeholder="Select Area..."
                      data-required
                    />
                  </div>
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
                      Select Base <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      classNamePrefix="select"
                      name="base"
                      options={baseOptions}
                      onChange={handleBaseChange}
                      onInputChange={(inputValue) => {
                        if (inputValue && selectedArea?.value) fetchBases(selectedArea.value, inputValue);
                      }}
                      value={selectedBase}
                      isClearable={true}
                      isSearchable={true}
                      isDisabled={!selectedArea}
                      placeholder="Select Base..."
                      data-required
                    />
                  </div>
                </div>
                <div className="row mt-3">
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
                    <label className="font-weight-bold" htmlFor="">
                      Remarks
                    </label>
                    <textarea className="form-control" name="remarks" value={inputs.remarks || ""} onChange={handleChange} placeholder="Remarks" />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
                      Places <i className="fa fa-star required"></i>
                    </label>
                    <Select
                      classNamePrefix="select"
                      name="places"
                      options={placeOptions}
                      onChange={handlePlaceChange}
                      onInputChange={(inputValue) => {
                        if (inputValue) fetchPlaces(inputValue);
                      }}
                      value={selectedPlaces}
                      isMulti={true}
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select Places..."
                      data-required
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
                      Status
                    </label>
                    <select className="form-control" name="status" value={inputs.status || 1} onChange={handleChange}>
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
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

export default Edit;