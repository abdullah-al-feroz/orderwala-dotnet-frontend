import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import useRequiredFields from "../../../../hooks/useRequiredFields";

const CreateRegion = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [error, setError] = useState({});
  const [list, setList] = useState([{ desc: "", date: "" }]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [staff, setStaff] = useState({});
  const { checkRequiredFields } = useRequiredFields();

  const handleInputChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...list]; // Defined Experience State All Information into List Variable

    inputInfo[index][name] = value;
    setList(inputInfo);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const selectHandleChange = (selectedValues) => {
    setSelectedStaff(selectedValues);
  };

  const fetchData = () => {
    Http.get("/roaster-holiday/" + id + "/edit").then((res) => {
      setInputs({
        name: res.data.name,
        year: res.data.year,
      });

      const listInfo = [];
      Object.keys(res.data.items).forEach((key) => {
        listInfo.push({
          date: res.data.items[key].date,
          desc: res.data.items[key].desc,
        });
      });
      setList(listInfo);

      const staffInfo = [];
      Object.keys(res.data.users).forEach((key) => {
        staffInfo.push({
          label: res.data.users[key].name,
          value: res.data.users[key].id,
        });
      });
      console.log(staffInfo);
      setSelectedStaff(staffInfo);
    });

    Http.get("/staff2").then((res) => {
      setStaff(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add More List
  const addMoreList = () => {
    setList([...list, { date: "", desc: "" }]); // Add One More List
  };
  // Remove List
  const removeList = (index) => {
    const inputInfo = [...list]; // Load All Existing experience State Data
    inputInfo.splice(index, 1); // Remove Experience by Index/Click Event Wise
    setList(inputInfo); // Replace Existing experience into State
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      inputs.list = list;
      inputs.staff_list = selectedStaff;
      Http.put("/roaster-holiday/" + id, inputs)
        .then((res) => {
          navigate("/roaster-holiday-list", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          setError(e.response.data.errors);
        });
    }
  };

  return (
    <div>
      <IsLogin></IsLogin>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Edit Roaster Holiday Calander</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Edit Roaster Holiday</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label className="font-weight-bold">
                  Name <i className="fa fa-star required"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={inputs.name || ""}
                  onChange={handleChange}
                  placeholder="Input Name"
                  data-required
                />
              </div>
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">
                  Year <i className="fa fa-star required"></i>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="year"
                  value={inputs.year || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
                  data-required
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label className="font-weight-bold">Staff</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={selectedStaff}
                  value={selectedStaff}
                  name="hr_staff_basic_info_id"
                  options={staff}
                  text="Please select user."
                  isMulti="yes"
                  onChange={selectHandleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-10"></div>
              <div className="col-2 mt-4">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
            </div>
            {/* <div className="row mt-3">
              <div className="col-12">
                <div className="col-lg">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={inputs.name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg mt-3">
                  <label>Year</label>
                  <input
                    type="number"
                    className="form-control"
                    name="year"
                    value={inputs.year || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-10"></div>
              <div className="col-2 mt-4">
                <button
                  className="btn btn-info btn-block mg-b-10"
                  onClick={addMoreList}
                >
                  <i className="fa fa-plus mg-r-10"></i> ADD More
                </button>
              </div>
            </div> */}
            {Array.from(list).map((x, i) => (
              <div className="row mt-4" key={i}>
                <div className="col-lg">
                  <div className="row">
                    <div className="col-6">
                      <label className="font-weight-bold">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={x.date || ""}
                        onChange={(e) => handleInputChange(e, i)}
                      />
                    </div>
                    <div className="col-5">
                      <label className="font-weight-bold">Remarks</label>
                      <input
                        type="text"
                        className="form-control"
                        name="desc"
                        value={x.desc || ""}
                        onChange={(e) => handleInputChange(e, i)}
                      />
                    </div>
                    <div className="col-1 mt-4">
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
