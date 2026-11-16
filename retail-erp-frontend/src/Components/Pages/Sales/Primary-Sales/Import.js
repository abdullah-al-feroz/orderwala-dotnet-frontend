import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import $ from "jquery"; // Import jQuery

const Create = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedDistributor, setSelectedDistributor] = useState([]);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [product, setProduct] = useState({});
  const [distributor, setDistributor] = useState({});
  const [sr, setSr] = useState({});
  const [list, setList] = useState([]);
  const { checkRequiredFields } = useRequiredFields();

  const calculateDueAmount = (finalPrice) => {
    const previous_due = inputs.previous_due
      ? parseFloat(inputs.previous_due)
      : 0;
    const received_amount = inputs.received_amount
      ? parseFloat(inputs.received_amount)
      : 0;

    return finalPrice + previous_due - received_amount;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const selectHandleChange = async (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const { value } = selectedOption;

    setInputs((values) => ({ ...values, [name]: value }));

    const res = await Http.get(`/distributor/${value}`);
    let listInfo = [];

    setInputs((values) => ({
      ...values,
      ["previous_due"]: res.data.previous_due,
    }));

    if (res.data.business_type === "ho") {
      const dataInfo = await Http.get(`/region_area_base_users/${value}`);
      listInfo = dataInfo.data.map((item) => ({
        id: item.id,
        name: item.name,
        user_type: item.user_type,
      }));
    } else {
      for (const key in res.data.sr_base_info) {
        const base = res.data.sr_base_info[key].base;

        if (base && base.users.length) {
          base.users.forEach((user) => {
            if (user.status === "active") {
              listInfo.push({
                id: user.id,
                name: user.name,
                user_type: user.user_type,
              });
            }
          });
        } else {
          const dataInfo = await Http.get(`/region_area_base_users/${value}`);
          listInfo = dataInfo.data.map((item) => ({
            id: item.id,
            name: item.name,
            user_type: item.user_type,
          }));
        }
      }
    }

    setSr(listInfo);
  };

  const handleInvChange = (e, index) => {
    const { name, value } = e.target;
    const inputInfo = [...list]; // Clone the list to avoid direct state mutation
    const currentItem = inputInfo[index];

    // Parse current values, or default to zero
    let currentInvQty = parseInt(value);
    let currentToQty = parseInt(currentItem.to_qty) || 0;

    // Set the new inventory quantity
    currentItem[name] = currentInvQty;

    // Calculate the line total based on the new inventory quantity
    let lineTotal = currentInvQty * parseFloat(currentItem.primary_price);
    currentItem.line_total = lineTotal;

    // Assume handleTOChange would update TO quantities based on some logic
    updateTradeOfferQuantities(currentItem, currentInvQty, index);

    // Update the list with the modified item info
    setList(inputInfo);

    // Call any additional functions if needed, like recalculating totals
    totalCalc(); // Assuming totalCalc recalculates the total invoice values
  };

  const handleTOChange = (e, index) => {
    const { name, value } = e.target;
    const inputInfo = [...list];
    const currentItem = inputInfo[index];

    const newValue = parseInt(value);
    currentItem[name] = newValue; // Update based on direct user input for TO qty

    // Validate the trade offer quantity
    if (
      currentItem.tradeOfferActualQty &&
      newValue === currentItem.tradeOfferActualQty
    ) {
      currentItem.tradeOfferMessage = ""; // Clear message if quantity is correct
    } else {
      currentItem.tradeOfferMessage =
        "Please enter the correct trade offer quantity.";
    }
    console.log(currentItem);
    console.log("lorem" + currentItem.tradeOfferActualQty);
    console.log("ipsum" + currentItem.tradeOfferMessage);

    // Check and possibly update other dependent fields
    updateTradeOfferQuantities(currentItem, currentItem.inv_qty, index); // Reuse the same logic as in handleInvChange

    setList(inputInfo); // Apply the updated list
    totalCalc(); // Recalculate totals
  };

  const updateTradeOfferQuantities = (currentItem, currentInvQty, index) => {
    // Check if trade offer conditions are met
    if (
      currentItem.trade_offer &&
      currentInvQty >= currentItem.trade_offer.qty
    ) {
      let tradeOfferMultiplier = Math.floor(
        currentInvQty / currentItem.trade_offer.qty
      );
      let currentToQty =
        tradeOfferMultiplier * currentItem.trade_offer.offer_qty;
      currentItem.to_qty = currentToQty;
      currentItem.total_qty = currentInvQty + currentToQty; // Total quantity might also depend on other factors
    }
  };

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    const final_price = parseFloat(inputs.total_price) - parseFloat(value);

    setInputs((values) => ({
      ...values,
      [name]: value,
      final_price: final_price,
      due_amount: calculateDueAmount(final_price),
    }));
  };

  const handleReceivedAmountChange = (e) => {
    const { name, value } = e.target;
    const final_price = inputs.final_price ? parseFloat(inputs.final_price) : 0;

    setInputs((values) => ({
      ...values,
      [name]: value,
      due_amount: calculateDueAmount(final_price),
    }));
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    let price =
      parseFloat(inputInfo[index]["rate"]) *
      parseFloat(inputInfo[index]["inv_qty"]);
  };

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };
  const getCurrentTimeInput = () => {
    // Get the current time
    const now = new Date();

    // Format the current time as HH:mm
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    // Set the formatted time as the default value
    setInputs((values) => ({ ...values, ["time"]: formattedTime }));
  };
  // Default Load
  const fetchData = () => {
    Http.get("/fg-with-stock").then((res) => {
      setProduct(res.data);
    });
    Http.get("/distributor2").then((res) => {
      setDistributor(res.data);
    });
    Http.get("/last-code-increment-by-one/orders/receipt_no/PS").then((res) => {
      setInputs((values) => ({ ...values, ["invoice_no"]: res.data }));
    });
  };
  // End Default Load

  useEffect(() => {
    // This will run only once when the component mounts
    fetchData();
    getCurrentDateInput();
    getCurrentTimeInput();
    setIsFirstLoad(true); // Set to true if you need to toggle class only on initial load

    // If you need to set up DataTable only once, it can go here
    DatatableFunc();

    if (isFirstLoad) {
      $("body").toggleClass("collapse-menu");
      $("body").toggleClass("show-left");
    }
  }, []);

  useEffect(() => {
    // This will run every time 'list' changes
    if (!isFirstLoad) {
      //totalCalc(); // Call totalCalc whenever the list changes
    }
    setIsFirstLoad(false); // After first update, set this to false
  }, [list]);

  // Add More List
  const addMoreList = (id) => {
    let exists = false;
    Object.keys(list).forEach((key) => {
      if (parseInt(list[key].id) == parseInt(id)) {
        Swal.fire({
          title: "Warning!",
          text: "This Product already in the list ! Please choose another Product to Invoice.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {});
        exists = true;
      }
    });

    if (!exists) {
      Http.get("/product/" + id).then((res) => {
        // if (res.data.stockQty > 0) setList([...list, res.data]);
        // else alert("Stock Not Available");
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

        // Update the list state and call totalCalc in the callback
        setList(inputInfo);
      }
    });
  };

  // const formSubmit = () => {
  //   console.log(list);
  //   /*inputs.items = list;
  //   inputs.sr_id = parseInt(inputs.sr_id);
  //   Http.post("/order", inputs)
  //     .then((res) => {
  //       navigate("/primary-sales", {
  //         state: { message: res.data.message, type: "success" },
  //       });
  //     })
  //     .catch(function (e) {
  //       setError(e.response.data.errors);
  //     });*/
  // };

  const formSubmit = () => {
    const itemsWithTradeOfferId = list.map((item) => ({
      ...item,
      primary_trade_offer_id: item.primary_trade_offer_id,
    }));

    const payload = {
      ...inputs,
      items: itemsWithTradeOfferId,
      sr_id: parseInt(inputs.sr_id),
    };

    Http.post("/order", payload)
      .then((res) => {
        console.log("Order submitted successfully:", res.data);
        navigate("/primary-sales", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch((error) => {
        setError(error.response.data.errors);
      });
  };

  const totalCalc = () => {
    const total = list.reduce((acc, currItem) => acc + currItem.line_total, 0);

    const validDiscount =
      parseFloat(inputs.discount) > 0 ? parseFloat(inputs.discount) : 0;
    const validReceivedAmount =
      parseFloat(inputs.received_amount) > 0
        ? parseFloat(inputs.received_amount)
        : 0;

    const final_price = total - validDiscount;
    const due_amount = final_price - validReceivedAmount;

    setInputs((prevInputs) => ({
      ...prevInputs,
      total_price: total,
      final_price: final_price,
      due_amount: due_amount,
    }));
  };
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };

  const checkTradeOfferMessages = () => {
    return list.some(
      (item) => item.tradeOfferMessage && item.tradeOfferMessage.trim() !== ""
    );
  };

  // Function to convert Excel serial date to JavaScript Date
  const excelSerialDateToDate = (serialDate) => {
    const excelEpoch = new Date(1899, 11, 30); // Excel's epoch start (December 30, 1899)
    const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    return new Date(excelEpoch.getTime() + serialDate * msPerDay);
  };
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      const rowData = d[0];
      const dateObj = excelSerialDateToDate(rowData.date);
      const formattedDate = dateObj.toISOString().split("T")[0]; // e.g., "YYYY-MM-DD"

      // Set your inputs including the converted date and time
      setInputs({
        invoice_no: rowData.receipt_no,
        date: formattedDate,
        time: rowData.time.substring(0, 5),
        distributor_id: rowData.company_id,
        sr_id: rowData.sr_id,
        payment_type: rowData.payment_type,
        total_price: rowData.total_price,
        discount: rowData.discount,
        final_price: rowData.total_price - rowData.discount,
        previous_due: 0,
        received_amount: rowData.payment_amount,
        due_amount: rowData.due_amount,
        ldl_order_id: rowData.id,
        payment_date: rowData.payment_date,
        transfer_status: rowData.transfer_status,
      });

      Http.post("/ldl-order-information-search", rowData)
        .then((res) => {
          if (res.data.distributor != null) {
            setSelectedDistributor({
              label: res.data.distributor.name,
              value: res.data.distributor.id,
            });

            let listInfo = [];

            if (res.data.distributor.business_type === "ho") {
              Http.get(
                "/region_area_base_users/" + res.data.distributor.id
              ).then((res2) => {
                listInfo = res2.data.map((item) => ({
                  id: item.id,
                  name: item.name,
                  user_type: item.user_type,
                }));
              });
            } else {
              for (const key in res.data.distributor.sr_base_info) {
                const base = res.data.distributor.sr_base_info[key].base;

                if (base && base.users.length) {
                  base.users.forEach((user) => {
                    if (user.status === "active") {
                      listInfo.push({
                        id: user.id,
                        name: user.name,
                        user_type: user.user_type,
                      });
                    }
                  });
                } else {
                  Http.get(
                    "/region_area_base_users/" + res.data.distributor.id
                  ).then((res2) => {
                    listInfo = res2.data.map((item) => ({
                      id: item.id,
                      name: item.name,
                      user_type: item.user_type,
                    }));
                  });
                }
              }
            }

            setSr(listInfo);

            const srMatch = Array.from(listInfo).find(
              (item) => item.name === rowData.sr_id
            );
            let sr_id = srMatch ? srMatch.id : null;
            setInputs((values) => ({
              ...values,
              ["previous_due"]: res.data.distributor.previous_due,
              ["distributor_id"]: res.data.distributor.id,
              ["sr_id"]: sr_id,
            }));

            const requests = d.slice(2).map(async (row) => {
              try {
                if (typeof row.date === "string" && row.date.trim() !== "") {
                  const res2 = await Http.get(
                    `/ldl-order-item-information?productName=${encodeURIComponent(
                      row.date
                    )}&productQty=${encodeURIComponent(
                      row.users_id
                    )}&productTQty=${encodeURIComponent(
                      row.total_price
                    )}&basket=0&date=` + formattedDate
                  );
                  console.log(res2.data);
                  if (res2.data.status == 1) {
                    // return createResponseObject(row, res2.data.list);
                    return createResponseObject(row, res2.data.list);
                  }

                  // else {
                  //   alert();
                  // }
                } else {
                  if (
                    typeof row.transfer_status === "string" &&
                    row.transfer_status.trim() !== ""
                  ) {
                    const res2 = await Http.get(
                      `/ldl-order-item-information?productName=${encodeURIComponent(
                        row.transfer_status
                      )}&productQty=${encodeURIComponent(
                        row.users_id
                      )}&productTQty=${encodeURIComponent(
                        row.total_price
                      )}&basket=1&date=` + formattedDate
                    );
                    if (res2.data.status == 1) {
                      return createResponseObject(row, res2.data.list);
                    }
                    // return createResponseObject(row, res2.data.list);
                    // else alert();
                  } else {
                    // Handle cases where both row.date and row.payment_date are not valid strings
                    console.error("Invalid input for row:", row);
                    return null;
                  }
                }
              } catch (error) {
                // handle error or return a fallback value
                console.error("Failed to fetch data for row: ", row, error);
                return null;
              }
            });

            function createResponseObject(row, data) {
              console.log("Creating response object for:", row, data);

              return {
                ldl_order_item_id: row.id,
                id: data.id,
                code: data.code,
                pack_size: data.pack_size,
                name: data.name,
                order_qty: row.users_id,
                inv_qty: row.users_id,
                to_qty: row.total_price,
                trade_offer_product: null,
                primary_price: row.vat_percentage,
                // tp: row.transfer_status,
                // mrp: row.transfer_date,
                total_qty: row.discount,
                line_total: row.vat,
                amount: row.vat,
                primary_trade_offer_id: data.tradeOfferPrimary?.id,
                tradeOfferActualQty: data.tradeOfferActualQty,
                tradeOfferMessage: data.tradeOfferMessage,
                busket_or_not:
                  typeof row.transfer_status === "string" &&
                  row.transfer_status.trim() !== ""
                    ? 1
                    : 0,
              };
            }

            Promise.all(requests).then((listInfo) => {
              // Filter out any null values if you used null as a fallback in catch
              const filteredListInfo = listInfo.filter((item) => item != null);
              setList(filteredListInfo);
              console.log(listInfo);
            });
          } else {
            setList([]);
            setInputs([]);
            alert("Distributor Not Found with this name!");
          }
        })
        .catch(function (e) {
          setError(e.response.data.errors);
          alert(
            "Something went wrong! Please download excel again and try again!"
          );
        });
    });
  };
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Import Primary Sales</h5>
        </div>
        <div className="am-pagebody row">
          <div className="card pd-20 pd-sm-40 col-9">
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Import Primary Sales Form
            </h6>
            <hr></hr>
            {/* <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div> */}
            <div className="row">
              <div className="col-lg">
                <label>Import Primary Sales</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                  }}
                />
              </div>
              <div className="col-lg">
                <label>
                  Invoice No <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="invoice_no"
                  value={inputs.invoice_no || ""}
                  onChange={handleChange}
                  placeholder="Input Invoice No"
                />

                {displayError("invoice_no")}
              </div>
              <div className="col-lg">
                <label>
                  Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                />

                {displayError("date")}
              </div>
              <div className="col-lg">
                <label>
                  Time <i className="fa fa-star required"></i>
                </label>
                <input
                  type="time"
                  className="form-control"
                  name="time"
                  value={inputs.time || ""}
                  onChange={handleChange}
                  placeholder="Input Time"
                />
                {displayError("time")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg">
                <label>
                  Distributor <i className="fa fa-star required"></i>
                </label>
                {/* <select
                  className="form-control"
                  name="distributor_id"
                  onChange={handleDistributorChange}
                >
                  <option value="">Select Distributor</option>
                  {Array.from(distributor).map((item, index) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select> */}

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedDistributor}
                  value={selectedDistributor}
                  name="distributor_id"
                  options={distributor}
                  onChange={selectHandleChange}
                />
                {displayError("distributor_id")}
              </div>
              <div className="col-lg">
                <label>
                  Sales Person <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="sr_id"
                  onChange={handleChange}
                >
                  <option value="">Select Sr </option>
                  {Array.from(sr).map((item, index) => (
                    <option
                      value={item.id}
                      key={item.id}
                      selected={item.id === inputs.sr_id}
                    >
                      {item.name}- ({item.user_type})
                    </option>
                  ))}
                </select>

                {displayError("sr_id")}
              </div>
              <div className="col-lg">
                <label>
                  Payment Type <i className="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="payment_type"
                  onChange={handleChange}
                >
                  <option value="">Select Payment Type</option>
                  <option
                    value="Online"
                    selected={inputs.payment_type === "Online"}
                  >
                    Online
                  </option>
                  <option value="DD" selected={inputs.payment_type === "DD"}>
                    DD
                  </option>
                  <option value="CM" selected={inputs.payment_type === "CM"}>
                    CM
                  </option>
                  <option
                    value="Cheque"
                    selected={inputs.payment_type === "Cheque"}
                  >
                    Cheque
                  </option>
                  <option
                    value="Replace"
                    selected={inputs.payment_type === "Replace"}
                  >
                    Replace
                  </option>
                  <option
                    value="Due Inv"
                    selected={inputs.payment_type === "Due Inv"}
                  >
                    Due Inv
                  </option>
                  <option
                    value="Hill Allowence"
                    selected={inputs.payment_type === "Hill Allowence"}
                  >
                    Hill Allowence
                  </option>
                  <option
                    value="City Allowence"
                    selected={inputs.payment_type === "City Allowence"}
                  >
                    City Allowence
                  </option>
                  <option
                    value="Dealer Incentive"
                    selected={inputs.payment_type === "Dealer Incentive"}
                  >
                    Dealer Incentive
                  </option>
                  <option
                    value="DSR Incentive"
                    selected={inputs.payment_type === "DSR Incentive"}
                  >
                    DSR Incentive
                  </option>
                  <option
                    value="DD Cost"
                    selected={inputs.payment_type === "DD Cost"}
                  >
                    DD Cost
                  </option>
                  <option
                    value="sample"
                    selected={inputs.payment_type === "sample"}
                  >
                    Sample
                  </option>
                </select>

                {displayError("payment_type")}
              </div>
            </div>

            <div className="row mt-3">
              <div className="card card-solid">
                <div className="card-header with-border text-center">
                  <h5 className="card-title mb-0">
                    Items in the Order <i className="fa fa-star required"></i>
                  </h5>
                </div>
                <div className="card-body p-0">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          #
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Product
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Crtn Size
                        </th>
                        {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Order Qty
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Inv. Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          T/O Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Rate
                        </th>
                        {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          TP
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          MRP
                        </th> */}
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Total Qty
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Line Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.length < 1 ? (
                        <tr>
                          <td colSpan={10}>
                            <p
                              style={{ color: "red" }}
                              className="text-center mt-3"
                            >
                              Please Add Few Products to Process Order
                            </p>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}

                      {Array.from(list).map((x, i) => (
                        <tr>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeList(i)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                          <td>
                            <div className="col-lg">{list[i].code}</div>
                          </td>
                          <td>
                            <div className="col-lg">{list[i].name}</div>
                          </td>
                          <td>{list[i].pack_size ? list[i].pack_size : 0}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="inv_qty"
                              value={x.inv_qty || 0}
                              onChange={(e) => handleInvChange(e, i)}
                            />
                            {displayError("items." + i + ".inv_qty")}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="to_qty"
                              value={x.to_qty || 0}
                              onChange={(e) => handleTOChange(e, i)}
                            />
                            {x.tradeOfferMessage && (
                              <label className="btn btn-danger btn-sm">
                                {x.tradeOfferMessage}
                              </label>
                            )}
                            <label>{x.trade_offer_product}</label>
                            {displayError("items." + i + ".to_qty")}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="primary_price"
                              value={x.primary_price}
                              onChange={(e) => handleInvChange(e, i)}
                            />
                            {displayError("items." + i + ".price")}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="total_qty"
                              value={x.total_qty || 0}
                              onChange={(e) => handleInputChange(e, i)}
                              disabled
                            />
                            {displayError("items." + i + ".total_qty")}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="line_total"
                              value={x.line_total || 0}
                              onChange={(e) => handleInputChange(e, i)}
                              disabled
                            />
                            {displayError("items." + i + ".line_total")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan={7}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Total Price
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="total_price"
                            value={inputs.total_price || ""}
                            onChange={handleChange}
                            placeholder="Total Price"
                            disabled
                          />
                          {displayError("toal_price")}
                        </td>
                      </tr>
                      {/* <tr>
                        <td
                          colSpan={8}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Discount
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="discount"
                            value={inputs.discount || ""}
                            onChange={handleDiscountChange}
                            placeholder="Total Discount"
                          />
                          {displayError("discount")}
                        </td>
                      </tr> */}
                      <tr>
                        <td
                          colSpan={7}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Final Price
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="discount"
                            value={inputs.final_price || ""}
                            placeholder="Final Amount"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={7}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Previous Due
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="previous_due"
                            value={inputs.previous_due || ""}
                            onChange={handleChange}
                            placeholder="Total Price"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={7}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Received Amount
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="received_amount"
                            value={inputs.received_amount || ""}
                            onChange={handleReceivedAmountChange}
                            placeholder="Total Received Amount"
                          />
                          {displayError("received_amount")}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan={7}
                          className="text-right"
                          style={{ lineHeight: "40px" }}
                        >
                          Due Amount
                        </td>
                        <td colSpan={2}>
                          <input
                            type="text"
                            className="form-control"
                            name="due_amount"
                            value={inputs.due_amount || ""}
                            onChange={handleChange}
                            placeholder="Total Due Amount"
                            disabled
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                  disabled={list.some(
                    (item) =>
                      item.tradeOfferMessage &&
                      item.tradeOfferMessage.trim() !== ""
                  )}
                >
                  <i className="fa fa-send mg-r-10"></i> Create
                </button>
              </div>
            </div>
          </div>
          <div
            className="card pd-20 pd-sm-40 col-3"
            style={{ backgroundColor: "#ffffffc7" }}
          >
            <h6 className="card-body-title mg-sm-b-30 text-center">
              Available Items
            </h6>
            <hr></hr>
            <div className="row mt-3">
              <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                <thead>
                  <tr>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Item
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Price
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                      Stock
                    </th>
                    <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(product).map((x, i) => (
                    <tr>
                      <td>
                        {x.code} - {x.name}
                      </td>
                      <td>
                        <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
                          {x.primary_price ? x.primary_price : 0}
                        </p>
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

export default Create;
