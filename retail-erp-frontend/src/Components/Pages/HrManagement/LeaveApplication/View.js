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
    console.log("eeee" + id);
    Http.get("/leave-application/" + id).then((res) => {
      setReceiveData(res.data);
      console.log(res.data);
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

        Http.post("/bill-submission-approve/", inputs)
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
            <h5 className="am-title">Leave Application Detail</h5>
          </div>

          <div className="am-pagebody">
            <Alert alert={alert} />
            <div className="card pd-20 pd-sm-40">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12 padding">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-4">
                      <div className="col-sm-12">
                        <h5 className="mb-3">Leave Application Detail:</h5>
                        <div>Date : {receiveData.application_date}</div>
                        <div>
                          Name :
                          {receiveData.staff ? receiveData.staff.name : ""}
                        </div>
                        <div>
                          Application Date : {receiveData.application_date}
                        </div>
                        <div>Start Date : {receiveData.start_date}</div>
                        <div>End Date : {receiveData.end_date}</div>
                        <div>Total Days : {receiveData.total_days}</div>
                        <div>Type : {receiveData.leave_type}</div>
                        <div>Remarks : {receiveData.remarks}</div>
                        <div>
                          Recommend By :
                          {receiveData.recommened_by
                            ? receiveData.recommened_by.name
                            : ""}
                        </div>
                        <div>
                          Approved By :
                          {receiveData.approved_by
                            ? receiveData.approved_by.name
                            : ""}
                        </div>
                        <div>Status : {receiveData.status}</div>
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
