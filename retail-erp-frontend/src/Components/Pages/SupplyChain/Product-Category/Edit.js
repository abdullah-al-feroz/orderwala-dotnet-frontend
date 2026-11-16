import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [category, setCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const fetchData = () => {
    Http.get("/product-category/" + id + "/edit").then((res) => {
      setInputs({
        name: res.data.name,
        name_en: res.data.name_en,
        status: res.data.status,
      });
      setSelectedCategory({
        label: res.data.parent ? res.data.parent.name : "",
        value: res.data.parent ? res.data.parent.id : "",
      });
    });

    Http.get(
      "/select2/SupplyChainPurchaseManagement.ProductCategory/id,name"
    ).then((res) => {
      setCategory(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsSelected(true);
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setSelectedCategory({
      label: selectedOption.label,
      value: selectedOption.value,
    });
  };

  // const formSubmit = () => {
  //   Http.put("/product-category/" + id, inputs)
  //     .then((res) => {
  //       navigate("/product-category", {
  //         state: { message: res.data.message, type: res.data.type },
  //       });
  //     })
  //     .catch(function (e) {
  //       setError(e.response.data.errors);
  //     });
  // };

  const formSubmit = () => {
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
    // Using POST request with '_method' set to 'PUT' as a workaround for PUT with FormData
    formData.append("_method", "PUT");

    Http.post("/product-category/" + id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        navigate("/product-category", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Product Category</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Product Category Form
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
                  defaultValue={selectedCategory}
                  value={selectedCategory}
                  onChange={selectHandleChange}
                  name="parent_id"
                  options={category}
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
                />
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
                />
              </div>
              <div className="col-lg">
                <label>
                  Category Image <i className="fa fa-star required"></i>
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="cv"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Status <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  onChange={handleChange}
                >
                  <option
                    value="active"
                    selected={inputs.status === "active" ? true : false}
                  >
                    Active
                  </option>
                  <option
                    value="inactive"
                    selected={inputs.status === "inactive" ? true : false}
                  >
                    inactive
                  </option>
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
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Edit;
