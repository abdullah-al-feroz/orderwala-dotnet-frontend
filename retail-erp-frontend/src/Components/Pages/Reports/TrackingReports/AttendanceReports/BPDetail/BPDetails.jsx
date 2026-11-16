import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../../../Common/Alert";
import DatatableFunc from "../../../../../Common/DatatableFunc";
import Http from "../../../../../Common/Http";
import IsLogin from "../../../../../Common/IsLogin";
// import { LoaderComponent } from "../../../../Common/LoaderComponent";

//New Data table Code Start
import { Oval } from "react-loader-spinner";
import ReactDataTable from "../../../../../Common/ReactDataTable";
//New Data table Code End

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState({});
  const [queryParams, setQueryParams] = useState({});
  const [paramsIndexWise, setParamsIndexWise] = useState({});
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = async () => {
    // Http.get("/app/report/attendance").then((res) => {
    //   console.log(res);
    //   setReceiveData(res.data.list);
    //   setCumulativeData(res.data);
    // });

    setLoading(true);
    try {
      // const res = await Http.get("/app/report/attendance-moo-report");

      const searchParams = new URLSearchParams(location.search);
      const params = {};
      const paramsIndexWise = [];
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
        paramsIndexWise.push(key);
      }

      const queryString = new URLSearchParams(params).toString();
      // const res = await Http.get(
      //   "/app/moo/attendance-report?type=cdm&hmo_id=" + id
      // );
      // const url = `/app/moo/bp-detail/${id}`;
      const res = await Http.get(`/app/moo/bp-detail/${id}`);

      const resRole = await Http.get("/staff-type-check");
      setRole(resRole.data);
      setReceiveData(res.data);
      setCumulativeData(res.data);
      // const res2 = await Http.get(
      //   "/app/moo/attendance-report?type=cdm&orderwala_verified=1"
      // );
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }

    /*try {
      setLoading(true);
      const res = await Http.get(
        "/select2/Hr.HrStaffBasicInfo/id,name/status:active"
      );
      setStaff(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }*/
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    const paramsIndexWise = [];
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
      paramsIndexWise.push(key);
    }
    setQueryParams(params);
    setParamsIndexWise(paramsIndexWise);

    DatatableFunc();
    fetchData();
  }, []);

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
    { field: "customer.shop_name", header: "Shop" },
    { field: "customer.available_for_mdo", header: "Shop Type" },
    { field: "checkin_at", header: "Checkin" },
    { field: "checkout_at", header: "Check out" },
    { field: "survey.Surveyed", header: "Survey" },
    { field: "survey.is_educated", header: "Educated" },
    { field: "customer.is_fake", header: "Is Fake" },
    { field: "customer.faked_date", header: "Faked Date" },
    
  ];

  // if (paramsIndexWise.length > 0) {
  //   if (paramsIndexWise[0] == "orderwala_sales_qty") {
  //     let cols = [
  //       { field: "name", header: "Name" },
  //       { field: "total_shop", header: "Total Shop" },
  //       { field: "sales_memo", header: "Total Memo" },
  //       { field: "sales_amount", header: "Total Amount" },
  //     ];
  //   } else if (paramsIndexWise[0] == "orderwala_verified") {
  //     let cols = [
  //       { field: "name", header: "Name" },
  //       { field: "verified_shops", header: "No. Of Verified Shops" },
  //     ];
  //   }
  // }

  const formSubmit = async () => {
    setLoading(true);
    try {
      // const res = await Http.get("/app/report/attendance-moo-report");
      const res = await Http.get(
        "/app/moo/attendance-report?type=cdm&hmo_id=" +
          id +
          "&from_date=" +
          inputs.from +
          "&to_date=" +
          inputs.to
      );
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
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
      rowData.id && (
        <div className="text-xs text-nowrap">
          <Link
            to={{
              pathname:
                "/tracking-reports/attendance-reports/rsm/" + rowData.id,
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
            <h5 className="am-title">BP Detail Report</h5>
          </div>
          {/* <div className="am-pagebody p-2">
            <Alert alert={alert} />
            <div className="card pd-sm-40 mt-2">
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
                <div className="col-lg">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="chart_of_account_id"
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
                      <th>Total CDM : {cumulative.total_staff}</th>
                      <th>
                        Total CDM Attendant : {cumulative.attendance_given}
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
                        {cumulative.total_order_amount_team_orderwala} || Total:{" "}
                        {cumulative.total_order_amount})
                      </th>
                    </tr>
                  </table>
                </>
              )}
            </div>
          </div> */}

          <div className="am-pagebody p-2">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <ReactDataTable
                  cols={cols}
                  isLoading={loading}
                  receiveData={receiveData}
                  // actionTemplate={actionTemplate}
                  deleteData={deleteData}
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
