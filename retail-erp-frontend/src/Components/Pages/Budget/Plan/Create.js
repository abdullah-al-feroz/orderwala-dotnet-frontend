import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const CreateRegion = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [list, setList] = useState([{ purpose: "", amount: "" }]);
  const { checkRequiredFields } = useRequiredFields();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };
  const displayError = (fieldName) => {
    if (error && error[fieldName]) {
      return <div className="text-danger small">{error[fieldName]}</div>;
    }
    return null;
  };
  const handleInputAmountChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);

    let total = 0;
    inputInfo.forEach((item, itemIndex) => {
      if (item.amount > 0) {
        total += parseFloat(item.amount);
      }
    });
    setTotalAmount(total);
  };

  // Add More List
  const addMoreList = () => {
    setList([...list, { purpose: "", amount: "" }]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
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
        const inputInfo = [...list]; // Load All Existing experience State Data
        inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
        setList(inputInfo); // Replace Existing experience into State

        let total = 0;
        inputInfo.forEach((item, itemIndex) => {
          if (item.amount > 0) {
            total += parseFloat(item.amount);
          }
        });
        setTotalAmount(total);
      }
    });
  };

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["start_date"]: shortDate }));
    setInputs((values) => ({ ...values, ["end_date"]: shortDate }));
  };
  useEffect(() => {
    getCurrentDateInput();
  }, []);

  const formSubmit = () => {
    checkRequiredFields();
    inputs.total_amount = totalAmount;
    inputs.list = list;
    Http.post("/budget-plan", inputs)
      .then((res) => {
        navigate("/budget-plan", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch(function (e) {
        setError(e.response.data.errors);
      });
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Budget Plan</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Budget Plan</h6>
            {/* <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div> */}
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Start Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={inputs.start_date || ""}
                  onChange={handleChange}
                  placeholder="Input Start Date"
                  data-required
                />
                {displayError("start_date")}
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  End Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={inputs.end_date || ""}
                  onChange={handleChange}
                  placeholder="Input End Date"
                  data-required
                />
                {displayError("end_date")}
              </div>
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">Remarks</label>
                <textarea
                  className="form-control"
                  name="message"
                  value={inputs.message || ""}
                  onChange={handleChange}
                  placeholder="Write Message"
                />
                {displayError("message")}
              </div>
            </div>

            {Array.from(list).map((x, i) => (
              <div className="row mt-4" key={i}>
                <div className="col-lg">
                  <label className="font-weight-bold">Purpose</label>
                  <input
                    type="text"
                    className="form-control"
                    name="purpose"
                    value={x.purpose || ""}
                    onChange={(e) => handleInputChange(e, i)}
                    placeholder="Input Name"
                    data-required
                  />
                  {displayError("list." + i + ".purpose")}
                </div>
                <div className="col-lg">
                  <div className="row">
                    <div className="col-10">
                      <label className="font-weight-bold">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={x.amount || ""}
                        onChange={(e) => handleInputAmountChange(e, i)}
                        data-required
                      />
                      {displayError("list." + i + ".amount")}
                    </div>
                    <div className="col-2">
                      {list.length > 1 ? (
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ marginTop: "30px" }}
                          onClick={() => removeList(i)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="row mt-3">
              <div className="col-6">
                <label className="font-weight-bold float-right">Total</label>
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  name="total_amount"
                  value={totalAmount || ""}
                  onChange={handleChange}
                  placeholder="Total Amount"
                  data-required
                />
                {displayError("total_amount")}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6"></div>
              <div className="col-3">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Create
                </button>
              </div>
            </div>
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default CreateRegion;
