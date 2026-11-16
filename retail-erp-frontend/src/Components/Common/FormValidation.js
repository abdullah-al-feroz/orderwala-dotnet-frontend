import React from "react";

const FormValidation = (props) => {
  let msg = [];

  Object.keys(props.error).forEach((key) => {
    msg.push(props.error[key][0]);
  });

  if (msg.length > 0) {
    window.scrollTo(0, 0);
  }

  return (
    props.error && (
      <>
        <ul
          className="parsley-errors-list filled"
          style={{ marginBottom: "20px" }}
        >
          {msg.map((item, index) => (
            <li className="parsley-required" style={{ color: "red" }}>
              <span className="help-block">{item}</span>
            </li>
          ))}
        </ul>
      </>
    )
  );
};

export default FormValidation;
