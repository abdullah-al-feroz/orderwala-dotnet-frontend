import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/circular-rfq/" + id).then((res) => {
      setReceiveData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Circular Detail</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-header p-4">
                    <a className="pt-2 d-inline-block">{receiveData.title}</a>
                    <div className="float-right">
                      <h3 className="mb-0">Invoice {receiveData.wo_number}</h3>
                      Date: {receiveData.date}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Circular Info:</h5>
                        <p>Date :{receiveData.date}</p>
                        <p>Circular No :{receiveData.circular_no}</p>
                        <p>Title :{receiveData.title}</p>
                        <p>Subject :{receiveData.subject}</p>
                        <p>
                          Last Date Of Quotation :
                          {receiveData.last_date_of_quotation}
                        </p>
                        <p>
                          Factory :
                          {receiveData.factory ? receiveData.factory.name : ""}
                        </p>
                        <p>Description :{receiveData.description}</p>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Item</th>
                            <th className="text-right">Qty</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="center">{index + 1}</td>
                                  <td className="left strong">
                                    {item.product ? item.product.name : ""}
                                  </td>
                                  <td className="right text-right">
                                    {item.qty}
                                  </td>
                                  <td className="right text-right">
                                    {item.desc}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
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
