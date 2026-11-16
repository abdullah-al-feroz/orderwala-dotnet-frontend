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
    Http.get("/depo-wise-product-stock").then((res) => {
      setFactory(res.data.factory);
      setReceiveData(res.data.item);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);
  // function depoStock(factory_name, list) {
  //   let factory_name_lower = factory_name.toLowerCase().replace(/\s+/g, "_");

  //   return list[factory_name_lower] || "0";
  // }

  const cols = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "unit_name", header: "Unit" },
    { field: "category_name", header: "Category" },
  ];

  factory.forEach((item, index) => {
    cols.push({
      field: (rowData) =>
        rowData[item.name.toLowerCase().replace(/\s+/g, "_")] || "0",
      header: item.name,
    });
  });

  // factory.forEach((item, index) => {
  //   cols.push({
  //     field: (rowData) =>
  //       factory.map((rowData, index2) => depoStock(rowData.name, rowData)),
  //     header: item.name,
  //   });
  // });

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel" style={{ marginTop: "50px" }}>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <h3 className="card-body-title mg-sm-b-30 text-center">
                Depot Wise Current Stock
              </h3>
              <hr />
              <div className="card">
                <ReactDataTable
                  cols={cols}
                  receiveData={receiveData}
                  // actionTemplate={actionTemplate}
                  // deleteData={deleteData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedGoodStock;
