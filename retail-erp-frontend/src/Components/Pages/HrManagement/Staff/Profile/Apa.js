import React from "react";

const APA = (props) => {
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
                    Staff
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Effective Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Basic
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Other
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Increment Name
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2 text-right">
                    Updated Salary
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
                  <tr key={item.id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">{props.data[index].type}</td>
                    <td className="text-xs">{props.data[index].staff.name}</td>
                    <td className="text-xs">
                      {props.data[index].effective_date}
                    </td>
                    <td className="text-xs">{props.data[index].basic}</td>
                    <td className="text-xs">{props.data[index].other}</td>
                    <td className="text-xs">
                      {props.data[index].type_name_if}
                    </td>
                    <td className="text-xs text-right">
                      {parseFloat(
                        props.data[index].staff.salary_structure_latest.gross
                      ).toFixed(2)}
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

export default APA;
