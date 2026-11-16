import React, { useEffect, useState } from "react";
import Http from "../../Common/Http";
import ReactDataTable from "../../Common/ReactDataTable";
import IsLogin from "../../Common/IsLogin";
import Select from "react-select";

const List = () => {
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributor, setDistributor] = useState([]);
  const [inputs, setInputs] = useState([]);
  const fetchData = async () => {
    setLoading(true); // Start loading state
    try {
      const distributor = await Http.get(
        "/select2/SaleDistribution.Distributor/id,name"
      );
      setDistributor(distributor.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmit = async () => {
    setLoading(true);
    const submissionInputs = { ...inputs };

    // Build the query string dynamically
    const queryParams = new URLSearchParams({
      date: submissionInputs.date,
    });

    if (Number.isInteger(submissionInputs.distributor_id)) {
      queryParams.append("distributor_id", submissionInputs.distributor_id);
    }
    try {
      const response = await Http.get(
        `/distributor/date-wise-stock-report?${queryParams.toString()}`
      );
      setReceiveData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error on form submit:", error);
      setLoading(false);
    }
  };

  const cols = [
    { field: "name_en", header: "Product Name" },
    { field: "stockQty", header: "Stock" },
  ];

  return (
    <div>
      <IsLogin />
      <div>
        <div className="am-mainpanel">
          <div className="am-pagetitle">
            <h5 className="am-title">Tracking Report</h5>
          </div>
          <div className="am-pagebody">
            <div className="card pd-sm-40">
              <div className="row">
                <div className="col-lg">
                  <label htmlFor="">Distributor</label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={distributor[0]}
                    name="distributor_id"
                    options={distributor}
                    onChange={selectHandleChange}
                  />
                </div>
                <div className="col-lg">
                  <label htmlFor="">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={inputs.date}
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
          </div>
          <div className="am-pagebody">
            <div className="card pd-20 pd-sm-40">
              <ReactDataTable
                cols={cols}
                receiveData={receiveData}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
