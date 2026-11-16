import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const EditRegion = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});
  const [selectedStaff, setSelectedStaff] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/staff2").then((res) => {
      setStaff(res.data);
    });
    Http.get("/leave-deduction/" + id + "/edit").then((res) => {
      setInputs({
        hr_staff_basic_info_id: res.data.hr_staff_basic_info_id,
        year: res.data.year,
        casual: res.data.casual,
        sick: res.data.sick,
        earn: res.data.earn,
        others: res.data.others,
        remarks: res.data.remarks,
      });

      setSelectedStaff({
        label: res.data.staff.name,
        value: res.data.staff.id,
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    Http.put("/leave-deduction/" + id, inputs)
      .then((res) => {
        navigate("/leave-deduction", {
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
          <h5 className="am-title">Edit Leave Deduction</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Leave Deduction Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  Staff <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedStaff}
                  value={selectedStaff}
                  onChange={selectHandleChange}
                  name="hr_staff_basic_info_id"
                  options={staff}
                />

                {/* <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={staff[1]}
                  name="hr_staff_basic_info_id"
                  options={staff}
                  onChange={selectHandleChange}
                /> */}
              </div>
              <div className="col-lg">
                <label>
                  Year <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="year"
                  value={inputs.year || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="casual">Casual</option>
                </select>
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="casual"
                  value={inputs.casual || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="sick">Sick</option>
                </select>
              </div>

              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="sick"
                  value={inputs.sick || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="others"
                  value={inputs.others || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label className="font-weight-bold">Leave Type</label>
                <select className="form-control" disabled>
                  <option value="earn">Earn</option>
                </select>
              </div>

              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="earn"
                  value={inputs.earn || ""}
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

export default EditRegion;
