import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const List = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({});
  const [receiveData, setReceiveData] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [circular, setCircular] = useState({});
  const [listSelect, setListSelect] = useState([]);
  const [workOrderList, setWorkOrderList] = useState([]);
  const [alert, setAlert] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState({});

  const fetchData = () => {
    Http.get("/rfq-sent-from-vendor/" + id).then((res) => {
      setReceiveData(res.data.info);
      setCircular(res.data.circular);
    });
    Http.get("/circular-rfq/" + id + "/edit").then((res) => {
      setItemList(res.data.items);
    });
    Http.get("/final-quotation/" + id).then((res) => {
      if (res.data.items && res.data.items.length > 0) {
        const list = [...listSelect];
        res.data.items.forEach((item, itemIndex) => {
          list[item.quotation_item_sent_from_vendor_id] =
            item.quotation_item_sent_from_vendor_id;
        });
        setListSelect(list);
      } else {
        // Handle the case when there are no items (optional)
        console.log("No Final Quotation found.");
      }
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const itemSelect = (id) => {
    const list = [...listSelect];
    list[id] = id;

    setListSelect(list);
  };
  const itemNotSelect = (id) => {
    const list = [...listSelect];
    list.splice(id, 1);

    setListSelect(list);
  };

  const toggleItemSelect = (id) => {
    const list = [...listSelect];

    if (list.includes(id)) {
      const index = list.indexOf(id);
      list.splice(index, 1);
    } else {
      list.push(id);
    }

    setListSelect(list);
  };
  const formSubmit = () => {
    inputs.data = listSelect;
    inputs.circular = id;
    Http.post("/final-quotation", inputs)
      .then((res) => {
        navigate("/circular-rfq", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">{circular.title}</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 _datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sl
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Vendors
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Validaty Date
                        </th>
                        {itemList.map((item, index) => (
                          <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                            <table style={{ width: "100%" }}>
                              <thead>
                                <tr>
                                  <th
                                    colSpan={7}
                                    style={{ textAlign: "center" }}
                                  >
                                    {item.product ? item.product.name : ""}
                                  </th>
                                </tr>
                                <tr>
                                  {/* <th>Unit</th> */}
                                  <th>Qty</th>
                                  <th>Price</th>
                                  <th>Vat</th>
                                  <th>Tax</th>
                                  <th>Amount</th>
                                  <th>Description</th>
                                </tr>
                              </thead>
                            </table>
                          </th>
                        ))}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Remarks
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.vendor.name}</td>
                          <td className="text-xs">{item.date}</td>
                          <td className="text-xs">
                            {item.quotation_validity_date}
                          </td>
                          {item.items.map((x, i) => (
                            <td
                              className={
                                "text-xs " +
                                (listSelect.includes(x.id) ? "selected" : "")
                              }
                            >
                              <table style={{ width: "100%" }}>
                                <tbody>
                                  <tr
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleItemSelect(x.id)}
                                    key={x.id}
                                  >
                                    {/* <td>{x.unit.name}</td> */}
                                    <td>{x.qty}</td>
                                    <td>{x.unit_price}</td>
                                    <td>{x.vat > 0 ? x.vat : 0.0}</td>
                                    <td>{x.tax > 0 ? x.tax : 0.0}</td>
                                    <td>{x.actual_amount}</td>
                                    <td>{x.remarks}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          ))}
                          <td className="text-xs">{item.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {listSelect.length > 0 ? (
                <div className="row mt-3">
                  <div className="col-6"></div>
                  <div className="col-3"></div>
                  <div className="col-3">
                    <button
                      className="btn btn-primary btn-block mg-b-10"
                      onClick={formSubmit}
                    >
                      <i className="fa fa-send mg-r-10"></i> Create
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
