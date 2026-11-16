import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import ReactDataTable from "../../../Common/ReactDataTable";

const FinishedGoodStock = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [factory, setFactory] = useState([]);

  const fetchData = () => {
    Http.post("/report/dsr-order-delivery-report").then((res) => {
      setReceiveData(res.data.list);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const cols = [
    { field: "region", header: "Region" },
    { field: "area", header: "Area" },
    { field: "base", header: "Base" },
    { field: "route", header: "Route" },
    { field: "mdo", header: "MDO" },
    { field: "dsr", header: "DSR" },
    // { field: "mobile", header: "Mobile" },
    { field: "last_day_memo_qty", header: "Last Day Memo Qty" },
    { field: "undelivered_memo_qty", header: "Undelivered" },
    { field: "pickup_qty", header: "Picked" },
    { field: "delivered_qty", header: "Delivered" },
    { field: "total_pickup", header: "Total Pickup(Today)" },
    { field: "total_delivery", header: "Total Delivery(Today)" },
    {
      field: "last_day_memo_amount",
      header: "Memo Amount",
    },
    { field: "undelivered_memo_amount", header: "Undelivered Amount" },
    { field: "pickup_amount", header: "Picked Amount" },
    { field: "delivered_amount", header: "Delivered Amount" },
    { field: "total_pickup_amount", header: "Picked Amount (Total)" },
    { field: "total_delivery_amount", header: "Delivered (Total)" },
  ];

  factory.forEach((item, index) => {
    cols.push({
      field: (rowData) =>
        rowData[item.name.toLowerCase().replace(/\s+/g, "_")] || "0",
      header: item.name,
    });
  });

  //Date range start


  const [inputs, setInputs] = useState({
    date: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  //Date range end

  //Date range start
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    Http.post("/report/dsr-order-delivery-report", inputs).then((res) => {
      setReceiveData(res.data.list);
    });
  };

  //Date range end

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        {/* <h2>Hello</h2> */}
        <div className="am-mainpanel" style={{ marginTop: "50px" }}>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <h3 className="card-body-title mg-sm-b-30 text-center">
                Dsr Order Delivery Report
              </h3>
              {/* Date range start */}
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={inputs.date || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
            {/* Date range end */}
              <hr />
              <div className="card">
                <ReactDataTable cols={cols} receiveData={receiveData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedGoodStock;
