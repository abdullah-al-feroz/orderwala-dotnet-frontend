import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";

import ReactDataTable from "../../../Common/ReactDataTable";
import { Dialog } from "primereact/dialog";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [outSideCompany, setOutSideCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [locationInput, setLocationInput] = useState({ lat: "", lng: "" });
  const [errors, setErrors] = useState({});
  const [selectedImageField, setSelectedImageField] = useState('');
  // const fetchData = () => {
  //   Http.get("/distributor").then((res) => {
  //     setReceiveData(res.data);
  //   });
  //   Http.get("/me").then((res) => {
  //     setOutSideCompany(res.data);
  //   });
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const userResponse = await Http.get("/me");
      setOutSideCompany(userResponse.data);

      const distributorResponse = await Http.get(`/distributor?imageField=${selectedImageField}`);
      setReceiveData(distributorResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Ensure loading is false after fetch
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, [selectedImageField]);

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

  const formSubmit = async (id) => {
    if (!id) return;

    try {
      const response = await Http.post(`/distributor/${id}/update-location`, {
        lat: locationInput.lat,
        lng: locationInput.lng,
      });

      // Success handling
      Swal.fire("Success", "Location updated successfully", "success");
      setVisible(false);
      setSelectedRow(null);
      setLocationInput({ lat: "", lng: "" });
      fetchData(); // Refresh list
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update location", "error");
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const errorMsg = Object.values(validationErrors).flat().join("\n");
        setErrors(error.response.data.errors); // <-- for inline display
        Swal.fire("Validation Error", errorMsg, "warning");
      } else {
        Swal.fire("Error", "Something went wrong. Try again later.", "error");
      }
    }
  };

  const cols = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },

    { field: "email", header: "Email" },
    ...(outSideCompany?.data?.user_type !== "other-company"
      ? [
        {
          header: "Detail",
          field: (rowData) => {
            return (
              <Link
                to={`/distributor-details/${rowData.id}`}
                className="btn btn-info btn-sm mx-1"
                title="View"
              >
                <i className="fa fa-list" aria-hidden="true"></i>
              </Link>
            );
          },
        },
        { field: "locationFound", header: "Location" },
        { field: "factory.name", header: "Depot" },
        { field: "usersMDO", header: "MDO" },
        { field: "usersDSR", header: "DSR" },
        { field: "usersAM", header: "AM" },
        { field: "usersRSM", header: "RSM" },
        { field: "baseNames", header: "Base" },
        { field: "areaNames", header: "Area" },
        { field: "regionNames", header: "Region" },
        { field: "business_type", header: "Type" },
      ]
      : []),

    { field: "balance", header: "Balance" },
    { field: "status", header: "Status" },
  ];

  const imgArray = [
    {
      label: "profile img",
      id: 'profile_img',
    },
    {
      label: "base taken from",
      id: 'base_taken_from',
    },
    {
      label: "no transaction from",
      id: 'no_transaction_from',
    },
    {
      label: "opening form img",
      id: 'openingform_img',
    },
    {
      label: "agreement img",
      id: 'agreement_img',
    },
    {
      label: "vat registration img",
      id: 'vat_reg_img',
    },
    {
      label: "tin img",
      id: 'tin_img',
    },
    {
      label: "nid img",
      id: 'nid_img',
    },
  ]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedImageField(value);
  };
  const mappedData = receiveData.map((item) => {
    const baseNames = item.sr_base_info
      .map((info) => info.base?.name)
      .join(" , ");
    const areaNames = item.distributor_workplace
      .map((info) => info.area?.name)
      .join(" , ");
    const regionNames = item.distributor_workplace
      .map((info) => info.region?.name)
      .join(" , ");

    // Initialize usersByType
    const usersByType = {
      so: [],
      dsr: [],
      am: [],
      rsm: [],
    };

    item.sr_base_info.forEach((info) => {
      if (info.base && info.base.users) {
        info.base.users.forEach((user) => {
          // Ensure user_type exists before pushing
          if (user.user_type && usersByType[user.user_type]) {
            usersByType[user.user_type].push(`${user.name}`);
          }
        });
      }
    });

    // Create separate fields for each user type
    const usersMDO = usersByType["so"].join(" ||  ");
    const usersDSR = usersByType["dsr"].join(" || ");
    const usersAM = usersByType["am"].join(" || ");
    const usersRSM = usersByType["rsm"].join(" || ");

    return {
      ...item,
      baseNames,
      areaNames,
      regionNames,
      usersMDO,
      usersDSR,
      usersAM,
      usersRSM,
    };
  });

  return (
    <div>
      <IsLogin></IsLogin>
      {/* <LoaderComponent /> */}
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Distributors</h5>
            <Link to="/create-distributors" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>
          <div className="am-pagebody">
          <div className="card">
            <label>
             Distributor Without Image <i className="fa fa-star required"></i>
            </label>
            <select
              className="form-control"
              name="image_field"
              onChange={handleChange}
            >
              <option value="">Select Image Field</option>
              {Array.from(imgArray).map((item, index) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card">

              <ReactDataTable
                cols={cols}
                receiveData={mappedData}
                // imageBodyTemplate={imageBodyTemplate}
                // actionTemplate={actionTemplate}
                actionTemplate={(rowData) => actionTemplate(rowData, deleteData, null, outSideCompany, () => {
                  setSelectedRow(rowData);
                  setLocationInput({
                    lat: rowData.lat || "",
                    lng: rowData.lng || "",
                  });
                  setVisible(true);
                })}
                // detailOnName={detailOnName}
                deleteData={deleteData}
                onAddClick={() => setVisible(true)}
                // statusChange={statusChange}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        header="Location Change"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
          setVisible(false);
          setSelectedRow(null);
          setLocationInput({ lat: "", lng: "" }); // Clear input on close
        }}
      >
        <div className="form-group">
          <label htmlFor="lat">Lat</label>
          <input
            type="text"
            name="lat"
            className="form-control"
            value={locationInput.lat}
            onChange={(e) =>
              setLocationInput({ ...locationInput, lat: e.target.value })
            }
          />
          {errors.lat && <small className="text-danger">{errors.lat[0]}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="lng">Lng</label>
          <input
            type="text"
            name="lng"
            className="form-control"
            value={locationInput.lng}
            onChange={(e) =>
              setLocationInput({ ...locationInput, lng: e.target.value })
            }
          />
          {errors.lng && <small className="text-danger">{errors.lng[0]}</small>}
        </div>

        <div className="form-group mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => formSubmit(selectedRow?.id)}
          >
            Submit
          </button>
        </div>
      </Dialog>

    </div >
  );
};

