import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [company, setCompany] = useState([]);
  const [outSideCompany, setOutSideCompany] = useState([]);
  const { checkRequiredFields } = useRequiredFields();
  const [loading, setLoading] = useState(false);

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
  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const outsideCompanyResponse = await Http.get("/me");

      setOutSideCompany(outsideCompanyResponse.data);

      const companyResponse = await Http.get(
        "/select2/SupplyChainPurchaseManagement.Vendor/id,name"
      );
      setCompany(companyResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const formSubmit = () => {
  //   if (checkRequiredFields()) {
  //     if (outSideCompany?.data?.user_type === "other-company") {
  //       setInputs((prevInputs) => ({
  //         ...prevInputs,
  //         company_id: outSideCompany.data.id,
  //       }));
  //     }
  //     Http.post("/brand", inputs)
  //       .then((res) => {
  //         navigate("/brand", {
  //           state: { message: res.data.message, type: "success" },
  //         });
  //       })
  //       .catch(function (e) {
  //         setError(e.response.data.errors);
  //       });
  //   }
  // };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      // Create a local variable for inputs
      let updatedInputs = { ...inputs };

      // Add company_id if the user type is "other-company"
      if (outSideCompany?.data?.user_type === "other-company") {
        updatedInputs.company_id = outSideCompany.data.id;
      }

      // Send the updated inputs in the API call
      Http.post("/brand", updatedInputs)
        .then((res) => {
          navigate("/brand", {
            state: { message: res.data.message, type: "success" },
          });
        })
        .catch((e) => {
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
          <h5 className="am-title">Create Brand</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Brand Form</h6>
            <div className="row">
              {outSideCompany?.data?.user_type !== "other-company" && (
                <div
                  className={`${
                    outSideCompany?.data?.user_type !== "other-company"
                      ? "col-lg-4"
                      : "col-lg-6"
                  }`}
                >
                  <label>
                    Company <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={company[0]}
                    name="company_id"
                    options={company}
                    onChange={selectHandleChange}
                    placeholder="Select Company"
                  />
                </div>
              )}
              {/* <div className="col-lg">
                <label htmlFor="">
                  Company <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={company[0]}
                  name="company_id"
                  options={company}
                  onChange={selectHandleChange}
                />
              </div> */}
              <div
                className={`${
                  outSideCompany?.data?.user_type !== "other-company"
                    ? "col-lg-4"
                    : "col-lg-6"
                }`}
              >
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
              <div
                className={`mt-4 ${
                  outSideCompany?.data?.user_type !== "other-company"
                    ? "col-lg-4"
                    : "col-lg-4"
                }`}
              >
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
