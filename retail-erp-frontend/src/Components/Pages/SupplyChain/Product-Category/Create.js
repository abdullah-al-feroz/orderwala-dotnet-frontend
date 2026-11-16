import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [category, setCategory] = useState({});
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const { checkRequiredFields } = useRequiredFields();

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
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = () => {
    Http.get(
      "/select2/SupplyChainPurchaseManagement.ProductCategory/id,name"
    ).then((res) => {
      setCategory(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*const formSubmit = () => {
    Http.post("/product-category", inputs)
      .then((res) => {
        navigate("/product-category", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };*/
  const formSubmit = () => {
    if (checkRequiredFields()) {
      const formData = new FormData();

      // Append all text inputs to the formData
      Object.keys(inputs).forEach((key) => {
        formData.append(key, inputs[key]);
      });

      // Append the file to formData
      if (selectedFile) {
        formData.append("image", selectedFile, selectedFile.name);
      }

      // Send the request with formData
      Http.post("/product-category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          navigate("/product-category", {
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
          <h5 className="am-title">Create Product Category</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Product Category Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Parent Category</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={category[0]}
                  name="parent_id"
                  options={category}
                  onChange={selectHandleChange}
                />
              </div>
              <div className="col-lg">
                <label>
                  Category Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name_en"
                  value={inputs.name_en || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                  data-required
                />
                {displayError("name")}
              </div>
              <div className="col-lg">
                <label>
                  Category Name (Bangla) <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name (Bangla)"
                  data-required
                />
                {displayError("name")}
              </div>
              <div className="col-lg">
                <label>
                  Category Image <i className="fa fa-star required"></i>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
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
