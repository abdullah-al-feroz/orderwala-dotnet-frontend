import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const EditLeaveRules = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [department, setDepartment] = useState({});
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const fetchData = () => {
    Http.get("/leave-rules/" + id + "/edit").then((res) => {
      setInputs({
        type: res.data.type,
        start_date: res.data.start_date,
        end_date: res.data.end_date,
        total_days: res.data.total_days,
        department_id: res.data.department_id,
      });
    });

    Http.get("/department").then((res) => {
      setDepartment(res.data);
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
      Http.put("/leave-rules/" + id, inputs)
        .then((res) => {
          navigate("/leave-rules", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Leave Rules</h5>
        </div>

        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Leave Rules Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">Department</label>
                <select
                  className="form-control"
                  name="department_id"
                  onChange={handleChange}
                >
                  <option
                    value="all"
                    selected={inputs.department_id == "all" ? true : false}
                  >
                    All
                  </option>
                  {Array.from(department).map((item, index) => (
                    <option
                      value={item.id}
                      selected={inputs.department_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label className="font-weight-bold">Type</label>
                <select
                  className="form-control"
                  name="type"
                  onChange={handleChange}
                >
                  <option
                    value="casual"
                    selected={inputs.type === "casual" ? true : false}
                  >
                    casual
                  </option>
                  <option
                    value="sick"
                    selected={inputs.type === "sick" ? true : false}
                  >
                    sick
                  </option>
                  <option
                    value="earn"
                    selected={inputs.type === "earn" ? true : false}
                  >
                    earn
                  </option>
                  <option
                    value="others"
                    selected={inputs.type === "others" ? true : false}
                  >
                    others
                  </option>
                </select>
              </div>
              {inputs.type == "earn" ? (
                <div className="col-lg">
                  <label className="font-weight-bold">Earn Eligable Date</label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Eligable Date"
                    name="earn_eligable_date"
                    value={inputs.earn_eligable_date || ""}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="col-lg">
                <label className="font-weight-bold">
                  Total Days <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Days"
                  name="total_days"
                  value={inputs.total_days || ""}
                  onChange={handleChange}
                  data-required
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

export default EditLeaveRules;
