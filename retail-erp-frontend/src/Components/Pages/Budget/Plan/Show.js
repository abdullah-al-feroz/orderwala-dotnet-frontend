import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();

  const fetchData = () => {
    Http.get("/budget-plan/" + id).then((res) => {
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
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Budget Plan Info</h5>
          </div>

          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Budget Plan Info:</h5>
                        <div>Start Date : {receiveData.start_date}</div>
                        <div>End Date : {receiveData.end_date}</div>
                        <div>Remarks : {receiveData.message}</div>
                        <div>
                          Created By :{" "}
                          {receiveData.created_by
                            ? receiveData.created_by.name
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Purpose</th>
                            <th className="right text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="center">{index + 1}</td>
                                  <td className="left strong">
                                    {item.purpose}
                                  </td>
                                  <td className="right text-right">
                                    {item.amount}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan={3} className="right text-right">
                              {receiveData.total}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
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
