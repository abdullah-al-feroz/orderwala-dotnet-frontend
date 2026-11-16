import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../Common/Http";
import IsLogin from "../Common/IsLogin";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [message, setMessage] = useState();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    Http.post("/login", inputs)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        sessionStorage.setItem("token", res.data.token);
        localStorage.setItem("type", res.data.type);
        sessionStorage.setItem("type", res.data.type);
        localStorage.setItem("role", res.data.role);
        sessionStorage.setItem("role", res.data.role);
        window.location.href = "/dashboard";
      })
      .catch(function (e) {
        setMessage(e.response.data.message);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-signin-wrapper">
        <div className="am-signin-box">
          <div className="row no-gutters">
            <div className="col-lg-5">
              <div>
                <h2>Limtech ERP</h2>

                <hr />
                <p>
                  Don't have an account? <br /> <a href="#">Sign up Now</a>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <h5 className="tx-gray-800 mg-b-25">Signin to Your Account</h5>

              <form onSubmit={formSubmit}>
                <div className="form-group">
                  <label className="form-control-label">Email:</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-control-label">Password:</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="form-group mg-b-20">
                  <a href="">Reset password</a>
                </div>

                <button
                  type="submit"
                  className="btn btn-block"
                  onClick={formSubmit}
                >
                  Sign In
                </button>
              </form>
              <p style={{ color: "red", marginTop: "20px" }}>{message}</p>
            </div>
          </div>
          <p className="tx-center tx-white-5 tx-12 mg-t-15">
            Copyright &copy; {new Date().getFullYear()}. All Rights Reserved. by{" "}
            <a href="https://limerickbd.com" target="_blank">
              Limerick Resources Limited
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
