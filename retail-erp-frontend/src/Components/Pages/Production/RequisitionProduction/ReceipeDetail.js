import React from "react";

const ReceipeDetail = (props) => {
  let options = [];
  if (props.listInfo != undefined) {
    options.push({ value: "", info: "Select RMPM" });
    Object.keys(props.listInfo).forEach((key) => {
      options.push({
        value: props.listInfo[key],
        info: props.listInfo[key],
        selected: props.selected,
      });
    });
  } else {
    options.push({
      value: "",
      info: "No RMPM Found",
      selected: null,
    });
  }
  const removeList = (index) => {
    props.remove(index);
  };
  const handleInputChange = (e, index) => {
    props.listInputChange(e, index);
  };
  return (
    <tr>
      <td>{props.listInfo.code}</td>
      <td>
        {props.listInfo.name}
        {/* <select
          className="form-control"
          name="product_id"
          onChange={(e) => handleInputChange(e, props.listSl)}
        >
          <option value="">Select Product</option>
          {Array.from(props.rmpm).map((item, index) => (
            <option
              value={item.id}
              key={item.id}
              selected={props.listInfo.id === item.id ? true : false}
            >
              {item.name}
            </option>
          ))}
        </select> */}
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
          value={props.listInfo.issue_qty || "0"}
        />
        <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {props.listInfo.issue_qty < 1 ? "Stock Not Found" : ""}
        </p>
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
