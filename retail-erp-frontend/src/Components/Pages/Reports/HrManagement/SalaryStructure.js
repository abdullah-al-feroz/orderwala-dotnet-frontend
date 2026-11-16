import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const SalaryStructure = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/report-salary-structure").then((res) => {
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Salary Structure</h5>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              {/* <h6 className="card-body-title mg-sm-b-30">Datatable</h6> */}
              <div className="row">
                <div className="table-responsive p-0 pb-2">
                  <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                    <thead>
                      <tr>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          S/N
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Name
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Department
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Designation
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Basic Salary
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          House Rent
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Medical Allowance{" "}
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Conveyence
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Entertainment
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          TADA
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Holiday Rate
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Insurance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Income Tax
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Other Allowance
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Catenn Bill
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Phone Bill Limit
                        </th>
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Gross Salary
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {receiveData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-xs">{index + 1}</td>
                          <td className="text-xs">{item.name}</td>
                          <td className="text-xs">{item.department.name}</td>
                          <td className="text-xs">{item.designation.name}</td>
                          <td className="text-xs">
                            {item.salary_structure_latest.basic
                              ? parseFloat(
                                  item.salary_structure_latest.basic
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.house_rent
                              ? parseFloat(
                                  item.salary_structure_latest.house_rent
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.medical
                              ? parseFloat(
                                  item.salary_structure_latest.medical
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.conveyence
                              ? parseFloat(
                                  item.salary_structure_latest.conveyence
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.entertainment
                              ? parseFloat(
                                  item.salary_structure_latest.entertainment
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.ta_da
                              ? parseFloat(
                                  item.salary_structure_latest.ta_da
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.holiday
                              ? parseFloat(
                                  item.salary_structure_latest.holiday
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.insurance
                              ? parseFloat(
                                  item.salary_structure_latest.insurance
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.income_tax
                              ? parseFloat(
                                  item.salary_structure_latest.income_tax
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.other_allowance
                              ? parseFloat(
                                  item.salary_structure_latest.other_allowance
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.canteen_bill
                              ? parseFloat(
                                  item.salary_structure_latest.canteen_bill
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.phone_bill_limit
                              ? parseFloat(
                                  item.salary_structure_latest.phone_bill_limit
                                ).toFixed(2)
                              : 0.0}
                          </td>
                          <td className="text-xs">
                            {item.salary_structure_latest.gross
                              ? parseFloat(
                                  item.salary_structure_latest.gross
                                ).toFixed(2)
                              : 0.0}
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

export default SalaryStructure;
