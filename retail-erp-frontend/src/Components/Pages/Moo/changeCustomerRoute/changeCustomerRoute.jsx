import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Http from "../../../Common/Http";
import ReactDataTable from "../../../Common/ReactDataTable";
import DatatableFunc from "../../../Common/DatatableFunc";
import LoaderComponent from "../../../Common/LoaderComponent";
import IsLogin from "../../../Common/IsLogin";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

const ChangeCustomerRoute = () => {
  const location = useLocation();
  const dt = useRef(null);
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [factory, setFactory] = useState([]);
  const [zone, setZone] = useState([]);
  const [zoneDataForModal, setZoneDataForModal] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [modalInputs, setModalInputs] = useState([]);
  const [random, setRandom] = useState();
  const [route, setRoute] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Pagination and Search states
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
    filters: {
      global: { value: null, matchMode: 'contains' }
    }
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);
      setZoneDataForModal(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);
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
    const queryParams = new URLSearchParams();

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
    if (Number.isInteger(submissionInputs.work_place_route_id)) {
      queryParams.append("route", submissionInputs.work_place_route_id);
    }

    // Add pagination and search parameters
    queryParams.append("page", lazyParams.page);
    queryParams.append("per_page", lazyParams.rows);
    if (lazyParams.filters.global.value) {
      queryParams.append("search", lazyParams.filters.global.value);
    }

    try {
      const ordersResponse = await Http.get(
        `/app/get-customer-list?${queryParams.toString()}`
      );
      
      // Assuming the backend returns { data: [], total: number }
      setReceiveData(ordersResponse.data || []);
      setTotalRecords(ordersResponse.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  // Handle lazy loading state changes (pagination, filtering)
  const onPage = (event) => {
    setLazyParams(event);
  };

  // Handle global search
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    
    setLazyParams((prevState) => ({
      ...prevState,
      filters: {
        global: { value, matchMode: 'contains' }
      },
      page: 1,
      first: 0
    }));
  };

  // Effect to reload data when lazy params change
  useEffect(() => {
    formSubmit();
  }, [lazyParams]);

  const getCurrentPageData = () => {
    const start = lazyParams.first;
    const end = start + lazyParams.rows;
    return receiveData.slice(start, end);
  };

  // Table header with search
  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="m-0">Customers</h5>
      <span className="p-input-icon-left">
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </span>
    </div>
    );
  };

  const ModalFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submissionInputs = { ...modalInputs };

    try {
      const ordersResponse = await Http.post(
        `/app/update-customer-route/${customerData.id}`,
        submissionInputs
      );
      console.log(ordersResponse, "ordersResponse");
      if (ordersResponse.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Route Changed Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        formSubmit();
        setVisible(false);
        setLoading(false);
      } else {
        Swal.fire({
          title: "Error",
          text: "Route Change Failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const showModalFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submissionInputs = { ...modalInputs };

    try {
      const ordersResponse = await Http.post(`/app/update-customer-route`, {
        customer_ids: selectedCustomers,
        ...submissionInputs,
      });
      console.log(ordersResponse, "ordersResponse");
      if (ordersResponse.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Route Changed Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        formSubmit();
        setShowModal(false);
        setLoading(false);
      } else {
        Swal.fire({
          title: "Error",
          text: "Route Change Failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const handleEdit = async (rowData) => {
    setCustomerData(rowData);
    setVisible(true);
  };

  const cols = [
    { field: "owner_name", header: "Name" },
    { field: "shop_name", header: "Shop Name" },
    {
      field: (rowData) => (
        <>{rowData.available_for_mdo ? "Team Orderwala" : "Retailer"}</>
      ),
      header: "Type",
    },
    { field: "phone", header: "Phone" },

    {
      field: (rowData) => {
        if (rowData.status === "active") {
          return (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleEdit(rowData)}
            >
              <i className="fa fa-edit"></i>
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
    if (name === "work_place_base_id") {
      Http.get(
        `/select2/Hr.WorkPlaceRoute/id,name/work_place_base_id:` + value
      ).then((res) => {
        console.log(res.data);
        setRoute(res.data);
      });
    }
  };

  const selectHandleChangeModal = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setModalInputs((values) => ({ ...values, [name]: value }));

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
    if (name === "work_place_base_id") {
      Http.get(
        `/select2/Hr.WorkPlaceRoute/id,name/work_place_base_id:` + value
      ).then((res) => {
        console.log(res.data);
        setRoute(res.data);
      });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Change Customer Route</h5>
        </div>
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
              <div className="col-lg">
                <label htmlFor="">Select Route</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={base[0]}
                  name="work_place_route_id"
                  options={route}
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
              {selectedCustomers.length > 0 && (
                <button
                  className="btn btn-primary btn-sm mb-3"
                  style={{ width: "40px" }}
                  onClick={() => setShowModal(true)}
                >
                  <i className="fa fa-send mg-r-10"></i>
                </button>
              )}
              <DataTable
                ref={dt}
                value={getCurrentPageData()}
                lazy
                dataKey="id"
                paginator
                rows={lazyParams.rows}
                rowsPerPageOptions={[5, 10, 25, 50]}
                totalRecords={totalRecords}
                first={lazyParams.first}
                onPage={onPage}
                loading={loading}
                header={renderHeader()}
                filters={lazyParams.filters}
                globalFilterFields={['owner_name', 'shop_name', 'phone', 'address', 'nid_no']}
                emptyMessage="No customers found."
                className="p-datatable-customers"
                selection={selectedCustomers}
                onSelectionChange={(e) => setSelectedCustomers(e.value)}
                selectionMode="checkbox"
              >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="owner_name" header="Name" sortable />
                <Column field="shop_name" header="Shop Name" sortable />
                <Column
                  field="type"
                  header="Type"
                  body={(rowData) =>
                    rowData.available_for_mdo ? "Team Orderwala" : "Retailer"
                  }
                  sortable
                />
                <Column field="phone" header="Phone" sortable />
                <Column field="address" header="Address" sortable />
                <Column field="nid_no" header="NID No" sortable />
                <Column field="verified_date" header="Verified Date" sortable />
                <Column field="division.name" header="Division" sortable />
                <Column field="district.name" header="District" sortable />
                <Column field="thana.name" header="Thana" sortable />
                <Column field="place.name" header="Place" sortable />
                <Column field="route.name" header="Route" sortable />
                <Column
                  header="Action"
                  body={(rowData) =>
                    rowData.status === "active" ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(rowData)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    ) : null
                  }
                />
              </DataTable>
            </div>
          </div>
        </div>

        <Dialog
          header="Change Customer Route"
          visible={visible}
          style={{ width: "80vw", height: "35vh" }}
          onHide={() => {
            if (!visible) return;
            setVisible(false);
          }}
        >
          <div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Zone</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={customerData?.route?.work_place_zone_id || ""}
                  name="work_place_zone_id"
                  options={zoneDataForModal}
                  onChange={selectHandleChangeModal}
                  styles={{
                    select__menu: (provided) => ({
                      ...provided,
                      zIndex: 9999999999999,
                    }),
                  }}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Region</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={customerData?.route?.work_place_region_id || ""}
                  name="work_place_region_id"
                  options={region}
                  onChange={selectHandleChangeModal}
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
                  defaultValue={customerData?.route?.work_place_area_id || ""}
                  name="work_place_area_id"
                  options={area}
                  onChange={selectHandleChangeModal}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Select Base</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_base_id"
                  defaultValue={customerData?.route?.work_place_base_id || ""}
                  options={base}
                  onChange={selectHandleChangeModal}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Select Route</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={customerData?.route?.work_place_route_id || ""}
                  name="work_place_route_id"
                  options={route}
                  onChange={selectHandleChangeModal}
                />
              </div>
              <div className="col-lg mt-4">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={ModalFormSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Change Route
                </button>
              </div>
            </div>{" "}
          </div>
        </Dialog>

        <Dialog
          header="Change Customer Route"
          visible={showModal}
          style={{ width: "80vw", height: "35vh" }}
          onHide={() => {
            if (!showModal) return;
            setShowModal(false);
          }}
        >
          <div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Zone</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={customerData?.route?.work_place_zone_id || ""}
                  name="work_place_zone_id"
                  options={zoneDataForModal}
                  onChange={selectHandleChangeModal}
                  styles={{
                    select__menu: (provided) => ({
                      ...provided,
                      zIndex: 9999999999999,
                    }),
                  }}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Region</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={customerData?.route?.work_place_region_id || ""}
                  name="work_place_region_id"
                  options={region}
                  onChange={selectHandleChangeModal}
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
                  defaultValue={customerData?.route?.work_place_area_id || ""}
                  name="work_place_area_id"
                  options={area}
                  onChange={selectHandleChangeModal}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">Select Base</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  name="work_place_base_id"
                  defaultValue={customerData?.route?.work_place_base_id || ""}
                  options={base}
                  onChange={selectHandleChangeModal}
                />
              </div>
              <div className="col-lg">
                <label htmlFor="">Select Route</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={customerData?.route?.work_place_route_id || ""}
                  name="work_place_route_id"
                  options={route}
                  onChange={selectHandleChangeModal}
                />
              </div>
              <div className="col-lg mt-4">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={showModalFormSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Change Route
                </button>
              </div>
            </div>{" "}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ChangeCustomerRoute;
