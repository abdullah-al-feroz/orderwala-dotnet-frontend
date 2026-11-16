import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../Common/Alert";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import moment from "moment";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/notifications").then((res) => {
      setReceiveData(res.data);
      document.getElementById("app-title").innerText = `(0) Limtech ERP`;
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const markAsRead = (id) => {
    Http.get("/notifications/" + id + "/mark-as-read")
      .then((res) => {
        Swal.fire("Mark As Read!", "Mark As Read", "success");
        Http.get("/notifications").then((res) => {
          setReceiveData(res.data);
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Notifications</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-20 pd-sm-40">
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          From User
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Type
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Message
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created At
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">
                            {item.from ? item.from.name : ""}
                          </td>
                          <td className="text-xs">
                            {/* <Link
                              to={{
                                pathname: item.type,
                              }}
                            >
                              {item.flag}
                            </Link> */}
                            <Link
                              to={{
                                pathname: item.type + "/" + item.flagable_id,
                              }}
                              className="ms-1"
                            >
                              {item.flag}
                            </Link>
                          </td>
                          <td className="text-xs">{item.message}</td>
                          <td className="text-xs">
                            {moment(item.created_at).fromNow()}
                          </td>
                          <td>
                            {item.read < 1 && (
                              <>
                                <button
                                  className="btn btn-info btn-sm ms-1"
                                  title="Mark As Read"
                                  onClick={() => markAsRead(item.id)}
                                >
                                  <i className="fa fa-thumbs-up"></i>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
