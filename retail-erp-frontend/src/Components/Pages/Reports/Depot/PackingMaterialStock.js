import React, { useEffect, useState } from "react";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const FinishedGoodStock = () => {
  const [receiveData, setReceiveData] = useState([]);

  const fetchData = () => {
    Http.get("/rmpm-with-stock").then((res) => {
      setReceiveData(res.data);
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
        <div className="am-mainpanel" style={{ marginTop: "50px" }}>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <h6 className="card-body-title mg-sm-b-30 text-center">
                Products Stock
              </h6>
              <hr />
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Unit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Price
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          SKU
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Pack Size
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Stock
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData
                        .filter((item) => item.type === "packing_materials")
                        .map((item, index) => (
                          <tr key={item.id}>
                            <td className="text-xs">{item.code}</td>
                            <td className="text-xs">{item.name}</td>
                            <td className="text-xs">{item.unit_name}</td>
                            <td className="text-xs">{item.price}</td>
                            <td className="text-xs">{item.sku}</td>
                            <td className="text-xs">{item.pack_size}</td>
                            <td className="text-xs">{item.stockQty}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedGoodStock;
