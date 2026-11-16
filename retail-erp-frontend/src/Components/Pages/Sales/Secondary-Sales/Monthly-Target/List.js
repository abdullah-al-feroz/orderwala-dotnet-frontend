import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import ReactDataTable from "../../../../Common/ReactDataTable";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const res = await Http.get("/target");
      setReceiveData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    {
      field: (item) => (
        <Link to="/monthly-target-view">
          {item.target ? item.target.target_month : ""}
        </Link>
      ),
      header: "Month",
    },
    {
      field: (item) => (item.target ? item.target.target_start_date : ""),
      header: "Start Date",
    },
    {
      field: (item) => (item.target ? item.target.target_end_date : ""),
      header: "End Date",
    },
    {
      field: (item) => (item.target ? item.target.no_of_working_days : ""),
      header: "No Of Working Days",
    },
    {
      field: (item) => parseFloat(item.qty).toFixed(2),
      header: "Target",
    },
    {
      field: (item) =>
        item.orderIms ? parseFloat(item.orderIms.qty).toFixed(2) : 0,
      header: "Total IMS",
    },
    {
      field: (item) =>
        (parseFloat(item.qty) - parseFloat(item.orderIms.qty)).toFixed(2),
      header: "Difference",
    },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Monthly Target</h5>
          </div>

          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <Alert alert={alert} />
              <div className="row">
                <div className="col-2">
                  <Link
                    to="/create-target"
                    className="btn btn-primary btn-block"
                  >
                    <i className="fa fa-plus-square"></i> Add Target
                  </Link>
                </div>
                <div className="col-2">
                  <Link to="/edit-target" className="btn btn-info btn-block">
                    <i className="fa fa-plus-square"></i> Edit Target
                  </Link>
                </div>
                <div className="col-2">
                  <Link
                    to="/monthly-target-view"
                    className="btn btn-secondary btn-block"
                  >
                    <i className="fa fa-plus-square"></i> View Target
                  </Link>
                </div>
                <div className="col-2">
                  <Link
                    to="/opening-stock-view"
                    className="btn btn-success btn-block"
                  >
                    <i className="fa fa-plus-square"></i> View OS
                  </Link>
                </div>
                <div className="col-2">
                  <Link
                    to="/create-opening-stock"
                    className="btn btn-warning btn-block"
                  >
                    <i className="fa fa-plus-square"></i> Add OS
                  </Link>
                </div>
                <div className="col-2">
                  <Link
                    to="/edit-opening-stock"
                    className="btn btn-danger btn-block"
                  >
                    <i className="fa fa-plus-square"></i> Edit OS
                  </Link>
                </div>
              </div>
              <div className="table-responsive p-0 pb-2 mt-3">
                <ReactDataTable
                  cols={cols}
                  receiveData={receiveData}
                  isLoading={loading}
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
