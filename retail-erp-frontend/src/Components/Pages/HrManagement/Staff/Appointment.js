import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HttpUser from "../../../Common/HttpUser";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const AppointmentLetter = () => {
  const { id } = useParams();
  const appointmentId = parseInt(id);
  const [receiveData, setReceiveData] = useState({});

  const fetchData = () => {
    HttpUser.get("/GetById/" + appointmentId).then((res) => {
      setReceiveData(res.data.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function dateFormat(d) {
    var t = new Date(d);
    return (
      t.getDate() + " " + monthNames[t.getMonth()] + ", " + t.getFullYear()
    );
  }

  return (
    <div>
      {/* <IsLogin></IsLogin> */}
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Offer Letter</h5>
          </div>

          <div className="am-pagebody">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="card border-0 shadow">
                  <div className="card-body p-5">
                    <div className="mb-5 d-flex justify-content-center">
                      <img
                        className="img-fluid"
                        style={{
                          maxWidth: "50%",
                        }}
                        src="https://limerickbd.com/wp-content/uploads/2021/12/Limerick-LOGO-1536x388.png"
                        alt="Company Logo"
                      />
                    </div>
                    <h2 className="text-center text-uppercase font-weight-bold mb-5">
                      Offer Letter
                    </h2>
                    <div className="table-responsive">
                      <table className="table table-borderless mb-5">
                        <tbody>
                          <tr>
                            <td style={{ width: "145px" }}>
                              <strong>Date:</strong>
                            </td>
                            <td>{dateFormat(new Date())}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Employee Name:</strong>
                            </td>
                            <td>{receiveData.name}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Address:</strong>
                            </td>
                            <td>{receiveData.presentAddress}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Email:</strong>
                            </td>
                            <td>{receiveData.email}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Phone:</strong>
                            </td>
                            <td>{receiveData.mobile}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mb-5">
                      <p className="mt-5">Dear {receiveData.name},</p>
                      <p>
                        We are pleased to offer you a position at our company as
                        &nbsp;
                        {receiveData.designationId
                          ? receiveData.designationName
                          : " "}
                        . We believe that your skills and experience will be a
                        great addition to our team.
                      </p>
                      <p>
                        Your employment will begin on{" "}
                        {receiveData?.joiningDate
                          ? dateFormat(receiveData.joiningDate.split("T")[0])
                          : " "}%, and you will
                        report to Shahrear Rahman. Your working hours will be 40
                        hours per week.
                      </p>
                      <p>
                        Please find the attached documents detailing the terms
                        and conditions of your employment, including salary,
                        benefits, and other policies. We kindly request you to
                        review and sign these documents and return them to us by
                        July 30, 2023.
                      </p>
                      <p>
                        If you have any questions or need further clarification,
                        please do not hesitate to contact us.
                      </p>
                      <p>
                        We look forward to welcoming you to our team and wish
                        you success in your new role.
                      </p>
                    </div>
                    <div className="mt-9">
                      <p>Sincerely,</p>
                      <div>Shahrear Rahman</div>
                      <div>Human Resource</div>
                      <div>Limerick resources Ltd.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLetter;