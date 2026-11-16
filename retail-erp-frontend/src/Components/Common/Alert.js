import React from "react";

const Alert = (props) => {
  // const capitalize = (word) => {
  //   const lower = word.toLowerCase();
  //   return lower.charAt(0).toUpperCase() + lower.slice(1);
  // };

  return (
    props.alert && (
      <>
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert"
        >
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="d-flex align-items-center justify-content-start">
            <i className="icon ion-ios-checkmark alert-icon tx-32 mg-t-5 mg-xs-t-0" />
            <span>
              {/* <strong>{capitalize(props.alert.type)}</strong>:{" "} */}
              <strong>{props.alert.type}</strong>:{" "}
              {props.alert.message
                ? props.alert.message
                : "Successfully Completed"}
            </span>
          </div>
        </div>
      </>
    )
  );
};

export default Alert;
