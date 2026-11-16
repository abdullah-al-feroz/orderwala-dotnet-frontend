import React, { useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";

//New Data table Code Start
import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const List = (props) => {
  const toast = useRef(null);
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  //   const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});
  const { id, baseId } = useParams();
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(location.search);
  const from_date = query.get("from_date");
  const to_date = query.get("to_date");

  const [inputs, setInputs] = useState({
    date: new Date().toISOString().substr(0, 10),
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    user_id: id,
    status: "active",
  });
  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await Http.get(
        `/app/report/mdo-shop-details?user_id=${id}&base_id=${baseId}&from_date=${from_date}&to_date=${to_date}`
        // + "&to_date=" + to_date
      );
      setReceiveData(res.data.list);
      setCumulativeData(res.data.summary);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }

    try {
      setLoading(true);
      const res = await Http.get(
        "/select2/Hr.HrStaffBasicInfo/id,name/status:active"
      );
      setStaff(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (from_date) {
      setInputs((prev) => ({
        ...prev,
        date: from_date,
      }));
    }
    DatatableFunc();
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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

  const formatTo12HourWithDate = (dateTimeString) => {
    if (!dateTimeString) return ""; // Return empty string if dateTimeString is null or undefined
    const [datePart, timePart] = dateTimeString.split(" "); // Split into date and time
    if (!timePart) return datePart; // If timePart is missing, return the date only
    const [hours, minutes, seconds] = timePart.split(":");
    const hours12 = (+hours % 12 || 12).toString().padStart(2, "0");
    const period = +hours < 12 ? "AM" : "PM";
    return `${datePart} ${hours12}:${minutes} ${period}`;
  };

  const cols = [
    { field: "shop_name", header: "Shop Name" },
    { field: "route.region.name", header: "Region" },
    { field: "route.area.name", header: "Area" },
    { field: "route.base.name", header: "Base" },
    { field: "route.name", header: "Route" },
    // { field: "store_checkin_info.checkin_at", header: "Checkin At" },
    // { field: "store_checkin_info.checkout_at", header: "Checkout At" },
    {
      field: (rowData) =>
        formatTo12HourWithDate(rowData.store_checkin_info.checkin_at),
      header: "Checkin At",
    },
    {
      field: (rowData) =>
        formatTo12HourWithDate(rowData.store_checkin_info.checkout_at),
      header: "Checkout At",
    },
    { field: "order_info.memo_qty", header: "Memo Qty" },
    { field: "order_info.total_price", header: "Memo Amount" },
    { field: "order_info.categories_no", header: "No. of Categories" },
    { field: "order_info.products_no", header: "No. of SKU" },
    // { field: "ledger.total_order_amount", header: "Lifetime Order Amount" },
    // { field: "ledger.total_paid_amount", header: "Lifetime Payment Amount" },
    // { field: "ledger.total_return_amount", header: "Lifetime Return Amount" },
    // { field: "ledger.total_due_amount", header: "Current Balance" },
  ];
  const formSubmit = async () => {
    try {
      setLoading(true); // Start loading
      const res = await Http.get(
        `/app/report/mdo-shop-details?user_id=${inputs.user_id}&date=${inputs.date}`
      );

      if (res.data.status) {
        setReceiveData(res.data.list);
        setCumulativeData(res.data.summary);
      } else {
        setReceiveData([]);
        setCumulativeData([]);
        if (toast.current) {
          toast.current.show({
            severity: "warn",
            summary: "No Data",
            detail: "Route Plan Not Found for this user",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setReceiveData([]);
      setCumulativeData([]);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while fetching data.",
        });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const actionTemplate = (rowData, deleteData, statusChange) => {
    return (
      <div className="text-xs text-nowrap">
        {rowData.order_info.memo_qty > 0 && (
          <button
            className="btn btn-info btn-sm mx-1"
            // title="View"
            onClick={() => {
              const orderId = rowData.order_info.order_id; // Replace with the actual field name in your data
              // const shopId = rowData.id; // Replace with the actual field name in your data
              // const date = inputs.date; // Replace with the actual field name in your data
              const url = `/distributor/retailer-order/${orderId}`;
              window.open(url, "_blank");
            }}
          >
            <i className="fa fa-list" aria-hidden="true"></i>
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Market Development Officer Details</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card">
              <div className="row">
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={inputs.date || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="user_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
              {loading ? (
                <>
                  <h2
                    className="mg-b-5 tx-inverse tx-lato"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Oval
                      height={80}
                      width={80}
                      color="#00BFFF"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="#4fa94d"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </h2>
                </>
              ) : (
                <>
                  <table className="table mb-0">
                    <tr>
                      <th colSpan={8} className="text-center">
                        <label style={{ color: "red", fontWeight: "bold" }}>
                          Data Showing at {inputs.date}
                        </label>
                      </th>
                    </tr>
                    <tr>
                      <th>Staff</th>
                      <td>{cumulative.staff_name}</td>
                      <th>Attendance At</th>
                      <td>{cumulative.attendance_at}</td>
                      <th>Checkout At</th>
                      <td>{cumulative.checkout_at}</td>
                      <th>Assigned Route</th>
                      <td>{cumulative.todays_route}</td>
                    </tr>
                    <tr>
                      <th>Total Shop</th>
                      <td>{cumulative.total_shop}</td>
                      <th>Total Checkin</th>
                      <td>{cumulative.total_checkin}</td>

                      <th>Total Memo Qty</th>
                      <td>{cumulative.total_memo_qty}</td>
                      <th>Total Memo Amount</th>
                      <td>{cumulative.total_memo_amount}</td>
                    </tr>
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="am-pagebody">
            <div className="card">
              <ReactDataTable
                cols={cols}
                isLoading={loading}
                receiveData={receiveData}
                actionTemplate={actionTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
