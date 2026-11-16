import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const loaderModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "none",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
};

const loaderContentStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const loaderIconStyles = {
  marginBottom: "1rem",
};

// ...

const Loader = ({ isOpen }) => {
  return (
    <Modal isOpen={isOpen} ariaHideApp={false} style={loaderModalStyles}>
      <div style={loaderContentStyles}>
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          style={loaderIconStyles}
        />
        <span>Loading...</span>
      </div>
    </Modal>
  );
};

export default Loader; // Change this line

// Export the named export as well
export { Loader };
