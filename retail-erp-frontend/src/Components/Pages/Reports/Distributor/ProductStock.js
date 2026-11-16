import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { useParams } from "react-router-dom";
import ProductStockDetail from "./ProductStockDetail";

const FinishedGoodStock = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const { id } = useParams();

  const fetchData = () => {
    let endpoint = "/distributor-product-stock";
    if (id) {
      endpoint += `/${id}`; // Modify the endpoint if `id` is present
    }

    Http.get(endpoint).then((res) => {
      console.log(res.data);
      setReceiveData(res.data.info);
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
                <ProductStockDetail data={receiveData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishedGoodStock;
