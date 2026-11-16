import React from "react";

const Attendance = (props) => {
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
                    Name
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Lat
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Lng
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Mac Address
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Checkin Distance
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Checkout Distance
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Start Date and Time
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    End Date and Time
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(props.data).map((item, index) => (
                  <tr key={props.data[index].id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">
                      {props.data[index].staff
                        ? props.data[index].staff.name
                        : ""}
                    </td>
                    <td className="text-xs">{props.data[index].lat}</td>
                    <td className="text-xs">{props.data[index].lng}</td>
                    <td className="text-xs">{props.data[index].mac_address}</td>
                    <td className="text-xs">
                      {props.data[index].checkin_distance}
                    </td>
                    <td className="text-xs">
                      {props.data[index].checkout_distance}
                    </td>
                    <td className="text-xs">
                      {props.data[index].start_date_time}
                    </td>
                    <td className="text-xs">
                      {props.data[index].end_date_time}
                    </td>
                    <td className="text-xs">{props.data[index].remarks}</td>
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

export default Attendance;
