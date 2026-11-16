import React, { useRef, useState, useEffect } from "react";
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
  // Server-side pagination এর জন্য নতুন props
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  lazy = false, // Server-side pagination enable/disable করার জন্য
  onSearch, // New prop for search callback
  statusFilter: initialStatusFilter, // Get current status filter from parent
  selection,
  onSelectionChange,
  selectionMode,
}) => {
  const dt = useRef(null);
  const searchInputRef = useRef(null);
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
  // Initialize statusFilter from parent prop, convert number to string
  const getInitialStatusFilter = () => {
    if (initialStatusFilter === 1) return "active";
    if (initialStatusFilter === 0) return "inactive";
    return null;
  };
  const [statusFilter, setStatusFilter] = useState(getInitialStatusFilter());
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
      // start with no filter to avoid accidentally hiding rows on first render
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },
    status2: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },
  });

  // Maintain focus on search input during data render
  useEffect(() => {
    if (searchInputRef.current && globalFilterValue) {
      searchInputRef.current.focus();
    }
  }, [receiveData]); // Focus when data changes

  // Sync statusFilter when parent changes it
  useEffect(() => {
    const newStatusFilter = initialStatusFilter === 1 ? "active" : initialStatusFilter === 0 ? "inactive" : null;
    setStatusFilter(newStatusFilter);
  }, [initialStatusFilter]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);

    // Call the search callback if provided (for server-side filtering)
    if (onSearch && lazy) {
      onSearch(value);
    }
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
    switch (String(status || "").toLowerCase()) {
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
        return { severity: "secondary", icon: "pi pi-verified", style: { backgroundColor: 'green' } };
      case "approved":
        return { severity: "success", icon: "pi pi-check-circle" };
      case "recommended":
        return { severity: "info", icon: "pi pi-check" };
      case "pending":
        return { severity: "warning", icon: "pi pi-clock" };
      case "submitted":
        return { severity: "warning", icon: "pi pi-circle", style: { backgroundColor: 'blue' } };
      case "damage":
        return { severity: "warning", icon: "pi pi-info-circle", style: { backgroundColor: '#ff1919' } };
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
      <span>
        {cols.some((col) => col.header === "Status") && (
          <Dropdown
            value={statusFilter}
            options={statuses}
            onChange={(e) => {
              setStatusFilter(e.value);
              if (statusChange) {
                statusChange(e.value);
              }
            }}
            itemTemplate={statusItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
            showClear
            onClear={(e) => {
              setStatusFilter(null);
              if (statusChange) {
                statusChange(null);
              }
            }}
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
            ref={searchInputRef}
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

  // const footer = `Total rows:  ${receiveData ? receiveData.length : 0}`;
  // Footer এ total records দেখানো
  const footer = lazy
    ? `Total rows: ${totalRecords || 0}`
    : `Total rows: ${receiveData ? receiveData.length : 0}`;
  // key based on data content so DataTable remounts when data changes
  // const tableKey = receiveData
  //   ? `${String(receiveData.length)}-${String(JSON.stringify(receiveData).length)}-${receiveData[0]?.id ?? ""}`
  //   : "0";

const tableKey = React.useMemo(() => {
  if (!receiveData || receiveData.length === 0) {
    return `empty-${Date.now()}`; // Empty হলেও unique key
  }
  // Data এর উপর based করে key
  const ids = receiveData.map(item => item.id).join('-');
  return `data-${receiveData.length}-${ids.substring(0, 50)}`;
}, [receiveData]);


  return (
    <div>
      <DataTable
        key={tableKey}
        footer={footer}
        resizableColumns
        stripedRows
        showGridlines
        filters={filters}
        paginator
        loading={isLoading}
        header={header}
        rows={lazy ? pageSize : 10}
        rowsPerPageOptions={[10, 20, 50, 100]}
        removableSort
        ref={dt}
        value={receiveData}
        emptyMessage="No Data Found !"
        scrollable
        scrollHeight="433px"
        lazy={lazy}
        totalRecords={lazy ? totalRecords : (receiveData?.length || 0)}
        first={lazy ? currentPage * pageSize : 0}
        onPage={lazy ? onPageChange : undefined}
        selection={selection}
        onSelectionChange={onSelectionChange}
        dataKey="id"
      >
        {/* {detailOnName && (
          <Column removableSort header="Name" body={detailOnName} />
        )} */}
        {imageBodyTemplate && (
          <Column header="Image" body={imageBodyTemplate} />
        )}

        {selection && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          />
        )}

        {cols.map((col, index) => (
          <Column
            style={{ width: "1pxy" }}
            sortable
            key={index}
            field={col.field}
            header={col.header}
            body={
              // Prefer explicit body renderer from column definition
              col.body
                ? col.body
                : col.header === "Status"
                  ? statusBodyTemplate
                  : col.header === " Status"
                    ? statusBodyTemplate2
                    : null
            }
          />
        ))}

        {actionTemplate && (
          <Column
            style={{ width: "5%" }}
            header="Actions"
            body={(item) =>
              actionTemplate(item, deleteData, role || statusChange || invite)
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