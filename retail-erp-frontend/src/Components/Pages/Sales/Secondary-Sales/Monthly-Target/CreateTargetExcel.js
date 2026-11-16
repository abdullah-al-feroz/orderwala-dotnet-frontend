import React, { useEffect, useState } from "react";
import IsLogin from "../../../../Common/IsLogin";
import $ from "jquery";

const ExcelUpload = () => {
  return (
    <div>
      <IsLogin></IsLogin>
      <iframe
        style={{ marginTop: "60px" }}
        width="100%"
        height="700px"
        src="https://backend.orderwalabd.com/public/api/target-excel-upload"
      ></iframe>
    </div>
  );
};

export default ExcelUpload;
