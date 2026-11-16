import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Http from "../../../../Common/Http";
import IsLogin from "../../../../Common/IsLogin";
// import { LoaderComponent } from "../../../../Common/LoaderComponent";
import FormValidation from "../../../../Common/FormValidation";
import ExcelUpload from "./CreateTargetExcel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";

const Create = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    target_month: "january",
    target_year: 2024,
    work_place_region_id: "",
    work_place_area_id: "",
  });
  const [error, setError] = useState({});
  const [region, setRegion] = useState([]);
  const [area, setArea] = useState([]);
  const [base, setBase] = useState([]);
  const [product, setProduct] = useState([]);
  const [baseWiseProduct, setBaseWiseProduct] = useState({});
  const [viewType, setViewType] = useState("fromInput"); // View selection state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Http.get("/regionSelect2").then((res) => setRegion(res.data));
    Http.get("/product?status=active").then((res) => setProduct(res.data));
  };

  const areaRegionWise = (selectedOption, actionMeta) => {
    setInputs((values) => ({
      ...values,
      [actionMeta.name]: selectedOption.value,
    }));
    Http.get("/region-wise-area2/" + selectedOption.value).then((res) =>
      setArea(res.data)
    );
  };

  const baseRegionWise = (selectedOption, actionMeta) => {
    setInputs((values) => ({
      ...values,
      [actionMeta.name]: selectedOption.value,
    }));
    Http.get("/area-wise-base/" + selectedOption.value).then((res) => {
      setBase(res.data);
      const listInfo = {};
      product.forEach((prod) => {
        listInfo[prod.id] = {};
        res.data.forEach((baseItem) => {
          listInfo[prod.id][baseItem.id] = 0;
        });
      });
      setBaseWiseProduct(listInfo);
    });
  };

  const handleInputChange = (e, productId, baseId) => {
    const { value } = e.target;
    setBaseWiseProduct((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [baseId]: value },
    }));
  };

  const formSubmit = () => {
    inputs.items = baseWiseProduct;
    Http.post("/target", inputs)
      .then((res) => {
        navigate("/monthly-target", {
          state: { message: res.data.message, type: "success" },
        });
      })
      .catch((e) => setError(e.response.data.errors));
  };
  /*const exportCSV = () => {
    // Export CSV logic
    const baseHeaders = base.map((b) => b.name);
    const headers = ["FG", ...baseHeaders];
    const rows = product.map((prod) => {
      const baseValues = base.map(
        (b) => baseWiseProduct[prod.id]?.[b.id] || "0"
      );
      return [prod.name, ...baseValues];
    });
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "monthly_target.csv";
    link.click();
  };*/
  /*const exportCSV = () => {
    // Combine headers
    const baseHeaders = base.map((b) => b.name);
    const headers = ["FG", ...baseHeaders];

    // Add inputs metadata as the first row
    const inputMetadata = [
      ["Target Month", inputs.target_month],
      ["Target Year", inputs.target_year],
      [
        "Region",
        region.find((r) => r.value === inputs.work_place_region_id)?.label ||
          "",
      ],
      [
        "Area",
        area.find((a) => a.value === inputs.work_place_area_id)?.label || "",
      ],
    ];

    // Prepare rows with product and base-wise values
    const rows = product.map((prod) => {
      const baseValues = base.map(
        (b) => baseWiseProduct[prod.id]?.[b.id] || "0"
      );
      return [prod.name, ...baseValues];
    });

    // Combine metadata and main rows into the CSV content
    const csvContent = [
      ...inputMetadata.map(([key, value]) => `${key},${value}`), // Metadata rows
      "\n", // Blank row for separation
      headers.join(","), // Headers
      ...rows.map((row) => row.join(",")), // Data rows
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "monthly_target.csv";
    link.click();
  };*/

  /*const exportCSV = () => {
    // Combine headers for the product and base data
    const baseHeaders = base.map((b) => b.name);
    const headers = ["FG", ...baseHeaders];

    // Row 1: Field names
    const metadataHeaders = ["target_month", "target_year", "region", "area"];

    // Row 2: Corresponding values
    const metadataValues = [
      inputs.target_month,
      inputs.target_year,
      inputs.work_place_region_id,
      inputs.work_place_area_id,
    ];

    // Prepare rows with product and base-wise values
    const rows = product.map((prod) => {
      const baseValues = base.map(
        (b) => baseWiseProduct[prod.id]?.[b.id] || "0"
      );
      return [prod.name, ...baseValues];
    });

    // Combine metadata, headers, and rows into CSV content
    const csvContent = [
      metadataHeaders.join(","), // First row: Field names
      metadataValues.join(","), // Second row: Field values
      "\n", // Blank row for separation
      headers.join(","), // Headers for FG and bases
      ...rows.map((row) => row.join(",")), // Data rows
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "monthly_target.csv";
    link.click();
  };*/

  const exportCSV = () => {
    // Replace spaces with underscores in base names
    const baseHeaders = base.map((b) => b.name.replace(/\s+/g, "_"));
    const headers = ["FG", ...baseHeaders];

    // Row 1: Metadata headers
    const metadataHeaders = ["target_month", "target_year", "region", "area"];

    // Row 2: Metadata values
    const metadataValues = [
      inputs.target_month, // target_month value
      inputs.target_year, // target_year value
      inputs.work_place_region_id, // region_id
      inputs.work_place_area_id, // area_id
    ];

    // Prepare product rows with base-wise values
    const rows = product.map((prod) => {
      const baseValues = base.map(
        (b) => baseWiseProduct[prod.id]?.[b.id] || "0"
      );
      return [prod.name_en, ...baseValues];
    });

    // Combine metadata, headers, and rows into CSV content
    const csvContent = [
      metadataHeaders.join(","), // First row: Metadata headers
      metadataValues.join(","), // Second row: Metadata values
      headers.join(","), // Third row: Table headers
      ...rows.map((row) => row.join(",")), // Table rows
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "monthly_target.csv";
    link.click();
  };

  return (
    <div>
      <IsLogin />
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Monthly Target</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title">Create Monthly Target</h6>
            <FormValidation error={error} />

            {/* Month, Year, Region, Area Fields */}
            <div className="row mb-3">
              <div className="col-lg">
                <label>Target Month</label>
                <select
                  className="form-control"
                  name="target_month"
                  value={inputs.target_month}
                  onChange={(e) =>
                    setInputs({ ...inputs, target_month: e.target.value })
                  }
                >
                  {[
                    "january",
                    "february",
                    "march",
                    "april",
                    "may",
                    "june",
                    "july",
                    "august",
                    "september",
                    "october",
                    "november",
                    "december",
                  ].map((month) => (
                    <option value={month} key={month}>
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label>Target Year</label>
                <select
                  className="form-control"
                  name="target_year"
                  value={inputs.target_year}
                  onChange={(e) =>
                    setInputs({ ...inputs, target_year: e.target.value })
                  }
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg">
                <label>Region</label>
                <Select
                  name="work_place_region_id"
                  options={region}
                  onChange={areaRegionWise}
                />
              </div>
              <div className="col-lg">
                <label>Area</label>
                <Select
                  name="work_place_area_id"
                  options={area}
                  onChange={baseRegionWise}
                />
              </div>
            </div>

            {/* View Type Dropdown (conditionally displayed) */}
            {inputs.work_place_region_id && inputs.work_place_area_id && (
              <div className="row mb-3">
                <div className="col-lg">
                  <label>View Type</label>
                  <select
                    className="form-control"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                  >
                    <option value="fromInput">From Input</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
            )}

            {/* Conditional Content Rendering */}
            {viewType === "fromInput" ? (
              <>
                <Toolbar
                  className="mt-3"
                  left={
                    <Button
                      label="Export CSV"
                      icon="pi pi-upload"
                      onClick={exportCSV}
                    />
                  }
                />

                <DataTable
                  value={product}
                  paginator
                  rows={10}
                  responsiveLayout="scroll"
                  header="Monthly Target Table"
                >
                  <Column field="name" header="FG" />
                  {base.map((item) => (
                    <Column
                      key={item.id}
                      header={item.name}
                      body={(rowData) => (
                        <input
                          type="text"
                          className="form-control"
                          value={baseWiseProduct[rowData.id]?.[item.id] || 0}
                          onChange={(e) =>
                            handleInputChange(e, rowData.id, item.id)
                          }
                        />
                      )}
                    />
                  ))}
                </DataTable>

                <div className="row mt-3">
                  <div className="col-12">
                    <button
                      className="btn btn-success btn-block"
                      onClick={formSubmit}
                    >
                      <i className="fa fa-send mg-r-10"></i> Create
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // <iframe
              //   src="/path-to-your-csv"
              //   title="CSV Viewer"
              //   width="100%"
              //   height="500px"
              //   style={{ border: "1px solid #ddd" }}
              // ></iframe>
              <ExcelUpload />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
