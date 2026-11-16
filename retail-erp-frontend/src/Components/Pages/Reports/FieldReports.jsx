import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../Common/Alert";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";

//New Data table Code Start
import ReactDataTable from "../../Common/ReactDataTable";
import { param } from "jquery";
import { Oval } from "react-loader-spinner";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [cumulative, setCumulativeData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [parameterIndexWise, setParameterIndexWise] = useState({});

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      const queryString = new URLSearchParams(params).toString();
      const res = await Http.get("/report/field-reports?" + queryString);
      setReceiveData(res.data.list);
      setCumulativeData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    const paramsIndexWise = [];
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
      paramsIndexWise.push({ key, value });
    }
    setQueryParams(params);
    setParameterIndexWise(paramsIndexWise);
    fetchData();
  }, [location.search]); // Trigger when location.search changes

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  // Dynamically filter columns
  //   let cols =
  //     parameterIndexWise[0]?.value === "ow-order-reports"
  //       ? [
  //           { field: "name", header: "Name" },
  //           { field: "total_shop", header: "Total Shop" },
  //           { field: "sales_memo", header: "Sales Memo" },
  //           { field: "sales_amount", header: "Sales Amount" },
  //         ]
  //       : [
  //           { field: "name", header: "Name" },
  //           { field: "sales_memo", header: "Sales Memo" },
  //           { field: "sales_amount", header: "Sales Amount" },
  //           { field: "delivery_memo", header: "Delivery Memo" },
  //           { field: "delivery_amount", header: "Delivery" },
  //           { field: "due_amount", header: "Due" },
  //           { field: "undelivered_amount", header: "Undelivered" },
  //         ];

  let cols;

  if (
    parameterIndexWise[0]?.value === "ow-order-reports" ||
    parameterIndexWise[0]?.value === "mdo-order-reports"
  ) {
    cols = [
      { field: "name", header: "Name" },
      { field: "total_shop", header: "Total Shop" },
      { field: "sales_memo", header: "Sales Memo" },
      { field: "sales_amount", header: "Sales Amount" },
    ];
  } else if (parameterIndexWise[0]?.value === "mdo-visited-shop") {
    cols = [
      { field: "name", header: "Name" },
      { field: "total_shop", header: "Total Shop" },
    ];
  } else if (parameterIndexWise[0]?.value === "ow-store-verify") {
    cols = [
      { field: "name", header: "Name" },
      { field: "store_verify", header: "No. of Shops Verified" },
    ];
  } else if (parameterIndexWise[0]?.value === "mdo-store-created") {
    cols = [
      { field: "name", header: "Name" },
      { field: "store_created", header: "No. of Shops Created" },
    ];
  } else if (parameterIndexWise[0]?.value === "delivered-report") {
    cols = [
      { field: "name", header: "Name" },
      { field: "sales_memo", header: "Sales Memo" },
      { field: "sales_amount", header: "Sales Amount" },
      { field: "delivery_memo", header: "Delivery Memo" },
      { field: "delivery_amount", header: "Delivery Amount" },
    ];
  } else if (parameterIndexWise[0]?.value === "mdo-visited-area-reports") {
    cols = [
      { field: "name", header: "Name" },
      { field: "total_shop", header: "Total Shop" },
      { field: "visited_shop", header: "Visited Shop" },
      { field: "total_order", header: "Total Order" },
      { field: "total_delivery", header: "Total Delivery" },
    ];
  } else if (
    parameterIndexWise[0]?.value === "ow-yesrerday-delivered-amount" ||
    parameterIndexWise[0]?.value === "team-orderwala-yesterday-delivered-report"
  ) {
    cols = [
      { field: "name", header: "Name" },
      { field: "sales_memo", header: "Sales Memo" },
      { field: "sales_amount", header: "Sales Amount" },
    ];
  } else {
    cols = [
      { field: "name", header: "Name" },
      { field: "sales_memo", header: "Sales Memo" },
      { field: "sales_amount", header: "Sales Amount" },
      { field: "delivery_memo", header: "Delivery Memo" },
      { field: "delivery_amount", header: "Delivery Amount" },
      { field: "due_amount", header: "Due Amount" },
      { field: "undelivered_amount", header: "Undelivered Amount" },
    ];
  }

  const formSubmit = async () => {
    setLoading(true);
    try {
      // Get all parameters from the browser's URL
      const searchParams = new URLSearchParams(window.location.search);
      const params = {};

      // Convert URLSearchParams to a plain object
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      // Add form-specific parameters
      params.from_date = inputs.from;
      params.to_date = inputs.to;

      // Convert the params object to a query string
      const queryString = new URLSearchParams(params).toString();

      // Make the API call
      const res = await Http.get(`/report/field-reports?${queryString}`);
      setReceiveData(res.data.list);
      setCumulativeData(res.data);

      console.log("API Response:", res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Reports</h5>
          </div>
          <div className="am-pagebody p-2">
            <Alert alert={alert} />
            <div className="card pd-sm-40 mt-2">
              <div className="row">
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10"
                    onClick={formSubmit}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>

              {loading ? (
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
                  <table className="table mb-0">
                    <tr>
                      <th>Total Staff : {cumulative.total_staff}</th>
                      {parameterIndexWise[0]?.value != "mdo-visited-shop" && (
                        <>
                          <th>Total Memo : {cumulative.sales_memo}</th>
                          <th>Total Amount : {cumulative.sales_amount}</th>
                        </>
                      )}
                      {parameterIndexWise[0]?.value === "ow-order-reports" ||
                        (parameterIndexWise[0]?.value ===
                          "mdo-visited-shop" && (
                          <th>Total Shop : {cumulative.total_shop}</th>
                        ))}
                      {parameterIndexWise[0]?.value === "ow-store-verify" && (
                        <th>
                          Total Verified Shops : {cumulative.store_verify}
                        </th>
                      )}
                      {parameterIndexWise[0]?.value === "mdo-store-created" && (
                        <th>
                          Total Created Shops : {cumulative.store_created}
                        </th>
                      )}
                    </tr>
                    {parameterIndexWise[0]?.value ===
                      "mdo-visited-area-reports" && (
                      <>
                        <tr>
                          <th>Total Shop : {cumulative.total_shop}</th>
                          <th>
                            Total Visited Shop : {cumulative.visited_shop}
                          </th>
                          <th>
                            Total Order Amount : {cumulative.visited_shop}
                          </th>
                          <th>
                            Total Order Delivery Amount :{" "}
                            {cumulative.visited_shop}
                          </th>
                        </tr>
                      </>
                    )}
                    {parameterIndexWise[0]?.value !== "ow-order-reports" &&
                      parameterIndexWise[0]?.value !== "ow-store-verify" &&
                      parameterIndexWise[0]?.value !== "mdo-order-reports" &&
                      parameterIndexWise[0]?.value !== "mdo-store-created" &&
                      parameterIndexWise[0]?.value !==
                        "ow-yesrerday-delivered-amount" &&
                      parameterIndexWise[0]?.value !==
                        "team-orderwala-yesterday-delivered-report" &&
                      parameterIndexWise[0]?.value !==
                        "mdo-visited-area-reports" &&
                      parameterIndexWise[0]?.value !== "mdo-visited-shop" && (
                        <>
                          <tr>
                            <th>
                              Total Memo Delivery : {cumulative.delivery_memo}
                            </th>
                            <th>
                              Total Delivery Amount :{" "}
                              {cumulative.delivery_amount}
                            </th>
                            <th colSpan={2}>
                              Total Due Amount : {cumulative.due_amount}
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={3}>
                              Total Undelivered Order Amount :{" "}
                              {cumulative.undelivered_amount}
                            </th>
                          </tr>
                        </>
                      )}
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="am-pagebody p-2">
            <Alert alert={alert} />

            <div className="card pd-sm-40">
              <div className="row">
                <ReactDataTable
                  cols={cols}
                  isLoading={loading}
                  receiveData={receiveData}
                  actionTemplate={(rowData) =>
                    actionTemplate(rowData, parameterIndexWise)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, parameterIndexWise) => {
  // Define the mapping of userType transitions
  const userTypeTransitions = {
    // hmo: "cdm",
    cdm: "mdm",
    mdm: "mdc",
    mdc: "mdo",
  };
  const userTypeParameterTransitions = {
    // first: "hmo_id",
    // hmo_id: "cdm_id",
    first: "cdm_id",
    cdm_id: "mdm_id",
    mdm_id: "mdc_id",
    mdc_id: "mdo_id",
  };

  // Get the current userType from parameterIndexWise
  const currentUserType = parameterIndexWise[1]["value"] || "cdm"; // Default to 'cdm' if not found
  const nextUserType = userTypeTransitions[currentUserType] || "mdo"; // Fallback to 'mdo' if no transition
  const currentUserTypeParameter =
    parameterIndexWise.length > 3
      ? parameterIndexWise[3]["key"] || "first"
      : "first"; // Default to 'cdm' if not found
  console.log("teee", currentUserTypeParameter);
  const nextUserTypeParameter =
    userTypeParameterTransitions[currentUserTypeParameter] || "mdm_id"; // Fallback to 'mdo' if no transition
  if (currentUserType == "mdo") return "";
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{
          pathname: "/reports/field",
          search: `?type=${parameterIndexWise[0]["value"]}&userType=${nextUserType}&team=${parameterIndexWise[2]["value"]}&${nextUserTypeParameter}=${rowData.id}`,
        }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
    </div>
  );
};

export default List;
