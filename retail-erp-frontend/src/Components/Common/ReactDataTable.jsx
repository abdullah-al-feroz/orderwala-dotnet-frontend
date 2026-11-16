import React, { useRef, useState } from "react";
//New Data table Code Start
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

//New Data table Code End

const ReactDataTable = ({
  cols,
  receiveData,
  isLoading,
  imageBodyTemplate,
  actionTemplate,
  deleteData,
  statusChange,
  role,
  invite,
  rowClass,
  totalNumber = 0,
  exportCsvOrPdf = true,
  frozenColumnFields = [],
}) => {
  const dt = useRef(null);
  // const [filters2, setFilters2] = useState({
  //   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  // });
  // const [filters, setFilters] = useState({
  //   status: { value: "active", matchMode: FilterMatchMode.EQUALS },
  // });
  // const [statuses] = useState(["active", "inactive", "unverified"]);

  // const [globalFilter, setGlobalFilter] = useState("");
  // const [statuses] = useState(["active", "inactive", "unverified"]);

  // New way start

  // Check if the "Status" column exists in the cols array
  const hasStatusColumn = cols.some((col) => col.header === "Status");
  // const hasStatusColumn2 = cols.some((col) => col.header === " Status");

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [statusFilter2, setStatusFilter2] = useState(null);
  const [statuses] = useState(["active", "inactive"]);
  const [statuses2] = useState([
    "active",
    "approved",
    "recommended",
    "pending",
    "submitted",
    "damage",
  ]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: {
      value: hasStatusColumn ? "active" : null,
      matchMode: FilterMatchMode.EQUALS,
    },
    status2: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // New way end

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0);

        // Customize the appearance of the PDF
        doc.setFontSize(4);
        doc.setTextColor(0, 0, 0);
        doc.autoTable({
          head: [exportColumns.map((col) => col.title)],
          body: receiveData.map((data) =>
            exportColumns.map((col) => data[col.dataKey])
          ),
          // theme: "plain",
          styles: {
            halign: "center", // Horizontal alignment
            valign: "middle", // Vertical alignment
          },
        });
        doc.save("products.pdf");
      });
    });
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const getSeverityAndIcon = (status) => {
    switch (status) {
      case "inactive":
        return { severity: "danger", icon: "pi pi-times" };
      case "active":
        return { severity: "success", icon: "pi pi-check" };
      default:
        return { severity: null, icon: null };
    }
  };

  const getSeverityAndIcon2 = (status2) => {
    switch (status2) {
      case "active":
        return {
          severity: "secondary",
          icon: "pi pi-verified",
          style: { backgroundColor: "green" },
        };
      case "approved":
        return { severity: "success", icon: "pi pi-check-circle" };
      case "recommended":
        return { severity: "info", icon: "pi pi-check" };
      case "pending":
        return { severity: "warning", icon: "pi pi-clock" };
      case "submitted":
        return {
          severity: "warning",
          icon: "pi pi-circle",
          style: { backgroundColor: "blue" },
        };
      case "damage":
        return {
          severity: "warning",
          icon: "pi pi-info-circle",
          style: { backgroundColor: "#ff1919" },
        };
      default:
        return { severity: null, icon: null };
    }
  };

  // const statusBodyTemplate = (rowData) => {
  //   console.log(rowData)
  //   return (
  //     <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  //   );
  // };

  // const statusBodyTemplate = (rowData) => {
  //   return (
  //     <Tag value={rowData.status} severity={getSeverityAndIcon(rowData.status)} />
  //   );
  // };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag {...getSeverityAndIcon(rowData.status)} value={rowData.status} />
    );
  };

  const statusItemTemplate = (option) => {
    return <Tag {...getSeverityAndIcon(option)} value={option} />;
  };

  const statusBodyTemplate2 = (rowData) => {
    return (
      <Tag {...getSeverityAndIcon2(rowData.status)} value={rowData.status} />
    );
  };

  const statusItemTemplate2 = (option) => {
    return <Tag {...getSeverityAndIcon2(option)} value={option} />;
  };

  // const statusRowFilterTemplate = (options) => {
  //   return (
  //     <Dropdown
  //       value={options.value}
  //       options={statuses}
  //       onChange={(e) => options.filterApplyCallback(e.value)}
  //       itemTemplate={statusItemTemplate}
  //       placeholder="Select One"
  //       className="p-column-filter"
  //       showClear
  //       style={{ Width: "1px" }}
  //     />
  //   );
  // };

  const header = () => (
    <div className="d-flex justify-content-between reactDataTable">
      {exportCsvOrPdf ? (
        <div className="headerIcons">
          <Button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            severity="warning"
            rounded
            onClick={exportPdf}
            data-pr-tooltip="PDF"
          />
        </div>
      ) : (
        <>
          <div className="headerIcons"></div>
        </>
      )}
      <span>
        {cols.some((col) => col.header === "Status") && (
          <Dropdown
            value={statusFilter}
            options={statuses}
            onChange={(e) => {
              setStatusFilter(e.value);
              dt.current.filter(e.value, "status", "equals");
            }}
            itemTemplate={statusItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
            showClear
          />
        )}
        {cols.some((col) => col.header === " Status") && (
          <Dropdown
            value={statusFilter2}
            options={statuses2}
            onChange={(e) => {
              setStatusFilter2(e.value);
              dt.current.filter(e.value, "status", "equals");
            }}
            itemTemplate={statusItemTemplate2}
            placeholder="Select One"
            className="p-column-filter"
            showClear
          />
        )}
      </span>
      <span className="searching">
        <IconField iconPosition="left">
          {/* <InputIcon className="pi pi-search" /> */}
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </IconField>
        {/* <InputText
          placeholder="Search"
          onInput={(e) =>
            setGlobalFilter({
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            })
          }
        /> */}
      </span>
    </div>
  );
  // let footer = `Total rows:  ${
  //   totalNumber > 0
  //     ? totalNumber + " | Currently showing: " + receiveData.length
  //     : receiveData.length
  // } `;
  let footer = `Displaying ${receiveData?.length} ${
    totalNumber > 0 ? `of ${totalNumber} total entries` : "entries"
  }`;

  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = getToday();

  const rowClassName = (rowData) => {
    const start = rowData.start_date;
    const end = rowData.end_date;
    const isActive = start <= today && end >= today;
    return {
      "active-row": isActive, // custom class
    };
  };
  return (
    <div>
      <DataTable
        footer={footer}
        resizableColumns
        stripedRows
        showGridlines
        filters={filters}
        rowClassName={rowClass ? rowClassName : null}
        // filters={filters & filters}
        // filters={{
        //   global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
        //   status: { value: statusFilter, matchMode: FilterMatchMode.EQUALS },
        // }}
        paginator
        loading={isLoading}
        rows={100}
        rowsPerPageOptions={[10, 20, 50, 100]}
        // paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        removableSort
        ref={dt}
        value={receiveData}
        header={header}
        emptyMessage="No Data Found !"
        // tableStyle={{ width: "100%" }}
        scrollable
        scrollHeight="433px"
        // filterDisplay="row"
      >
        {/* {detailOnName && (
          <Column removableSort header="Name" body={detailOnName} />
        )} */}
        {imageBodyTemplate && (
          <Column header="Image" body={imageBodyTemplate} />
        )}

        {cols.map((col, index) => (
          <Column
            style={{ width: "1pxy" }}
            sortable={col.sortable !== false}
            key={index}
            field={col.field}
            header={col.header}
            frozen={frozenColumnFields.includes(col.field)}
            body={
              col.body
                ? col.body
                : col.header === "Status"
                ? statusBodyTemplate
                : col.header === " Status"
                ? statusBodyTemplate2
                : null
            }

            // {...(col.header === "Status" && {
            //   showFilterMenu: false,
            //   filterMenuStyle: { width: "1px" },
            //   filter: true,
            //   filterElement: statusRowFilterTemplate,
            // })}
          />
        ))}

        {actionTemplate && (
          <Column
            style={{ width: "5%" }}
            header="Actions"
            body={(item) =>
              actionTemplate(item, deleteData, role, statusChange || invite)
            }
          />
        )}

        {/* <Column
          header="Name"
          body={(rowData) => detailOnName(rowData)}
        /> */}
      </DataTable>
    </div>
  );
};

export default ReactDataTable;
