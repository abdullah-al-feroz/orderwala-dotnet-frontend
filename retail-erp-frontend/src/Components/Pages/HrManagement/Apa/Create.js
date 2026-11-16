import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import DatatableFunc from "../../../Common/DatatableFunc";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [staff, setStaff] = useState({});
  const [error, setError] = useState({});
  const [grade, setGrade] = useState({});
  const [designation, setDesignation] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const staffChange = (e, index) => {
    const { name, value } = e.target; // Chanages Experience Input Name and Value
    const inputInfo = [...staff]; // Defined Experience State All Information into List Variable
    inputInfo[index][name] = value;

    setStaff(inputInfo);
  };
  const typeChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    const staffArray = [];

    if (value == "others") {
      Http.get("/staff?status=active").then((res) => {
        Array.from(res.data).map((d, index) =>
          staffArray.push({
            id: d.id,
            card_no: d.card_no,
            name: d.name,
            designation: d.designation.name,
            department: d.department.name,
            gross: d.salary_structure_latest.gross,
            effective_date: "",
            basic: "",
            other: "",
            apa_name: "",
            designation_id: "",
          })
        );
        setStaff(staffArray);
      });
    } else if (value == "increment") {
      Http.get("/staff?status=active&apa=increment").then((res) => {
        Array.from(res.data).map((d, index) =>
          d.show == 1
            ? staffArray.push({
                id: d.id,
                card_no: d.card_no,
                name: d.name,
                designation: d.designation.name,
                department: d.department.name,
                gross: d.salary_structure_latest.gross,
                effective_date: "",
                basic: "",
                other: "",
                apa_name: "",
                designation_id: "",
              })
            : ""
        );
        setStaff(staffArray);
      });
    } else if (value == "promotion") {
      Http.get("/staff?status=active&apa=promotion").then((res) => {
        Array.from(res.data).map((d, index) =>
          d.show == 1
            ? staffArray.push({
                id: d.id,
                card_no: d.card_no,
                name: d.name,
                designation: d.designation.name,
                department: d.department.name,
                gross: d.salary_structure_latest.gross,
                effective_date: "",
                basic: "",
                other: "",
                apa_name: "",
                designation_id: "",
              })
            : ""
        );
        setStaff(staffArray);
      });
    } else if (value == "upgradation") {
      Http.get("/staff?status=active&apa=upgradation").then((res) => {
        Array.from(res.data).map((d, index) =>
          d.show == 1
            ? staffArray.push({
                id: d.id,
                card_no: d.card_no,
                name: d.name,
                designation: d.designation.name,
                department: d.department.name,
                gross: d.salary_structure_latest.gross,
                effective_date: "",
                basic: "",
                other: "",
                apa_name: "",
                designation_id: "",
              })
            : ""
        );
        setStaff(staffArray);
      });
    }
  };

  useEffect(() => {
    Http.get("/grade").then((res) => {
      // Get All Designation Info
      setGrade(res.data); // Set Designation State
    });
    Http.get("/designation").then((res) => {
      // Get All Designation Info
      setDesignation(res.data); // Set Designation State
    });
    DatatableFunc();
  }, []);
  const formSubmit = () => {
    inputs.staff = staff;
    Http.post("/apa", inputs)
      .then((res) => {
        navigate("/apa", {
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
          <h5 className="am-title">Create APA</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              New Salary Increment Scale
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Type: <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="type"
                  onChange={typeChange}
                >
                  <option value="">Select Type</option>
                  <option value="others">Others (Tk.)</option>
                  <option value="increment">Annual Increment (Qty.)</option>
                  <option value="promotion">Promotion</option>
                  <option value="upgradation">Upgradation</option>
                </select>
              </div>
              <div className="col-lg">
                <label>
                  Remarks <i class="fa fa-star required"></i>
                </label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={inputs.remarks || ""}
                  onChange={handleChange}
                  placeholder="Remarks"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <div className="table-responsive p-0 pb-2">
                  <table className="table container _datatable">
                    <thead>
                      <tr>
                        <th scope="col">Sl</th>
                        <th scope="col">Card No</th>
                        <th scope="col">Name</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Department</th>
                        <th scope="col" style={{ textAlign: "right" }}>
                          Current Salary
                        </th>
                        <th scope="col">Effective Date</th>
                        {inputs.type != "promotion" &&
                        inputs.type != "upgradation" ? (
                          <th scope="col">Basic</th>
                        ) : (
                          ""
                        )}
                        {inputs.type != "promotion" &&
                        inputs.type != "upgradation" ? (
                          <th scope="col">Other</th>
                        ) : (
                          ""
                        )}
                        {inputs.type == "promotion" ||
                        inputs.type == "upgradation" ? (
                          <th scope="col">Grade</th>
                        ) : (
                          ""
                        )}
                        {inputs.type == "promotion" ||
                        inputs.type == "upgradation" ? (
                          <th scope="col">Designation</th>
                        ) : (
                          ""
                        )}
                        {inputs.type == "others" ? (
                          <th scope="col">Name</th>
                        ) : (
                          ""
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(staff).map((item, index) => (
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>{item.card_no}</td>
                          <td>{item.name}</td>
                          <td>{item.designation}</td>
                          <td>{item.department}</td>
                          <td style={{ textAlign: "right" }}>
                            {parseFloat(item.gross).toFixed(2)}
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              name="effective_date"
                              onChange={(e) => staffChange(e, index)}
                              value={item.effective_date}
                            />
                          </td>
                          {inputs.type != "promotion" &&
                          inputs.type != "upgradation" ? (
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="basic"
                                onChange={(e) => staffChange(e, index)}
                                value={item.basic}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                          {inputs.type != "promotion" &&
                          inputs.type != "upgradation" ? (
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="other"
                                onChange={(e) => staffChange(e, index)}
                                value={item.other}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                          {inputs.type == "promotion" ||
                          inputs.type == "upgradation" ? (
                            <td>
                              <select
                                className="form-control"
                                name="grade_id"
                                onChange={(e) => staffChange(e, index)}
                              >
                                <option value="">Select Grade</option>
                                {Array.from(grade).map((item, index) => (
                                  <option value={item.id} key={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            ""
                          )}
                          {inputs.type == "promotion" ||
                          inputs.type == "upgradation" ? (
                            <td>
                              <select
                                className="form-control"
                                name="designation_id"
                                onChange={(e) => staffChange(e, index)}
                              >
                                <option value="">Select Designation</option>
                                {Array.from(designation).map((item, index) => (
                                  <option value={item.id} key={item.id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ) : (
                            ""
                          )}
                          {inputs.type == "others" ? (
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="apa_name"
                                onChange={(e) => staffChange(e, index)}
                                value={item.apa_name}
                              />
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
