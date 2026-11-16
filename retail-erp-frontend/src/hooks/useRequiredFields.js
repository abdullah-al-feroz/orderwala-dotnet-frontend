import { useCallback } from "react";

const useRequiredFields = () => {
  const checkRequiredFields = useCallback(() => {
    const requiredFields = document.querySelectorAll("[data-required]");
    let allFieldsValid = true;

    requiredFields.forEach((field) => {
      if (field.matches(".select[data-required]")) {
        const selectValue = field.querySelector(
          ".select__single-value"
        ).textContent;
        if (selectValue.trim() === "") {
          field.querySelector(".select__control").style.borderColor = "red";
          allFieldsValid = false;
        } else {
          field.querySelector(".select__control").style.borderColor = "";
        }
      } else {
        if (field.value.trim() === "") {
          field.style.borderColor = "red";
          allFieldsValid = false;
        } else {
          field.style.borderColor = "";
        }
      }
    });

    return allFieldsValid;
  }, []);

  return { checkRequiredFields };
};

export default useRequiredFields;
