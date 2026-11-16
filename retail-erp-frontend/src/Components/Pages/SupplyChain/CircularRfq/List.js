import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Http from "../../../Common/Http";
import Swal from "sweetalert2";
import IsLogin from "../../../Common/IsLogin";

const TableHeader = ({ label }) => (
  <th className="text-uppercase text-dark text-sm font-weight-bolder ps-2">
    {label}
  </th>
);

const LinkButton = ({ path, icon, title }) => (
  <Link
    to={path}
    className={`btn btn-${icon ? "primary" : "info"} btn-sm ms-1`}
    title={title}
  >
    {icon ? <i className={`fa fa-${icon}`} aria-hidden="true"></i> : "Compare"}
  </Link>
);

const ActionButtons = ({ item, onDelete }) => {
  if (item.final_quotation) return null;

  return (
    <>
      <LinkButton path={`/circular-compare/${item.id}`} title="Compare" />
      <LinkButton
        path={`/edit-circular-rfq/${item.id}`}
        icon="pencil"
        title="Edit"
      />
      <LinkButton
        path={`/vendor-quotation-sent/${item.id}`}
        icon="user"
        title="Vendor Quotation Sent"
      />
      <button
        className="btn btn-danger btn-sm ms-1"
        onClick={() => onDelete(item.id, "circular-rfq", "circular rfq")}
        title="Delete"
      >
        <i className="fa fa-trash"></i>
      </button>
    </>
  );
};

const List = () => {
  const location = useLocation();
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    DatatableFunc();
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await Http.get("/circular-rfq");
    setReceiveData(data);

    Http.get("/staff-type-check").then((res) => {
      setRole(res.data);
    });
  };

  useEffect(() => {
    if (location.state) {
      showAlert(location.state.message, location.state.type);
    }
  }, [location]);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const deleteData = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await Http.delete(`/${deleteApiUrl}/${id}`);
        setReceiveData(data);
        Swal.fire("Deleted!", `${showMsg} has been deleted.`, "success");
      }
    });
  };

  return (
    <div>
      <IsLogin />
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">All Circular</h5>
          <Link to="/create-circular-rfq" className="btn btn-primary">
            <i className="fa fa-plus-square mg-r-6"></i>New
          </Link>
        </div>
        <div className="am-pagebody">
          <Alert alert={alert} />
          <div className="card pd-20 pd-sm-40">
            <div className="row">
              <div className="table-responsive p-0 pb-2">
                <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                  <thead>
                    <tr>
                      <TableHeader label="S/N" />
                      <TableHeader label="Date" />
                      <TableHeader label="Title" />
                      <TableHeader label="Subject" />
                      <TableHeader label="Description" />
                      <TableHeader label="Circular No" />
                      <TableHeader label="Last Date" />
                      <TableHeader label="Quotation Validaty" />
                      <TableHeader label="Created by" />
                      {(role === "admin" || role === "supply_chain") && (
                        <TableHeader label="Action" />
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {receiveData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-xs">{index + 1}</td>
                        <td className="text-xs">{item.date}</td>
                        <td className="text-xs">
                          <Link to={`/vendor-quotation-list/${item.id}`}>
                            {item.title}
                          </Link>
                        </td>
                        <td className="text-xs">{item.subject}</td>
                        <td className="text-xs">{item.description}</td>
                        <td className="text-xs">{item.circular_no}</td>
                        <td className="text-xs">
                          {item.last_date_of_quotation}
                        </td>
                        <td className="text-xs">{item.quotation_validaty}</td>
                        <td className="text-xs">
                          {item.createdBy ? item.created_by.name : ""}
                        </td>
                        {role === "admin" ||
                          (role === "supply_chain" && (
                            <td className="text-xs text-nowrap">
                              <ActionButtons
                                item={item}
                                onDelete={deleteData}
                              />
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
