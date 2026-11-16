import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
// import { LoaderComponent } from "../../../../Common/LoaderComponent";

//New Data table Code Start
import { Oval } from "react-loader-spinner";
import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const List = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [staff, setStaff] = useState({});
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const params = {};
      const paramsIndexWise = [];

      for (const [key, value] of searchParams.entries()) {
        if (value > 0) {
          // Ensure value is greater than 0
          params[key] = value;
          paramsIndexWise.push(key);
        }
      }

      const queryString = new URLSearchParams(params).toString();

      const resRole = await Http.get("/staff-type-check");
      setRole(resRole.data);

      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const url = `/app/moo/attendance-report?type=mdo${
        queryString ? `&${queryString}` : ""
      }`;

      const res = await Http.get(url);
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
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

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => {
        setArea(res.data);
      });
    }
    if (name == "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
      ).then((res) => {
        setBase(res.data);
      });
    }
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

  // const cols = [
  //   {
  //     field: (rowData) => {
  //       return <p className="bg-success">{rowData.name}</p>;
  //     },
  //     header: "Name",
  //   },
  //   {
  //     field: (rowData) => {
  //       return <p className="bg-success">{rowData.designation}</p>;
  //     },
  //     header: "Staff type",
  //   },
  //   {
  //     field: (rowData) => {
  //       return <p className="bg-success">{rowData.attendance_time}</p>;
  //     },
  //     header: "Attendance At",
  //   },
  //   {
  //     field: (rowData) => {
  //       return <p className="bg-success">{rowData.visited_store}</p>;
  //     },
  //     header: "Visited store",
  //   },
  //   {
  //     field: (rowData) => {
  //       return <p className="bg-success">{rowData.order_qty}</p>;
  //     },
  //     header: "Order qty",
  //   },
  //   {
  //     field: (rowData) => {
  //       return <p className="bg-success">{rowData.order_amount}</p>;
  //     },
  //     header: "Order amount",
  //   },
  // ];
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
    {
      field: "name",
      header: "Name",
    },
    { field: "official_designation", header: "Designation" },
    // { field: "workplace", header: "Workplace" },
    // { field: "designation", header: "Staff type" }, --- IGNORE ---
    { field: "zone", header: "Zone" },
    { field: "region", header: "Region" },
    { field: "area", header: "Area" },
    { field: "base", header: "Base" },
    // { field: "attendance_time", header: "Attendance At" },
    // {
    //   field: (rowData) => {
    //     return (
    //       <span className={rowData?.is_late === 1 ? "text-danger" : ""}>
    //         {rowData?.is_late === 1 ? "Yes" : ""}
    //       </span>
    //     );
    //   },
    //   header: "Late",
    // },

    // { field: "attendance_time", header: "Attendance At" },
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
    { field: "closed_store", header: "Closed store" },

    // { field:(rowData) => { return <div>{rowData.visited_store} ( OW: {rowData.visited_store_orderwala}, TOW: {rowData.visited_store_team_orderwala} ) </div>}, header: "Visited stores" },

    { field: "order_qty_team_orderwala", header: "Order Qty Team Orderwala" },
    { field: "order_qty_orderwala", header: "Order Qty Orderwala" },
    { field: "order_qty", header: "Order qty" },
    { field: "delivery_qty", header: "Delivery qty" },

    {
      field: "order_amount_team_orderwala",
      header: "Order Amount Team Orderwala",
    },
    { field: "order_amount_orderwala", header: "Order Amount Orderwala" },
    { field: "undeliveredOrderAmount", header: "Undelivered Order amount" },
    { field: "deliveredOrderAmount", header: "Delivered Order amount" },
    // { field: "primary_price", header: "Primary_price" },
    { field: "order_amount", header: "Order amount" },
  ];

  const formSubmit = async () => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    const paramsIndexWise = [];

    for (const [key, value] of searchParams.entries()) {
      if (value > 0) {
        // Ensure value is greater than 0
        params[key] = value;
        paramsIndexWise.push(key);
      }
    }
    const queryString = new URLSearchParams(params).toString();

    setLoading(true);
    try {
      // const res = await Http.get("/app/report/attendance-moo-report");

      const submissionInputs = {
        ...inputs,
      };

      // Build the query string dynamically
      const queryParams = new URLSearchParams({
        type: "mdo",
        from_date: submissionInputs.from,
        to_date: submissionInputs.to,
      });

      // Conditionally add region, area, and base if they are integers
      if (Number.isInteger(submissionInputs.work_place_zone_id)) {
        queryParams.append("zone", submissionInputs.work_place_zone_id);
      }
      if (Number.isInteger(submissionInputs.work_place_region_id)) {
        queryParams.append("region", submissionInputs.work_place_region_id);
      }
      if (Number.isInteger(submissionInputs.work_place_area_id)) {
        queryParams.append("area", submissionInputs.work_place_area_id);
      }
      if (Number.isInteger(submissionInputs.work_place_base_id)) {
        queryParams.append("base", submissionInputs.work_place_base_id);
      }

      if (queryString) {
        queryString.split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          queryParams.append(key, value);
        });
      }
      // const res = await Http.get(
      //   "/app/moo/attendance-report?type=mdo&from_date=" +
      //     inputs.from +
      //     "&to_date=" +
      //     inputs.to
      // );
      const res = await Http.get(
        `/app/moo/attendance-report?${queryParams.toString()}`
      );
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const actionTemplate = (rowData, statusChange) => {
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
                : item
            )
          );
        }
      } catch (error) {
        console.error("Approval error:", error);
        Swal.fire("Error", "Something went wrong while approving.", "error");
      }
    };

    return (
      <div className="text-xs text-nowrap">
        <span
          // onClick={() =>
          //   navigate(
          //     `/tracking-reports/attendance-report-details/mdo/${rowData.id}/0?from_date=${inputs.from}&to_date=${inputs.to}`
          //   )
          // }
          onClick={() =>
            window.open(
              `/tracking-reports/attendance-report-details/mdo/${rowData.id}/0?from_date=${inputs.from}&to_date=${inputs.to}`,
              "_blank"
            )
          }
          className="btn btn-info btn-sm mx-1"
          title="View"
          style={{ cursor: "pointer" }}
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </span>
        {rowData.is_late === 1 && role === "hmo" && (
          <button
            className="btn btn-success btn-sm mx-1"
            onClick={handleApprove}
          >
            Approve
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
            <h5 className="am-title">
              Market Development Officer Attendance Report
            </h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Zone</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={zone[0]}
                    name="work_place_zone_id"
                    options={zone}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Region</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={region[0]}
                    name="work_place_region_id"
                    options={region}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Area</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={area[0]}
                    name="work_place_area_id"
                    options={area}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Base</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={base[0]}
                    name="work_place_base_id"
                    options={base}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">To Date</label>
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
                <div className="col-lg mt-4">
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
                  <table className="table mb-0 mt-3">
                    <tr>
                      <th>Total MDO : {cumulative.total_staff}</th>
                      <th>
                        Total MDO Attendant : {cumulative.attendance_given}
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
                        Total: {cumulative.total_visited_store})<br />{" "}
                        <b style={{ paddingLeft: 0 }}>Closed Stores :</b>{" "}
                        {cumulative.total_closed_store}
                      </th>
                      <th>
                        Order Qty : (OW: {cumulative.total_order_qty_orderwala}{" "}
                        || TOW: {cumulative.total_order_qty_team_orderwala} ||
                        Total: {cumulative.total_order_qty})
                        <br />
                        {""}
                        <b style={{ paddingLeft: 0 }}>Total Delivery Qty : </b>
                        {cumulative.total_delivery_qty}
                      </th>
                      <th>
                        Order Amount : (OW:{" "}
                        {cumulative.total_order_amount_orderwala} || TOW:{" "}
                        {cumulative.total_order_amount_team_orderwala} || TUA:{" "}
                        {cumulative.total_undelivered_order_amount}
                        || TDA: {cumulative.total_delivered_order_amount}
                        || Total: {cumulative.total_order_amount})
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
                frozenColumnFields={["name"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const actionTemplate = (rowData, statusChange) => {
//   return (
//     <div className="text-xs text-nowrap">
//       <Link
//         to={{
//           pathname:
//             "/tracking-reports/attendance-report-details/mdo/" +
//             rowData.id +
//             "/0",
//         }}
//         className="btn btn-info btn-sm mx-1"
//         target="_blank"
//         title="View"
//       >
//         <i className="fa fa-list" aria-hidden="true"></i>
//       </Link>
//       <button>
//         Approve
//       </button>
//     </div>
//   );
// };

export default List;
