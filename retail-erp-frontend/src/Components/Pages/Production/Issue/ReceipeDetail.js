import React from "react";
import Select from "react-select";

const ReceipeDetail = (props) => {
  const removeList = (index) => {
    props.remove(index);
  };
  const handleInputChange = (e, index) => {
    props.listInputChange(e, index);
  };
  // const handleCustomInputChange = (e, index) => {
  //   props.listInputChange(e, index);
  // };
  return (
    <tr>
      <td>{props.listInfo.code}</td>
      <td>
        {props.listInfo.name ? props.listInfo.name : props.listInfo.product}
      </td>
      <td className="text-right">
        <p style={{ padding: "7px 0px", marginBottom: "0px" }}>
          {props.listInfo.stndrd_qty ? props.listInfo.stndrd_qty : 0}
        </p>
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          name="issue_qty"
          onChange={(e) => handleInputChange(e, props.listSl)}
          value={
            // props.listInfo.msg == "" ? props.listInfo.issue_qty || "0" : "0"
            props.listInfo.issue_qty || "0"
          }
        />
      </td>
      <td>
        {/* {props.custom.length > 0 ? (
          <select
            className="form-control"
            _multiple
            name="custom_purchase_order"
          >
            <option value="">Select Product</option>
            {Array.from(props.listInfo.purchase_list).map((item, index) => (
              <option value={item.id} key={item.id}>
                Rate - {item.unit_price} | Available Qty -{" "}
                {item.actual_qty - item.issue_qty}
              </option>
            ))}
          </select>
        ) : (
          props.listDetail[props.listSl]
        )} */}
        {props.receipeType == "custom" ? (
          parseFloat(props.listInfo.current_stock) >=
          parseFloat(props.listInfo.issue_qty) ? (
            props.listInfo.purchase_list ? (
              props.listInfo.purchase_list.length > 0 ? (
                <>
                  <select
                    className="form-control"
                    multiple
                    name="custom_purchase_order"
                    onChange={(e) => handleInputChange(e, props.listSl)}
                  >
                    {/* <option value="">Select Product</option> */}
                    {Array.from(props.listInfo.purchase_list).map(
                      (item, index) => (
                        <option value={item.id} key={item.id}>
                          Rate - {item.unit_price} | Available Qty -{" "}
                          {item.actual_qty - item.issue_qty}
                        </option>
                      )
                    )}
                  </select>
                </>
              ) : (
                ""
              )
            ) : (
              ""
            )
          ) : (
            "Please Resize the Issue Qty"
          )
        ) : props.listDetail.length > 0 ? (
          props.listDetail[props.listSl]
        ) : (
          ""
        )}
      </td>
      <td className="text-center">
        <button
          className="btn btn-danger btn-sm"
          onClick={() => removeList(props.listSl)}
        >
          <i className="fa fa-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default ReceipeDetail;
