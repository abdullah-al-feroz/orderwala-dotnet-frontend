import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const CreateRegion = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [list, setList] = useState([{ h_name: "", date: "" }]);
  const { checkRequiredFields } = useRequiredFields();

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };

  // Add More List
  const addMoreList = () => {
    setList([...list, { h_name: "", date: "" }]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
    const inputInfo = [...list]; // Load All Existing experience State Data
    inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
    setList(inputInfo); // Replace Existing experience into State
  };

  const formSubmit = () => {
    inputs.list = list;
    Http.post("/holiday", inputs)
      .then((res) => {
        navigate("/holiday-list", {
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
          <h5 className="am-title">Create Holiday Calander</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Create Holiday</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-10"></div>
              <div className="col-2">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
            </div>
            {Array.from(list).map((x, i) => (
              <div className="row mt-4" key={i}>
                <div className="col-lg">
                  <label className="font-weight-bold">Holiday Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="h_name"
                    value={x.h_name || ""}
                    onChange={(e) => handleInputChange(e, i)}
                    placeholder="Input Name"
                  />
                </div>
                <div className="col-lg">
                  <div className="row">
                    <div className="col-10">
                      <label className="font-weight-bold">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={x.date || ""}
                        onChange={(e) => handleInputChange(e, i)}
                      />
                    </div>
                    <div className="col-2">
                      {list.length > 1 ? (
                        <button
                          className="btn btn-danger btn-sm"
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
            {/* <div className="row mt-3">
              <div className="col-lg">
                <textarea className="form-control" name="remarks" value={inputs.remarks || ""} onChange={handleChange} placeholder="Remarks" />
              </div>
            </div> */}

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

export default CreateRegion;
