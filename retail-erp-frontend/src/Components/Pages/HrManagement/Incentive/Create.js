import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const CreateIncentive = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };

  // Default Load
  const fetchData = () => {
    Http.get("/staff2").then((res) => {
      setStaff(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    getCurrentDateInput();
  }, []);
  // End Default Load

  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.type = "incentive";
      Http.post("/transaction", inputs)
        .then((res) => {
          navigate("/incentive", {
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
          <h5 className="am-title">Create Incentive</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Incentive</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Staff <i class="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={staff[0]}
                  name="hr_staff_basic_info_id"
                  options={staff}
                  onChange={selectHandleChange}
                />

                {/* <select
                  className="form-control"
                  name="hr_staff_basic_info_id"
                  onChange={handleChange}
                >
                  <option value="">Select Staff</option>
                  {Array.from(staff).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.card_no + " - " + item.name}
                    </option>
                  ))}
                </select> */}
              </div>
              <div className="col-lg">
                <label>
                  Total Amount <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="total_amount"
                  value={inputs.total_amount || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label>
                  Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>Remarks</label>
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

export default CreateIncentive;
