import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [apiError, setApiError] = useState("");
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [thana, setThana] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const { checkRequiredFields } = useRequiredFields();


  // Fetch Division Data
  const fetchDivisions = async (filter = "") => {
    try {
      const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
      const res = await HttpSupplyChain.get(`/Division/paginated?Page=1&PageSize=10&Status=1&${filterParam}`);
      setDivision(res?.data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Fetch District Data
  const fetchDistricts = async (filter = "", divisionId = null) => {
    try {
      const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
      const divisionParam = divisionId || inputs.division_id ? `&DivisionId=${encodeURIComponent(divisionId || inputs.division_id)}` : "";
      const res = await HttpSupplyChain.get(`/District/paginated?Page=1&PageSize=10&Status=1${divisionParam}${filterParam}`);
      setDistrict(res?.data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Fetch Thanas Data
  const fetchThanas = async (filter = "", districtId = null) => {
    try {
      const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
      const districtParam = districtId || inputs.district_id ? `&DistrictId=${encodeURIComponent(districtId || inputs.district_id)}` : "";
      const res = await HttpSupplyChain.get(`/Thana/paginated?Page=1&PageSize=10&Status=1${districtParam}${filterParam}`);
      setThana(res?.data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchData = () => {
    setLoading(true);
    Promise.all([fetchDivisions("")])
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDivisionInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchDivisions(inputValue);
    }, 300);
  };

  const handleDivisionChange = (selected) => {
    const val = selected ? selected.value : "";
    setInputs((values) => ({ ...values, division_id: val, district_id: "", thana_id: "" }));
    setSelectedDivision(selected);
    setDistrict([]);
    setSelectedDistrict(null);
    setThana([]);
    setSelectedThana(null);

    if (val) {
      fetchDistricts("", val);
    }
  };

  const handleDistrictInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchDistricts(inputValue, inputs.division_id);
    }, 300);
  };

  const handleDistrictChange = (selected) => {
    const val = selected ? selected.value : "";
    setInputs((values) => ({ ...values, district_id: val, thana_id: "" }));
    setSelectedDistrict(selected);
    setThana([]);
    setSelectedThana(null);
    if (val) {
      fetchThanas("", val);
    }
  };
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleThanaInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchThanas(inputValue, inputs.district_id);
    }, 300);
  };

  const handleThanaChange = (selected) => {
    const val = selected ? selected.value : "";
    setInputs((values) => ({ ...values, thana_id: val }));
    setSelectedThana(selected);
  };


  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };


  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        divisionId: inputs?.division_id,
        districtId: inputs?.district_id,
        thanaId: inputs?.thana_id,
        name: inputs?.name || "",
        postalCode: inputs?.postal_code || "",
        createdAt: new Date().toISOString(),
        status: 1
      };

      HttpSupplyChain.post("/Place/Create", payload)
        .then((res) => {
          navigate("/place", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setApiError(e?.response?.data?.message || "Save failed. Please try again.");
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create place</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create place Form</h6>
            {apiError && (
              <div className="alert alert-danger mg-b-20">
                <i className="fa fa-exclamation-triangle mg-r-10"></i>
                {apiError}
              </div>
            )}
            <div className="row">
              <div className="col-lg"></div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Division <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="division_id"
                  placeholder="Search and select division..."
                  isClearable
                  isSearchable
                  onInputChange={handleDivisionInputChange}
                  onChange={handleDivisionChange}
                  options={division.map((item) => ({ value: item.id, label: item.name }))}
                  value={selectedDivision}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  District <i className="fa fa-star required"></i>
                </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="district_id"
                      placeholder={inputs.division_id ? "Search and select district..." : "First select a division"}
                      isClearable
                      isSearchable
                      // isDisabled={!inputs.division_id}
                      onInputChange={handleDistrictInputChange}
                      onChange={handleDistrictChange}
                      options={inputs.division_id ? district.map((item) => ({ value: item.id, label: item.name })) : []}
                      value={selectedDistrict}
                    />
              </div>

              <div className="col-lg">
                <label htmlFor="">
                  Thana <i className="fa fa-star required"></i>
                </label>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      name="thana_id"
                      placeholder={inputs.district_id ? "Search and select thana..." : "First select a district"}
                      isClearable
                      isSearchable
                      // isDisabled={!inputs.district_id}
                      onInputChange={handleThanaInputChange}
                      onChange={handleThanaChange}
                      options={inputs.district_id ? thana.map((item) => ({ value: item.id, label: item.name })) : []}
                      value={selectedThana}
                    />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
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
                {displayError("name")}
              </div>
              <div className="col-lg">
                <label>
                  Postal Code <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="postal_code"
                  value={inputs.postal_code || ""}
                  onChange={handleChange}
                  placeholder="Input Postal Code"
                  data-required
                />
                {displayError("postal_code")}
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