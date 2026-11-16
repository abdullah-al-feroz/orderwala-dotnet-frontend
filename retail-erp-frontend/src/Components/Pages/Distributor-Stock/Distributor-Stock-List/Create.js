import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { checkRequiredFields } = useRequiredFields();
  const [inputs, setInputs] = useState({
    type,
    mushok_6_4_show: true,
    status: "active",
  }); // initialized type from useParams
  const [distributor, setDistributor] = useState([]);

  // const [unitSupply, setUnitSupply] = useState([]);

  const [error, setError] = useState({});
  const [isRequired, setIsRequired] = useState(false);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Default Load
  const fetchData = async () => {
    const distributorData = await Http.get("/distributor2");
    const codeData = await Http.get(
      "/last-code-increment-by-one/products/code/P"
    );

    setDistributor(distributorData.data);
    // setUnitSupply(unitData.data);
    // setCategory(categoryData.data);
    setInputs((prevInputs) => ({
      ...prevInputs,
      code: codeData.data,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formSubmit = () => {
    if (checkRequiredFields()) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        type: type,
      }));

      Http.post("/product", inputs, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          navigate("/product", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Product</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Select Distributor <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={distributor[0]}
                  name="distributor_id"
                  options={distributor}
                  onChange={selectHandleChange}
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
