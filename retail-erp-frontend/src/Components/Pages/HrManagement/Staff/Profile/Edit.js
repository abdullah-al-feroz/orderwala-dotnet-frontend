import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [authDetail, setAuthDetail] = useState([]);

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
    Http.put("/staff-profile/" + inputs.id, inputs)
      .then((res) => {
        Swal.fire("Successfully Updated!", "Profile Updated", "success");
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  // Default Load
  const fetchData = () => {
    Http.get("/login-staff-detail").then((res) => {
      setInputs({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        mobile: res.data.mobile,
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
          <h5 className="am-title">Profile</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Profile Edit &nbsp;&nbsp;
              <span style={{ color: "red" }}>
                ( You have to login with Changes Email and Password )
              </span>
            </h6>
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
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Email<i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  data-required
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  name="password"
                  value={inputs.password || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Mobile<i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="mobile"
                  name="mobile"
                  value={inputs.mobile || ""}
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
