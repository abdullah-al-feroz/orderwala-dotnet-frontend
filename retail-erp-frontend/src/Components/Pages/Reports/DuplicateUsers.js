import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import { LoaderComponent } from "../../Common/LoaderComponent";
import ReactDataTable from "../../Common/ReactDataTable";
import Swal from "sweetalert2";

const DuplicateUsers = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [factory, setFactory] = useState([]);
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [random, setRandom] = useState();

  const fetchData = async () => {
    setLoading(true);
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const ordersResponse = await Http.get(
        `/report/get-duplicate-customer-list`
      );
      setReceiveData(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, [random]);

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      start_date: submissionInputs.start_date,
      end_date: submissionInputs.end_date,
      // type: submissionInputs.type,
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
      const ordersResponse = await Http.get(
        `/report/get-duplicate-customer-list?${queryParams.toString()}`
      );
      setReceiveData(ordersResponse.data);
      setRandom(Math.random());
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };
  // function depoStock(factory_name, list) {
  //   let factory_name_lower = factory_name.toLowerCase().replace(/\s+/g, "_");

  //   return list[factory_name_lower] || "0";
  // }

  const handleEdit = async (rowData) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to inactive this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, inactive it!",
    });
    if (result.isConfirmed) {
      await Http.get(`/inactive-duplicate-customer/${rowData.id}`).then(
        (res) => {
          console.log(res);
        }
      );
      formSubmit(inputs);

      Swal.fire({
        title: "Inactive!",
        text: "User has been inactivated.",
        icon: "success",
      });
    }
  };

  const cols = [
    { field: "shop_name", header: "Name" },
    {
      field: (rowData) => (
        <>{rowData.available_for_mdo ? "Team Orderwala" : "Retailer"}</>
      ),
      header: "Type",
    },
    { field: "phone", header: "Phone" },
    { field: "total_order_amount", header: "Total Order" },
    { field: "last_order_date", header: "Last Order Date" },
    { field: "last_delivery_date", header: "Last Delivery Date" },
    { field: "undelivered_amount", header: "Total Undelivered Amount" },

    {
      field: (rowData) => {
        if (rowData.status === "active") {
          return (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleEdit(rowData)}
            >
              <i className="fa fa-link"></i>
            </button>
          );
        }
      },
      header: "Action",
    },
  ];

  factory.forEach((item, index) => {
    cols.push({
      field: (rowData) =>
        rowData[item.name.toLowerCase().replace(/\s+/g, "_")] || "0",
      header: item.name,
    });
  });

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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel" style={{ marginTop: "50px" }}>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
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
            <div className="card pd-20 pd-sm-40">
              <div className="card">
                <ReactDataTable cols={cols} receiveData={receiveData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateUsers;
