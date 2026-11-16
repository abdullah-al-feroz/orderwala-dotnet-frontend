import React from "react";

const Asset = (props) => {
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
                    Asset Category
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Asset
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Assign Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Return Date
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Remarks
                  </th>
                  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(props.data).map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-xs">{index + 1}</td>
                    <td className="text-xs">
                      {props.data[index].asset
                        ? props.data[index].asset.category.name
                        : ""}
                    </td>
                    <td className="text-xs">
                      {props.data[index].asset
                        ? props.data[index].asset.name
                        : ""}
                    </td>
                    <td className="text-xs">{props.data[index].assign_date}</td>
                    <td className="text-xs">{props.data[index].return_date}</td>
                    <td className="text-xs">{props.data[index].remarks}</td>
                    <td className="text-xs">{props.data[index].status}</td>
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

export default Asset;
