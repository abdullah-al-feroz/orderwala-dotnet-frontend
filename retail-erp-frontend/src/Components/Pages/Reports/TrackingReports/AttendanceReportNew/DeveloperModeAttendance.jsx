import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
import { exportToCSV } from "../../../../Common/ExportUtils";
import "./DeveloperModeAttendance.css";

// Local date (YYYY-MM-DD). toISOString() uses UTC, which gives the wrong
// day for Dhaka between 00:00 and 06:00.
const toLocalDate = (d) => {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toLocalDate(d);
};

const today = toLocalDate(new Date());

const PRESETS = [
  { key: "today", label: "Today", range: () => ({ from: today, to: today }) },
  { key: "yesterday", label: "Yesterday", range: () => ({ from: daysAgo(1), to: daysAgo(1) }) },
  { key: "last7", label: "Last 7 days", range: () => ({ from: daysAgo(6), to: today }) },
  {
    key: "month",
    label: "This month",
    range: () => {
      const d = new Date();
      return { from: toLocalDate(new Date(d.getFullYear(), d.getMonth(), 1)), to: today };
    },
  },
];

const STATUS_FILTERS = [
  { value: "all", label: "All staff" },
  { value: "devOn", label: "Dev mode on" },
  { value: "devOff", label: "Dev mode off only" },
  { value: "absent", label: "Absent" },
];

