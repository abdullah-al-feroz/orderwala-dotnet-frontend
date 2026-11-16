import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";

import ReactDataTable from "../../../Common/ReactDataTable";

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [inputs, setInputs] = useState({ status: "active" });
  const [outSideCompany, setOutSideCompany] = useState([]);

  // const fetchData = () => {
  //   Http.get("/retailer-offer").then((res) => {
  //     setReceiveData(res.data);
  //   });

  //   Http.get("/me").then((res) => {
  //     setOutSideCompany(res.data);
  //   });
  // };

  const fetchData = async () => {
    try {
      const retailerOfferResponse = await Http.get("/retailer-offer");
      setReceiveData(retailerOfferResponse.data);

      const outsideCompanyResponse = await Http.get("/me");
      setOutSideCompany(outsideCompanyResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

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

  const cols = [
    ...(outSideCompany?.data?.user_type !== "other-company"
      ? [
        { field: "region.name", header: "Region" },
        { field: "area.name", header: "Area" },
        { field: "base.name", header: "Base" },
        { field: "route.name", header: "Route" },
      ]
      : []),
    { field: "distributor.name", header: "Distributor" },
    { field: "offer_type", header: "Offer Type" },
    { field: "title", header: "Title" },
    { field: "start_date", header: "Start Date" },
    { field: "end_date", header: "End Date" },
  ];

  const mappedData = receiveData.map((item) => ({
    ...item,
    region: item.region ? item.region : { name: "All" }, // Providing a default object with name as null if region doesn't exist
    area: item.area ? item.area : { name: "ALL" }, // Providing a default object with name as null if area doesn't exist
    base: item.base ? item.base : { name: "ALL" }, // Providing a default object with name as null if base doesn't exist
    route: item.route ? item.route : { name: "ALL" }, // Providing a default object with name as null if route doesn't exist
    distributor: item.distributor ? item.distributor : { name: "ALL" }, // Providing a default object with name as null if distributor doesn't exist
  }));

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All Offer</h5>
            <Link to="/create-retailer-offer" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i> New
            </Link>
          </div>
          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card">
              <ReactDataTable
                cols={cols}
                receiveData={mappedData}
                // imageBodyTemplate={imageBodyTemplate}
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
          pathname: "/show-retailer-offer/" + rowData.id,
        }}
        className="btn btn-info btn-sm ms-1"
        title="Show"
      >
        <i className="fa fa-list ms-1" aria-hidden="true"></i>
      </Link>
    </div>
  );
};

export default List;
