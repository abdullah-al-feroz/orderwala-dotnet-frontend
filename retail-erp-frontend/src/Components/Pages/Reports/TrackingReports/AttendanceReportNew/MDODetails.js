import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import Select from "react-select";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import { Toast } from "primereact/toast";

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
        "/app/report/mdo-shop-details?user_id=" + id + "&base_id=" + baseId
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

  const cols = [
    { field: "shop_name", header: "Shop Name" },
    { field: "rowData.store.available_for_mdo", header: "MDO Shop" },
    { field: "route.region.name", header: "Region" },
    { field: "route.area.name", header: "Area" },
    { field: "route.base.name", header: "Base" },
    { field: "route.name", header: "Route" },
    { field: "store_checkin_info.checkin_at", header: "Checkin At" },
    { field: "store_checkin_info.checkout_at", header: "Checkout At" },
    { field: "order_info.memo_qty", header: "Memo Qty" },
    { field: "order_info.total_price", header: "Memo Amount" },
    // { field: "ledger.total_order_amount", header: "Lifetime Order Amount" },
    // { field: "ledger.total_paid_amount", header: "Lifetime Payment Amount" },
    // { field: "ledger.total_return_amount", header: "Lifetime Return Amount" },
    // { field: "ledger.total_due_amount", header: "Current Balance" },
  ];

  const formSubmit = () => {
    Http.get(
      "/app/report/mdo-shop-details?user_id=" +
        inputs.user_id +
        "&date=" +
        inputs.date
    ).then((res) => {
      if (res.data.status == true) {
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
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Market Development Officer Details</h5>
          </div>
          <div className="am-pagebody" style={{ padding: "0px" }}>
            <Alert alert={alert} />
            <div className="card pd-sm-40">
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
            </div>
          </div>

          <div className="am-pagebody">
            <table className="table">
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

            <div className="card">
              <ReactDataTable
                cols={cols}
                isLoading={loading}
                receiveData={receiveData}
                frozenColumnFields={[
                  "shop_name",
                  "rowData.store.available_for_mdo",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
