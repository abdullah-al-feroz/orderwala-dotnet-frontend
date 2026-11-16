import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import * as XLSX from "xlsx";
import moment from "moment";
import { LoaderComponent } from "../../../Common/LoaderComponent";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState({});
  const [items, setItems] = useState([]);
  const [inputAmount, setInputAmount] = useState([]);

  const listChange = (e, index) => {
    const { name, value } = e.target;
    const inputInfo = [...items]; // Defined Experience State All Information into List Variable
    inputInfo[index][name] = value;

    setItems(inputInfo);
  };

  const ExcelDateToJSDate = (date) => {
    let converted_date = new Date(Math.round((date - 25569) * 864e5));
    converted_date = String(converted_date).slice(4, 15);
    date = converted_date.split(" ");
    let day = date[1];
    let month = date[0];
    month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
    if (month.toString().length <= 1) month = "0" + month;
    let year = date[2];

    return String(year + "-" + month + "-" + day);
  };

  const ExcelDateTimeToJSDateTime = (date) => {
    let milliseconds = moment
      .utc(date * 24 * 60 * 60 * 1000)
      .format("HH:mm:ss");

    return milliseconds;
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

    promise.then((data) => {
      // setItems(d);

      const staffAmount = [];
      data.map((info, index) =>
        staffAmount.push({
          id: info.id,
          code: info.code,
          name: info.name,
          date: ExcelDateToJSDate(info.date),
          start_time: ExcelDateTimeToJSDateTime(info.start_time),
          end_time: ExcelDateTimeToJSDateTime(info.end_time),
        })
      );
      setItems(staffAmount);
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
          date: "",
          start_date_time: "",
          end_date_time: "",
        })
      );

      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(staff);

      XLSX.utils.book_append_sheet(wb, ws, "Attendance");
      XLSX.writeFile(wb, "Attendance.xlsx");
    });
  };

  const formSubmit = () => {
    /*const staffAmount = [];
    items.map((d, index) =>
      staffAmount.push({
        id: d.id,
        date: d.date ? ExcelDateToJSDate(d.date) : "",
        start_date_time: d.start_date_time
          ? ExcelDateTimeToJSDateTime(d.start_date_time)
          : "",
        end_date_time: d.end_date_time
          ? ExcelDateTimeToJSDateTime(d.end_date_time)
          : "",
      })
    );*/

    inputs.list = items;
    Http.post("/attendance-excel", inputs)
      .then((res) => {
        navigate("/attendance", {
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
          <h5 className="am-title">Import Attendance</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Import Attendance</h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <label className="font-weight-bold">
                  Upload <i className="fa fa-star required"></i>
                </label>
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
                  <h5 className="text-center">Attendance Info</h5>
                  <table className="table container">
                    <thead>
                      <tr>
                        <th scope="col">Sl</th>
                        <th scope="col">Card No</th>
                        <th scope="col">Name</th>
                        <th scope="col" style={{ textAlign: "center" }}>
                          Date
                        </th>
                        <th scope="col" style={{ textAlign: "center" }}>
                          IN time
                        </th>
                        <th scope="col" style={{ textAlign: "center" }}>
                          Out time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((data, index) => (
                        <tr key={index + 1}>
                          <th>{index + 1}</th>
                          <th>{data.code}</th>
                          <th>{data.name}</th>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              name="date"
                              onChange={(e) => listChange(e, index)}
                              value={data.date}
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              className="form-control"
                              name="start_time"
                              onChange={(e) => listChange(e, index)}
                              value={data.start_time}
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              className="form-control"
                              name="end_time"
                              onChange={(e) => listChange(e, index)}
                              value={data.end_time}
                            />
                          </td>
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
