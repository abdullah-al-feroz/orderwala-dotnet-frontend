import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Http from "./Http";

const IsLogin = () => {
  const location = useLocation();
  const [staffFound, setStaffFound] = useState(false);
  const [staffInfo, setStaffInfo] = useState(false);

  const fetchData = () => {
    if (location.pathname == "/" || location.pathname == "/login") {
      if (
        localStorage.getItem("token") != "" &&
        localStorage.getItem("token") != null
      ) {
        Http.get("/me")
          .then((res) => {
            window.location.href = "/dashboard";
          })
          .catch(function (e) {
            console.log("User Token Not Found");
          });
      }
    } else if (
      localStorage.getItem("token") == "" ||
      localStorage.getItem("token") == null ||
      localStorage.getItem("token") == "null"
    ) {
      Http.get("/me")
        .then((res) => {
          window.location.href = "/";
        })
        .catch(function (e) {
          window.location.href = "/login";
        });
    } else {
      Http.get("/me")
        .then((res) => {
          setStaffInfo(res.data);
          // console.log("User Token Found");
        })
        .catch(function (e) {
          window.location.href = "/login";
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
};

export default IsLogin;
