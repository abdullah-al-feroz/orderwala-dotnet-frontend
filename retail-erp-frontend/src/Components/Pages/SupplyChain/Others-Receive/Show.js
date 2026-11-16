import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import Swal from "sweetalert2";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const fetchData = () => {
    Http.get("/others-receive/" + id).then((res) => {
      setReceiveData(res.data);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const receiveWorkOrder = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You wan't to create an Purchase Order based on this quotation!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Create Purchase Order!",
    }).then((result) => {
      if (result.isConfirmed) {
        inputs.circular_rfq_id = id;
        inputs.work_order_id = receiveData.id;
        inputs.work_order_items_id = receiveData.items;

        Http.post("/create-purchase-order/", inputs)
          .then((res) => {
            Swal.fire("Purchase Order! has been Created.", "success");
            navigate("/final-quotation", {
              state: { message: res.data.message, type: "success" },
            });
          })
          .catch(function (e) {
            setError(e.response.data.errors);
          });
      }
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Others Receive</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Others Receive :</h5>
                        <div>Date : {receiveData.date}</div>
                        <div>
                          Location :
                          {receiveData.company_location
                            ? receiveData.company_location.name
                            : ""}
                        </div>
                        <div>
                          Factory :
                          {receiveData.factory ? receiveData.factory.name : ""}
                        </div>
                        <div>
                          Department :
                          {receiveData.department
                            ? receiveData.department.name
                            : ""}
                        </div>
                        <div>Description : {receiveData.description}</div>
                        <div>
                          Created By :
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
                            <th>Product</th>
                            <th className="text-right">Qty</th>
                            <th className="text-right">Price</th>
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
                                  <td className="text-right">{item.qty}</td>
                                  <td className="text-right">
                                    {item.unit_price}
                                  </td>
                                  <td>{item.desc}</td>
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
