import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const BPList = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState({});
  const [queryParams, setQueryParams] = useState({});
  const [paramsIndexWise, setParamsIndexWise] = useState({});

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = async () => {

    setLoading(true);
    try {

      const res = await Http.get(
        "/app/moo/attendance-report-for-bp"
      );

      const resRole = await Http.get("/staff-type-check");
      setRole(resRole.data);

      // Format attendance_at and checkout_at to 12-hour format
      const formattedList = res.data.list.map(item => ({
          ...item,
          attendance_at: formatDate(item.attendance_at),
          checkout_at: item.checkout_at ? formatDate(item.checkout_at) : null,
      }));

      setReceiveData(formattedList);
      setCumulativeData(res.data);
      // const res2 = await Http.get(
      //   "/app/moo/attendance-report?type=cdm&orderwala_verified=1"
      // );
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date to 12-hour format
  const formatDate = (dateString) => {
      const options = { hour: 'numeric', minute: 'numeric', hour12: true, year: 'numeric', month: 'numeric', day: 'numeric' };
      return new Date(dateString).toLocaleString('en-US', options);
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

  let cols = [
    {
      field: 'name',
      header: "Name",
    },
    {
      field: 'attendance_at',
      header: "Attendance At",
    },
    {
      field: 'checkout_at',
      header: "Checkout At",
    },
    {
      field: 'survey',
      header: "Survey",
    },
    {
      field:'towTotalVisitedStore',
      header: "Total Visited Store",
    },
     {
      field: 'owEducated',
      header: "OW Educated",
    },
      {
      field: 'min4CatOrder',
      header: "Minimun 4 Category Products Order Ensure",
    },
  ];


  const formSubmit = async () => {
    setLoading(true);
    try {
      // const res = await Http.get("/app/report/attendance-moo-report");
      const res = await Http.get(
        "/app/moo/attendance-report-for-bp?from_date=" +
        inputs.from +
        "&to_date=" +
        inputs.to
      );

      // Format attendance_at and checkout_at to 12-hour format
      const formattedList = res.data.list.map(item => ({
          ...item,
          attendance_at: formatDate(item.attendance_at),
          checkout_at: item.checkout_at ? formatDate(item.checkout_at) : null,
      }));

      setReceiveData(formattedList);
      setCumulativeData(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const actionTemplate = (rowData, deleteData, statusChange) => {
    // const handleApprove = async () => {
    //   try {
    //     const result = await Swal.fire({
    //       title: "Are you sure?",
    //       text: "You are about to approve this entry!",
    //       icon: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#3085d6",
    //       cancelButtonColor: "#d33",
    //       confirmButtonText: "Yes, approve it!",
    //     });

    //     if (result.isConfirmed) {
    //       // Call the API to approve the attendance
    //       await Http.post(`/approve-mdo-attendnace/${rowData.attendance_id}`);

    //       Swal.fire("Approved!", "The entry has been approved.", "success");

    //       // Update the receiveData state to remove the "Approve" button
    //       setReceiveData((prevData) =>
    //         prevData.map((item) =>
    //           item.attendance_id === rowData.attendance_id
    //             ? { ...item, is_late: 0 } // Mark as not late
    //             : item
    //         )
    //       );
    //     }
    //   } catch (error) {
    //     console.error("Approval error:", error);
    //     Swal.fire("Error", "Something went wrong while approving.", "error");
    //   }
    // };

    return (
      // rowData.id && (
        <div className="text-xs text-nowrap">
          <Link
            to={{
              pathname:
                "/bp-detail-report/" + rowData.user_id,
            }}
            className="btn btn-info btn-sm mx-1"
            title="View"
          >
            <i className="fa fa-list" aria-hidden="true"></i>
          </Link>
          {/* {rowData.is_late === 1 && role === "hmo" && (
            <button
              className="btn btn-success btn-sm mx-1"
              onClick={handleApprove}
            >
              Approve
            </button>
          )} */}
        </div>
      // )
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">BP Attendance Report</h5>
          </div>
          <div className="am-pagebody p-2">
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
                      <th>Total BP : {cumulative.totalBp ?? 0}</th>
                      <th>
                        Total BP Attendant : {cumulative.totalAttendance ?? 0}
                      </th>
                      <th>
                        Total Survey : {cumulative.total_survey ?? 0}
                      </th>
                    </tr>
                     <tr>
                      <th>Total Visited Store : {cumulative.TotalVisitedStore ?? 0}</th>
                      <th>Total Total Ow Educated: {cumulative.totalOwEducated ?? 0}</th>
                      <th>
                        Minimun 4 Category Products Order Ensure : {cumulative.totalMin4CatOrder ?? 0}
                      </th>
                    </tr>
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="am-pagebody p-2">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <ReactDataTable
                  cols={cols}
                  isLoading={loading}
                  receiveData={receiveData}
                  deleteData={deleteData}
                  actionTemplate={actionTemplate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPList;
