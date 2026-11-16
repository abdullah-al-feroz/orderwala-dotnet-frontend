import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import DatatableFunc from "../../../../Common/DatatableFunc";
import FormValidation from "../../../../Common/FormValidation";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const { targetId, id } = useParams();
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
  const [listImsDetails, setListImsDetails] = useState({});
  const [target, setTarget] = useState({});
  const [baseWiseProduct, setBaseWiseProduct] = useState({});

  // Default Load
  const fetchData = () => {
    Http.get("/finished-good").then((res) => {
      setProduct(res.data);
    });

    Http.get("/regionWiseDetail/" + targetId + "/" + id).then((res) => {
      if (res.data.base.length > 0) {
        setBase(res.data.base);
        let targetId = res.data.targetId;
        let targetList = res.data.list;

        const listDetail = new Array();
        const listImsDetail = new Array();

        Object.keys(res.data.product).forEach((productKey) => {
          listDetail[res.data.product[productKey].id] = new Array();
          listImsDetail[res.data.product[productKey].id] = new Array();
          Object.keys(targetList).forEach((key) => {
            if (targetList[key].item_id == res.data.product[productKey].id) {
              listDetail[res.data.product[productKey].id][
                targetList[key].base_id
              ] = new Array();
              listImsDetail[res.data.product[productKey].id][
                targetList[key].base_id
              ] = new Array();
              listDetail[res.data.product[productKey].id][
                targetList[key].base_id
              ] = targetList[key].target_qty;
              listImsDetail[res.data.product[productKey].id][
                targetList[key].base_id
              ] = targetList[key].orderIms.qty;
            }
          });
        });
        // console.log(listDetail);
        setListDetails(listDetail);
        setListImsDetails(listImsDetail);
      } else {
        setBase({});
        setListDetails({});
        setListImsDetails({});
      }
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
            <div className="row mt-3">
              {base.length > 0 ? (
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                        {Array.from(base).map((item, index) => (
                          <th
                            colSpan={2}
                            className="text-uppercase text-center text-dark text-sm font-weight-bolder ps-2"
                          >
                            <Link
                              to={{
                                pathname:
                                  "/monthly-target-view-base-wise-daily/" +
                                  targetId +
                                  "/" +
                                  id +
                                  "/" +
                                  item.base.id,
                              }}
                            >
                              {item.base.name}
                            </Link>
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
                                      {listDetails[item.id][baseList.base.id]}
                                    </p>
                                  </td>
                                  <td className="text-xs">
                                    <p className="text-center">
                                      {
                                        listImsDetails[item.id][
                                          baseList.base.id
                                        ]
                                      }
                                    </p>
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
