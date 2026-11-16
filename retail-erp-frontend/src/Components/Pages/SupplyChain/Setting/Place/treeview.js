import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../../Common/Alert";
import DatatableFunc from "../../../../Common/DatatableFunc";
import Http from "../../../../Common/Http";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import IsLogin from "../../../../Common/IsLogin";
import Swal from "sweetalert2";
import TreeViewItem from "./TreeViewItem";

const transformData = (flatData) => {
  const divisions = {};
  const districts = {};
  const thanas = {};

  flatData.forEach((place) => {
    // Add division if it doesn't exist
    if (!divisions[place.division.id]) {
      divisions[place.division.id] = { ...place.division, districts: {} };
    }

    // Add district if it doesn't exist
    if (!divisions[place.division.id].districts[place.district.id]) {
      divisions[place.division.id].districts[place.district.id] = {
        ...place.district,
        thanas: {},
      };
    }

    // Add thana if it doesn't exist
    if (
      !divisions[place.division.id].districts[place.district.id].thanas[
        place.thana.id
      ]
    ) {
      divisions[place.division.id].districts[place.district.id].thanas[
        place.thana.id
      ] = { ...place.thana, places: [] };
    }

    // Add place
    divisions[place.division.id].districts[place.district.id].thanas[
      place.thana.id
    ].places.push(place);
  });

  // Convert objects to arrays
  const divisionArray = Object.values(divisions).map((division) => ({
    ...division,
    districts: Object.values(division.districts).map((district) => ({
      ...district,
      thanas: Object.values(district.thanas),
    })),
  }));

  return divisionArray;
};

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/place").then((res) => {
      // setReceiveData(res.data);
      const hierarchicalData = transformData(Object.values(res.data));
      setReceiveData(hierarchicalData);
    });
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

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">All places</h5>
            <Link to="/create-place" className="btn btn-primary">
              <i className="fa fa-plus-square mg-r-6"></i>New
            </Link>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />

            <div className="card pd-20 pd-sm-40">
              <div className="treeview">
                {receiveData.map((division) => (
                  <TreeViewItem key={division.id} item={division} level={0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
