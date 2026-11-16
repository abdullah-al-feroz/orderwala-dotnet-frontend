import React from "react";

const NewProductStockDetail = (props) => {
  const data = props.data;

  // Function to calculate stock
  const calculateStock = (primarySalesItems) => {
    return primarySalesItems.reduce((acc, currentItem) => {
      return (
        acc +
        (parseFloat(currentItem.qty) -
          parseFloat(currentItem.sale_qty) +
          currentItem.trade_offer_product_offer_id ==
        currentItem.product_id
          ? parseFloat(currentItem.toQty)
          : 0)
      );
    }, 0);
  };
  // Check if data is an array before rendering
  if (!Array.isArray(data)) {
    console.log("Data is not an array:", data);
    return <div>Loading...</div>; // or any other fallback UI
  }
  return (
    <>
      <div className="table-responsive p-0 pb-2">
        <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 _datatable">
          <thead>
            <tr>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Code
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Name
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Stock
              </th>
              <th
                colSpan={2}
                className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
              >
                Breakdown
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={3} className="text-xs"></td>
              <td className="text-xs">Qty</td>
              <td className="text-xs">Amount</td>
            </tr>
            {/* {data.map((item, index) => (
              <>
                <tr>
                  <td rowSpan={3} className="text-xs">
                    {item.code}
                  </td>
                  <td rowSpan={3} className="text-xs">
                    {item.name}
                  </td>
                  <td rowSpan={3} className="text-xs">
                    {calculateStock(item.primary_sales_item).toFixed(2)}
                  </td>
                  <td className="text-xs">40</td>
                  <td className="text-xs">20</td>
                </tr>
                <tr>
                  <td className="text-xs">40</td>
                  <td className="text-xs">30</td>
                </tr>
                <tr>
                  <td className="text-xs">20</td>
                  <td className="text-xs">40</td>
                </tr>
              </>
            ))} */}

            {data.map((item) => (
              <React.Fragment key={item.id}>
                {/* Initial row for each product */}
                <tr>
                  <td
                    rowSpan={item.primary_sales_item.length + 1}
                    className="text-xs"
                  >
                    {item.code}
                  </td>
                  <td
                    rowSpan={item.primary_sales_item.length + 1}
                    className="text-xs"
                  >
                    {item.name}
                  </td>
                  <td
                    rowSpan={item.primary_sales_item.length + 1}
                    className="text-xs"
                  >
                    {calculateStock(item.primary_sales_item).toFixed(2)}
                  </td>
                  {/* Empty cells for the initial row, as Qty and Sale Qty details will be in subsequent rows */}
                  <td className="text-xs"></td>
                  <td className="text-xs"></td>
                </tr>
                {/* Rows for each primary_sales_item */}
                {item.primary_sales_item.map((salesItem, index) => (
                  <tr key={index}>
                    <td className="text-xs">
                      {parseFloat(
                        salesItem.qty -
                          salesItem.sale_qty +
                          (salesItem.trade_offer_product_offer_id ==
                          salesItem.product_id
                            ? parseFloat(salesItem.toQty)
                            : 0)
                      )}
                    </td>
                    <td className="text-xs">
                      {parseFloat(
                        (salesItem.qty - salesItem.sale_qty) *
                          salesItem.secondary_price
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default NewProductStockDetail;
