import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import HttpUser from "../../../Common/HttpUser";
import IsLogin from "../../../Common/IsLogin";

const ChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      showAlert("Both password fields are required.", "danger");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("Password and confirm password do not match.", "danger");
      return;
    }

    setLoading(true);
    try {
      await HttpUser.put(`/forgot-password/${id}`, {
        newPassword: newPassword,
      });

      navigate("/staff", {
        state: { message: "Password updated successfully", type: "success" },
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to update password.";
      showAlert(message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <IsLogin></IsLogin> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Change Password</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="col-lg-6">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>

                <div className="row mg-t-20">
                  <div className="col-lg-6">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={loading}
                    >
                      <i className="fa fa-send mg-r-10"></i>
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;