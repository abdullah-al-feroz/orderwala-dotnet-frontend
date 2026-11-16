import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Http from "../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../Common/IsLogin";
import ReactDataTable from "../../Common/ReactDataTable";


const DiscountOffer = () => {
  const navigate = useNavigate();
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    start_date: getCurrentDate(),
    end_date: getCurrentDate(),
    type: "order_date",
  });
  const [error, setError] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [role, setRole] = useState(null);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);

  function getCurrentDate() {
    const dateObj = new Date();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const roleResponse = await Http.get("/staff-type-check");
      setRole(roleResponse.data);

      const ordersResponse = await Http.get("/report/discount-offer-details");
      setReceiveData(ordersResponse.data);

      const filteredIds = ordersResponse.data
        .filter(
          (item) =>
            item.payment_status === "paid" &&
            item.distributor_receive_amount_status !== 1
        )
        .map((item) => item.id);

      setSelectedCheckboxes(filteredIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleCheckboxChange = (event) => {
    const value = Number(event.target.value);
    setSelectedCheckboxes((prev) =>
      event.target.checked
        ? [...prev, value]
        : prev.filter((id) => id !== value)
    );
  };
  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => {
        setArea(res.data);
      });
    }
    if (name == "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
      ).then((res) => {
        setBase(res.data);
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // const formSubmit = async () => {
  //   const submissionInputs = {
  //     ...inputs,
  //     item_id: selectedCheckboxes,
  //   };

  //   try {
  //     const response = await Http.get(
  //       `/distributor/retailer-order?from=${submissionInputs.start_date}&to=${submissionInputs.end_date}&type=${submissionInputs.type}&region=${submissionInputs.work_place_region_id}&area=${submissionInputs.work_place_area_id}&base=${submissionInputs.work_place_base_id}`
  //     );
  //     setReceiveData(response.data);
  //   } catch (error) {
  //     console.error("Error on form submit:", error);
  //   }
  // };
  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = {
      ...inputs,
      item_id: selectedCheckboxes,
    };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      from: submissionInputs.start_date,
      to: submissionInputs.end_date,
      type: submissionInputs.type,
    });

    // Conditionally add region, area, and base if they are integers
    if (Number.isInteger(submissionInputs.work_place_zone_id)) {
      queryParams.append("zone", submissionInputs.work_place_zone_id);
    }
    if (Number.isInteger(submissionInputs.work_place_region_id)) {
      queryParams.append("region", submissionInputs.work_place_region_id);
    }
    if (Number.isInteger(submissionInputs.work_place_area_id)) {
      queryParams.append("area", submissionInputs.work_place_area_id);
    }
    if (Number.isInteger(submissionInputs.work_place_base_id)) {
      queryParams.append("base", submissionInputs.work_place_base_id);
    }

    try {
      const response = await Http.get(
        `/distributor/retailer-order?${queryParams.toString()}`
      );
      setReceiveData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const paymentReceive = async () => {
    if (selectedCheckboxes.length > 0) {
      const submissionInputs = {
        ...inputs,
        item_id: selectedCheckboxes,
      };

      try {
        const response = await Http.post(
          "/distributor/distributor-payment-receive",
          submissionInputs
        );
        alert("Successfully Received Amount");
        setReceiveData(response.data);
      } catch (e) {
        console.error("Error on payment receive:", e);
      }
    } else {
      alert("Please Select Minimum 1 Checkbox to Receive Payment Amount");
    }
  };

  const deleteData = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
          setReceiveData(res.data);
          Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
        });
      }
    });
  };

  const cols = [
    { field: "date", header: "Order Date" },
    { field: "receipt_no", header: "Invoice No" },
    { field: "zone.name", header: "Zone" },
    { field: "region.name", header: "Region" },
    { field: "area.name", header: "Area" },
    { field: "base.name", header: "Base" },
    { field: "route.name", header: "Route" },
    {
      field: (rowData) => (rowData.mdo_id > 0 ? "MDO" : "Orderwala"),
      header: "Type",
    },
    {
      field: "customer.phone",
      header: "Customer Phone",
      template: (rowData) => rowData.customer?.phone || "",
    },
    {
      field: "customer.shop_name",
      header: "Shop Name",
      template: (rowData) => rowData.customer?.shop_name || "",
    },
    { field: "total_price", header: "Invoice Total" },
    // { field: "payment_amount", header: "Received Amount" },
  ];

  // const actionTemplate = (rowData, deleteData) => {
  //   return (
  //     <div className="text-xs text-nowrap">
  //       {role == "distributor" ? (
  //         rowData.payment_status == "paid" &&
  //         rowData.distributor_receive_amount_status != 1 ? (
  //           <input
  //             type="checkbox"
  //             name="amount_receive"
  //             value={rowData.id} // Ensure rowData.id is the correct type
  //             onChange={handleCheckboxChange}
  //             checked={selectedCheckboxes.includes(rowData.id)}
  //           />
  //         ) : (
  //           ""
  //         )
  //       ) : (
  //         ""
  //       )}
  //       <Link
  //         to={{
  //           pathname: "/distributor/retailer-order/" + rowData.id,
  //         }}
  //         className="btn btn-info btn-sm"
  //         target="_blank"
  //       >
  //         <i className="fa fa-list" aria-hidden="true"></i>
  //       </Link>
  //       {rowData.payment_status == "unpaid" &&
  //       rowData.delivery_status == "undelivered" ? (
  //         <>
  //           <button
  //             className="btn btn-danger btn-sm ms-1"
  //             onClick={() =>
  //               deleteData(
  //                 rowData.id,
  //                 "distributor/retailer-order-delete",
  //                 "Order"
  //               )
  //             }
  //           >
  //             <i className="fa fa-trash"></i>
  //           </button>
  //         </>
  //       ) : (
  //         ""
  //       )}
  //     </div>
  //   );
  // };

  const actionTemplate = (rowData, deleteData) => {
    const isCheckboxVisible =
      role === "distributor" &&
      rowData.payment_status === "paid" &&
      rowData.distributor_receive_amount_status !== 1;

    const canDeleteOrder =
      rowData.payment_status === "unpaid" &&
      rowData.delivery_status === "undelivered";

    return (
      <div className="text-xs text-nowrap">
        {/* Conditional Checkbox */}
        {isCheckboxVisible && (
          <input
            type="checkbox"
            name="amount_receive"
            value={rowData.id}
            onChange={handleCheckboxChange}
            checked={selectedCheckboxes.includes(rowData.id)}
          />
        )}

        {/* View Details Button */}
        <Link
          to={`/distributor/retailer-order/${rowData.id}`}
          className="btn btn-info btn-sm ms-1"
          target="_blank"
          title="View Details"
        >
          <i className="fa fa-list" aria-hidden="true"></i>
        </Link>

        {/* Delete Button */}
        {canDeleteOrder && (
          <button
            className="btn btn-danger btn-sm ms-1"
            onClick={() =>
              deleteData(
                rowData.id,
                "distributor/retailer-order-delete",
                "Order"
              )
            }
            title="Delete Order"
          >
            <i className="fa fa-trash"></i>
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Discount Offer</h5>
          </div>
 
          <div className="am-pagebody">
            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
                actionTemplate={actionTemplate}
                deleteData={deleteData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountOffer;
