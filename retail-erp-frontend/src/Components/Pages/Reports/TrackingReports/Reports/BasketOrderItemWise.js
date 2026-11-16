import React, { useEffect, useState } from "react";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import ReactDataTable from "../../../../Common/ReactDataTable";
import { Oval } from "react-loader-spinner";

const BasketOrderItemWise = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    start_date: getCurrentDate(),
    end_date: getCurrentDate(),
    type: "order_date",
  });

  function getCurrentDate() {
    const dateObj = new Date();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const queryParams = new URLSearchParams({
            from: inputs.start_date,
            to: inputs.end_date
        });
        const response = await Http.get(`/distributor/retailer-basket-order-item-wise?${queryParams.toString()}`);
        setReceiveData(response.data);
    } catch (error) {
        console.error("Error fetching basket order item wise data:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      from: inputs.start_date,
      to: inputs.end_date
    });


    try {
      const response = await Http.get(
        `/distributor/retailer-basket-order-item-wise?${queryParams.toString()}`
      );
      setReceiveData(response.data);
    } catch (error) {
      console.error("Error searching basket order item wise data:", error);
    } finally {
      setLoading(false);
    }
  };

  const cols = [
    { field: "zone", header: "Zone" },
    { field: "region", header: "Region" },
    { field: "area", header: "Area" },
    { field: "base", header: "Base" },
    { field: "basket_delivery", header: "Basket Delivery" },
    { field: "item_name", header: "Items Name" },
    { field: "total_amount", header: "Total Amount" },
  ];

  return (
    <div>
      <IsLogin />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Basket Order Item Wise</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-sm-40">
            <div className="row">
              </div>
            <div className="row mt-4">
              <div className="col-lg">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={inputs.start_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={inputs.end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 mt-3">
                <p style={{ fontWeight: 600, marginBottom: 0,textAlign:'center' }}>
                  Showing Data from <small style={{color: "red",fontSize: "12px",fontWeight: "bold"}}>{inputs.start_date}</small> to <small style={{color: "red",fontSize: "12px",fontWeight: "bold"}}>{inputs.end_date}</small>
                </p>
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
              {loading ? (
                <div
                  className="py-5"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Oval
                    height={50}
                    width={50}
                    color="#00BFFF"
                    visible={true}
                    ariaLabel="loading"
                  />
                </div>
              ) : (
                <ReactDataTable cols={cols} receiveData={receiveData} isLoading={loading} />
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BasketOrderItemWise;
