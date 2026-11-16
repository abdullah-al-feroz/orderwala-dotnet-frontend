import React, { useEffect, useState } from "react";
import Select from "react-select";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import ReactDataTable from "../../Common/ReactDataTable";

const CategoryWisePercentage = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [discountOffer, setDiscountOffer] = useState([]);
  // Get the first and last dates of the current month
  const { firstDay, lastDay } = getCurrentMonthDateRange();

  const [inputs, setInputs] = useState({
    start_date: firstDay,
    end_date: lastDay,
  });

  function getCurrentMonthDateRange() {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();

    // First day of the current month
    const firstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;

    // Last day of the current month
     const today = dateObj.getDate();
     const lastDay = `${year}-${String(month+1).padStart(2,'0')}-${String(today).padStart(2,'0')}`;

    return { firstDay, lastDay };
  }

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const tradeOfferList = await Http.get("/category-wise-offer-list");
      setDiscountOffer(tradeOfferList.data);

      const ordersResponse = await Http.get("/report/category-wise-percentage-offer");
      setReceiveData(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (name == "work_place_zone_id") {
      Http.get(
        "/select2/Hr.WorkPlaceRegion/id,name/work_place_zone_id:" + value
      ).then((res) => {
        setRegion(res.data);
      });
    }
    if (name === "work_place_region_id") {
      Http.get(
        "/select2/Hr.WorkPlaceArea/id,name/work_place_region_id:" + value
      ).then((res) => {
        setArea(res.data);
      });
    }
    if (name === "work_place_area_id") {
      Http.get(
        "/select2/Hr.WorkPlaceBase/id,name/work_place_area_id:" + value
      ).then((res) => {
        setBase(res.data);
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Ensure the selected date falls within the current month range
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  console.log(inputs, "inputs");

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };
    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
    });

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
    if (submissionInputs.offer_id) {
      queryParams.append("offer_id", submissionInputs.offer_id);
    }

    try {
      const response = await Http.get(
        `/report/category-wise-percentage-offer?${queryParams.toString()}`
      );
      console.log(response.data, "response.data");
      setReceiveData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const cols = [
    { header: "Zone", field: (row) => row?.zone },
    { header: "Region", field: (row) => row?.region },
    { header: "Area", field: (row) => row?.area },
    { header: "Base", field: (row) => row?.base },
    { header: "Category Name", field: (row) => row?.category_name },
    { header: "Orderwla Order Amount", field: (row) => row?.orderwala_order_amount },
    { header: "Team Orderwala Order Amount", field: (row) => row?.team_orderwala_order_amount },
    { header: "Order Amount", field: (row) => row?.total_order_amount },
    { header: "Orderwla Delivery Amount", field: (row) => row?.orderwala_delivery_amount },
    { header: "Team Delivery Amount", field: (row) => row?.team_orderwala_delivery_amount	 },
    { header: "Order Delivery Amount", field: (row) => row?.total_delivery_amount	 },
  ];

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Category wise percentage offer report</h5>
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
                    styles={{
                      select__menu: (provided) => ({
                        ...provided,
                        zIndex: 9999999999999,
                      }),
                    }}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Select Area</label>
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
                  <label htmlFor="">Select Base</label>
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
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryWisePercentage;
