// useDeleteSupplyChainData.js
import { useCallback } from "react";
import Swal from "sweetalert2";
import HttpSupplyChain from "../Components/Common/HttpSupplyChain";

const useDeleteSupplyChainData = (fetchData) => {
  const deleteData = useCallback(
    (id, deleteApiUrl, itemName) => {
      const message = `Are you sure you want to delete this ${itemName}?`;
      Swal.fire({
        title: "Are you sure?",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          HttpSupplyChain.delete(`/${deleteApiUrl}/${id}`).then(() => {
            Swal.fire("Deleted!", `${itemName} has been deleted.`, "success");
            fetchData(); // Call the fetchData callback
          });
        }
      });
    },
    [fetchData]
  );

  return deleteData;
};

export default useDeleteSupplyChainData;