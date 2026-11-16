import React from "react";

const Salary = (props) => {
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive p-0 pb-2">
            <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
              <thead>
                <tr>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    S/N
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Month
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Year
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Name
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Designation
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Joining Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Inactive Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Basic
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    House Rent
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Medical
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Conveyence
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Entertainment
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Other Allowance
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Declared Gross Salary
                  </th>
                  <th
                    className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                    title="(Gross * Number of Working Days) / Total Number of Days Month"
                  >
                    Gross Salary (If Inactive User)
                  </th>
                  <th
                    className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                    title="Calculate Attendance,Leave Application,Late & Movement Slip"
                  >
                    Salary Deduction For Not Present
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Arrear
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Overtime
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Holiday Allowance
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Night Hold
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    TADA
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Salary Advance
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Canteen
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Phone Bill Extra
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Income Tax
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Deduction
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Bonus
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(props.data).map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">{props.data[index].date}</td>
                    <td className="text-xs">
                      {new Date(
                        props.data[index].year,
                        props.data[index].month,
                        10
                      ).toLocaleString("default", { month: "long" })}
                    </td>
                    <td className="text-xs">{props.data[index].year}</td>
                    <td className="text-xs">
                      {props.data[index].staff.card_no}
                    </td>
                    <td className="text-xs">{props.data[index].staff.name}</td>
                    <td className="text-xs">
                      {props.data[index].staff.designation.name}
                    </td>
                    <td className="text-xs">
                      {props.data[index].staff.joining_date}
                    </td>
                    <td className="text-xs">
                      {props.data[index].staff.inactive_date}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].basic}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].house_rent}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].medical}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].conveyence}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].entertainment}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].other_allowance}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].gross}
                    </td>
                    <td className="text-xs" align="right">
                      {
                        props.data[index]
                          .final_gross_after_inactive_date_salary_calculation
                      }
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].salaryDeductionForNotPresent}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].arrear}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].overtime_amount}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].holiday_allowance}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].night_hold}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].tada}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].salary_advance}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].canteen}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].phone_bill_extra}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].income_tax}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].deduction}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].bonus}
                    </td>
                    <td className="text-xs" align="right">
                      {props.data[index].final_amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Salary;
