import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";
import useRequiredFields from "../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formRows, setFormRows] = useState([]);
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const fetchData = async () => {
    try {
      const userResponse = await Http.get(`/distributor-wise-place/${id}`);
      const placeData = userResponse.data;

      if (placeData.length === 0) {
        // If no data, show a blank form row
        const division = await fetchDivisionOptions();
        setFormRows([
          {
            inputs: {},
            division,
            district: [],
            thana: [],
            place: [],
            selectedPlace: [],
          },
        ]);
        return;
      }

      const transformedFormRows = await Promise.all(
        placeData.map(async (item) => {
          const division = await fetchDivisionOptions();
          const district = await fetchDistrictOptions(item.division_id);
          const thana = await fetchThanaOptions(item.district_id);
          const place = await fetchPlaceOptions(item.thana_id);

          return {
            inputs: {
              division_id: item.division_id,
              district_id: item.district_id,
              thana_id: item.thana_id,
            },
            division,
            district,
            thana,
            place,
            selectedPlace: item.place_id.map((place) => ({
              value: place.id,
              label: `Place ${place.id}`,
            })),
          };
        })
      );

      setFormRows(transformedFormRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDivisionOptions = async () => {
    const response = await Http.get(
      "/select2/SupplyChainPurchaseManagement.Setting.Division/id,name"
    );
    return response.data;
  };

  const fetchDistrictOptions = async (divisionId) => {
    const response = await Http.get(
      `/select2/SupplyChainPurchaseManagement.Setting.District/id,name/division_id:${divisionId}`
    );
    return response.data;
  };

  const fetchThanaOptions = async (districtId) => {
    const response = await Http.get(
      `/select2/SupplyChainPurchaseManagement.Setting.Thana/id,name/district_id:${districtId}`
    );
    return response.data;
  };

  const fetchPlaceOptions = async (thanaId) => {
    const response = await Http.get(
      `/select2/SupplyChainPurchaseManagement.Setting.Place/id,name/thana_id:${thanaId}`
    );
    return response.data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateFormRow = (index, key, value) => {
    setFormRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index][key] = value;
      return updatedRows;
    });
  };

  const handleSelectChange = async (index, selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption?.value;

    updateFormRow(index, "inputs", {
      ...formRows[index].inputs,
      [name]: value,
    });

    if (name === "division_id") {
      const districts = await fetchDistrictOptions(value);
      updateFormRow(index, "district", districts);
      updateFormRow(index, "thana", []);
      updateFormRow(index, "place", []);
    }
    if (name === "district_id") {
      const thanas = await fetchThanaOptions(value);
      updateFormRow(index, "thana", thanas);
      updateFormRow(index, "place", []);
    }
    if (name === "thana_id") {
      const places = await fetchPlaceOptions(value);
      updateFormRow(index, "place", places);
    }
  };

  const addMoreRows = async () => {
    const division = await fetchDivisionOptions();
    setFormRows((prevRows) => [
      ...prevRows,
      {
        inputs: {},
        division,
        district: [],
        thana: [],
        place: [],
        selectedPlace: [],
      },
    ]);
  };

  const handleFormSubmit = async () => {
    if (checkRequiredFields()) {
      try {
        const response = await Http.put(
          `/distributor-place/${id}`,
          formRows.map((row) => ({
            ...row.inputs,
            place_id: row.selectedPlace.map((place) => place.value),
          }))
        );
        navigate("/distributors", {
          state: { message: response.data.message, type: "success" },
        });
      } catch (error) {
        setError(error.response.data.errors);
      }
    }
  };

  return (
    <div>
      <IsLogin />
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Place</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Place Form</h6>

            {formRows.map((row, index) => (
              <div className="card mb-4" key={index}>
                <div className="card-header">
                  <h6 className="mb-0">Row {index + 1}</h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-lg-4">
                      <label className="form-label">Division</label>
                      <Select
                        value={
                          row.division.find(
                            (option) => option.value === row.inputs.division_id
                          ) || null
                        }
                        options={row.division}
                        name="division_id"
                        onChange={(option, actionMeta) =>
                          handleSelectChange(index, option, actionMeta)
                        }
                      />
                    </div>
                    <div className="col-lg-4">
                      <label className="form-label">District</label>
                      <Select
                        value={
                          row.district.find(
                            (option) => option.value === row.inputs.district_id
                          ) || null
                        }
                        options={row.district}
                        name="district_id"
                        onChange={(option, actionMeta) =>
                          handleSelectChange(index, option, actionMeta)
                        }
                      />
                    </div>
                    <div className="col-lg-4">
                      <label className="form-label">Thana</label>
                      <Select
                        value={
                          row.thana.find(
                            (option) => option.value === row.inputs.thana_id
                          ) || null
                        }
                        options={row.thana}
                        name="thana_id"
                        onChange={(option, actionMeta) =>
                          handleSelectChange(index, option, actionMeta)
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-12">
                      <label className="form-label">Places</label>
                      <Select
                        isMulti
                        value={row.selectedPlace}
                        options={row.place}
                        onChange={(values) =>
                          updateFormRow(index, "selectedPlace", values)
                        }
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-12 text-end">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          setFormRows((prevRows) =>
                            prevRows.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove Row
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="row mt-3">
              <div className="col-lg-12 text-end">
                <button className="btn btn-info mr-3" onClick={addMoreRows}>
                  Add More
                </button>
                <button className="btn btn-primary" onClick={handleFormSubmit}>
                  Update
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
