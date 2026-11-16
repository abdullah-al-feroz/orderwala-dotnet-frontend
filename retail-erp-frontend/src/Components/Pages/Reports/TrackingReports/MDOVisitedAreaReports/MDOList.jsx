import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

//New Data table Code Start
import ReactDataTable from "../../../../Common/ReactDataTable";
//New Data table Code End

const List = (props) => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  //   const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});
  const { id } = useParams();

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = () => {
    Http.get("/app/report/total-visited-area?area_id=" + id).then((res) => {
      console.log(res.data.list);
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
    });

    Http.get("/select2/Hr.HrStaffBasicInfo/id,name/status:active").then(
      (res) => {
        setStaff(res.data);
      }
    );
    // Http.get("/staff-type-check").then((res) => {
    //   setRole(res.data);
    // });
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
    { field: "name", header: "Base" },
    { field: "total_shop", header: "Total Shop" },
    { field: "visted_shop", header: "Visited Shop" },
    { field: "total_order", header: "Total Order" },
    { field: "total_delivery", header: "Total Delivery" },
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
      "/app/report/total-visited-area?user_id=" +
        id +
        "&from_date=" +
        inputs.from +
        "&to_date" +
        inputs.to
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
            <h5 className="am-title">Base Wise MDO Visited Area Report</h5>
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
            </div>
          </div>

          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-md-3">
                  <table className="table">
                    <tr>
                      <th width="40%">Total Visted</th>
                      <th width="5%">:</th>
                      <td>{cumulative.visted_shop_summary}</td>
                    </tr>
                    <tr>
                      <th width="40%">Total Order</th>
                      <th width="5%">:</th>
                      <td>{cumulative.total_order_summary}</td>
                    </tr>
                    <tr>
                      <th width="40%">Total Delivery</th>
                      <th width="5%">:</th>
                      <td>{cumulative.total_delivery_summary}</td>
                    </tr>
                  </table>
                </div>
                <div className="col-md-9"></div>
              </div>
            </div>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">
              <ReactDataTable
                cols={cols}
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
    <div className="text-xs text-nowrap">
      <Link
        to={{
          pathname:
            "/tracking-reports/attendance-report-details/mdo/0/" + rowData.id,
        }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
    </div>
  );
};

export default List;
