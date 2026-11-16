import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Alert from "../../../Common/Alert";
import DatatableFunc from "../../../Common/DatatableFunc";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const View = () => {
  const [receiveData, setReceiveData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const [listInput, setListInput] = useState([{ amount: "" }]);

  const fetchData = () => {
    Http.get("/bill-submission/" + id).then((res) => {
      setReceiveData(res.data);
      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push(res.data.items[key].amount);
      });
      setListInput(listInfo);
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
  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...listInput]; // Defined Experience State All Information into List Variable

    inputInfo[index] = value;
    setListInput(inputInfo);
  };
  useEffect(() => {
    if (!location.state) {
      return;
    }
    showAlert(location.state.message, location.state.type);
  }, [location]);

  const approve = (id, deleteApiUrl, showMsg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You wan't to approve this bill !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approved Bill Amount!",
    }).then((result) => {
      if (result.isConfirmed) {
        inputs.bill_submission_id = id;
        inputs.list = listInput;

        Http.post("/bill-submission-post-approve", inputs)
          .then((res) => {
            Swal.fire("Bill Has Been Approved", "success");
            navigate("/billsubmission", {
              state: { message: res.data.message, type: "success" },
            });
          })
          .catch(function (e) {
            setError(e.response.data.errors);
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
            <h5 className="am-title">Bill Submission Detail</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Bill Info:</h5>
                        <div>Date :{receiveData.submitted_date}</div>
                        <div>
                          Name :
                          {receiveData.staff ? receiveData.staff.name : ""}
                        </div>
                        <div>Total Amount :{receiveData.total_amount}</div>
                        <div>Remarks :{receiveData.remarks}</div>
                        {/* <div>
                          Recommended By :
                          {receiveData.recommended
                            ? receiveData.recommended.name
                            : ""}
                        </div> */}
                        <div>
                          Approved By :
                          {receiveData.approved
                            ? receiveData.approved.name
                            : ""}
                        </div>
                        <div>Status :{receiveData.status}</div>
                      </div>
                    </div>
                    <div className="table-responsive-sm">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Date</th>
                            <th>Description or Purpose</th>
                            <th className="right text-right">Amount</th>
                            <th className="right text-right">Approve Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receiveData.items
                            ? receiveData.items.map((item, index) => (
                                <tr key={item.id}>
                                  <td className="center">{index + 1}</td>
                                  <td className="left strong">{item.date}</td>
                                  <td className="left strong">{item.desc}</td>
                                  <td className="right text-right">
                                    {item.amount}
                                  </td>
                                  <td className="right text-right">
                                    {receiveData.status == "approved" ? (
                                      item.approve_amount
                                    ) : (
                                      <input
                                        type="number"
                                        className="form-control"
                                        name="amount"
                                        value={listInput[index] || item.amount}
                                        onChange={(e) =>
                                          handleInputChange(e, index)
                                        }
                                      />
                                    )}
                                  </td>
                                </tr>
                              ))
                            : ""}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-sm-5 d-flex align-items-center">
                        {receiveData.status == "submitted" ? (
                          <button
                            className="btn btn-primary btn-block mg-b-10"
                            onClick={() => approve(id)}
                          >
                            <i className="fa fa-send mg-r-10"></i> Approve
                          </button>
                        ) : (
                          <button className="btn btn-success btn-block mg-b-10">
                            <i className="fa fa-send mg-r-10"></i>{" "}
                            {receiveData.status}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
