import React, { useEffect, useState } from "react";
import IsLogin from "../Common/IsLogin";
import Http from "../Common/Http";
import { LoaderComponent } from "../Common/LoaderComponent";
import $ from "jquery";

const Dashboard = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [src, setSrc] = useState(null);
  const fetchData = () => {
    Http.get("/me").then((res) => {
      setProfileData(res.data.data);
      setReceiveData(res.data.data.user_type);
      if (res.data.data.user_type == "hmo" && res.data.data.id == 874) {
        setSrc(
          "https://app.powerbi.com/view?r=eyJrIjoiZjQ0OGEzOWItYWM4Zi00NjEyLTkwNGItMTZkNzFiODcyMGNhIiwidCI6IjBhODBmNzAxLTg1YTktNDFhNS1hOTY0LTc1MTNiZjQ0ZmQ4OCIsImMiOjEwfQ%3D%3D"
        );
      } else if (res.data.data.user_type == "hmo" && res.data.data.id == 1252) {
        setSrc(
          "https://app.powerbi.com/view?r=eyJrIjoiY2U1YmU5NDctM2JmZS00ZDFjLTg0NDQtMzFjY2Y0ZmYyOTc1IiwidCI6IjBhODBmNzAxLTg1YTktNDFhNS1hOTY0LTc1MTNiZjQ0ZmQ4OCIsImMiOjEwfQ%3D%3D"
        );
      } else if (res.data.data.user_type == "hmo" && res.data.data.id == 1261) {
        setSrc(
          "https://app.powerbi.com/view?r=eyJrIjoiM2UwNjlmODktMTEyZi00NDY2LWJjM2MtNzhlNjFkOTQxMzZjIiwidCI6IjBhODBmNzAxLTg1YTktNDFhNS1hOTY0LTc1MTNiZjQ0ZmQ4OCIsImMiOjEwfQ%3D%3D"
        );
      } else {
        setSrc(
          "https://app.powerbi.com/view?r=eyJrIjoiNTBhMjAyNjUtYzE1Ny00ZWYyLWFkOTItZGU0NDc4MjZjMjA4IiwidCI6IjBhODBmNzAxLTg1YTktNDFhNS1hOTY0LTc1MTNiZjQ0ZmQ4OCIsImMiOjEwfQ%3D%3D"
        );
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <iframe
        style={{ marginTop: "60px", marginLeft: "170px" }}
        width="100%"
        height="700px"
        src={src}
      ></iframe>
      ;
    </div>
  );
};

export default Dashboard;
