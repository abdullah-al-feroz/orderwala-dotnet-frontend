import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Show = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();

  const fetchData = () => {
    Http.get("/payslip/" + id).then((res) => {
      setReceiveData(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Pay Slip</h5>
          </div>

          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="card">
                    <div className="card-body">
                      <div className="payslip">
                        <div className="payslip-logo text-center mb-4">
                          <img
                            className="img-fluid"
                            style={{ width: "30%" }}
                            src="https://limerickbd.com/wp-content/uploads/2021/12/Limerick-LOGO-1536x388.png"
                            alt="User profile picture"
                          />
                        </div>
                        <div className="payslip-header text-center mb-4">
                          <h2>Pay Slip</h2>
                          <small>
                            For the month of {receiveData.month},{" "}
                            {receiveData.info ? receiveData.info.year : ""}
                          </small>
                        </div>
                        <hr />
                        {/* <div className="payslip-content">
                          <table className="table table-borderless">
                            <tr>
                              <td>
                                <strong>Employee ID:</strong> {receiveData.info ? (receiveData.info.staff ? receiveData.info.staff.card_no : "") : ""}
                              </td>
                              <td>
                                <strong>Employee Name:</strong> {receiveData.info ? (receiveData.info.staff ? receiveData.info.staff.card_no : "") : ""}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Designation:</strong> {receiveData.info ? (receiveData.info.staff ? receiveData.info.staff.designation.name : "") : ""}
                              </td>
                              <td>
                                <strong>Department:</strong> {receiveData.info ? (receiveData.info.staff ? (receiveData.info.staff.department ? receiveData.info.staff.department.name : "") : "") : ""}
                              </td>
                            </tr>
                          </table>
                          <hr />
                          <div className="row">
                            <div className="col-6">
                              <h5 className="mb-3">Earnings</h5>
                              <p>Gross Salary: {receiveData.info ? receiveData.info.gross : ""}</p>
                              <p>Bonus: {receiveData.info ? receiveData.info.bonus : ""}</p>
                            </div>
                            <div className="col-6">
                              <h5 className="mb-3">Deductions</h5>
                              <p>Canteen: {receiveData.info ? receiveData.info.canteen : ""}</p>
                              <p>Income Tax: {receiveData.info ? receiveData.info.incometax : ""}</p>
                              <p>Phone Bill: {receiveData.info ? receiveData.info.phone_bill_extra : ""}</p>
                              <p>Salary Advance: {receiveData.info ? receiveData.info.salary_advance : ""}</p>
                              <p>Penalty: {receiveData.info ? receiveData.info.deduction : ""}</p>
                            </div>
                          </div>
                          <hr />
                          <div className="payslip-footer">
                            <h5 className="mb-3">Net Amount Payable: Tk. {receiveData.info ? receiveData.info.final_amount : ""}</h5>
                            <h5 className="text-right mb-3">Checked By</h5>
                          </div>
                        </div> */}

                        <div className="payslip-content">
                          <div className="row">
                            <div className="col-12">
                              <h5 className="mb-3 text-center">
                                Employee Details
                              </h5>
                              <table className="table table-borderless">
                                <tr>
                                  <td>
                                    <strong>Employee ID:</strong>{" "}
                                    {receiveData.info
                                      ? receiveData.info.staff
                                        ? receiveData.info.staff.card_no
                                        : ""
                                      : ""}
                                  </td>
                                  <td>
                                    <strong>Employee Name:</strong>{" "}
                                    {receiveData.info
                                      ? receiveData.info.staff
                                        ? receiveData.info.staff.name
                                        : ""
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>Designation:</strong>{" "}
                                    {receiveData.info
                                      ? receiveData.info.staff
                                        ? receiveData.info.staff.designation
                                            .name
                                        : ""
                                      : ""}
                                  </td>
                                  <td>
                                    <strong>Department:</strong>{" "}
                                    {receiveData.info
                                      ? receiveData.info.staff
                                        ? receiveData.info.staff.department
                                          ? receiveData.info.staff.department
                                              .name
                                          : ""
                                        : ""
                                      : ""}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-6">
                              <h5 className="mb-3 text-center">Earnings</h5>
                              <table className="table table-striped">
                                <tr>
                                  <td>Gross Salary</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.gross
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Bonus</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.bonus
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>TADA</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.tada
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Overtime</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.overtime_amount
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Other Allowance</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.other_allowance
                                      : ""}
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <div className="col-6">
                              <h5 className="mb-3 text-center">Deductions</h5>
                              <table className="table table-striped">
                                <tr>
                                  <td>Canteen</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.canteen
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Income Tax</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.incometax
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Phone Bill</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.phone_bill_extra
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Salary Advance</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.salary_advance
                                      : ""}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Penalty</td>
                                  <td>
                                    {receiveData.info
                                      ? receiveData.info.deduction
                                      : ""}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                          <hr />
                          <div className="payslip-footer">
                            <h5 className="mb-3">
                              Net Amount Payable: Tk.{" "}
                              {receiveData.info
                                ? receiveData.info.final_amount
                                : ""}
                            </h5>
                            <h5 className="text-right mb-3">Checked By</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
