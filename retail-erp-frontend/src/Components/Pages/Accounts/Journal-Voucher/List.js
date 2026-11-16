import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const [inputs, setInputs] = useState({
    month: month,
    year: year,
    status: "active",
  });

  const fetchData = () => {
    Http.get("/journal-voucher").then((res) => {
      setReceiveData(res.data);
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
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
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
  let debit = 0;
  let credit = 0;
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Journal Voucher</h5>
            <Link to="/create-journal-voucher" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg"></div>
              </div>
            </div>
          </div>
          {/* <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <select className="form-control" name="year" onChange={handleChange}>
                    <option value="">Select Year</option>
                    <option value="2022" selected={inputs.year === 2022 ? true : false}>2022</option>
                    <option value="2023" selected={inputs.year === 2023 ? true : false}>2023</option>
                    <option value="2024" selected={inputs.year === 2024 ? true : false}>2024</option>
                    <option value="2025" selected={inputs.year === 2025 ? true : false}>2025</option>
                    <option value="2026" selected={inputs.year === 2026 ? true : false}>2026</option>
                    <option value="2027" selected={inputs.year === 2027 ? true : false}>2027</option>
                    <option value="2028" selected={inputs.year === 2028 ? true : false}>2028</option>
                    <option value="2029" selected={inputs.year === 2029 ? true : false}>2029</option>
                    <option value="2030" selected={inputs.year === 2030 ? true : false}>2030</option>
                  </select>
                </div>
                <div className="col-lg">
                  <button className="btn btn-primary btn-block mg-b-10" onClick={formSubmit}>
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Action
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Created By
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          JV No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Type
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Chart Of Accounts
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Sub Category
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Bill No
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Bill Date
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Debit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiveData
                        .map(({ items }) => Object.entries(items))
                        .flat()
                        .map(([key, value], index) => (
                          <tr key={index}>
                            <td></td>
                            <td className="text-xs">
                              <Link
                                to={{
                                  pathname:
                                    "/edit-journal-voucher/" +
                                    value.journal_voucher.id,
                                }}
                                className="btn btn-primary btn-sm"
                                style={{ display: key == 0 ? "" : "none" }}
                              >
                                <i
                                  className="fa fa-pencil"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                              <button
                                className="btn btn-danger btn-sm ms-1"
                                style={{ display: key == 0 ? "" : "none" }}
                                onClick={() =>
                                  deleteData(
                                    value.journal_voucher.id,
                                    "journal-voucher",
                                    "Journal Voucher"
                                  )
                                }
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </td>
                            <td className="text-xs">
                              {key == 0 ? value.created_by.name : ""}
                            </td>
                            <td className="text-xs">
                              {key == 0 ? value.journal_voucher.date : ""}
                            </td>
                            <td className="text-xs">
                              {key == 0
                                ? value.journal_voucher.serial_number
                                : ""}
                            </td>
                            <td className="text-xs">
                              {key == 0 ? value.journal_voucher.type : ""}
                            </td>
                            <td className="text-xs">
                              {value.chart_of_account.code +
                                " - " +
                                value.chart_of_account.name}
                            </td>
                            <td className="text-xs">
                              {value.sub_category != null
                                ? value.sub_category.name == "new"
                                  ? value.sub_category.new_name
                                  : value.sub_category.name == "hr"
                                  ? value.hr.card_no + " - " + value.hr.name
                                  : value.sub_category.name == "assets"
                                  ? value.asset.code + " - " + value.asset.name
                                  : value.sub_category.name == "supplier"
                                  ? value.supplier.code +
                                    " - " +
                                    value.supplier.name
                                  : value.sub_category.name == "distributor"
                                  ? value.distributor.code +
                                    " - " +
                                    value.distributor.name
                                  : value.sub_category.name != "hr" &&
                                    value.sub_category.name != "new"
                                  ? value.sub_category.name
                                  : null
                                : null}
                            </td>
                            <td className="text-xs">{value.bill_number}</td>
                            <td className="text-xs">{value.bill_date}</td>
                            <td className="text-xs text-right">
                              {value.debit}
                            </td>
                            <td className="text-xs text-right">
                              {value.credit}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    {/* <tfoot>
                      <tr>
                        <td colSpan="10" style={{ textAlign:"right" }}>Total</td>
                        <td>{debit}</td>
                        <td>{credit}</td>
                      </tr>
                    </tfoot> */}
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
