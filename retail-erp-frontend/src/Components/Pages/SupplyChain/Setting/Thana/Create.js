import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";
import FormValidation from "../../../../Common/FormValidation";
import { ProgressSpinner } from "primereact/progressspinner";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [division, setDivision] = useState([]);
  const [district, setDistrict] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const { checkRequiredFields } = useRequiredFields();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  // Fetch Division Data
  const fetchDivisions = async (filter = "") => {
    try {
      const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
      const res = await HttpSupplyChain.get(`/Division/paginated?Page=1&PageSize=10&Status=1&${filterParam}`)
      setDivision(res?.data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () => {
    fetchDivisions("");
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
    setInputs((values) => ({ ...values, division_id: val, district_id: "" }));
    setSelectedDivision(selected);
    setDistrict([]);
    setSelectedDistrict(null);

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
    setInputs((values) => ({ ...values, district_id: val }));
    setSelectedDistrict(selected);
  };

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
        name: inputs?.name || "",
        createdAt: new Date().toISOString(),
        status: 1
      };

      HttpSupplyChain.post("/Thana/Create", payload)
        .then((res) => {
          navigate("/thana", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response.data.message);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Thana</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Thana Form</h6>
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
                      placeholder="Search and select district..."
                      isClearable
                      isSearchable
                      onInputChange={handleDistrictInputChange}
                      onChange={handleDistrictChange}
                      options={district.map((item) => ({ value: item.id, label: item.name }))}
                      value={selectedDistrict}
                    />
                  </div>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;