import React from "react";

const SubCategory = (props) => {
  let options = [];
  if (props.data != undefined) {
    options.push({ value: "", info: "Select Sub Category Module" });
    Object.keys(props.data).forEach((key) => {
      Object.keys(props.data[key]).forEach((info) => {
        if (key == "hr") {
          options.push({
            value: "hr_" + info,
            info: props.data[key][info],
            selected: props.selected,
          });
        } else if (key == "vendor") {
          options.push({
            value: "vendor_" + info,
            info: props.data[key][info],
            selected: props.selected,
          });
        } else if (key == "distributor") {
          options.push({
            value: "distributor_" + info,
            info: props.data[key][info],
            selected: props.selected,
          });
        } else if (key == "customer") {
          options.push({
            value: "customer_" + info,
            info: props.data[key][info],
            selected: props.selected,
          });
        } else if (key == "asset") {
          options.push({
            value: "asset_" + info,
            info: props.data[key][info],
            selected: props.selected,
          });
        } else if (key == "subsidiary") {
          options.push({
            value: "subsidiary_" + info,
            info: props.data[key][info],
            selected: props.selected,
          });
        }
      });
    });
  } else {
    options.push({
      value: "",
      info: "No Sub Category Found",
      selected: null,
    });
  }

  return (
    <>
      {options.map((item, index) => (
        <option
          value={item.value}
          key={index}
          selected={item.value == item.selected ? true : false}
        >
          {item.info}
        </option>
      ))}
    </>
  );
};

export default SubCategory;
