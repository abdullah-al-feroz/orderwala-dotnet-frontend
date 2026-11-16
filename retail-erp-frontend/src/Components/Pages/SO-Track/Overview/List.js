import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import ReactDataTable from "../../../Common/ReactDataTable";
import Select from "react-select";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [zone, setZone] = useState([]);
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);

  const [inputs, setInputs] = useState({
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
    status: "active",
  });

  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const zone = await Http.get("/select2/Hr.WorkPlaceZone/id,name");
      setZone(zone.data);

      const region = await Http.get("/select2/Hr.WorkPlaceRegion/id,name");
      setRegion(region.data);

      const ordersResponse = await Http.post("/so-track/mdo-overview");
      setReceiveData(ordersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
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
    { field: "card_no", header: "Card No. " },
    { field: "name", header: "Name " },
    { field: "mobile", header: "Phone " },
    { field: "designation.name", header: "Designation " },
    { field: "base_name", header: "Base " },
    { field: "region_name", header: "Region " },
    { field: "area_name", header: "Area " },
    { field: "attendances", header: "Attendance At " },
    { field: "route_name", header: "Route " },
    { field: "store_checkin_count", header: "Visited Store " },
    { field: "mdo_store_count", header: "MDO Created Stores " },
    { field: "store_count", header: "Total Store " },
    { field: "last_store_checkin_name", header: "Last Checked In Store " },
    { field: "order_ims_count", header: "Invoice No. " },
    { field: "order_ims_total_price", header: "Total Order " },
  ];

  const mappedData = receiveData.map((item) => {
    const attendances = item.attendances
      .map((attendance) => {
        const formattedDate = new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date(attendance.created_at));

        return {
          ...attendance,
          attendance_at: formattedDate,
        };
      })
      .map((attendance) => attendance.attendance_at)
      .join(" || ");

    return {
      ...item,
      attendances,
    };
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
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

  const formSubmit = async () => {
    setIsLoading(true); // Start loading when submitting the form
    Http.post("/so-track/mdo-overview", inputs)
      .then((res) => {
        setReceiveData(res.data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  return (
    <div>
      <IsLogin />
      {/* {isLoading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2 style={{ marginTop: "20%", marginLeft: "100px" }}>
            All Active Mdo Data is Loading, please wait 1 or 2 Minute to show
            full data...
          </h2>
        </div>
      ) : ( */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">SO Track Overview</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

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
                <div className="col-lg">
                  <label for="">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    value={inputs.from || ""}
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

            <div className="card">
              <ReactDataTable
                cols={cols}
                isLoading={loading}
                receiveData={mappedData}
                _actionTemplate={actionTemplate}
                deleteData={deleteData}
              />
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

const actionTemplate = (rowData, deleteData, statusChange) => {
  return (
    <div className="text-xs text-nowrap">
      {/* Add action buttons here if needed */}
    </div>
  );
};

export default List;
