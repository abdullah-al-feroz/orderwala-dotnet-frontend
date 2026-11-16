import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";

import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";

// Data table
import { Oval } from "react-loader-spinner";
import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // =========================================================
  // URL QUERY PARAMETERS
  // =========================================================
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const fromDate = searchParams.get("from_date");
  const toDate = searchParams.get("to_date");

  // =========================================================
  // STATES
  // =========================================================
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState({});
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState({});
  const [queryParams, setQueryParams] = useState({});
  const [paramsIndexWise, setParamsIndexWise] = useState([]);

  // =========================================================
  // DATE INPUTS
  // =========================================================
  const today = new Date().toISOString().substr(0, 10);

  const [inputs, setInputs] = useState({
    from: fromDate || today,
    to: toDate || today,
    status: "active",
  });

  // =========================================================
  // FETCH DATA
  // =========================================================
  const fetchData = async () => {
    setLoading(true);

    try {
      const currentSearchParams = new URLSearchParams(location.search);

      const urlId = currentSearchParams.get("id");
      const urlType = currentSearchParams.get("type");
      const urlFromDate = currentSearchParams.get("from_date");
      const urlToDate = currentSearchParams.get("to_date");

      const apiParams = new URLSearchParams();

      apiParams.append("type", urlType || "moo");

      if (urlId) {
        apiParams.append("id", urlId);
      }

      if (urlFromDate) {
        apiParams.append("from_date", urlFromDate);
      }

      if (urlToDate) {
        apiParams.append("to_date", urlToDate);
      }

      const url = `/app/new-report/dashboard/priority-customer?${apiParams.toString()}`;

      console.log("Priority Retailers API URL:", url);

      const res = await Http.get(url);

      // Staff role
      const resRole = await Http.get("/staff-type-check");

      setRole(resRole.data);
      setReceiveData(res.data.list || []);
      setCumulativeData(res.data || {});
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // URL CHANGE / INITIAL LOAD
  // =========================================================
  useEffect(() => {
    const params = {};
    const paramsIndexWise = [];

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
      paramsIndexWise.push(key);
    }

    setQueryParams(params);
    setParamsIndexWise(paramsIndexWise);

    // Update input dates from URL
    setInputs((previous) => ({
      ...previous,
      from: fromDate || previous.from || today,
      to: toDate || previous.to || today,
    }));

    DatatableFunc();

    fetchData();

    // IMPORTANT:
    // This will run whenever query parameters change.
  }, [location.search]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs((values) => ({
      ...values,
      [name]: value,
    }));
  };

  // =========================================================
  // ALERT
  // =========================================================
  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });

    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // =========================================================
  // LOCATION STATE ALERT
  // =========================================================
  useEffect(() => {
    if (!location.state) {
      return;
    }

    showAlert(location.state.message, location.state.type);
  }, [location]);

  // =========================================================
  // DELETE DATA
  // =========================================================
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

          Swal.fire(
            "Deleted!",
            showMsg + " has been deleted.",
            "success"
          );
        });
      }
    });
  };

  // =========================================================
  // FORMAT DATE/TIME
  // =========================================================
  const formatTo12HourWithDate = (dateTimeString) => {
    if (!dateTimeString) return "";

    const [datePart, timePart] = dateTimeString.split(" ");

    if (!timePart) return datePart;

    const [hours, minutes] = timePart.split(":");

    const hours12 = (+hours % 12 || 12)
      .toString()
      .padStart(2, "0");

    const period = +hours < 12 ? "AM" : "PM";

    return `${datePart} ${hours12}:${minutes} ${period}`;
  };

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
  const cols = [
    {
      field: "name",
      header: "Workplace",
    },
    {
      field: "user",
      header: "Name",
    },
    {
      field: "todayPriorityCustomer",
      header: "Retailers",
    },
    {
      field: "todayPriorityCheckin",
      header: "Checkin",
    },
    {
      field: "todayPriorityOrder",
      header: "Memo",
    },
    {
      field: "todayPriorityNotOrdered",
      header: "Not Ordered",
    },
    {
      field: "todayPriorityImsAgainstOrder",
      header: "IMS",
    },
  ];

  // =========================================================
  // SEARCH / FORM SUBMIT
  // =========================================================
  const formSubmit = async () => {
    setLoading(true);

    try {
      const currentSearchParams = new URLSearchParams(
        location.search
      );

      const urlId = currentSearchParams.get("id");
      const urlType = currentSearchParams.get("type") || "moo";

      const apiParams = new URLSearchParams();

      apiParams.append("type", urlType);

      if (urlId) {
        apiParams.append("id", urlId);
      }

      apiParams.append("from_date", inputs.from);
      apiParams.append("to_date", inputs.to);

      const url = `/app/new-report/dashboard/priority-customer?${apiParams.toString()}`;

      console.log("Search API URL:", url);

      const res = await Http.get(url);

      setReceiveData(res.data.list || []);
      setCumulativeData(res.data || {});
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ACTION TEMPLATE
  // =========================================================
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
          await Http.post(
            `/approve-mdo-attendnace/${rowData.attendance_id}`
          );

          Swal.fire(
            "Approved!",
            "The entry has been approved.",
            "success"
          );

          setReceiveData((prevData) =>
            prevData.map((item) =>
              item.attendance_id === rowData.attendance_id
                ? {
                    ...item,
                    is_late: 0,
                  }
                : item
            )
          );
        }
      } catch (error) {
        console.error("Approval error:", error);

        Swal.fire(
          "Error",
          "Something went wrong while approving.",
          "error"
        );
      }
    };

    return (
      rowData.id && (
        <div className="text-xs text-nowrap">
          {rowData.type === "so" ? (
            <Link
                to={{
                pathname: "/priority-retailers/"+rowData.id,
                search: createSearchParams({
                    id: String(rowData.id),
                    type: "so",
                    from_date: inputs.from,
                    to_date: inputs.to,
                }).toString(),
                }}
                className="btn btn-warning btn-sm mx-1"
                title={"Go To " + rowData.name + " SO Lists"}
            >
                <i className="fa fa-list" aria-hidden="true"></i>
            </Link>
            ) : (
            <Link
                to={{
                pathname: "/priority-retailers",
                search: createSearchParams({
                    id: String(rowData.id),
                    type: String(rowData.type || "rsm"),
                    from_date: inputs.from,
                    to_date: inputs.to,
                }).toString(),
                }}
                className="btn btn-info btn-sm mx-1"
                title={"Go To " + rowData.name + " Lists"}
            >
                <i className="fa fa-list" aria-hidden="true"></i>
            </Link>
            )}
        </div>
      )
    );
  };

  // =========================================================
  // RETURN
  // =========================================================
  return (
    <div>
      <IsLogin />

      <div>
        <div className="am-mainpanel">

          {/* PAGE TITLE */}
          <div className="am-pagetitle">
            <h5 className="am-title">
              Coordinator Attendance Report
            </h5>
          </div>

          {/* =====================================================
              FILTER SECTION
          ====================================================== */}
          <div className="am-pagebody p-2">
            <Alert alert={alert} />

            <div className="card pd-sm-40 mt-2">

              <div className="row">

                {/* FROM DATE */}
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* TO DATE */}
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* SEARCH */}
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i>
                    Search
                  </button>
                </div>

              </div>

              {/* =================================================
                  SUMMARY
              ================================================== */}
              {loading ? (
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
              ) : (
                <table className="table mb-0">

                  <tbody>

                    <tr>
                      <th>
                        Total Customers :{" "}
                        {cumulative.totalPriorityCustomerSummary || 0}
                      </th>

                      <th>
                        Total Store Checkin :{" "}
                        {cumulative.totalPriorityCheckinSummary || 0}
                      </th>

                      <th>
                        Total Memo :{" "}
                        {cumulative.totalPriorityOrderSummary || 0}
                      </th>

                      <th>
                        Ims :{" "}
                        {cumulative.totalImsAgainstOrderSummary || 0}
                      </th>

                      <th>
                        Not Order Retailers :{" "}
                        {cumulative.totalPriorityNotOrderedSummary || 0}
                      </th>
                    </tr>

                    <tr>
                      <th
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          color: "red",
                        }}
                      >
                        {cumulative.date || ""}
                      </th>
                    </tr>

                  </tbody>

                </table>
              )}

            </div>
          </div>

          {/* =====================================================
              DATA TABLE
          ====================================================== */}
          <div className="am-pagebody p-2">

            <Alert alert={alert} />

            <div className="card pd-sm-40">

              <div className="row">

                <ReactDataTable
                  cols={cols}
                  isLoading={loading}
                  receiveData={receiveData}
                  actionTemplate={actionTemplate}
                  deleteData={deleteData}
                  frozenColumnFields={[
                    "name",
                    "official_designation",
                    "workplace",
                  ]}
                />

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default List;