// "2026-11-04" -> "04 Nov"
const formatDateHeader = (date) => {
  const parsed = new Date(date + "T00:00:00");
  if (isNaN(parsed)) return date;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

// "2026-11-04" -> "04 Nov 2026"
const formatDateLong = (date) => {
  const parsed = new Date(date + "T00:00:00");
  if (isNaN(parsed)) return date;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// "2026-11-04 10:24:33" -> "10:24 AM"
const formatTime = (value) => {
  if (!value) return "";
  const str = value.toString().trim();
  const parts = str.split(/\s+/);
  const timePart = parts.length > 1 ? parts[1] : parts[0];

  const t = timePart.split(":");
  if (t.length < 2) return timePart;

  let h = parseInt(t[0], 10);
  const m = t[1];

  if (isNaN(h)) return timePart;

  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const hh = h.toString().padStart(2, "0");
  const mm = m.toString().padStart(2, "0");

  return `${hh}:${mm} ${ampm}`;
};

const getAttendanceData = (rowData, date) => {
  if (!rowData || !rowData.attendance) return null;
  // Array structure (also covers an empty PHP array serialized as [])
  if (Array.isArray(rowData.attendance)) {
    return rowData.attendance.find((a) => a?.attendance_at?.startsWith(date)) || null;
  }
  // Object structure: rowData.attendance["2026-11-04"]
  return rowData.attendance[date] || null;
};

const isDevOn = (record) => Number(record?.developer_mode_on) === 1;

const renderDevMode = (record) => {
  if (!record) return "";
  return isDevOn(record) ? "On" : "Off";
};

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

const percent = (part, whole) => (whole ? (part / whole) * 100 : 0);

const detailsUrl = (userId, date) =>
  `/tracking-reports/attendance-reports/developer-mode/${userId}?date=${date}`;

const DeveloperModeAttendance = () => {
  const [inputs, setInputs] = useState({ from: today, to: today });
  const [applied, setApplied] = useState({ from: today, to: today });
  const [dates, setDates] = useState([]);
  const [receiveData, setReceiveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Search on name or workplace. The summary follows this filter.
  const searchedData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return receiveData;
    return receiveData.filter(
      (row) =>
        (row.name || "").toLowerCase().includes(query) ||
        (row.workplace || "").toLowerCase().includes(query),
    );
  }, [receiveData, searchText]);

  // Status filter on top of the search. Only the table and CSV follow this.
  const tableData = useMemo(() => {
    if (statusFilter === "all") return searchedData;
    return searchedData.filter((row) => {
      const records = dates.map((d) => getAttendanceData(row, d)).filter(Boolean);
      if (statusFilter === "devOn") return records.some(isDevOn);
      if (statusFilter === "devOff") return records.length > 0 && !records.some(isDevOn);
      if (statusFilter === "absent") return records.length === 0;
      return true;
    });
  }, [searchedData, statusFilter, dates]);

  // Per-date counts for the summary.
  const summary = useMemo(
    () =>
      dates.map((date) => {
        let present = 0;
        let devOn = 0;
        searchedData.forEach((row) => {
          const record = getAttendanceData(row, date);
          if (record) {
            present += 1;
            if (isDevOn(record)) devOn += 1;
          }
        });
        return {
          date,
          total: searchedData.length,
          present,
          absent: searchedData.length - present,
          devOn,
          devOff: present - devOn,
        };
      }),
    [dates, searchedData],
  );

  const totals = summary.reduce(
    (acc, s) => ({
      present: acc.present + s.present,
      absent: acc.absent + s.absent,
      devOn: acc.devOn + s.devOn,
      devOff: acc.devOff + s.devOff,
    }),
    { present: 0, absent: 0, devOn: 0, devOff: 0 },
  );

  const multiDay = dates.length > 1;
  const activePreset = PRESETS.find((p) => {
    const r = p.range();
    return r.from === inputs.from && r.to === inputs.to;
  })?.key;

  const rangeLabel =
    applied.from === applied.to
      ? formatDateLong(applied.from)
      : `${formatDateLong(applied.from)} – ${formatDateLong(applied.to)}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const fetchData = async (filters = applied) => {
    if (!filters.from || !filters.to) return;
    setLoading(true);
    try {
      const res = await Http.get(
        `/report/developer-mode-attendance?from_date=${filters.from}&to_date=${filters.to}`,
      );
      setDates(res.data.dates || []);
      setReceiveData(res.data.list || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(applied);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = (filters) => {
    setInputs(filters);
    setApplied(filters);
    fetchData(filters);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    runSearch(inputs);
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const exportCols = [
        { header: "Card No", field: "card_no" },
        { header: "Name", field: "name" },
        { header: "Designation", field: "designation" },
        { header: "Workplace", field: "workplace" },
        { header: "Email", field: "email" },
        { header: "Phone No", field: "mobile" },
        ...dates.flatMap((date) => [
          {
            header: `${date} Attendance`,
            accessor: (row) => formatTime(getAttendanceData(row, date)?.attendance_at),
          },
          {
            header: `${date} Developer Mode`,
            accessor: (row) => renderDevMode(getAttendanceData(row, date)),
          },
        ]),
      ];

      exportToCSV({
        cols: exportCols,
        data: tableData,
        filename: `developer_mode_attendance_${applied.from}_${applied.to}`,
      });
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  // ---------- Cell renderers ----------
  const staffBody = (row) => (
    <div className="dma-staff">
      <div className="dma-avatar">{initials(row.name)}</div>
      <div>
        <Link className="dma-staff-name" to={detailsUrl(row.id, applied.from)}>
          {row.name}
        </Link>
        <div className="dma-sub">{row.card_no}</div>
      </div>
    </div>
  );

  const designationBody = (row) => (
    <div>
      <div>{row.designation || "—"}</div>
      {row.user_type && <span className="dma-badge badge-type">{row.user_type}</span>}
    </div>
  );

  const contactBody = (row) => (
    <div>
      <div>{row.mobile || "—"}</div>
      {row.email && <div className="dma-sub">{row.email}</div>}
    </div>
  );

  const attendanceBody = (date) => (row) => {
    const time = formatTime(getAttendanceData(row, date)?.attendance_at);
    return time ? (
      <Link className="dma-time" to={detailsUrl(row.id, date)} title="View store checkins">
        {time}
      </Link>
    ) : (
      <span className="dma-absent" title="Absent">—</span>
    );
  };

  const devModeBody = (date) => (row) => {
    const record = getAttendanceData(row, date);
    if (!record) return <span className="dma-absent">—</span>;
    return isDevOn(record) ? (
      <span className="dma-badge badge-on">
        <span className="dot" /> On
      </span>
    ) : (
      <span className="dma-badge badge-off">
        <span className="dot" /> Off
      </span>
    );
  };

  // Flag rows where developer mode was on for any day in the range.
  const rowClassName = (row) =>
    dates.some((d) => isDevOn(getAttendanceData(row, d))) ? "dma-row-flag" : "";

  // Each date becomes a group of two columns: Attendance and Dev Mode.
  // NOTE: flatMap (not map) so the Columns are direct children, not nested arrays.
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Staff" rowSpan={2} />
        <Column header="Designation" rowSpan={2} />
        <Column header="Workplace" rowSpan={2} />
        <Column header="Contact" rowSpan={2} />
        {dates.map((date) => (
          <Column
            key={date}
            header={formatDateHeader(date)}
            colSpan={2}
            headerClassName="dma-date-head"
          />
        ))}
      </Row>
      <Row>
        {dates.flatMap((date) => [
          <Column key={`${date}-att-head`} header="Attendance At" />,
          <Column key={`${date}-dev-head`} header="Dev Mode" />,
        ])}
      </Row>
    </ColumnGroup>
  );

  const dateColumns = dates.flatMap((date) => [
    <Column
      key={`${date}-att`}
      columnKey={`${date}-att`}
      className="text-center"
      body={attendanceBody(date)}
    />,
    <Column
      key={`${date}-dev`}
      columnKey={`${date}-dev`}
      className="text-center"
      body={devModeBody(date)}
    />,
  ]);

  const kpis = [
    {
      label: "Total Staff",
      value: searchedData.length,
      meta: multiDay ? `${dates.length} days selected` : "Active CDM, RSM, AM & SO",
      icon: "fa-users",
      tone: "kpi-primary",
    },
    {
      label: "Present",
      value: totals.present,
      meta: `${percent(totals.present, totals.present + totals.absent).toFixed(1)}% attendance`,
      icon: "fa-check-circle",
      tone: "kpi-success",
    },
    {
      label: "Absent",
      value: totals.absent,
      meta: `${percent(totals.absent, totals.present + totals.absent).toFixed(1)}% of total`,
      icon: "fa-user-times",
      tone: "kpi-muted",
    },
    {
      label: "Dev Mode On",
      value: totals.devOn,
      meta: `${percent(totals.devOn, totals.present).toFixed(1)}% of present`,
      icon: "fa-exclamation-triangle",
      tone: "kpi-danger",
    },
    {
      label: "Dev Mode Off",
      value: totals.devOff,
      meta: `${percent(totals.devOff, totals.present).toFixed(1)}% of present`,
      icon: "fa-shield",
      tone: "kpi-success",
    },
  ];

  return (
    <div>
      <IsLogin></IsLogin>
      <div className="am-mainpanel dma-page">
        <div className="am-pagetitle dma-header">
          <div>
            <h5 className="am-title">Developer Mode Attendance Report</h5>
            <div className="dma-subtitle">
              <i className="fa fa-calendar mg-r-6"></i>
              {rangeLabel}
            </div>
          </div>
        </div>

        {/* ---------- Filters ---------- */}
        <div className="am-pagebody p-2">
          <form className="dma-card" onSubmit={formSubmit}>
            <div className="dma-filters">
              <div className="dma-field">
                <label htmlFor="dma-from">From Date</label>
                <input
                  id="dma-from"
                  type="date"
                  className="form-control"
                  name="from"
                  value={inputs.from || ""}
                  max={inputs.to || undefined}
                  onChange={handleChange}
                />
              </div>
              <div className="dma-field">
                <label htmlFor="dma-to">To Date</label>
                <input
                  id="dma-to"
                  type="date"
                  className="form-control"
                  name="to"
                  value={inputs.to || ""}
                  min={inputs.from || undefined}
                  onChange={handleChange}
                />
              </div>
              <div className="dma-field">
                <label>Quick Range</label>
                <div className="dma-presets">
                  {PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      className={`dma-chip ${activePreset === p.key ? "active" : ""}`}
                      onClick={() => runSearch(p.range())}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ms-auto">
                <button type="submit" className="btn btn-primary dma-btn" disabled={loading}>
                  {loading ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa fa-search"></i>
                  )}
                  Generate Report
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ---------- KPI cards ---------- */}
        {dates.length > 0 && (
          <div className="am-pagebody p-2">
            <div className="dma-kpis">
              {kpis.map((k) => (
                <div key={k.label} className={`dma-kpi ${k.tone}`}>
                  <div className="dma-kpi-icon">
                    <i className={`fa ${k.icon}`}></i>
                  </div>
                  <div>
                    <div className="dma-kpi-label">{k.label}</div>
                    <div className="dma-kpi-value">{loading ? "…" : k.value}</div>
                    <div className="dma-kpi-meta">{k.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            {multiDay && (
              <div className="dma-sub mt-2">
                Present, absent and dev mode counts are summed across all {dates.length} days.
              </div>
            )}
          </div>
        )}

        {/* ---------- Day-wise summary (only useful for a range) ---------- */}
        {multiDay && (
          <div className="am-pagebody p-2">
            <div className="dma-card">
              <div className="mb-3">
                <h6 className="dma-card-title">Day-wise Summary</h6>
                <p className="dma-card-subtitle">Attendance and developer mode usage per day</p>
              </div>
              <div className="table-responsive">
                <table className="dma-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th className="num">Total Staff</th>
                      <th className="num">Present</th>
                      <th className="num">Absent</th>
                      <th className="num">Dev Mode On</th>
                      <th className="num">Dev Mode Off</th>
                      <th className="num">Dev Mode On %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((s) => {
                      const pct = percent(s.devOn, s.present);
                      return (
                        <tr key={s.date}>
                          <td className="fw-semibold">{formatDateLong(s.date)}</td>
                          <td className="num">{s.total}</td>
                          <td className="num">{s.present}</td>
                          <td className="num">{s.absent}</td>
                          <td className="num">
                            {s.devOn > 0 ? (
                              <span className="dma-badge badge-on">{s.devOn}</span>
                            ) : (
                              0
                            )}
                          </td>
                          <td className="num">{s.devOff}</td>
                          <td className="num">
                            <div className="dma-bar">
                              <div className="dma-bar-track">
                                <div
                                  className="dma-bar-fill"
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                              <span>{pct.toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Staff table ---------- */}
        <div className="am-pagebody p-2">
          <div className="dma-card">
            <div className="dma-toolbar">
              <div>
                <h6 className="dma-card-title">Staff Attendance</h6>
                <p className="dma-card-subtitle">
                  Showing {tableData.length} of {receiveData.length} staff · click a name or
                  check-in time to see store checkins
                </p>
              </div>
              <div className="dma-toolbar-actions">
                <div className="dma-search">
                  <i className="fa fa-search"></i>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search name or workplace"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  {STATUS_FILTERS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline-success dma-btn"
                  onClick={handleExportCSV}
                  disabled={exporting || tableData.length === 0}
                >
                  {exporting ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa fa-download"></i>
                  )}
                  Export CSV
                </button>
              </div>
            </div>

            {/* key forces a remount when the date range changes, so
                PrimeReact rebuilds its column list */}
            <DataTable
              key={dates.join(",")}
              value={tableData}
              loading={loading}
              headerColumnGroup={dates.length ? headerGroup : undefined}
              rowClassName={rowClassName}
              paginator
              rows={20}
              rowsPerPageOptions={[10, 20, 50, 100]}
              paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink"
              currentPageReportTemplate="{first}–{last} of {totalRecords}"
              showGridlines
              scrollable
              scrollHeight="560px"
              emptyMessage={
                <div className="dma-empty">
                  <i className="fa fa-inbox"></i>
                  No staff match the current filters
                </div>
              }
            >
              <Column columnKey="staff" header="Staff" body={staffBody} />
              <Column columnKey="designation" header="Designation" body={designationBody} />
              <Column columnKey="workplace" field="workplace" header="Workplace" />
              <Column columnKey="contact" header="Contact" body={contactBody} />
              {dateColumns}
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperModeAttendance;
