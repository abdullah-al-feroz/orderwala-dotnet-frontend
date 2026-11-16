import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});
  const [totalAmount, SetTotalAmount] = useState(0);
  const [error, setError] = useState({});

  const getCurrentDateInput = () => {
    const dateObj = new Date();

    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();

    const shortDate = `${year}-${month}-${day}`;

    setInputs((values) => ({ ...values, ["date"]: shortDate }));
  };

  useEffect(() => {
    getCurrentDateInput();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const amount = e.target.getAttribute("amount");
    const total = e.target.getAttribute("total");

    setInputs((values) => ({ ...values, [name]: value }));

    if (e.target.name == "suspense") {
      SetTotalAmount(
        (inputs.thousand_total > 0 ? inputs.thousand_total : 0) +
          (inputs.five_hundred_total > 0 ? inputs.five_hundred_total : 0) +
          (inputs.two_hundred_total > 0 ? inputs.two_hundred_total : 0) +
          (inputs.one_hundred_total > 0 ? inputs.one_hundred_total : 0) +
          (inputs.fifty_total > 0 ? inputs.fifty_total : 0) +
          (inputs.twenty_total > 0 ? inputs.twenty_total : 0) +
          (inputs.ten_total > 0 ? inputs.ten_total : 0) +
          (inputs.five_total > 0 ? inputs.five_total : 0) +
          (inputs.two_total > 0 ? inputs.two_total : 0) +
          (inputs.one_total > 0 ? inputs.one_total : 0) -
          value
      );
    } else {
      setInputs((values) => ({ ...values, [total]: value * amount }));
      SetTotalAmount(totalAmount + value * amount);

      SetTotalAmount(
        (inputs.thousand_total > 0 ? inputs.thousand_total : 0) +
          (inputs.five_hundred_total > 0 ? inputs.five_hundred_total : 0) +
          (inputs.two_hundred_total > 0 ? inputs.two_hundred_total : 0) +
          (inputs.one_hundred_total > 0 ? inputs.one_hundred_total : 0) +
          (inputs.fifty_total > 0 ? inputs.fifty_total : 0) +
          (inputs.twenty_total > 0 ? inputs.twenty_total : 0) +
          (inputs.ten_total > 0 ? inputs.ten_total : 0) +
          (inputs.five_total > 0 ? inputs.five_total : 0) +
          (inputs.two_total > 0 ? inputs.two_total : 0) +
          (inputs.one_total > 0 ? inputs.one_total : 0)
      );
    }
  };

  const formSubmit = () => {
    inputs.total_amount = totalAmount;
    Http.post("/cash-count", inputs)
      .then((res) => {
        navigate("/cash-count", {
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
          <h5 className="am-title">Create Cash Count</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Cash Count</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation
                  error={error}
                  amount=""
                  value={inputs.date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Date <i class="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={inputs.date || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="table-responsive p-0 pb-2">
                <table className="table table-sm table-bordered table-striped align-items-center justify-content-center mb-0 datatable">
                  <tbody>
                    <tr>
                      <th colSpan={5}>
                        <h5
                          className="categoryName text-center"
                          style={{ fontWeight: "bold" }}
                        >
                          Category Name
                        </h5>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="thousand"
                          className="form-control thousand"
                          amount="1000"
                          total="thousand_total"
                          value={inputs.thousand || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">1000.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="thousand_total"
                          className="form-control thousand_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.thousand_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="five_hundreed"
                          className="form-control five_hundreed"
                          amount="500"
                          total="five_hundred_total"
                          value={inputs.five_hundreed || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">500.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="five_hundred_total"
                          className="form-control five_hundred_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.five_hundred_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="two_hundreed"
                          className="form-control two_hundreed"
                          amount="200"
                          total="two_hundred_total"
                          value={inputs.two_hundreed || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">200.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="two_hundred_total"
                          className="form-control two_hundred_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.two_hundred_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="hundreed"
                          className="form-control hundreed"
                          amount="100"
                          total="one_hundred_total"
                          value={inputs.hundreed || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">100.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="one_hundred_total"
                          className="form-control one_hundred_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.one_hundred_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="fifty"
                          className="form-control fifty"
                          amount="50"
                          total="fifty_total"
                          value={inputs.fifty || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">50.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="fifty_total"
                          className="form-control fifty_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.fifty_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="tweenty"
                          className="form-control tweenty"
                          amount="20"
                          total="twenty_total"
                          value={inputs.tweenty || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">20.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="twenty_total"
                          className="form-control twenty_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.twenty_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="ten"
                          className="form-control ten"
                          amount="10"
                          total="ten_total"
                          value={inputs.ten || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">10.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="ten_total"
                          className="form-control ten_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.ten_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="five"
                          className="form-control five"
                          amount="5"
                          total="five_total"
                          value={inputs.five || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">5.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="five_total"
                          className="form-control five_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.five_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="two"
                          className="form-control two"
                          amount="2"
                          total="two_total"
                          value={inputs.two || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">2.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="two_total"
                          className="form-control two_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.two_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          name="one"
                          className="form-control one"
                          amount="1"
                          total="one_total"
                          value={inputs.one || ""}
                          onChange={handleChange}
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        X
                      </td>
                      <td className="amount">1.00</td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        =
                      </td>
                      <td>
                        <input
                          type="number"
                          name="one_total"
                          className="form-control one_total totalCount"
                          step="any"
                          readonly="readonly"
                          amount=""
                          value={inputs.one_total || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" style={{ textAlign: "right" }}>
                        Suspense.
                      </td>
                      <td>
                        <input
                          type="text"
                          name="suspense"
                          className="form-control suspense"
                          value={inputs.suspense || ""}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" style={{ textAlign: "right" }}>
                        Total.
                      </td>
                      <td>
                        <input
                          type="text"
                          name="total_amount"
                          className="form-control total_amount"
                          readonly="readonly"
                          amount=""
                          value={totalAmount || 0}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mt-3">
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

export default Create;
