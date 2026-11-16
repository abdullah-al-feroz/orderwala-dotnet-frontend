import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import DatatableFunc from "../../../../Common/DatatableFunc";
import FormValidation from "../../../../Common/FormValidation";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    target_month: "january",
    target_year: 2023,
  });
  const [error, setError] = useState({});
  const [region, setRegion] = useState({});
  const [area, setArea] = useState({});
  const [base, setBase] = useState({});
  const [notFound, setNotFound] = useState();
  const [product, setProduct] = useState({});
  const [listDetails, setListDetails] = useState({});
  const [target, setTarget] = useState({});
  const [baseWiseProduct, setBaseWiseProduct] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    Http.get("/target/" + value).then((res) => {
      if (res.data.base.length > 0) {
        setBase(res.data.base);
        let targetId = value;
        let targetList = res.data.list;

        const listDetail = new Array();
        Object.keys(product).forEach((productKey) => {
          listDetail[product[productKey].id] = new Array();
          Object.keys(targetList).forEach((key) => {
            if (targetList[key].item_id == product[productKey].id) {
              listDetail[product[productKey].id][targetList[key].base_id] =
                new Array();
              listDetail[product[productKey].id][targetList[key].base_id] =
                targetList[key].target_qty;
            }
          });
        });
        setListDetails(listDetail);
      } else {
        setBase({});
        setListDetails({});
      }
    });
  };

  // Default Load
  const fetchData = () => {
    Http.get("/target").then((res) => {
      setTarget(res.data);
    });
    Http.get("/finished-good").then((res) => {
      setProduct(res.data);
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
          <h5 className="am-title">Monthly Target</h5>
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
                    <option value={item.id}>
                      {item.target_month} - {item.year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              {base.length > 0 ? (
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                        {Array.from(base).map((item, index) => (
                          <th
                            colSpan={2}
                            className="text-uppercase text-center text-dark text-sm font-weight-bolder ps-2"
                          >
                            {item.base.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sl
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Product Name
                        </th>
                        {Array.from(base).map((item, index) => (
                          <>
                            <th className="text-center text-uppercase text-dark text-sm font-weight-bolder ps-2">
                              Target
                            </th>
                            <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                              IMS
                            </th>
                          </>
                        ))}
                      </tr>
                      {product.length > 0
                        ? product.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-xs">{index + 1}</td>
                              <td className="text-xs">
                                {item.code} - {item.name}
                              </td>
                              {Array.from(base).map((baseList, baseIndex) => (
                                <>
                                  <td className="text-xs">
                                    <p className="text-center">
                                      {/* {baseWiseProduct[item.id][baseList.id] ||  ""} */}
                                      {listDetails[item.id][baseList.base.id]}
                                    </p>
                                  </td>
                                  <td className="text-xs">
                                    <p className="text-center">0</p>
                                  </td>
                                </>
                              ))}
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
