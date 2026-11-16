import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import FormValidation from "../../../Common/FormValidation";

const TrialBalance = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [fromDateData, setFromDateData] = useState({});
  const [toDateData, setToDateData] = useState({});
  const [cofDrData, setCofDrData] = useState([]);
  const [cofCrData, setCofCrData] = useState([]);
  const [totalCofDrData, setTotalCofDrData] = useState([]);
  const [totalCofCrData, setTotalCofCrData] = useState([]);

  const fetchData = () => {
    Http.post("/trial-balance").then((res) => {
      setFromDateData(res.data.from);
      setToDateData(res.data.to);
      setCofDrData(res.data.cof_dr);
      setCofCrData(res.data.cof_cr);
      setTotalCofDrData(res.data.total_cof_dr);
      setTotalCofCrData(res.data.total_cof_cr);
    });
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

  const formSubmit = () => {
    Http.post("/trial-balance/", inputs).then((res) => {
      setFromDateData(res.data.from);
      setToDateData(res.data.to);
      setCofDrData(res.data.cof_dr);
      setCofCrData(res.data.cof_cr);
      setTotalCofDrData(res.data.total_cof_dr);
      setTotalCofCrData(res.data.total_cof_cr);
    });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Trial Balance</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-sm-40">
            <div className="row">
              <div className="col-lg"></div>
              <div className="col-lg">
                <input
                  type="date"
                  className="form-control"
                  name="from"
                  value={inputs.from || fromDateData}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <input
                  type="date"
                  className="form-control"
                  name="to"
                  value={inputs.to || toDateData}
                  onChange={handleChange}
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
          </div>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
            <div className="row">
              <div className="table-responsive p-0 pb-2">
                <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        Accounts CD
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                        Head Of Accounts
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center">
                        Opening(Taka)
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center">
                        Debit(Taka)
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center">
                        Credit(Taka)
                      </th>
                      <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-center">
                        CL Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="8880">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-center">
                        <b>Trial Balance Debit</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {cofDrData.length > 0
                      ? cofDrData.map((item, index) => (
                          <>
                            <tr key={item.id}>
                              <td></td>
                              <td className="text-xs">
                                <b>{item.code}</b>
                              </td>
                              <td className="text-xs">
                                <b>{item.name}</b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.opening_amount
                                    ? parseFloat(item.opening_amount).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.debit
                                    ? parseFloat(item.debit).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.credit
                                    ? parseFloat(item.credit).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.balance
                                    ? parseFloat(item.balance).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                            </tr>
                          </>
                        ))
                      : ""}
                    <tr key={8881}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-xs text-end">Total</td>
                      <td className="text-xs text-end">
                        {totalCofDrData
                          ? parseFloat(totalCofDrData).toFixed(2)
                          : 0.0}
                      </td>
                    </tr>
                    <tr key={8882}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-center">
                        <b>Trial Balance Credit</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {cofCrData.length > 0
                      ? cofCrData.map((item, index) => (
                          <>
                            <tr key={item.id}>
                              <td></td>
                              <td className="text-xs">
                                <b>{item.code}</b>
                              </td>
                              <td className="text-xs">
                                <b>{item.name}</b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.opening_amount
                                    ? parseFloat(item.opening_amount).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.debit
                                    ? parseFloat(item.debit).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.credit
                                    ? parseFloat(item.credit).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                              <td className="text-xs text-end">
                                <b>
                                  {item.balance
                                    ? parseFloat(item.balance).toFixed(2)
                                    : 0.0}
                                </b>
                              </td>
                            </tr>
                          </>
                        ))
                      : ""}
                    <tr key={8883}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="text-xs text-end">Total</td>
                      <td className="text-xs text-end">
                        {totalCofCrData
                          ? parseFloat(totalCofCrData).toFixed(2)
                          : 0.0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
