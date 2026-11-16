import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/transaction/" + id + "/edit").then((res) => {
      setInputs({
        hr_staff_basic_info_id: res.data.hr_staff_basic_info_id,
        total_amount: res.data.total_amount,
        date: res.data.date,
        remarks: res.data.remarks,
      });
    });
    Http.get("/staff").then((res) => {
      setStaff(res.data);
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

  const formSubmit = () => {
    inputs.type = "arrear";
    Http.put("/transaction/" + id, inputs)
      .then((res) => {
        navigate("/arrear", {
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
          <h5 className="am-title">Edit Arrear Salary Form</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Arrear Salary Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Staff</label>
                <select
                  className="form-control"
                  name="hr_staff_basic_info_id"
                  onChange={handleChange}
                >
                  <option value="">Select Staff</option>
                  {Array.from(staff).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={
                        inputs.hr_staff_basic_info_id === item.id ? true : false
                      }
                    >
                      {item.card_no + " - " + item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label>Total Amount</label>
                <input
                  type="text"
                  className="form-control"
                  name="total_amount"
                  value={inputs.total_amount || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                  placeholder="Remarks"
                />
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
