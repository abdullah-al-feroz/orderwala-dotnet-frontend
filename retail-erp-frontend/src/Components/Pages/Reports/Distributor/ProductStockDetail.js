import React from "react";

const ProductStockDetail = (props) => {
  const data = props.data;
  const basket = props.basket;

  console.log(basket);

  if (!Array.isArray(data) || data.length === 0) {
    console.log("Data is not an array or it's empty:", data);
    return <div>Loading...</div>; // Adjust this message if needed
  }

  return (
    <>
      <div className="table-responsive p-0 pb-2">
        <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
          <thead>
            <tr>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Code
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Name
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Unit
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Price
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                SKU
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Pack Size
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Opening Stock
              </th>
              {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Other Receive
                        </th> 
                        <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                          Transfer Receive
                        </th>*/}

              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Grn
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Grn Trade Offer
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Grn Return
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Sale
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Sale Trade Offer
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Sale Return
              </th>
              {/* <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Physical Stock
              </th> */}
              <th
                className="text-uppercase text-dark text-sm font-weight-bolder ps-2"
                style={{ backgroundColor: "yellow" }}
              >
                Stock
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Undelivered Order Qty
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                PickUp Qty
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Category
              </th>
              <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td className="text-xs">{item.code}</td>
                <td className="text-xs">{item.name_en}</td>
                <td className="text-xs">{item.unit ? item.unit.name : ""}</td>
                <td className="text-xs">{item.secondary_price}</td>
                <td className="text-xs">{item.sku}</td>
                <td className="text-xs">{item.pack_size}</td>
                <td className="text-xs">{item.disOpeningStockQty}</td>
                {/* <td className="text-xs">{item.otherReceiveQty}</td> 
                          <td className="text-xs">{item.transferReceiveQty}</td> */}
                <td className="text-xs">{item.orderReceiveQty}</td>
                <td className="text-xs">{item.orderReceiveTradeQty}</td>
                <td className="text-xs">{item.orderReturnReceiveQty}</td>
                <td className="text-xs">
                  {parseFloat(item.orderImsReceiveQty) +
                    parseFloat(item.distributorSaleQty)}
                </td>
                <td className="text-xs">
                  {parseFloat(item.orderImsReceiveTradeQty) +
                    parseFloat(item.DistributorSaleTradeQty)}
                </td>
                <td className="text-xs">{item.imsOrderReturnReceiveQty}</td>
                {/* <td className="text-xs">
                  {item.tStockQty > 0
                    ? parseFloat(item.tStockQty) +
                      parseFloat(item.undeliveredStockQty)
                    : 0}
                </td> */}
                <td className="text-xs" style={{ backgroundColor: "yellow" }}>
                  {item.tStockQty > 0 ? item.tStockQty : 0}
                </td>
                <td className="text-xs">
                  {item.undeliveredStockQty > 0 ? item.undeliveredStockQty : 0}
                </td>
                <td className="text-xs">
                  {item.pickupOrderQty > 0 ? item.pickupOrderQty : 0}
                </td>
                <td className="text-xs">
                  {item.category ? item.category.name : ""}
                </td>
                <td className="text-xs">{item.status}</td>
              </tr>
            ))}

            {basket &&
              basket.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-xs"></td>
                  <td className="text-xs">{item.title}</td>
                  <td className="text-xs"></td>
                  <td className="text-xs">{item.secondary_price}</td>
                  <td className="text-xs"></td>
                  <td className="text-xs"></td>
                  <td className="text-xs">{item.disOpeningStockQty}</td>
                  <td className="text-xs">{item.orderReceiveQty}</td>
                  <td className="text-xs">{item.orderReceiveTradeQty}</td>
                  <td className="text-xs">{item.orderReturnReceiveQty}</td>
                  <td className="text-xs">
                    {parseFloat(item.orderImsReceiveQty)}
                  </td>
                  <td className="text-xs"></td>
                  <td className="text-xs"></td>
                  <td className="text-xs">
                    {item.stockQty > 0 ? parseFloat(item.stockQty) : 0}
                  </td>
                  <td className="text-xs">
                    {item.stockQty > 0 ? item.stockQty : 0}
                  </td>
                  <td className="text-xs">
                    {item.undeliveredStockQty > 0
                      ? item.undeliveredStockQty
                      : 0}
                  </td>
                  <td className="text-xs">
                    {item.pickupOrderQty > 0 ? item.pickupOrderQty : 0}
                  </td>
                  <td className="text-xs"></td>
                  <td className="text-xs"></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductStockDetail;