const actionTemplate = (rowData, deleteData, statusChange, outSideCompany, onAddClick) => {
  return (
    <div className="text-xs text-nowrap">
      {/* <Link
        to={{
          pathname: "/edit-shop/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link> */}
      <Link
        to={{
          pathname: "/edit-distributors/" + rowData.id,
        }}
        className="btn btn-primary btn-sm ml-1"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      {/* <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "distributors", "distributors")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button> */}
      <Link
        to={{ pathname: "/distributor-details/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-list" aria-hidden="true"></i>
      </Link>
      <Link
        to={{ pathname: "/distributor-doc-details/" + rowData.id }}
        className="btn btn-info btn-sm mx-1"
        title="View"
      >
        <i className="fa fa-eye" aria-hidden="true"></i>
      </Link>
      {outSideCompany?.data?.user_type !== "other-company" && (
        <Link
          to={{
            pathname: "/create-place-plan/" + rowData.id,
          }}
          className="btn btn-success btn-sm mr-1"
        >
          <i class="fa fa-map" aria-hidden="true"></i>

        </Link>
      )}
      {/* <button
        className="btn btn-primary btn-sm ms-1"
        onClick={() => statusChange(rowData.id, "shop-status", "shop")}
        title="Active Inactive"
      >
        <i className="fa fa-link"></i>
      </button> */}
      <button className="btn btn-primary btn-sm" onClick={onAddClick}> <i className="fa fa-map-marker" aria-hidden="true"></i></button>
    </div>
  );
};
// const detailOnName = (rowData) => {
//   return (
//     <div className="text-xs text-nowrap">

//       <Link
//         to={{
//           pathname: "/distributor-details/" + rowData.id,
//         }}
//         title="Distributor Details"
//       >
//         {rowData.name}
//       </Link>
//     </div>
//   );
// };

export default List;
