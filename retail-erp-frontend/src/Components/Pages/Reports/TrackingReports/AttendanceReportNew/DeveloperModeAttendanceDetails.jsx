import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { exportToCSV } from "../../../../Common/ExportUtils";

// Local date (YYYY-MM-DD). toISOString() uses UTC, which gives the wrong
// day for Dhaka between 00:00 and 06:00.
const getToday = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// "2026-11-04 10:24:33" -> "10:24 AM"
const formatTime = (value) => {
  if (!value) return "";
  const str = value.toString().trim();
  const parts = str.split(/[\sT]+/);
  const timePart = parts.length > 1 ? parts[1] : parts[0];

  const t = timePart.split(":");
  if (t.length < 2) return timePart;

  let h = parseInt(t[0], 10);
  if (isNaN(h)) return timePart;

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(t[1]).padStart(2, "0")} ${ampm}`;
};

const renderDevMode = (row) =>
  Number(row?.developer_mode_on) === 1 ? "On" : "Off";

const devModeBody = (row) => {
  const on = Number(row?.developer_mode_on) === 1;
  return (
    <span className={on ? "text-danger font-weight-bold" : "text-success"}>
      {on ? "On" : "Off"}
    </span>
  );
};

const DeveloperModeAttendanceDetails = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get("date") || getToday();

  const [inputDate, setInputDate] = useState(date);
  const [user, setUser] = useState(null);
  const [attendanceAt, setAttendanceAt] = useState(null);
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputDate(date);
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Http.get(
          `/report/developer-mode-attendance/${userId}?date=${date}`,
        );
        setUser(res.data.user || null);
        setAttendanceAt(res.data.attendance_at || null);
        setReceiveData(res.data.list || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, date]);

  const formSubmit = () => {
    if (inputDate) setSearchParams({ date: inputDate });
  };

  const handleExportCSV = () => {
    exportToCSV({
      cols: [
        { header: "SL", accessor: (row) => receiveData.indexOf(row) + 1 },
        { header: "Store Code", field: "store_code" },
        { header: "Store Name", field: "store_name" },
        { header: "Owner Name", field: "owner_name" },
        { header: "Phone", field: "phone" },
        { header: "Checkin At", accessor: (row) => formatTime(row.checkin_at) },
        { header: "Checkout At", accessor: (row) => formatTime(row.checkout_at) },
        { header: "Checkin Distance", accessor: (row) => formatTime(row.backend_checkin_distance_calculate) },
        { header: "Developer Mode", accessor: (row) => renderDevMode(row) },
      ],
      data: receiveData,
      filename: `developer_mode_checkins_${user?.card_no || userId}_${date}`,
    });
  };

  const devOnCount = receiveData.filter(
    (r) => Number(r.developer_mode_on) === 1,
  ).length;

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Developer Mode Store Checkin Report</h5>
          <Link
            to="/tracking-reports/attendance-reports/developer-mode"
            className="btn btn-sm btn-secondary"
          >
            <i className="fa fa-arrow-left mg-r-6"></i> Back
          </Link>
        </div>

        <div className="am-pagebody p-2">
          <div className="card pd-sm-40">
            <div className="row">
              <div className="col-lg-8">
                {user && (
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr>
                        <th style={{ width: 140 }}>Name</th>
                        <td>
                          {user.name} ({user.card_no})
                        </td>
                        <th style={{ width: 140 }}>Designation</th>
                        <td>
                          {user.designation} {user.user_type && `(${user.user_type})`}
                        </td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{user.mobile}</td>
                        <th>Attendance</th>
                        <td>{formatTime(attendanceAt) || "Absent"}</td>
                      </tr>
                      <tr>
                        <th>Total Checkins</th>
                        <td>{receiveData.length}</td>
                        <th>Dev Mode On</th>
                        <td>{devOnCount}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
              <div className="col-lg-2">
                <label htmlFor="">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={inputDate || ""}
                  onChange={(e) => setInputDate(e.target.value)}
                />
              </div>
              <div className="col-lg-2 mt-4">
                <button
                  className="btn btn-primary btn-block mg-b-10"
                  onClick={formSubmit}
                >
                  <i className="fa fa-send mg-r-10"></i> Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="am-pagebody p-2">
          <div className="card pd-sm-40">
            <div className="row">
              <div className="col-lg-12 mb-3">
                <button
                  className="btn btn-success"
                  onClick={handleExportCSV}
                  disabled={receiveData.length === 0}
                >
                  <i className="fa fa-file-excel-o mg-r-6"></i>
                  CSV
                </button>
              </div>
              <div className="col-lg-12">
                <DataTable
                  value={receiveData}
                  loading={loading}
                  paginator
                  rows={50}
                  rowsPerPageOptions={[20, 50, 100]}
                  stripedRows
                  showGridlines
                  scrollable
                  scrollHeight="500px"
                  emptyMessage="No Checkin Found !"
                >
                  <Column
                    header="SL"
                    body={(row, options) => options.rowIndex + 1}
                    style={{ width: 60 }}
                  />
                  <Column field="store_code" header="Store Code" />
                  <Column field="store_name" header="Store Name" />
                  <Column field="owner_name" header="Owner Name" />
                  <Column field="phone" header="Phone" />
                  <Column
                    header="Checkin At"
                    className="text-center"
                    body={(row) => formatTime(row.checkin_at)}
                  />
                  <Column
                    header="Checkout At"
                    className="text-center"
                    body={(row) => formatTime(row.checkout_at)}
                  />
                  <Column field="backend_checkin_distance_calculate" header="Checkin Distance" />
                  <Column
                    header="Dev Mode"
                    className="text-center"
                    body={devModeBody}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperModeAttendanceDetails;
