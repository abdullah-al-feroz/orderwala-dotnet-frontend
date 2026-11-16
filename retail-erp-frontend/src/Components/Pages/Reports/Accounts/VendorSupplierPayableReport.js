import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import ReactDataTable from "../../../Common/ReactDataTable";

const VendorSupplierPayableReport = () => {
  const location = useLocation();
  const [totalDebit, setTotalDebit] = useState([]);
  const [totalCredit, setTotalCredit] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    Http.get("/vendor-supplier-payable-report").then((res) => {
      setTotalDebit(res.data.totalDebit);
      setTotalCredit(res.data.totalCredit);
      setReceiveData(res.data.info);
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

  const cols = [
    { field: "name", header: "Name" },
    { field: "code", header: "Code" },
    { field: "debit", header: "Debit (TAKA)" },
    { field: "credit", header: "Credit (TAKA)" },
    {
      field: (item) =>
        item.balance ? parseFloat(item.credit - item.debit).toFixed(2) : 0.0,
      header: "Amount (TAKA)",
    },
  ];

  // const customFooter = "Grand Total Amount (Taka) : " + receiveData.totalCredit

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Supplier Payable</h5>
          </div>

          <div className="card">
            <ReactDataTable
              cols={cols}
              receiveData={receiveData}
              // customFooter={customFooter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSupplierPayableReport;
