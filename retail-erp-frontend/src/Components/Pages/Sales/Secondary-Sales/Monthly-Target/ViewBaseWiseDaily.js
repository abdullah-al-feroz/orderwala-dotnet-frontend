import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import DatatableFunc from "../../../../Common/DatatableFunc";
import FormValidation from "../../../../Common/FormValidation";
// import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const { targetId, regionId, baseId } = useParams();
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

    Http.get(
      "/baseWiseDetailDaily/" + targetId + "/" + regionId + "/" + baseId
    ).then((res) => {
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
              ] = targetList[key].ims;
            }
          });
        });

        // Object.keys(listImsDetail).forEach((key) => {
        //   console.log(listImsDetail[key]);
        // });

        setListDetails(listDetail);
        setListImsDetails(listImsDetail);
      } else {
        setBase({});
        setListDetails({});
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
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Monthly Target</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <div className="row mt-3">
              {base.length > 0 ? (
                <div>
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                    <thead>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        Sl
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        Product Name
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        Target
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        1
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        2
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        3
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        4
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        5
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        6
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        7
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        8
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        9
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        10
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        11
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        12
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        13
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        14
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        15
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        16
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        17
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        18
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        19
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        20
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        21
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        22
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        23
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        24
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        25
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        26
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        27
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        28
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        29
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        30
                      </th>
                    </thead>
                    {/* <tbody>
                      {product.length > 0
                        ? product.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-xs">{index + 1}</td>
                              <td className="text-xs">
                                {item.code} - {item.name}
                              </td>
                              <td>{listDetails[item.id]}</td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][1]
                                  ? listImsDetails[item.id][1][1]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][2]
                                  ? listImsDetails[item.id][1][2]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][3]
                                  ? listImsDetails[item.id][1][3]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][4]
                                  ? listImsDetails[item.id][1][4]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][5]
                                  ? listImsDetails[item.id][1][5]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][6]
                                  ? listImsDetails[item.id][1][6]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][7]
                                  ? listImsDetails[item.id][1][7]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][8]
                                  ? listImsDetails[item.id][1][8]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][9]
                                  ? listImsDetails[item.id][1][9]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][10]
                                  ? listImsDetails[item.id][1][10]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][11]
                                  ? listImsDetails[item.id][1][11]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][12]
                                  ? listImsDetails[item.id][1][12]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][13]
                                  ? listImsDetails[item.id][1][13]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][14]
                                  ? listImsDetails[item.id][1][14]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][15]
                                  ? listImsDetails[item.id][1][15]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][16]
                                  ? listImsDetails[item.id][1][16]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][17]
                                  ? listImsDetails[item.id][1][17]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][18]
                                  ? listImsDetails[item.id][1][18]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][19]
                                  ? listImsDetails[item.id][1][19]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][20]
                                  ? listImsDetails[item.id][1][20]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][21]
                                  ? listImsDetails[item.id][1][21]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][22]
                                  ? listImsDetails[item.id][1][22]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][23]
                                  ? listImsDetails[item.id][1][23]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][24]
                                  ? listImsDetails[item.id][1][24]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][25]
                                  ? listImsDetails[item.id][1][25]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][26]
                                  ? listImsDetails[item.id][1][26]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][27]
                                  ? listImsDetails[item.id][1][27]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][28]
                                  ? listImsDetails[item.id][1][28]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][29]
                                  ? listImsDetails[item.id][1][29]
                                  : 0}
                              </td>
                              <td className="text-xs">
                                {listImsDetails[item.id][1][30]
                                  ? listImsDetails[item.id][1][30]
                                  : 0}
                              </td>
                            </tr>
                          ))
                        : ""}
                    </tbody> */}

                    <tbody>
                      {product.length > 0 ? (
                        product.map((item, index) => {
                          const imsDetails = listImsDetails[item.id]?.[1] || []; // Fallback to an empty array if undefined
                          return (
                            <tr key={item.id}>
                              <td className="text-xs">{index + 1}</td>
                              <td className="text-xs">
                                {item.code} - {item.name}
                              </td>
                              <td>{listDetails[item.id] || "N/A"}</td>
                              {Array.from({ length: 30 }).map((_, idx) => (
                                <td className="text-xs" key={idx}>
                                  {imsDetails[idx + 1] || 0}
                                </td>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="33" className="text-xs text-center">
                            No data available
                          </td>
                        </tr>
                      )}
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
