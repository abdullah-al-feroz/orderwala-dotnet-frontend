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
                    Receipt No
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Total Price
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Delivery Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(props.data).map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">{props.data[index].receipt_no}</td>
                    <td className="text-xs">{props.data[index].date}</td>
                    <td className="text-xs">{props.data[index].total_price}</td>
                    <td className="text-xs">
                      {props.data[index].delivery_status}
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
