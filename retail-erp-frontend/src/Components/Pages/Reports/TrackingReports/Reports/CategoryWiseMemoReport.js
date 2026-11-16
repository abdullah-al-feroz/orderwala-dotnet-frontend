import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import Swal from "sweetalert2";
import Select from "react-select";
import ReactDataTable from "../../../../Common/ReactDataTable";
import { Oval } from "react-loader-spinner";

const List = () => {
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
  const [basketTemplates, setBasketTemplates] = useState([]);
  const [basketSummaries, setBasketSummaries] = useState([]);
  const [loadingSummaryData, setLoadingSummaryData] = useState(false);

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

  // Initial data fetch on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingSummaryData(true);
      try {
        const basketSummariesResponse = await Http.get("/moo-panel/reports/category-wise-memo-summary?from=" + inputs.start_date + "&to=" + inputs.end_date);
        setBasketSummaries(basketSummariesResponse.data.data);
      } catch (error) {
        console.error("Error fetching basket summary data:", error);
      } finally {
        setLoadingSummaryData(false);
      }
    };
    fetchInitialData();
  }, []); // Only run once on mount

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const roleResponse = await Http.get("/staff-type-check");
      setRole(roleResponse.data);

      const ordersResponse = await Http.get("/distributor/retailer-order?is_basket=1");
      setReceiveData(ordersResponse.data);

      const basketTemplatesResponse = await Http.get("/distributor/basket-templates");
      setBasketTemplates(basketTemplatesResponse.data?.list);



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
      setLoadingSummaryData(true)

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
    if (Number.isInteger(submissionInputs.basket_template_id)) {
      queryParams.append("basket_template_id", submissionInputs.basket_template_id);
    }

    queryParams.append('is_basket', 1)

    try {
      const [response, basketSummaries] = await Promise.all([
        Http.get(`/distributor/retailer-order?${queryParams.toString()}`),
        Http.get(`/moo-panel/reports/category-wise-memo-summary?${queryParams.toString()}`)
      ]);
      setReceiveData(response.data);
      setBasketSummaries(basketSummaries.data.data);
      setLoading(false);
      setLoadingSummaryData(false);

    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
      setLoadingSummaryData(false);
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
    { field: "zone", header: "Zone" },
    { field: "area", header: "Area" },
    { field: "base", header: "Base" },
    { field: "total_order_memo_qty", header: "O.Memo Qty" },
    { field: "total_delivery_memo_qty", header: "D.Memo Qty" },
    { field: "three_and_above_category_order_memo_qty", header: "3 Cat O.Memo" },
    { field: "three_and_above_category_delivery_memo_qty", header: "3 Cat D.Memo" },
    { field: "two_category_order_memo_qty", header: "2 Cat O.Memo" },
    { field: "two_category_delivery_memo_qty", header: "2 Cat D.Memo" },
    { field: "one_category_order_memo_qty", header: "1 Cat O.Memo" },
    { field: "one_category_delivery_memo_qty", header: "1 Cat D.Memo" },
  ];

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
            <h5 className="am-title">All Category Wise Memo Report</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Zone</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={zone[0]}
                    name="work_place_zone_id"
                    options={zone}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Region</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={region[0]}
                    name="work_place_region_id"
                    options={region}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Area</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={area[0]}
                    name="work_place_area_id"
                    options={area}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label for="">Select Base</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={base[0]}
                    name="work_place_base_id"
                    options={base}
                    onChange={selectHandleChange}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    value={inputs.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="end_date"
                    value={inputs.end_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg mt-4">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
              {loadingSummaryData ? (
                <>
                  <h2
                    className="mg-b-5 tx-inverse tx-lato"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Oval
                      height={80}
                      width={80}
                      color="#00BFFF"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                      ariaLabel="oval-loading"
                      secondaryColor="#4fa94d"
                      strokeWidth={2}
                      strokeWidthSecondary={2}
                    />
                  </h2>
                </>
              ) : (
                <>
                  {/* Summary Section */}
                  {basketSummaries && basketSummaries.length > 0 && (
                    <table className="table mb-0 mt-3">
                      <tr>
                        <th colSpan={4}>
                          <h6 style={{ textAlign: "center", "color": "black", "fontWeight": "bold" }}>All Category Wise Memo Summary</h6>
                        </th>
                      </tr>
                      <tr>
                        <th>Total Order Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.total_order_memo_qty, 0)}</th>
                        <th>Total Delivery Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.total_delivery_memo_qty, 0)}</th>
                        <th>3 & Above Category Order Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.three_and_above_category_order_memo_qty, 0)}</th>
                        <th>3 & Above Category Delivery Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.three_and_above_category_delivery_memo_qty, 0)}</th>
                      </tr>
                      <tr>
                        <th>2 Category Order Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.two_category_order_memo_qty, 0)}</th>
                        <th>2 Category Delivery Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.two_category_delivery_memo_qty, 0)}</th>
                        <th>1 Category Order Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.one_category_order_memo_qty, 0)}</th>
                        <th>1 Category Delivery Memo Qty : {basketSummaries.reduce((sum, item) => sum + item.one_category_delivery_memo_qty, 0)}</th>
                      </tr>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={basketSummaries}
                isLoading={loadingSummaryData}
                actionTemplate={null}
                deleteData={null}
                frozenColumnFields={["zone", "area", "base"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default List;
