import React, { useEffect, useState } from "react";
import Http from "../../../Common/Http";
import ReactDataTable from "../../../Common/ReactDataTable";
import IsLogin from "../../../Common/IsLogin";
import Select from "react-select";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);

  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);

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
    const lastDay = `${year}-${String(month + 1).padStart(2, "0")}-${new Date(
      year,
      month + 1,
      0
    ).getDate()}`;

    return { firstDay, lastDay };
  }

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const staffInfo = await Http.get(
        // "/select2/Hr.HrStaffBasicInfo/id,name/status:active"
        "/staff-with-types"
      );
      setStaff(staffInfo.data);

      // const staff = staffInfo.data.map((item) => ({
      //   value: item.id,
      //   label: item.name,
      // }));

      const ordersResponse = await Http.get("/moo/sku-wise-item-summary");
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
    if (
      new Date(value) >= new Date(firstDay) &&
      new Date(value) <= new Date(lastDay)
    ) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    } else {
      console.error("Selected date is out of range for the current month.");
    }
  };

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
      type: submissionInputs.type,
      staff_id: inputs.staff_id,
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

    try {
      const response = await Http.get(
        `/moo/sku-wise-item-summary?${queryParams.toString()}`
      );
      setReceiveData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const cols = [
    { field: "product_name", header: "Product Name" },
    { field: "total_ims_quantity", header: "Order Quantity" },
    { field: "total_target_quantity", header: "Monthly Target Quantity" },
    // { field: "achivement_percentage", header: "Achievement (%)" },
  ];

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Staff Wise Target Vs Achievement</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Staff</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={staff[0]}
                    name="staff_id"
                    options={staff}
                    onChange={selectHandleChange}
                  />
                </div>

                <div className="col-lg">
                  <label htmlFor="">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    min={firstDay}
                    max={lastDay}
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
                    min={firstDay}
                    max={lastDay}
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

export default List;
