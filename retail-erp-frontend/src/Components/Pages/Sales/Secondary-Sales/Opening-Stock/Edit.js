import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import DatatableFunc from "../../../../Common/DatatableFunc";
import FormValidation from "../../../../Common/FormValidation";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [region, setRegion] = useState({});
  const [area, setArea] = useState({});
  const [base, setBase] = useState({});
  const [notFound, setNotFound] = useState();
  const [product, setProduct] = useState({});
  const [baseWiseProduct, setBaseWiseProduct] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...baseWiseProduct]; // Defined Experience State All Information into List Variable

    const nameSplit = name.split("_");
    const productId = nameSplit[1];
    const baseId = nameSplit[2];

    inputInfo[productId][baseId] = value;
    setBaseWiseProduct(inputInfo);
  };

  // Default Load
  const fetchData = () => {
    Http.get("/regionSelect2").then((res) => {
      setRegion(res.data);
    });
    Http.get("/product?status=active").then((res) => {
      setProduct(res.data);
    });
  };
  useEffect(() => {
    fetchData();
    DatatableFunc();
  }, []);
  // End Default Load

  // Area Load Region Change Wise
  const areaRegionWise = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;

    Http.get("/region-wise-area2/" + value).then((res) => {
      setArea(res.data);
    });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Base Load Region Change Wise
  const baseRegionWise = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    inputs.work_place_area_id = value;
    Http.post("/os-edit", inputs)
      .then((res) => {
        let list = res.data.list;
        if (res.data.find > 0) {
          const listDetail = new Array();
          Object.keys(product).forEach((productKey) => {
            listDetail[product[productKey].id] = new Array();
            Object.keys(list).forEach((key) => {
              if (list[key].item_id == product[productKey].id) {
                listDetail[product[productKey].id][list[key].base_id] =
                  new Array();
                listDetail[product[productKey].id][list[key].base_id] =
                  list[key].os_qty;
              }
            });
          });

          Http.get("/area-wise-base/" + value).then((res) => {
            setBase(res.data);

            const listInfo = new Array();
            Object.keys(product).forEach((key) => {
              listInfo[product[key].id] = new Array();
              Object.keys(res.data).forEach((baseKey) => {
                let productId = product[key].id;
                let baseId = res.data[baseKey].id;

                listInfo[product[key].id][baseId] = new Array();
                if (listDetail[productId][baseId] > 0)
                  listInfo[productId][baseId] = listDetail[productId][baseId];
                else listInfo[productId][baseId] = 0;
              });
            });
            setBaseWiseProduct(listInfo);
          });
        } else {
          setBase({});
          setNotFound(
            "No Opening Stock Found for thisRegion & Area! Please choose the right one !"
          );
        }
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    inputs.items = baseWiseProduct;
    Http.post("/os-update", inputs)
      .then((res) => {
        navigate("/monthly-target", {
          state: { message: res.data.message, type: res.data.type },
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
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Opening Stock</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Opening Stock</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Region <i className="fa fa-star required"></i>
                </label>
                {/* <select
                  className="form-control"
                  name="work_place_region_id"
                  onChange={areaRegionWise}
                >
                  <option value="">Select Region</option>
                  {Array.from(region).map((item, index) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select> */}
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={region[0]}
                  name="work_place_region_id"
                  options={region}
                  onChange={areaRegionWise}
                />
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Area <i className="fa fa-star required"></i>
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={area[0]}
                  name="work_place_area_id"
                  options={area}
                  onChange={baseRegionWise}
                />
              </div>
            </div>
            <div className="row mt-3">
              {base.length > 0 ? (
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sl
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          FG
                        </th>
                        {Array.from(base).map((item, index) => (
                          <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                            {item.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {product.length > 0
                        ? product.map((item, index) => (
                            <tr key={item.id}>
                              <td className="text-xs">{index + 1}</td>
                              <td className="text-xs">
                                {item.code} - {item.name}
                              </td>
                              {Array.from(base).map((baseList, baseIndex) => (
                                <td className="text-xs">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name={"name_" + item.id + "_" + baseList.id}
                                    value={
                                      baseWiseProduct[item.id][baseList.id] ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(e, index)
                                    }
                                  />
                                </td>
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
            {base.length > 0 ? (
              <div className="row mt-3">
                <div className="col-3">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Update
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Create;
