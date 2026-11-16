import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import ReceipeDetail from "./ReceipeDetail";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import Swal from "sweetalert2";
import Select from "react-select";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [rmpm, setRmpm] = useState({});
  const [factory, setFactory] = useState({});
  const [list, setList] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  const [receipeNotFound, setReceipeNotFound] = useState("Receipe Not Found");
  const [selectedProductOption, setSelectedProductOption] = useState(null);
  const [selectedFactoryOption, setSelectedFactoryOption] = useState(null);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    if (
      inputs.product_id > 0 &&
      inputs.batch_size > 0 &&
      name == "batch_size"
    ) {
      inputs.batch_size = value;
      inputs.receipe_type = "fifo";
      Http.post("/receipe-load", inputs).then((res) => {
        if (res.data.status == 1) {
          setList(res.data.purchase_order_items);
          setReceipeNotFound("");
        } else {
          // setList({});
          // setReceipeNotFound(res.data.msg);
          setList(res.data.purchase_order_items);
          setReceipeNotFound("");
        }
      });
    }
  };

  const handleCustomInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };

  // Default Load
  const fetchData = () => {
    Http.get("/requisition-production/" + id + "/edit").then((res) => {
      setInputs({
        date: res.data.date,
        time: res.data.time,
        batch_no: res.data.batch_no,
        expected_production_date: res.data.expected_production_date,
        batch_size: res.data.batch_size,
        product_id: res.data.product_id,
        factory_id: res.data.factory_id,
      });
      if (res.data.product_id > 0) {
        setSelectedProductOption({
          label: res.data.product.name,
          value: res.data.product_id,
        });
      }
      if (res.data.factory_id > 0) {
        setSelectedFactoryOption({
          label: res.data.factory.name,
          value: res.data.factory_id,
        });
      }

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          id: res.data.items[key].product_id,
          code: res.data.items[key].product.code,
          name: res.data.items[key].product.name,
          stndrd_qty: res.data.items[key].stndrd_qty,
          product_id: res.data.items[key].product_id,
          issue_qty: res.data.items[key].qty,
        });
      });
      setList(listInfo);

      setReceipeNotFound("");
    });
    Http.get("/receipe-finished-good").then((res) => {
      setProduct(res.data);
    });
    Http.get("/rmpm-with-stock").then((res) => {
      setRmpm(res.data);
    });
    // Http.get("/factory").then((res) => {
    //   setFactory(res.data);
    // });
    Http.get("/factorySelect2").then((res) => {
      setFactory(res.data);
    });
    Http.get(
      "/last-code-increment-by-one/requisition_productions/batch_no/RP"
    ).then((res) => {
      setInputs((values) => ({ ...values, ["batch_no"]: res.data }));
    });
  };
  useEffect(() => {
    DatatableFunc();
    fetchData();
    // getCurrentDateInput();
  }, []);
  // End Default Load

  // Add More List
  // const addMoreList = (id) => {
  //   let exists = false;

  //   Object.keys(list).forEach((key) => {
  //     if (parseInt(list[key].id) == parseInt(id)) {
  //       alert("This Product already in the list ! Please choose another RMPM.");
  //       exists = true;
  //     }
  //   });
  //   if (!exists) {
  //     Http.get("/add-new-rmpm-receipe/" + id).then((res) => {
  //       console.log(res.data);
  //       setList([...list, res.data]);
  //     });
  //   }
  // };

  const addMoreList = (id) => {
    let exists = false;

    // Convert the object into an array using Object.values()
    const listArray = Object.values(list);

    listArray.forEach((item) => {
      if (parseInt(item.id) === parseInt(id)) {
        Swal.fire({
          text: "This Product already in the list! Please choose another Product!",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
        }).then((result) => {});
        exists = true;
      }
    });

    if (!exists) {
      Http.get("/add-new-rmpm-receipe/" + id).then((res) => {
        console.log(res.data);
        setList([...listArray, res.data]);
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
    checkRequiredFields();
    inputs.items = list;
    Http.put("/requisition-production/" + id, inputs)
      .then((res) => {
        navigate("/requisition-production", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };
  const receipeLoad = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));

    inputs.product_id = value;
    inputs.receipe_type = "fifo";
    Http.post("/receipe-load", inputs).then((res) => {
      if (res.data.status == 1) {
        setList(res.data.purchase_order_items);
        setReceipeNotFound("");
      } else {
        // setList({});
        // setReceipeNotFound(res.data.msg);
        setList(res.data.purchase_order_items);
        setReceipeNotFound("");
      }
    });

    setSelectedProductOption({
      label: selectedOption.label,
      value: selectedOption.value,
    });
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
      <LoaderComponent />
      <IsLogin></IsLogin>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Requisition Production</h5>
        </div>
        <div className="am-pagebody row">
          <div className="card pd-20 pd-sm-40 col-8">
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Edit Requisition Production Form
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
              <div className="col-lg">
                <label>Expected Production</label>
                <input
                  type="date"
                  className="form-control"
                  name="expected_production_date"
                  value={inputs.expected_production_date || ""}
                  onChange={handleChange}
                  placeholder="Input Expected Production Date"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Batch Size <i class="fa fa-star required"></i>
                </label>
                <input
                  type="batch_size"
                  className="form-control"
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
                {/* <select
                  className="form-control select2"
                  name="product_id"
                  onChange={receipeLoad}
                >
                  <option value="">Select Product</option>
                  {Array.from(product).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select> */}
                {/* <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={product[0]}
                  name="product_id"
                  options={product}
                  onChange={receipeLoad}
                  data-required
                /> */}
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedProductOption}
                  value={selectedProductOption}
                  onChange={receipeLoad}
                  name="product_id"
                  options={product}
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
                    <option value={item.id} key={item.id}>
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
            </div>

            <div className="row mt-3">
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
                          Request Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(list).map((x, i) => (
                        <ReceipeDetail
                          listInfo={x}
                          listSl={i}
                          rmpm={rmpm}
                          remove={() => removeList(i)}
                          listInputChange={(e) => handleCustomInputChange(e, i)}
                        />
                      ))}
                      {receipeNotFound != "" ? (
                        <tr>
                          <td colSpan={5}>
                            <p
                              style={{ color: "red" }}
                              className="text-center mt-3"
                            >
                              {receipeNotFound}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
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
                  <i className="fa fa-send mg-r-10"></i> Update
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
