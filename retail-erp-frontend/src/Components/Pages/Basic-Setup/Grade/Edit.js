import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import FormValidation from "../../../Common/FormValidation";
import HttpHR from "../../../Common/HttpHR";

const Edit = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const { id } = useParams();
  const gradeId = parseInt(id);
  const { checkRequiredFields } = useRequiredFields();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const res = await HttpHR.get("/Grades/GetById/" + gradeId);
        const { data } = res.data;
        setInputs({
          name: data.name,
          gradeCode: data.gradeCode,
          incrementRate: data.incrementRate,
          basicSalary: data.basicSalary,
          houseRent: data.houseRent,
          medicalAllowance: data.medicalAllowance,
          conveyanceAllowance: data.conveyanceAllowance,
          entertainmentAllowance: data.entertainmentAllowance,
          tadaAllowance: data.tadaAllowance,
          sellCenterAllowance: data.sellCenterAllowance,
          holidayRate: data.holidayRate,
          insuranceRate: data.insuranceRate,
          incomeTax: data.incomeTax,
          grossSalary: data.grossSalary,
          phoneBillLimit: data.phoneBillLimit,
          canteenBill: data.canteenBill,
          otherAllowance: data.otherAllowance,
          circularNo: data.circularNo,
          circularDate: data?.circularDate?.split("T")[0],
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const salaryChk = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      const updated = { ...prev, [name]: value };
      const sum = ["basicSalary", "houseRent", "medicalAllowance", "conveyanceAllowance",
        "entertainmentAllowance", "tadaAllowance", "sellCenterAllowance", "holidayRate",
        "canteenBill", "otherAllowance"]
        .reduce((acc, key) => acc + (parseInt(updated[key]) || 0), 0);
      return { ...updated, grossSalary: sum };
    });
  };

  const formSubmit = () => {
    const payload = {
      ...inputs,
      id: gradeId,
      status: 1,
      updateAt: new Date().toISOString()
    };
    if (checkRequiredFields()) {
      HttpHR.put("/Grades/Update/" + gradeId, payload)
        .then((res) => {
          navigate("/grade", {
            state: { message: res?.data?.message, type: "success" },
          });
        })
        .catch(function (e) {
          setError(e?.response?.data?.message);
        });
    }
  };

  return (
    <div>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Grade</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Grade Form</h6>

            {loading ? (
              <ProgressSpinner />
            ) : (
              <div>
                <div className="row">
                  <div className="col-lg">
                    <FormValidation error={error} />
                  </div>
                </div>
                <div className="row mb-3">
                  {/* Name */}
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="">
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
                  </div>
                  {/* Grade Code */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="gradeCode">
                      Grade Code <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="gradeCode"
                      value={inputs.gradeCode || ""}
                      onChange={handleChange}
                      placeholder="Input Grade Code"
                      data-required
                    />
                  </div>
                  {/* Increment Rate */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="incrementRate">
                      Increment Rate <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="incrementRate"
                      value={inputs.incrementRate || ""}
                      onChange={handleChange}
                      placeholder="Input Increment Rate"
                      data-required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Basic Salary */}
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="basicSalary">
                      Basic Salary <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="basicSalary"
                      value={inputs.basicSalary || ""}
                      onChange={salaryChk}
                      placeholder="Input Basic Salary"
                      data-required
                    />
                  </div>
                  {/* House Rent */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="house_rent">
                      House Rent <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="houseRent"
                      value={inputs.houseRent || ""}
                      onChange={salaryChk}
                      placeholder="Input House Rent"
                      data-required
                    />
                  </div>
                  {/* Medical Allowance */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="medicalAllowance">
                      Medical Allowance <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="medicalAllowance"
                      value={inputs.medicalAllowance || ""}
                      onChange={salaryChk}
                      placeholder="Input Medical Allowance"
                      data-required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Conveyence Allowence */}
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="conveyanceAllowance">
                      Conveyence Allowence <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="conveyanceAllowance"
                      value={inputs.conveyanceAllowance || ""}
                      onChange={salaryChk}
                      placeholder="Input Conveyence Allowence"
                      data-required
                    />
                  </div>
                  {/* Entertainment Allowence */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="entertainmentAllowance">
                      Entertainment Allowence <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="entertainmentAllowance"
                      value={inputs.entertainmentAllowance || ""}
                      onChange={salaryChk}
                      placeholder="Input Entertainment Allowence"
                      data-required
                    />
                  </div>
                  {/* TA / DA */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="tadaAllowance">
                      TA / DA <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="tadaAllowance"
                      value={inputs.tadaAllowance || ""}
                      onChange={salaryChk}
                      placeholder="Input TA / DA"
                      data-required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Sale Center Allowence */}
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="sellCenterAllowance">
                      Sale Center Allowence <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="sellCenterAllowance"
                      value={inputs.sellCenterAllowance || ""}
                      onChange={salaryChk}
                      placeholder="Sell Center Allowence"
                      data-required
                    />
                  </div>
                  {/* Holiday Rate */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="holidayRate">
                      Holiday Rate <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="holidayRate"
                      value={inputs.holidayRate || ""}
                      onChange={salaryChk}
                      placeholder="Input Holiday Rate"
                      data-required
                    />
                  </div>
                  {/* Insurance Rate */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="insuranceRate">
                      Insurance Rate <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="insuranceRate"
                      value={inputs.insuranceRate || ""}
                      onChange={salaryChk}
                      placeholder="Input Insurance Rate"
                      data-required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Income Tax */}
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="incomeTax">
                      Income Tax <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="incomeTax"
                      value={inputs.incomeTax || ""}
                      onChange={salaryChk}
                      placeholder="Input Income Tax"
                      data-required
                    />
                  </div>
                  {/* Gross Salary */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="grossSalary">
                      Gross Salary <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="grossSalary"
                      value={inputs.grossSalary || ""}
                      onChange={salaryChk}
                      placeholder="Input Gross Salary"
                      readOnly
                      data-required
                    />
                  </div>
                  {/* Phone Bill Limit */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="phoneBillLimit">
                      Phone Bill Limit <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="phoneBillLimit"
                      value={inputs.phoneBillLimit || ""}
                      onChange={salaryChk}
                      placeholder="Input Phone Bill Limit"
                      data-required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  {/* Canteen */}
                  <div className="col-lg">
                    <label className="font-weight-bold" htmlFor="canteenBill">
                      Canteen <i className="fa fa-star required"></i>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="canteenBill"
                      value={inputs.canteenBill || ""}
                      onChange={salaryChk}
                      placeholder="Input Canteen"
                      data-required
                    />
                  </div>
                  {/* Other Allowance */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="otherAllowance">
                      Others
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="otherAllowance"
                      value={inputs.otherAllowance || ""}
                      onChange={salaryChk}
                      placeholder="Input Others"
                    />
                  </div>
                  {/* Circular No */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="circularNo">
                      Circular No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="circularNo"
                      value={inputs.circularNo || ""}
                      onChange={handleChange}
                      placeholder="Input Circular No"
                    />
                  </div>
                  {/* Circular Date */}
                  <div className="col-lg mg-t-10 mg-lg-t-0">
                    <label className="font-weight-bold" htmlFor="circularDate">
                      Circular Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="circularDate"
                      value={inputs.circularDate || ""}
                      onChange={handleChange}
                      placeholder="Input Circular Date"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-3">
                    <button className="btn btn-primary btn-block mg-b-10" onClick={formSubmit}>
                      <i className="fa fa-send mg-r-10"></i> Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;