import React, { useEffect, useState } from "react";
import IsLogin from "../Common/IsLogin";
import { LoaderComponent } from "../Common/LoaderComponent";
import $ from "jquery";

const Dashboard = () => {
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <iframe
        style={{ marginTop: "60px", marginLeft: "100px" }}
        width="100%"
        height="700px"
        src="https://app.powerbi.com/view?r=eyJrIjoiZDBkNTI4NTktMzBiYi00NGQzLThhMDYtM2VmNjI3NWFiY2EyIiwidCI6IjBhODBmNzAxLTg1YTktNDFhNS1hOTY0LTc1MTNiZjQ0ZmQ4OCIsImMiOjEwfQ%3D%3D"
      ></iframe>
    </div>
  );
};

export default Dashboard;
