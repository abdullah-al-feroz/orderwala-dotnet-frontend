import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";

const FinishedGoodStock = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/finished-good-stock").then((res) => {
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

  const deleteData = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };

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
                          Category
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Unit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Price
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Opening Stock
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Other Receive
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Transfer Receive
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sale
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Grn
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Grn Return
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Damage
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Stock
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{item.code}</td>
                          <td className="text-xs">{item.name}</td>
                          <td className="text-xs">{item.category_name}</td>
                          <td className="text-xs">{item.unit_name}</td>
                          <td className="text-xs">{item.primary_price}</td>
                          <td className="text-xs">
                            {item.depoOpeningStockQty}
                          </td>
                          <td className="text-xs">{item.otherReceiveQty}</td>
                          <td className="text-xs">{item.transferReceiveQty}</td>
                          <td className="text-xs">{item.saleQty}</td>
                          <td className="text-xs">{item.inQty}</td>
                          <td className="text-xs">{item.returnQty}</td>
                          <td className="text-xs">
                            {parseFloat(item.damageQty) +
                              parseFloat(item.damageToQty)}
                          </td>
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
