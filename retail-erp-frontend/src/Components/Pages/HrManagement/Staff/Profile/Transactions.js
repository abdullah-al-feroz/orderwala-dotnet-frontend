import React from "react";

const Transactions = (props) => {
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
                    Type
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Name
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Rate
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Hours
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Total Amount
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Remarks
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(props.data).map((item, index) => (
                  <tr key={props.data[index].id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">{props.data[index].type}</td>
                    <td className="text-xs">{props.data[index].date}</td>
                    <td className="text-xs">{props.data[index].staff.name}</td>
                    <td className="text-xs">{props.data[index].rate}</td>
                    <td className="text-xs">{props.data[index].total_hours}</td>
                    <td className="text-xs">
                      {props.data[index].total_amount}
                    </td>
                    <td className="text-xs">{props.data[index].remarks}</td>
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

export default Transactions;
