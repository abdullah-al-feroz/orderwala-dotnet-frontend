import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";

import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({ status: "active" });
  const [isLoading, setIsLoading] = useState(true);
  const [outSideCompany, setOutSideCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const fetchData = () => {
  //   Http.get("/product?status=" + inputs.status).then((res) => {
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

      const productResponse = await Http.get(
        "/product?status=" + inputs.status
      );
      setReceiveData(productResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Ensure loading is false after fetch
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, [inputs.status]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const showAlert = (message, status) => {
    setAlert({
      message: message,
      status: status,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.status);
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

  const formSubmit = () => {
    Http.get("/product?status=" + inputs.status).then((res) => {
      setReceiveData(res.data);
    });
  };

  const cols = [
    // { field: "serialNumber", header: "S/N" },
    { field: "code", header: "Code" },
    { field: "name_en", header: "Name" },
    { field: "name", header: "Name (Bangla)" },
    { field: "unit.name", header: "Unit" },
    { field: "brand.name", header: "Brand" },
    { field: "category.name", header: "Category" },
    ...(outSideCompany?.data?.user_type !== "other-company"
      ? [
          {
            field: "company.name",
            header: "Company",
          },
        ]
      : []),
    // { field: "thumb_image", header: "Thumb Image" },
    // { field: "product_image", header: "Product Image" },
    { field: "primary_price", header: "Primary Price (DP)" },
    { field: "secondary_price", header: "Secondary Price (TP)" },
    { field: "mrp", header: "MRP Price (MRP)" },
    { field: "commission_rate", header: "Commission Rate" },
    { field: "status", header: "Status" },
    // { field: "action", header: "Action" },
  ];

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.thumb_image} // Assuming thumbImage is the URL of the image
        alt={rowData.name} // Assuming name is the name of the product
        style={{ width: "50px", height: "50px" }} // Adjust width and height as needed
      />
    );
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All product</h5>
            <Link to="/create-product" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> New
            </Link>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <div className="row">
                    <div className="col-lg">
                      <select
                        className="form-control"
                        name="status"
                        value={inputs.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">InActive</option>
                      </select>
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
                </div>
              </div>
            </div>
          </div>
          <div className="am-pagebody">
            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
                imageBodyTemplate={imageBodyTemplate}
                actionTemplate={actionTemplate}
                deleteData={deleteData}
              />
              {/* <Column <Tag className="mr-2" icon="pi pi-user" value="Active"></Tag> /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const actionTemplate = (rowData, deleteData) => {
  return (
    <div className="text-xs text-nowrap">
      <Link
        to={{
          pathname: "/edit-product/" + rowData.id,
          state: { id: rowData.id },
        }}
        className="btn btn-primary btn-sm"
        title="Edit"
      >
        <i className="fa fa-pencil" aria-hidden="true"></i>
      </Link>
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => deleteData(rowData.id, "product", "product")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button>
    </div>
  );
};

export default List;
