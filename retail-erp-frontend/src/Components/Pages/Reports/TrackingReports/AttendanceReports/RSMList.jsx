import React, { useCallback, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import {
  Link,
  useLocation,
  useParams,
  createSearchParams,
} from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";

//New Data table Code Start
import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const normalizeISODate = (value) => {
  if (!value) return null;
  const match = String(value)
    .trim()
    .match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;

  const normalized = match[1];
  const [year, month, day] = normalized.split("-").map((part) => Number(part));
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return normalized;
};

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [staff, setStaff] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = useCallback(
    async ({ fromDate, toDate } = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          type: "mdm",
          cdm_id: id,
        });

        if (fromDate && toDate) {
          params.set("from_date", fromDate);
          params.set("to_date", toDate);
        }

        const [res, resRole] = await Promise.all([
          Http.get(`/app/moo/attendance-report?${params.toString()}`),
          Http.get("/staff-type-check"),
        ]);

        setRole(resRole.data);
        setReceiveData(res.data.list);
        setCumulativeData(res.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
      // Http.get("/app/report/attendance?user_id=" + id).then((res) => {
      //   console.log(res);
      //   setReceiveData(res.data.list);
      //   setCumulativeData(res.data);
      // });

      // Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
      //   (res) => {
      //     setStaff(res.data);
      //   }
      // );
    },
    [id],
  );

  useEffect(() => {
    DatatableFunc();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromParam = normalizeISODate(params.get("from_date"));
    const toParam = normalizeISODate(params.get("to_date"));

    if (fromParam && toParam && new Date(fromParam) <= new Date(toParam)) {
      setInputs((prev) => ({
        ...prev,
        from: fromParam,
        to: toParam,
      }));
      fetchData({ fromDate: fromParam, toDate: toParam });
      return;
    }

    fetchData();
  }, [fetchData, location.search]);

  // const selectHandleChange = (selectedOption, actionMeta) => {
  //   const name = actionMeta.name;
  //   const value = selectedOption.value;
  //   setInputs((values) => ({ ...values, [name]: value }));
  // };

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

  const deleteData = (id, deleteApiUrl, showMsg) => {
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
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };
  const formatTo12HourWithDate = (dateTimeString) => {
    if (!dateTimeString) return ""; // Return empty string if dateTimeString is null or undefined
    const [datePart, timePart] = dateTimeString.split(" "); // Split into date and time
    if (!timePart) return datePart; // If timePart is missing, return the date only
    const [hours, minutes, seconds] = timePart.split(":");
    const hours12 = (+hours % 12 || 12).toString().padStart(2, "0");
    const period = +hours < 12 ? "AM" : "PM";
    return `${datePart} ${hours12}:${minutes} ${period}`;
  };

  let cols = [
    { field: "name", header: "Name" },
    { field: "workplace", header: "Workplace" },
    {
      field: (rowData) => formatTo12HourWithDate(rowData.attendance_time),
      header: "Attendance At ",
    },
    {
      field: (rowData) => (rowData.is_late === 1 ? "Yes" : "No"),
      header: "Late",
    },
    { field: "attendance_location", header: "Attendance Location" },
    { field: "checkout_location", header: "Checkout Location" },
    {
      field: (rowData) => formatTo12HourWithDate(rowData.checkout_time),
      header: "Checkout At",
    },

    {
      field: "total_verified",
      header: "Verified Store",
    },
    { field: "total_unverified", header: "Unverified Store" },
    {
      field: "visited_store_team_orderwala",
      header: "Visited store Team Orderwala",
    },
    { field: "visited_store_orderwala", header: "Visited store Orderwala" },
    { field: "visited_store", header: "Visited store" },

    { field: "order_qty_team_orderwala", header: "Order Qty Team Orderwala" },
    { field: "order_qty_orderwala", header: "Order Qty Orderwala" },
    { field: "order_qty", header: "Order qty" },

    {
      field: "order_amount_team_orderwala",
      header: "Order Amount Team Orderwala",
    },
    { field: "order_amount_orderwala", header: "Order Amount Orderwala" },
    { field: "undeliveryOrderAmount", header: "Undelivered Order amount" },
    { field: "deliveryOrderAmount", header: "Delivered Order amount" },
    { field: "order_amount", header: "Order amount" },
    // { field: "all_order_amount", header: "Actual Order amount" },
    { field: "total_order_item_amount", header: "Actual Order amount" },
  ];

  // const mappedData = receiveData.map((item) => {
  //   const attendances = item.attendances
  //     .map((attendances) => attendances?.attendance_at)
  //     .join(" || ");

  //   return {
  //     ...item,
  //     attendances,
  //   };
  // });

  //   const formSubmit = () => {
  //     Http.post("/chart-of-account-report/", inputs).then((res) => {
  //       setReceiveData(res.data.info);
  //     });
  const formSubmit = async () => {
    fetchData({ fromDate: inputs.from, toDate: inputs.to });
  };

  const actionTemplate = (rowData, deleteData, statusChange) => {
    const handleApprove = async () => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to approve this entry!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, approve it!",
        });

        if (result.isConfirmed) {
          // Call the API to approve the attendance
          await Http.post(`/approve-mdo-attendnace/${rowData.attendance_id}`);

          Swal.fire("Approved!", "The entry has been approved.", "success");

          // Update the receiveData state to remove the "Approve" button
          setReceiveData((prevData) =>
            prevData.map((item) =>
              item.attendance_id === rowData.attendance_id
                ? { ...item, is_late: 0 } // Mark as not late
                : item,
            ),
          );
        }
      } catch (error) {
        console.error("Approval error:", error);
        Swal.fire("Error", "Something went wrong while approving.", "error");
      }
    };
    return (
      rowData.id && (
        <div className="text-xs text-nowrap">
          <Link
            to={{
              pathname: "/tracking-reports/attendance-reports/am/" + rowData.id,
              search: createSearchParams({
                from_date: inputs.from,
                to_date: inputs.to,
              }).toString(),
            }}
            className="btn btn-info btn-sm mx-1"
            title="View"
          >
            <i className="fa fa-list" aria-hidden="true"></i>
          </Link>
          {rowData.is_late === 1 && role === "hmo" && (
            <button
              className="btn btn-success btn-sm mx-1"
              onClick={handleApprove}
            >
              Approve
            </button>
          )}
        </div>
      )
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">
              Regional Sales Manager Attendance Report
            </h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="chart_of_account_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div> */}
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
                      <th>Total RSM : {cumulative.total_staff}</th>
                      <th>
                        Total RSM Attendant : {cumulative.attendance_given}
                      </th>
                      <th>
                        Total Verified Store : {cumulative.total_verified} ||
                        Total Unverified Store : {cumulative.total_unverified}
                      </th>
                    </tr>
                    <tr>
                      <th>
                        Visited Stores : (OW:{" "}
                        {cumulative.total_visited_store_orderwala} || TOW:{" "}
                        {cumulative.total_visited_store_team_orderwala} ||
                        Total: {cumulative.total_visited_store})
                      </th>
                      <th>
                        Order Qty : (OW: {cumulative.total_order_qty_orderwala}{" "}
                        || TOW: {cumulative.total_order_qty_team_orderwala} ||
                        Total: {cumulative.total_order_qty})
                      </th>
                      <th>
                        Order Amount : (OW:{" "}
                        {cumulative.total_order_amount_orderwala} || TOW:{" "}
                        {cumulative.total_order_amount_team_orderwala} || TUA:{" "}
                        {cumulative.total_undelivered_order_amount}
                        || TDA: {cumulative.total_delivered_order_amount} ||
                        Total: {cumulative.total_order_amount})
                      </th>
                    </tr>
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
                isLoading={loading}
                receiveData={receiveData}
                actionTemplate={actionTemplate}
                deleteData={deleteData}
                frozenColumnFields={["name"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
