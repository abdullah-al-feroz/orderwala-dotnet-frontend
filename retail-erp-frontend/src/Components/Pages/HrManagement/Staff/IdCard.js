import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import HttpUser from "../../../Common/HttpUser";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const staffId = parseInt(id);

  const fetchData = () => {
    HttpUser.get("/GetById/" + staffId).then((res) => {
      setReceiveData(res.data.data);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Id Card </h5>
          </div>

          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div
                      style={{
                        width: "300px",
                        height: "450px",
                        background: "#ffffff",
                        boxShadow: "0px 10px 20px 0px rgba(0, 0, 0, 0.15)",
                        borderRadius: "15px",
                        overflow: "hidden",
                        padding: "25px 0px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "#000000",
                        margin: "0 auto",
                      }}
                    >
                      <img
                        src="../../assets/img/logo.png"
                        alt="national-museum"
                        style={{
                          width: "80px",
                          height: "80px",
                          marginBottom: "20px",
                        }}
                      />
                      <img
                        src="https://members.familycentre.online/assets/images/default_user.png"
                        alt="employee"
                        style={{
                          width: "100px",
                          height: "108px",
                          marginBottom: "10px",
                          border: "2px solid #983720",
                          borderRadius: "8px",
                          paddingTop: "8px",
                        }}
                      />
                      <h1
                        style={{
                          fontSize: "22px",
                          marginBottom: "5px",
                          marginTop: "8px",
                          background: "#983720",
                          width: "100%",
                          textAlign: "center",
                          color: "#fff",
                          padding: "8px 0px",
                        }}
                      >
                        {receiveData.name}
                      </h1>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#000000",
                          fontWeight: "600",
                          marginTop: "5px",
                          marginBottom: "8px",
                        }}
                      >
                        Employee ID: {receiveData.cardNo}
                      </p>
                      <img
                        src="../../assets/img/qrCode.png"
                        alt="national-museum"
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      />
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

export default Show;