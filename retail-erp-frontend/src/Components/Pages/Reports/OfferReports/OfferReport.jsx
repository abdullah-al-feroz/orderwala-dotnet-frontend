import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import Select from "react-select";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
//New Data table Code Start
import ReactDataTable from "../../../Common/ReactDataTable";
import { usePaginationState } from "../../../Common/Pagination/AdvancedPagination";

//New Data table Code End

const OnePercentOfferReport = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [discountOffer, setDiscountOffer] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [total_pages, setTotalPages] = useState(1);
  // const [current_page, setCurrentPage] = useState(1);

  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    2
  )
    .toISOString()
    .substr(0, 10);
  console.log(firstDayOfMonth);

  const [inputs, setInputs] = useState({
    from: firstDayOfMonth,
    to: new Date().toISOString().substr(0, 10),
    status: "active",
    search: "",
    // per_page: 5, // Default items per page
    // page: 1, // Default current page
  });

  const cols = [
    { field: "customer.shop_name", header: "Retailer Name" },
    { field: "customer.phone", header: "Phone" },
    { field: "customer.address", header: "Address" },
    {
      field: "total_price_without_discount",
      header: "Actual Order Amount Without Offer",
    },
    { field: "total_price", header: "Order Amount" },
    { field: "discount", header: "Offer Amount" },
    { field: "date", header: "Date" },
    { field: "time", header: "Time" },
    { field: "distributor.name", header: "Distributor" },
    { field: "distributor.code", header: "Distributor Id" },
    { field: "base.name", header: "Base" },
    { field: "area.name", header: "Area" },
    { field: "region.name", header: "Region" },
    { field: "zone.name", header: "Zone" },
    {
      header: "Offer Amount Breakdown",
      field: "offer_amounts_text",
      sortable: false,
      body: (row) => {
        const offers = row.offer_amounts ? Object.entries(row.offer_amounts) : [];
        if (!offers.length) return "";
        return (
          <ol style={{ paddingLeft: "20px", margin: 0 }}>
            {offers.map(([name, amount], idx) => (
              <li key={idx}>{`${name}: ${amount}`}</li>
            ))}
          </ol>
        );
      },
      accessor: (item) => {
        const offers = item.offer_amounts ? Object.entries(item.offer_amounts) : [];
        return offers.map(([name, amount]) => `${name}: ${amount}`).join(" || ");
      },
    },
  ];

  const fetchAllOfferDataForExport = async () => {
    try {
      const perPage = 200;
      let page = 1;
      const allData = [];
      let total = 0;
      while (true) {
        const submissionInputs = {
          ...inputs,
          page,
          per_page: perPage,
          search: inputs.search || "",
        };
        const res = await Http.post("/offer-report", submissionInputs);
        const chunk = res.data.data || [];
        const meta = res.data;
        if (page === 1) {
          total = meta.total || chunk.length;
        }
        if (!chunk.length) {
          break;
        }
        allData.push(...chunk);
        if (allData.length >= total) {
          break;
        }
        page += 1;
      }
      return allData;
    } catch (error) {
      console.error("Error fetching all offer data for export:", error);
      return [];
    }
  };

  const {
      pagination,
      setPagination,
      AdvancePagination,
      handleExportCSV,
      handleSearch, // This handleSearch will not be used directly for POST requests
      searchTemplate
    } = usePaginationState(50, `/offer-report`, cols, `/offer-report`, fetchAllOfferDataForExport, true); // Placeholder URLs, actual fetching in formSubmit
  

  //Date range end

  const fetchDiscountOffers = async () => {
    try {
      setLoading(true); // Start loading indicator
      const tradeOfferList = await Http.get("/discount-trade-offer-list");
      setDiscountOffer(tradeOfferList.data);
    } catch (error) {
      console.error("Error submitting form:", error); // Log errors
      // Optionally handle errors (e.g., show a toast or alert)
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchDiscountOffers();
    formSubmit(pagination.current_page, pagination.per_page); // Initial data load
  }, []);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  //Date range start
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = async (page = pagination.current_page, customLimit = pagination.per_page, searchTerm = '') => {
    try {
      setLoading(true); // Start loading indicator

      const submissionInputs = {
        ...inputs,
        page: page,
        per_page: customLimit,
        search: searchTerm, // Add search term to submission inputs
      };

      const res = await Http.post("/offer-report", submissionInputs); // Await the HTTP request
      setReceiveData(res.data.data);
// const res = await Http.get("/offer-report", { params: submissionInputs }); // Changed to GET with params      setReceiveData(res.data.data); // Set the received data
      const { data, current_page, per_page, total } = res.data;
      setPagination({ current_page, per_page, total });
    } catch (error) {
      console.error("Error submitting form:", error); // Log errors
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSearchChange = async (e) => {
    setLoading(true);
    const value = e.target.value;
    setInputs((values) => ({ ...values, search: value.trim() }));
    if (value.trim() === "") {
      formSubmit(1, pagination.per_page, ''); // Reset search
      return;
    }
    formSubmit(1, pagination.per_page, value); // Perform search
  };

  // const handlePageChange = (newPage) => {
  //   setInputs((values) => ({ ...values, page: newPage }));
  //   formSubmit(); // Re-fetch data for the new page
  // };

  //Date range end
  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">One Percent Offer Report</h5>
            {/* <Link to="/create-distributors" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link> */}
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            {/* Date range start */}
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Offer</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={discountOffer[0]}
                    name="offer_id"
                    options={discountOffer}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">From</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">To</label>
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    value={inputs.to || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* <div className="col-lg">
                  <select
                    className="form-control"
                    name="offer_id"
                    onChange={handleChange}
                  >
                    <option value="">Select Offer</option>
                    <option value="1">স্বাগত অফার</option>
                    <option value="36">ওয়ান পার্সেন্ট অফার</option>
                    <option value="77">৭০০ টাকায় ৫ পার্সেন্ট অফার </option>
                    <option value="78">২০০০ টাকায় ৫ পার্সেন্ট অফার </option>
                    <option value="80">
                      ১০০০ টাকার বেশি কেনাকাটায় ৩% ছাড়
                    </option>
                    <option value="81">
                      ১২৫০ টাকার বেশি কেনাকাটায় ৪% ছাড়
                    </option>
                  </select>
                </div> */}
                <div className="col-lg">
                  <button
                    className="btn btn-primary btn-block mg-b-10 mt-4"
                    onClick={() => formSubmit(1, pagination.per_page)}
                  >
                    <i className="fa fa-send mg-r-10"></i> Search
                  </button>
                </div>
              </div>
            </div>
            {/* Date range end */}

            <div className="card">
              {searchTemplate(handleSearchChange)}
              <ReactDataTable
                cols={cols}
                isLoading={loading}
                receiveData={receiveData}
                exportCsvOrPdf={false}
                totalNumber={pagination.total}
              />
              {/* Pagination controls */}
              {/* <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-outline-primary mr-2"
                  onClick={() => handlePageChange(current_page - 1)}
                  disabled={current_page === 1}
                >
                  Previous
                </button>
                <span className="align-self-center">
                  Page {current_page} of {total_pages}
                </span>
                <button
                  className="btn btn-outline-primary ml-2"
                  onClick={() => handlePageChange(current_page + 1)}
                  disabled={current_page === total_pages}
                >
                  Next
                </button>
              </div> */}
              <AdvancePagination
                onPageChange={(page) => formSubmit(page, pagination.per_page)}
                onLimitChange={(newLimit) => formSubmit(1, newLimit)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnePercentOfferReport;
