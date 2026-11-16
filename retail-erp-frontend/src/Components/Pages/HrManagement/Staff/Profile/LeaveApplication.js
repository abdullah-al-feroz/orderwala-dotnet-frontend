import React from "react";

const LeaveApplication = (props) => {
  return (
    <>
      <div className="row">
        <div className="col-md-6 offset-3">
          <table className="table table-sm table-hover table-striped align-items-center justify-content-center mb-5">
            <tr>
              <th colSpan={2} className="text-center">
                Leave Balance
              </th>
            </tr>
            <tr>
              <th>Casual</th>
              <th></th>
            </tr>
            <tr>
              <th>Sick</th>
              <th></th>
            </tr>
            <tr>
              <th>Earn</th>
              <th></th>
            </tr>
          </table>
        </div>
        <div className="col-md-12">
          <div className="table-responsive p-0 pb-2">
            <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
              <thead>
                <tr>
                  <th colSpan={9} className="text-center">
                    Application
                    <hr />
                  </th>
                </tr>
                <tr>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    S/N
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Name
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Apply Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Start Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    End Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Total Days
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Leave Type
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Status
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(props.data).map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">{props.data[index].staff.name}</td>
                    <td className="text-xs">
                      {props.data[index].application_date}
                    </td>
                    <td className="text-xs">{props.data[index].start_date}</td>
                    <td className="text-xs">{props.data[index].end_date}</td>
                    <td className="text-xs">{props.data[index].total_days}</td>
                    <td className="text-xs">{props.data[index].leave_type}</td>
                    <td className="text-xs">{props.data[index].status}</td>
                    <td className="text-xs">{props.data[index].created_at}</td>
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

export default LeaveApplication;
