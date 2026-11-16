import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const thanaId = parseInt(id);
  const [error, setError] = useState({});
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const { checkRequiredFields } = useRequiredFields();

  const fetchData = () => {
    setLoading(true);
    HttpSupplyChain.get("/Thana/GetById/" + thanaId)
      .then((res) => {
        const data = res?.data?.data || {};
        const divId = String(data.divisionId || "");
        const distId = String(data.districtId || "");
        setInputs({
          division_id: divId,
          district_id: distId,
          name: data.name,
          status: data.status,
          code: data.code
        });
        // Load divisions and division-scoped districts in parallel
        return Promise.all([
          HttpSupplyChain.get(`/Division/paginated?Page=1&PageSize=10`),
          divId ? HttpSupplyChain.get(`/District/paginated?Page=1&PageSize=10&Status=1&DivisionId=${divId}`) : Promise.resolve(null),
        ]).then(([divRes, distRes]) => {
          setDivisions(divRes?.data?.data || []);
          if (data.division) {
            setSelectedDivision({
              value: String(data.division.id),
              label: data.division.name,
            });
          } else if (divRes?.data?.data?.length > 0) {
            const found = divRes.data.data.find(x => String(x.id) === divId);
            if (found) {
              setSelectedDivision({ value: String(found.id), label: found.name });
            }
          }
          if (distRes) {
            setDistricts(distRes?.data?.data || []);
          }
          if (data.district) {
            setSelectedDistrict({
              value: String(data.district.id),
              label: data.district.name,
            });
          } else if (distRes?.data?.data?.length > 0) {
            const found = distRes.data.data.find(x => String(x.id) === distId);
            if (found) {
              setSelectedDistrict({ value: String(found.id), label: found.name });
            }
          }
        });
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        setError(e?.response?.data?.message || "Failed to load thana data");
      })
      .finally(() => setLoading(false));
  };

  const fetchDivisions = (filter) => {
    const filterParam = filter ? `&Filter=${encodeURIComponent(filter)}` : "";
    HttpSupplyChain.get(`/Division/paginated?Page=1&PageSize=10${filterParam}`)
      .then((res) => {
        setDivisions(res?.data?.data || []);
      })
      .catch((e) => {
        setError(e?.response?.data?.message || "Failed to load divisions");
      });
  };

  const handleDivisionInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetchDivisions(inputValue);
    }, 300);
  };

  const handleDivisionChange = (selected) => {
    const val = selected ? String(selected.value) : "";
    setInputs((values) => ({ ...values, division_id: val, district_id: "" }));
    setSelectedDivision(selected);
    setDistricts([]);
    setSelectedDistrict(null);
   
    if (val) {
      HttpSupplyChain.get(`/District/paginated?Page=1&PageSize=10&Status=1&DivisionId=${val}`)
        .then((res) => {
          setDistricts(res?.data?.data || []);
        })
        .catch((e) => console.error("Failed to load districts", e));
    }
  };

  const handleDistrictInputChange = (inputValue) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const divisionId = inputs.division_id;
      if (divisionId) {
        const filterParam = inputValue ? `&Filter=${encodeURIComponent(inputValue)}` : "";
        HttpSupplyChain.get(`/District/paginated?Page=1&PageSize=10&Status=1&DivisionId=${divisionId}${filterParam}`)
          .then((res) => {
            setDistricts(res?.data?.data || []);
          })
          .catch((e) => console.error("Failed to search districts", e));
      }
    }, 300);
  };

  const handleDistrictChange = (selected) => {
    const val = selected ? String(selected.value) : "";
    setInputs((values) => ({ ...values, district_id: val }));
    setSelectedDistrict(selected);
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
        divisionId: parseInt(inputs.division_id),
        districtId: parseInt(inputs.district_id),
        name: inputs.name || "",
        code: inputs.code || "",
        status: parseInt(inputs.status),
        id: thanaId,
        updatedAt: new Date().toISOString(),
      };
      HttpSupplyChain.put("/Thana/Update/" + id, payload)
        .then((res) => {
          navigate("/thana", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response?.data?.message || "Failed to update thana");
        });
    }
  };

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Thana</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Thana Form</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
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
                  options={divisions.map((item) => ({ value: String(item.id), label: item.name }))}
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
                  options={districts.map((item) => ({ value: String(item.id), label: item.name }))}
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
                />
              </div>
              <div className="col-lg">
                <label>
                  Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={inputs.code || ""}
                  onChange={handleChange}
                  placeholder="Input Code"
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Status <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  value={inputs.status ?? 1}
                  onChange={handleChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
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
        </div>
      </div>
    </div>
  );
};

export default Edit;