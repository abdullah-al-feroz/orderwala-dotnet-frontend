import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

//New Data table Code Start
import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState({});

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
      const res = await Http.get("/app/moo/attendance-report");
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
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

  const cols = [
    { field: "name", header: "Name" },
    { field: "designation", header: "Staff type" },
    { field: "attendance_time", header: "Attendance" },
    { field: "visited_store", header: "Visited store" },
    { field: "order_qty", header: "Order qty" },
    { field: "order_amount", header: "Order amount" },
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

  const formSubmit = () => {
    Http.get(
      "/app/report/attendance?from_date=" + inputs.from + "&to_date" + inputs.to
    ).then((res) => {
      setReceiveData(res.data.list);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">CDM Attendance Report</h5>
          </div>
          <div className="am-pagebody p-2">
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
              <table className="table border table-bordered">
                <tr>
                  <th>Total Staff : {cumulative.total_staff}</th>
                  <th>Total Attendance : {cumulative.attendance_given}</th>
                </tr>
              </table>
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
                  actionTemplate={actionTemplate}
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

const actionTemplate = (rowData, deleteData, statusChange) => {
  return (
    rowData.id && (
      <div className="text-xs text-nowrap">
        <Link
          to={{
            pathname: "/tracking-reports/attendance-reports/rsm/" + rowData.id,
          }}
          className="btn btn-info btn-sm mx-1"
          title="View"
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </Link>
      </div>
    )
  );
};

export default List;
