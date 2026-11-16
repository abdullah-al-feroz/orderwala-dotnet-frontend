import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const EditLeaveRules = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const { checkRequiredFields } = useRequiredFields();

  const fetchData = () => {
    Http.get("/weekly-off-day/" + id + "/edit").then((res) => {
      setInputs({
        year: res.data.year,
        day: res.data.day,
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
    if (checkRequiredFields()) {
      Http.put("/weekly-off-day/" + id, inputs).then((res) => {
        navigate("/weekly-off-day", {
          state: { message: res.data.message, type: res.data.type },
        });
      });
    }
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Weekly Off Day</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Weekly Off Day</h6>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Year <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Year"
                  name="year"
                  value={inputs.year || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">Day</label>
                <select
                  className="form-control"
                  name="day"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Day</option>
                  <option value="1" selected={inputs.day == 1 ? true : false}>
                    Saturday
                  </option>
                  <option value="2" selected={inputs.day == 2 ? true : false}>
                    Sunday
                  </option>
                  <option value="3" selected={inputs.day == 3 ? true : false}>
                    Monday
                  </option>
                  <option value="4" selected={inputs.day == 4 ? true : false}>
                    Tuesday
                  </option>
                  <option value="5" selected={inputs.day == 5 ? true : false}>
                    Wednesday
                  </option>
                  <option value="6" selected={inputs.day == 6 ? true : false}>
                    Thursday
                  </option>
                  <option value="7" selected={inputs.day == 7 ? true : false}>
                    Friday
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

export default EditLeaveRules;
