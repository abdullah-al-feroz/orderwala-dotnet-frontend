import React from "react";

const Info = (props) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <table className="table table-sm">
            <tr>
              <th>Card No</th>
              <td>{props.data.card_no}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{props.data.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{props.data.email}</td>
            </tr>
            <tr>
              <th>Mobile</th>
              <td>{props.data.mobile}</td>
            </tr>
            <tr>
              <th>Designation</th>
              <td>
                {props.data.designation ? props.data.designation.name : ""}
              </td>
            </tr>
            <tr>
              <th>Grade</th>
              <td>{props.data.grade ? props.data.grade.name : ""}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{props.data.department ? props.data.department.name : ""}</td>
            </tr>
            <tr>
              <th>Joining Date</th>
              <td>{props.data.joining_date}</td>
            </tr>
            <tr>
              <th>Inactive Date</th>
              <td>{props.data.inactive_date}</td>
            </tr>
            <tr>
              <th>Bank Account</th>
              <td>{props.data.bank_account}</td>
            </tr>
            <tr>
              <th>Blood Group</th>
              <td>{props.data.blood_group}</td>
            </tr>
          </table>
        </div>
        <div className="col-lg">
          <table className="table table-sm">
            <tr>
              <th>Date Of Birth</th>
              <td>{props.data.date_of_birth}</td>
            </tr>
            <tr>
              <th>Present Address</th>
              <td>{props.data.present_address}</td>
            </tr>
            <tr>
              <th>Permanent Address</th>
              <td>{props.data.permanent_address}</td>
            </tr>
            <tr>
              <th>Emergency Contact</th>
              <td>{props.data.emergency_contact}</td>
            </tr>
            <tr>
              <th>Reference</th>
              <td>{props.data.reference}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>
                {props.data.company_location
                  ? props.data.company_location.name
                  : ""}
              </td>
            </tr>
            <tr>
              <th>Region</th>
              <td>{props.data.region ? props.data.region.name : ""}</td>
            </tr>
            <tr>
              <th>Area</th>
              <td>{props.data.area ? props.data.area.name : ""}</td>
            </tr>
            <tr>
              <th>Base</th>
              <td>{props.data.base ? props.data.base.name : ""}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{props.data.status}</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg">
          <h4 className="text-center">Salary Structure</h4>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <table className="table table-sm">
            <tr>
              <th>Basic Salary</th>
              <th>House Rent</th>
              <th>Medical Allowance </th>
              <th>Conveyence</th>
              <th>Entertainment</th>
              <th>TADA</th>
              <th>Holiday Rate</th>
            </tr>
            <tr>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.basic
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.house_rent
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.medical
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.conveyence
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.entertainment
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.ta_da
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.holiday
                    ).toFixed(2)
                  : 0.0}
              </td>
            </tr>
            <tr>
              <th>Insurance</th>
              <th>Income Tax</th>
              <th>Other Allowance</th>
              <th>Catenn Bill</th>
              <th>Phone Bill Limit</th>
              <th>Gross Salary</th>
              <th></th>
            </tr>
            <tr>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.insurance
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.income_tax
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.other_allowance
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.canteen_bill
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.phone_bill_limit
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td>
                {props.data.salary_structure_latest
                  ? parseFloat(
                      props.data.salary_structure_latest.gross
                    ).toFixed(2)
                  : 0.0}
              </td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default Info;
