// import { ReactTree, useReactTreeApi } from "@naisutech/react-tree";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const List = () => {
  const location = useLocation();
  const [parents, setParents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({});
  // const treeApi = useReactTreeApi();

  const data = [
    {
      id: "2",
      parentId: null,
      label: "Root 2",
    },
    {
      id: "743",
      parentId: "2",
      label: "Child 2",
    },
    {
      id: "045",
      parentId: "743",
      label: "Child 2 Child 1",
      items: [
        {
          id: "096",
          parentId: "045",
          label: "File 3",
        },
        {
          id: "916",
          parentId: "045",
          label: "File 4",
        },
        {
          id: "238",
          parentId: "045",
          label: "File 5",
        },
      ],
    },
  ];

  const fetchData = () => {
    Http.get("/chart-of-account-code").then((res) => {
      setParents(res.data.parents);
      setReceiveData(res.data.chart_of_accounts);
      setSelected(res.data.selected_parent);
    });
    Http.get("/tree-chart-of-account-code").then((res) => {
      console.log(res.data);
    });
  };

  useEffect(() => {
    DatatableFunc();
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
        Http.delete("/" + deleteApiUrl + "/" + id + "/arrear").then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    Http.get(
      "/transaction?type=arrear&month=" + inputs.month + "&year=" + inputs.year
    ).then((res) => {
      setReceiveData(res.data);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Chart Of Accounts Lists</h5>
            <Link to="/create-chart-of-account" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>Create
            </Link>
          </div>

          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  {/* <ReactTree nodes={data} /> */}
                  {/* <button
                    onClick={() => {
                      treeApi.current.toggleAllNodesOpenState("open");
                    }}
                  >
                    Expand all
                  </button> */}
                  {/* <ReactTree nodes={data} ref={treeApi} /> */}
                  {/* <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Code
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Type
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Amount
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Description
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
                          <td className="text-xs">{item.name}</td>
                          <td className="text-xs">{item.code}</td>
                          <td className="text-xs">{item.name}</td>
                          <td className="text-xs">{item.opening_amount}</td>
                          <td className="text-xs">{item.description}</td>
                          <td className="text-xs">
                            <Link
                              to={{
                                pathname: "/edit-chart-of-account/" + item.id,
                              }}
                              className="btn btn-primary btn-sm"
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}
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
