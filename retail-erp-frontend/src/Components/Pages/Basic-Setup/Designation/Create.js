import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
// import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});

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

  const formSubmit = () => {
    // if (checkRequiredFields()) {
    checkRequiredFields();
    Http.post("/createDesignation", inputs)
      .then((res) => {
        navigate("/designation", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
    // }
  };

  // Default Load
  const fetchData = () => {
    Http.get(
      "/last-code-increment-by-one/designations/designation_code/D"
    ).then((res) => {
      setInputs({
        designation_code: res.data,
      });
    });
  };
  useEffect(() => {
    fetchData(); // Get All Fetch Info/Data
  }, []);
  // End Default Load

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Designation</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Designation Form
            </h6>
            {/* <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div> */}
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                  data-required // Add this custom attribute to make this field required
                />
                {displayError("name")}

                {/* <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                /> */}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  Code <i className="fa fa-star required"></i>
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="designation_code"
                  value={inputs.designation_code || ""}
                  onChange={handleChange}
                  placeholder="Input Designation Code"
                  data-required
                />
                {displayError("designation_code")}
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
