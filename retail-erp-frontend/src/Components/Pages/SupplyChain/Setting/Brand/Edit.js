// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Http from "../../../../Common/Http";
// import { LoaderComponent } from "../../../../Common/LoaderComponent";
// import FormValidation from "../../../../Common/FormValidation";
// import Select from "react-select";

// const Edit = (props) => {
//   const navigate = useNavigate();
//   const [inputs, setInputs] = useState({});
//   const { id } = useParams();
//   const [error, setError] = useState({});
//   const [company, setCompany] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState([]);

//   const selectHandleChange = (selectedOption, actionMeta) => {
//     const name = actionMeta.name;
//     const value = selectedOption.value;
//     setInputs((values) => ({ ...values, [name]: value }));

//     setSelectedCompany({
//       label: selectedOption.label,
//       value: selectedOption.value,
//     });
//   };
//   const fetchData = () => {
//     Http.get("/brand/" + id + "/edit").then((res) => {
//       setInputs({
//         name: res.data.name,
//         status: res.data.status,
//       });
//       setSelectedCompany({
//         label: res.data.vendor.name,
//         value: res.data.vendor.id,
//       });
//     });
//     Http.get("/select2/SupplyChainPurchaseManagement.Vendor/id,name").then(
//       (res) => {
//         setCompany(res.data);
//       }
//     );
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setInputs((values) => ({ ...values, [name]: value }));
//   };

//   const formSubmit = () => {
//     console.log(inputs);
//     Http.put("/brand/" + id, inputs)
//       .then((res) => {
//         navigate("/brand", {
//           state: { message: res.data.message, type: res.data.type },
//         });
//       })
//       .catch(function (e) {
//         setError(e.response.data.errors);
//       });
//   };

//   return (
//     <div>
//       <LoaderComponent />
//       <div className="am-mainpanel">
//         <div className="am-pagetitle">
//           <h5 className="am-title">Create brand</h5>
//         </div>
//         <div className="am-pagebody">
//           <div className="card pd-20 pd-sm-40">
//             <h6 className="card-body-title mg-sm-b-30">Edit brand Form</h6>
//             <div className="row">
//               <div className="col-lg">
//                 <FormValidation error={error} />
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg">
//                 <label htmlFor="">
//                   Company <i className="fa fa-star required"></i>
//                 </label>
//                 <Select
//                   className="basic-single"
//                   classNamePrefix="select"
//                   defaultValue={selectedCompany}
//                   value={selectedCompany}
//                   onChange={selectHandleChange}
//                   name="company_id"
//                   options={company}
//                 />
//               </div>
//               <div className="col-lg">
//                 <label>
//                   Name <i className="fa fa-star required"></i>
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="name"
//                   value={inputs.name || ""}
//                   onChange={handleChange}
//                   placeholder="Input Name"
//                 />
//               </div>
//               <div className="col-lg mg-t-10 mg-lg-t-0">
//                 <label>
//                   Status <i className="fa fa-star required"></i>
//                 </label>
//                 <select
//                   className="form-control"
//                   name="status"
//                   onChange={handleChange}
//                 >
//                   <option
//                     value="active"
//                     selected={inputs.status === "active" ? true : false}
//                   >
//                     Active
//                   </option>
//                   <option
//                     value="inactive"
//                     selected={inputs.status === "inactive" ? true : false}
//                   >
//                     inactive
//                   </option>
//                 </select>
//               </div>
//             </div>

//             <div className="row mt-3">
//               <div className="col-3">
//                 <button
//                   className="btn btn-primary btn-block mg-b-10"
//                   onClick={formSubmit}
//                 >
//                   <i className="fa fa-send mg-r-10"></i> Update
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* card */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Edit;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../../Common/Http";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

      const brandResponse = await Http.get(`/brand/${id}/edit`);
      setInputs({
        name: brandResponse.data.name,
        company_id: brandResponse.data.vendor?.id || "",
        status: brandResponse.data.status,
      });

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

  const formSubmit = () => {
    if (checkRequiredFields()) {
      let updatedInputs = { ...inputs };

      if (outSideCompany?.data?.user_type === "other-company") {
        updatedInputs.company_id = outSideCompany.data.id;
      }

      Http.put(`/brand/${id}`, updatedInputs)
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
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Brand</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Brand Form</h6>
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
                    defaultValue={company.find(
                      (c) => c.value === inputs.company_id
                    )}
                    name="company_id"
                    options={company}
                    onChange={selectHandleChange}
                    placeholder="Select Company"
                  />
                </div>
              )}
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
              <div className="col-lg">
                <label>
                  Status <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="status"
                  value={inputs.status || ""}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {displayError("status")}
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
