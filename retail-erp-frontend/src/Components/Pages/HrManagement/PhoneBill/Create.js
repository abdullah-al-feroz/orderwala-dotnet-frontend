import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import * as XLSX from "xlsx";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [items, setItems] = useState([]);
  const [inputAmount, setInputAmount] = useState([]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const amountChange = (e, index) => {
    const { name, value } = e.target;
    const inputInfo = [...items]; // Defined Experience State All Information into List Variable
    inputInfo[index][name] = value;

    setItems(inputInfo);
  };

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);

      const staffAmount = [];
      items.map((d, index) => staffAmount.push({ id: d.id, amount: d.amount }));
      setInputAmount(staffAmount);
    });
  };

  const exportData = () => {
    Http.get("/staff").then((res) => {
      const staff = [];
      res.data.map((d) =>
        staff.push({
          id: d.id,
          code: d.card_no,
          name: d.name,
          // limit: d.salary_structure_latest.phone_bill_limit,
          limit: d.salary_structure_latest
            ? d.salary_structure_latest.phone_bill_limit
            : "",
          amount: "",
        })
      );

      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(staff);

      XLSX.utils.book_append_sheet(wb, ws, "Staff");
      XLSX.writeFile(wb, "Staff.xlsx");
    });
  };

  const formSubmit = () => {
    inputs.staff = items;

    Http.post("/phone-bill", inputs)
      .then((res) => {
        navigate("/phonebill", {
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
          <h5 className="am-title">Create Phone Bill</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Create Phone Bill Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label>
                  Year <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="year"
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                </select>
              </div>
              <div className="col-lg">
                <label>
                  Month <i class="fa fa-star required"></i>
                </label>
                <select
                  className="form-control"
                  name="month"
                  onChange={handleChange}
                >
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div className="col-lg">
                <label>Upload</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    readExcel(file);
                  }}
                />
                <br />
                <a
                  onClick={exportData}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Download Sample
                </a>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12">
                <div className="table-responsive p-0 pb-2">
                  <h5 className="text-center">Employee List</h5>
                  <table className="table container">
                    <thead>
                      <tr>
                        <th scope="col">Sl</th>
                        <th scope="col">Card No</th>
                        <th scope="col">Name</th>
                        <th scope="col" style={{ textAlign: "center" }}>
                          Limit
                        </th>
                        <th scope="col" style={{ textAlign: "center" }}>
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((d, index) => (
                        <tr key={index + 1}>
                          <th>{index + 1}</th>
                          <th>{d.code}</th>
                          <th>{d.name}</th>
                          <td style={{ textAlign: "center" }}>{d.limit}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="amount"
                              onChange={(e) => amountChange(e, index)}
                              value={d.amount}
                            />
                          </td>
                          {/* <td style={{textAlign:"center"}}>{d.amount}</td> */}
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
