import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import ReceipeDetail from "./ReceipeDetail";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import Select from "react-select";

const Edit = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { requisition_production_id, id } = useParams();
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [rmpm, setRmpm] = useState({});
  const [factory, setFactory] = useState({});
  const [lastReceiptNo, setLastReceiptNo] = useState("000001");
  // const [list, setList] = useState([{ product_id: "", qty: "", desc: "" }]);
  const [list, setList] = useState({});
  // const [receipeTypeData, setReceipeTypeData] = useState({});
  const [listDetail, setListDetail] = useState({});
  const [listDetailId, setListDetailId] = useState([]);
  const [custom, setCustom] = useState({});
  const [selectedFactoryOption, setSelectedFactoryOption] = useState(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleCustomInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    const listArr = [];
    listArr.push(index);
    listArr.push(list[index]);
    inputs.product_id = Number(inputs.product_id);
    listArr.push(inputs);
    Http.post("/receipe-item-load", listArr).then((res) => {
      if (res.type == "custom") {
        const inputInfo = [...list];
        inputInfo[res.data.index] =
          res.data.product_purchase_list[res.data.product_id];
        setList(inputInfo);
        setListDetail({});
        setListDetailId({});
      } else {
        const inputInfo = [...listDetail];
        inputInfo[res.data.index] =
          res.data.product_purchase_detail[res.data.product_id];
        setListDetail(inputInfo);

        const inputInfo2 = [...listDetailId];
        inputInfo2[res.data.index] =
          res.data.purchase_order_items[res.data.product_id];
        setListDetailId(inputInfo2);
      }
    });
  };

  // Default Load
  const fetchData = () => {
    Http.get("/receipe-finished-good").then((res) => {
      setProduct(res.data);
    });
    Http.get("/rmpm-with-stock").then((res) => {
      setRmpm(res.data);
    });
    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });
    Http.get("/last-receipe-no").then((res) => {
      setLastReceiptNo(res.data);
    });
    Http.get("/issue/" + id).then((res) => {
      setInputs({
        date: res.data.info.date,
        reference_no: res.data.info.reference_no,
        time: res.data.info.time,
        batch_no: res.data.info.batch_no,
        batch_size: res.data.info.batch_size,
        product_id: res.data.info.product_id,
        product_name: res.data.info.product.name,
        factory_id: res.data.info.factory_id,
        receipe_type: res.data.info.receipe_type,
      });

      const listInfo = [];
      Object.keys(res.data.info.items).forEach((key) => {
        listInfo.push({
          code: res.data.info.items[key].product.code,
          product: res.data.info.items[key].product.name,
          product_id: Number(res.data.info.items[key].product_id),
          stndrd_qty: res.data.info.items[key].stndrd_qty,
          issue_qty: res.data.info.items[key].qty,
          details: "",
        });
      });
      setList(listInfo);
      setListDetail(res.data.listDetail);
      if (res.data.info.factory_id > 0) {
        setSelectedFactoryOption({
          label: res.data.info.factory.name,
          value: res.data.info.factory_id,
        });
      }
    });
    Http.get("/last-code-increment-by-one/issues/reference_no/IR").then(
      (res) => {
        setInputs((values) => ({ ...values, ["reference_no"]: res.data }));
      }
    );
    Http.get("/last-code-increment-by-one/issues/batch_no/IB").then((res) => {
      setInputs((values) => ({ ...values, ["batch_no"]: res.data }));
    });
  };
  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);
  // End Default Load

  // Add More List
  const addMoreList = (id) => {
    let exists = false;

    Object.keys(list).forEach((key) => {
      if (parseInt(list[key].id) == parseInt(id)) {
        alert("This Product already in the list ! Please choose another RMPM.");
        exists = true;
      }
    });
    if (!exists) {
      Http.get("/add-new-rmpm-receipe/" + id).then((res) => {
        setList([...list, res.data]);
      });
    }
  };
  // Remove List
  const removeList = (index) => {
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
        const inputInfo = [...list]; // Load All Existing experience State Data
        inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
        setList(inputInfo); // Replace Existing experience into State
      }
    });
  };

  const formSubmit = () => {
    inputs.list = list;
    inputs.listDetail = listDetail;
    inputs.list_detail_id = listDetailId;
    inputs.requisition_production_id = requisition_production_id;

    Http.put("/issue/" + id, inputs)
      .then((res) => {
        navigate("/issue", {
          state: { message: res.data.message, type: res.data.type },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const receipeLoad = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    inputs.receipe_type = value;
    inputs.requisition_id = requisition_production_id;
    Http.post("/requisition-production-load-receipe-type-wise", inputs).then(
      (res) => {
        // setReceipeTypeData(res.data);
        setList(res.data.purchase_order_items);
        // console.log(res.data.purchase_order_items);
        if (inputs.receipe_type == "custom") {
          // setCustom(res.data.product_purchase_list);
          setListDetail({});
          setListDetailId({});
        } else {
          setListDetail(res.data.product_purchase_detail);
          setListDetailId(res.data.purchase_order_items);
        }
      }
    );
  };
  const handleSelect2Change = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    setSelectedFactoryOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });
  };
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Issue</h5>
        </div>
        <div className="am-pagebody row">
          <div className="card pd-20 pd-sm-40 col-8">
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Edit Issue Form
            </h6>
            <hr></hr>
            {/* <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div> */}
            <div className="row">
              <div className="col-lg">
                <label>
                  Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                  data-required
                />
                {displayError("date")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label>
                  Reference No <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="reference_no"
                  value={inputs.reference_no || ""}
                  onChange={handleChange}
                  placeholder="Input Reference No"
                  data-required
                />

                {displayError("reference_no")}
              </div>
              <div className="col-lg">
                <label>
                  Time <i class="fa fa-star required"></i>
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={inputs.time || ""}
                  onChange={handleChange}
                  placeholder="Input Time"
                  data-required
                />
                {displayError("time")}
              </div>
              <div className="col-lg">
                <label>
                  Batch No <i class="fa fa-star required"></i>
                </label>
                <input
                  type="batch_no"
                  className="form-control"
                  name="batch_no"
                  value={inputs.batch_no || ""}
                  onChange={handleChange}
                  placeholder="Input Batch No"
                  data-required
                />
                {displayError("batch_no")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Batch Size <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  name="batch_size"
                  value={inputs.batch_size || ""}
                  onChange={handleChange}
                  placeholder="Input Batch Size"
                  data-required
                />
                {displayError("batch_size")}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Finished Good <i class="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  name="product_id"
                  value={inputs.product_name || ""}
                  onChange={handleChange}
                  placeholder="Input Batch Size"
                  data-required
                />
                {displayError("product_id")}
              </div>
              <div className="col-lg">
                <label htmlFor="">Factory</label>
                {/* <select
                  className="form-control"
                  name="factory_id"
                  onChange={handleChange}
                >
                  <option value="">Select Factory</option>
                  {Array.from(factory).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={inputs.factory_id === item.id ? true : false}
                    >
                      {item.name}
                    </option>
                  ))}
                </select> */}
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedFactoryOption}
                  value={selectedFactoryOption}
                  onChange={handleSelect2Change}
                  name="factory_id"
                  options={factory}
                  data-required
                />
                {displayError("factory_id")}
              </div>
              <div className="col-lg">
                <label htmlFor="">
                  Receipe Type <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="receipe_type"
                  onChange={receipeLoad}
                >
                  <option value="">Select Receipe Type</option>
                  <option
                    value="fifo"
                    selected={inputs.receipe_type === "fifo" ? true : false}
                  >
                    FIFO
                  </option>
                  <option
                    value="lifo"
                    selected={inputs.receipe_type === "lifo" ? true : false}
                  >
                    LIFO
                  </option>
                  {/* <option
                    value="custom"
                    selected={inputs.receipe_type === "custom" ? true : false}
                  >
                    Custom
                  </option> */}
                </select>
                {displayError("receipe_type")}
              </div>
            </div>

            <div className="row mt-3">
              {/* <div className="col-10"></div>
              <div className="col-2">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div> */}
              <div className="card card-solid">
                <div className="card-header with-border text-center">
                  <h5 className="card-title mb-0">Items in the Recipe</h5>
                </div>
                <div className="card-body mt-3 p-0 pt-3">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Product
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Standard Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Issue Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Details
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(list).map((x, i) => (
                        <ReceipeDetail
                          receipeType={inputs.receipe_type}
                          listInfo={x}
                          listSl={i}
                          listDetail={listDetail}
                          remove={() => removeList(i)}
                          listInputChange={(e) => handleCustomInputChange(e, i)}
                          // handleCustomInputChange={(e) =>
                          //   handleCustomInputChange(e, i)
                          // }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Edit
                </button>
              </div>
            </div>
          </div>
          <div
            className="card pd-20 pd-sm-40 col-4"
            style={{ backgroundColor: "#ffffffc7" }}
          >
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Raw &amp; Packaging Materials
            </h6>
            <hr></hr>
            <div className="row mt-3">
              <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Code
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Item
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Unit
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Stock
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(rmpm).map((x, i) => (
                    <tr>
                      <td></td>
                      <td>{x.code}</td>
                      <td>{x.name}</td>
                      <td>
                        {x.unit_qty}
                        {x.unit_name}
                      </td>
                      <td>
                        <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
                          {x.stockQty ? x.stockQty : 0}
                        </p>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => addMoreList(x.id)}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
