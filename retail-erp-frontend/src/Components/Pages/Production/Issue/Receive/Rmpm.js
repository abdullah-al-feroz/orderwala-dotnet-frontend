import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import FormValidation from "../../../../Common/FormValidation";
import { LoaderComponent } from "../../../../Common/LoaderComponent";

const Rmpm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState({});
  const [receiveData, setReceiveData] = useState([]);
  const [inputs, setInputs] = useState([]);

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };

  const fetchData = () => {
    Http.get("/issue/" + id).then((res) => {
      setReceiveData(res.data.info);
      getCurrentDateInput();
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const formSubmit = () => {
    inputs.items = receiveData;
    inputs.issue_id = id;

    Http.post("/issue-rmpm-receive", inputs)
      .then((res) => {
        navigate("/issue", {
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
          <h5 className="am-title">Receive Product</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Receive Product</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                />
              </div>
            </div>

            <div className="row mt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="center">#</th>
                    <th>Product</th>
                    <th className="text-right">Stndrd Qty</th>
                    <th className="text-right">Qty</th>
                    {/* <th className="text-right">Detail</th> */}
                  </tr>
                </thead>
                <tbody>
                  {receiveData.items
                    ? receiveData.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="center">{index + 1}</td>
                          <td className="left strong">
                            {item.product ? item.product.name : ""}
                          </td>
                          <td className="text-right">{item.stndrd_qty}</td>
                          <td className="text-right">{item.qty}</td>
                          {/* <td className="text-right">
                            {item.detail
                              ? item.detail.map(
                                  (value, key) =>
                                    "(" +
                                    value.qty +
                                    "*" +
                                    (value.grn ? value.grn.unit_price : 0) +
                                    ")" +
                                    "=" +
                                    value.qty *
                                      (value.grn ? value.grn.unit_price : 0) +
                                    " | "
                                )
                              : ""}
                          </td> */}
                        </tr>
                      ))
                    : ""}
                </tbody>
              </table>
            </div>

            <div className="row mt-3">
              <div className="col-3">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Receive
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

export default Rmpm;
