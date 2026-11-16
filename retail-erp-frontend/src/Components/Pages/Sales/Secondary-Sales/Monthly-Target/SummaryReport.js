import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import DatatableFunc from "../../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import FormValidation from "../../../../Common/FormValidation";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState();
  const [error, setError] = useState({});
  const [base, setBase] = useState({});
  const [notFound, setNotFound] = useState();
  const [product, setProduct] = useState({});
  const [target, setTarget] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    Http.get("/summary-report/" + value).then((res) => {
      if (res.data.product.length > 0) {
        setProduct(res.data.product);
      } else {
        setProduct({});
      }
    });
  };

  // Default Load
  const fetchData = () => {
    Http.get("/target").then((res) => {
      setTarget(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    DatatableFunc();
  }, []);

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Summary Report</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>Monthly Target</label>
                <select
                  className="form-control"
                  name="target_month"
                  onChange={handleChange}
                >
                  <option value="">Select Monthly Target</option>
                  {Array.from(target).map((item, index) => (
                    <option value={item.target.id}>
                      {item.target.target_month} - {item.target.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              {product.length > 0 ? (
                <div className="table-responsive p-0 pb-2 mt-5">
                  <h5 className="text-center">Summary Report</h5> <hr />
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                    <thead>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                      <th
                        colSpan={5}
                        className="text-center text-uppercase text-dark text-sm font-weight-bolder ps-2"
                        style={{ backgroundColor: "darkcyan" }}
                      >
                        Product Wise
                      </th>
                      <th
                        colSpan={5}
                        className="text-center text-uppercase text-dark text-sm font-weight-bolder ps-2"
                        style={{ backgroundColor: "skyblue" }}
                      >
                        Value Wise
                      </th>
                      <th
                        colSpan={2}
                        className="text-center text-uppercase text-dark text-sm font-weight-bolder ps-2"
                        style={{ backgroundColor: "darkcyan" }}
                      >
                        Achievment(%)
                      </th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sl</td>
                        <td>Product Name</td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          OS
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Target
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          T.IMS
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Lifting
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          CS
                        </td>
                        <td
                          style={{
                            backgroundColor: "skyblue",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          OS
                        </td>
                        <td
                          style={{
                            backgroundColor: "skyblue",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Target
                        </td>
                        <td
                          style={{
                            backgroundColor: "skyblue",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          T.IMS
                        </td>
                        <td
                          style={{
                            backgroundColor: "skyblue",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Lifting
                        </td>
                        <td
                          style={{
                            backgroundColor: "skyblue",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          CS
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          IMS
                        </td>
                        <td
                          style={{
                            backgroundColor: "darkcyan",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Lifting
                        </td>
                      </tr>
                      {product.length > 0
                        ? product.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-xs">{index + 1}</td>
                              <td className="text-xs">
                                {item.code} - {item.name}
                              </td>
                              <td>
                                {item.osQty
                                  ? parseFloat(item.osQty).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.targetQty
                                  ? parseFloat(item.targetQty).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.imsQty > 0
                                  ? parseFloat(item.imsQty).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.liftingQty
                                  ? parseFloat(item.liftingQty).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.osQty > 0
                                  ? item.osQty
                                  : 0 + item.imsQty > 0
                                  ? item.liftingQty
                                  : 0}
                              </td>
                              <td>
                                {item.osAmt
                                  ? parseFloat(item.osAmt).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.targetAmt
                                  ? parseFloat(item.targetAmt).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.imsAmt
                                  ? parseFloat(item.imsAmt).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.liftingAmt
                                  ? parseFloat(item.liftingAmt).toFixed(2)
                                  : 0}
                              </td>
                              <td>
                                {item.osAmt > 0
                                  ? item.osAmt
                                  : 0 + item.imsAmt > 0
                                  ? item.liftingAmt
                                  : 0}
                              </td>
                              <td>0</td>
                              <td>0</td>
                            </tr>
                          ))
                        : ""}
                    </tbody>
                  </table>
                </div>
              ) : (
                <h5 className="text-center mt-5" style={{ color: "red" }}>
                  {notFound}
                </h5>
              )}
            </div>
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
