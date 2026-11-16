import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
// import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Select from "react-select";

//New Data table Code Start
import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  //   const [inputs, setInputs] = useState({});
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
      const searchParams = new URLSearchParams(location.search);
      const params = {};
      const paramsIndexWise = [];
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
        paramsIndexWise.push(key);
      }

      const queryString = new URLSearchParams(params).toString();

      // const res = await Http.get("/app/report/attendance-moo-report");
      // const res = await Http.get("/app/report/sales");

      const res = await Http.get("/app/report/sales?" + queryString);
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }

    Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
      (res) => {
        setStaff(res.data);
      }
    );
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
    { field: "name", header: "Region" },
    { field: "total_shop", header: "Total Shop" },
    { field: "total_memo", header: "Total Memo" },
    { field: "total_amount", header: "Total amount" },
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
      "/app/report/sales?from_date=" + inputs.from + "&to_date" + inputs.to
    ).then((res) => {
      setReceiveData(res.data.list);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Region Wise MDO Sales Reports</h5>
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
              <table className="table mb-0">
                <tr>
                  <th width="33%" className="text-center">
                    Total Shop : {cumulative.total_shop_summary}
                  </th>
                  <th width="33%" className="text-center">
                    Total Memo : {cumulative.total_memo_summary}
                  </th>
                  <th width="33%" className="text-center">
                    Total Amount : {cumulative.total_amount_summary}
                  </th>
                </tr>
              </table>
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
              />
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
            pathname: "/tracking-reports/mdo-sales-reports/am/" + rowData.id,
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
