import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();

  const fetchData = () => {
    Http.get("/setting").then((res) => {
      setInputs({
        entry_time: res.data.entry_time,
        last_time: res.data.last_time,
        distance: res.data.distance,
        hr_attendance_distance: res.data.hr_attendance_distance,
        late_count_day_earn_leave: res.data.late_count_day_earn_leave,
        late_count_day: res.data.late_count_day,
        late_attendance_salary_deduct: res.data.late_attendance_salary_deduct,
        increment: res.data.increment,
        promotion: res.data.promotion,
      });
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
    Http.put("/setting/1", inputs).then((res) => {
      Swal.fire("Successfully Updated!", "Setting Updated", "success");
    });
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Setting</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Setting</h6>
            <div className="row mt-5">
              <div className="col-lg">
                <h5 className="font-weight-bold">Attendance (Time)</h5>
                <hr />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">Entry Time</label>
                <input
                  type="text"
                  className="form-control"
                  name="entry_time"
                  value={inputs.entry_time || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">Last Time</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_time"
                  value={inputs.last_time || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">Distance</label>
                <input
                  type="text"
                  className="form-control"
                  name="hr_attendance_distance"
                  value={inputs.hr_attendance_distance || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-lg">
                <h5 className="font-weight-bold">Salary Deduction</h5>
                <hr />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Late Count Day For Earn Leave Calculation
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="late_count_day_earn_leave"
                  value={inputs.late_count_day_earn_leave || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">Late Count Day</label>
                <input
                  type="text"
                  className="form-control"
                  name="late_count_day"
                  value={inputs.late_count_day || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Late Attendance Salary Deduct
                </label>{" "}
                <br />
                <input
                  type="radio"
                  name="late_attendance_salary_deduct"
                  value="no"
                  checked={
                    inputs.late_attendance_salary_deduct == "no" ? true : false
                  }
                  onChange={handleChange}
                />{" "}
                No &nbsp;
                <input
                  type="radio"
                  name="late_attendance_salary_deduct"
                  value="gross"
                  checked={
                    inputs.late_attendance_salary_deduct == "gross"
                      ? true
                      : false
                  }
                  onChange={handleChange}
                />{" "}
                Gross &nbsp;
                <input
                  type="radio"
                  name="late_attendance_salary_deduct"
                  value="basic"
                  checked={
                    inputs.late_attendance_salary_deduct == "basic"
                      ? true
                      : false
                  }
                  onChange={handleChange}
                />{" "}
                Basic
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-lg">
                <h5>APA</h5>
                <hr />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">Increment (Month)</label>
                <input
                  type="text"
                  className="form-control"
                  name="increment"
                  value={inputs.increment || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Promotion/Upgradation (Month)
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="promotion"
                  value={inputs.promotion || ""}
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
                  <i className="fa fa-send mg-r-10"></i> Save
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
