import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import DatatableFunc from "../../Common/DatatableFunc";
import Http from "../../Common/Http";
import IsLogin from "../../Common/IsLogin";
import ReactDataTable from "../../Common/ReactDataTable";
import Alert from "../../Common/Alert";
import Pagination from "../../Common/Pagination";
import { exportToCSV, exportToPDF } from "../../Common/ExportUtils";

const List = () => {
    const location = useLocation();
    const [receiveData, setReceiveData] = useState([]);
    const [alert, setAlert] = useState(null);
    const [outSideCompany, setOutSideCompany] = useState([]);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(50);
    const [exporting, setExporting] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 50,
        total: 0,
    });

    const fetchData = async (page = 1, customLimit = limit) => {
        setLoading(true);
        try {
            const userResponse = await Http.get("/me");
            setOutSideCompany(userResponse.data);

            const distributorResponse = await Http.get(`/report/all-distributor-stock-report?page=${page}&limit=${customLimit}`);
            // Format the received data
            const formattedData = distributorResponse.data.data.map(item => {
                // const formattedDue = parseNumber(item.due || 0).toFixed(2);
                // const formattedTotalStockValue = parseNumber(item.totalStockValue).toFixed(2);
                // const formattedMinimumStockValue = parseNumber(item.minimum_stock_value || 0).toFixed(2);
                // const stock = parseNumber(item.formattedTotalStockValue  || 0);
                // const resultNeededStock = (stock + parseNumber(formattedDue)) - parseNumber(formattedMinimumStockValue);
                // const resultTotalStock = stock + parseNumber(formattedDue); 

                const formattedDue = parseNumber(item.due || 0).toFixed(2);
                const formattedTotalStockValue = parseNumber(item.totalStockValue || 0).toFixed(2);
                const formattedMinimumStockValue = parseNumber(item.minimum_stock_value || 0).toFixed(2);

                const stock = parseNumber(formattedTotalStockValue); // Fix here
                const resultNeededStock = (stock + parseNumber(formattedDue)) - parseNumber(formattedMinimumStockValue);
                const resultTotalStock = stock + parseNumber(formattedDue);

                return {
                    ...item,
                    due: formattedDue,
                    totalStockValue: formattedTotalStockValue,
                    minimum_stock_value: formattedMinimumStockValue,
                    neededStock: resultNeededStock.toFixed(2),
                    totalStock: resultTotalStock.toFixed(2),
                };
            });

            setReceiveData(formattedData); // Set the formatted data
            const { data, current_page, per_page, total } = distributorResponse.data;
            setPagination({ current_page, per_page, total });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // Ensure loading is false after fetch
        }
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchData(1, newLimit); // Pass new limit and reset to page 1
    };


    useEffect(() => {
        DatatableFunc();
        fetchData();
    }, []);

    const showAlert = (message, type) => {
        setAlert({
            message: message,
            type: type,
        });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    useEffect(() => {
        if (!location.state) {
            return;
        }
        showAlert(location.state.message, location.state.type);
    }, [location]);

    const deleteData = (id, deleteApiUrl, showMsg) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Http.delete("/" + deleteApiUrl + "/" + id).then((res) => {
                    setReceiveData(res.data);
                    Swal.fire("Deleted!", showMsg + " has been deleted.", "success");
                });
            }
        });
    };

    const parseNumber = (val) => Number(String(val).replace(/,/g, '')) || 0;
    const totalPages = Math.ceil(pagination.total / pagination.per_page);
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(1, pagination.current_page - half);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const cols = [
        { field: "code", header: "Code" },
        { field: "name", header: "Name" },
        ...(outSideCompany?.data?.user_type !== "other-company"
            ? [
                { field: "zoneNames", header: "Zone" },
                { field: "regionNames", header: "Region" },
                { field: "areaNames", header: "Area" },
                { field: "baseNames", header: "Base" },
            ]
            : []),
        { field: "totalStockValue", header: "Stock Value" },
        { field: "due", header: "Payable Stock" },
        { field: "totalStock", header: "Total Stock" },
        { field: "minimum_stock_value", header: "Minimum Stock Value" },
        { field: "neededStock", header: "Needed Stock" },
        { field: "status", header: " Status " },
    ];

    // Debug: Verify the initial data
    const mappedData = (receiveData || []).map((item) => {
        const distributor_workplace = Array.isArray(item.distributor_workplace) ? item.distributor_workplace : [];
        const sr_base_info = Array.isArray(item.sr_base_info) ? item.sr_base_info : [];

        const zoneNames = Array.from(
            new Set(distributor_workplace.map(info => info?.zone?.name).filter(Boolean))
        ).join(" , ") || "";

        const baseNames = sr_base_info
            .map(info => info?.base?.name)
            .filter(Boolean)
            .join(" , ") || "";

        const areaNames = distributor_workplace
            .map(info => info?.area?.name)
            .filter(Boolean)
            .join(" , ") || "";

        const regionNames = distributor_workplace
            .map(info => info?.region?.name)
            .filter(Boolean)
            .join(" , ") || "";

        return {
            ...item,
            zoneNames,
            baseNames,
            areaNames,
            regionNames,
        };
    });

    // Debug: Verify the complete mapped data
    console.log('Complete mapped data:', mappedData);

    // const fetchAllData = useCallback(async () => {
    //     try {
    //         setExporting(true);
    //         const response = await Http.get(`/report/all-distributor-stock-report?limit=10000000`);
    //         // Apply the same mapping logic as in the main data fetch
    //         return response.data.data.map(item => {
    //             const distributor_workplace = Array.isArray(item.distributor_workplace) ? item.distributor_workplace : [];
    //             const sr_base_info = Array.isArray(item.sr_base_info) ? item.sr_base_info : [];

    //             const zoneNames = Array.from(
    //                 new Set(distributor_workplace.map(info => info?.zone?.name).filter(Boolean))
    //             ).join(" , ") || "";

    //             const baseNames = sr_base_info
    //                 .map(info => info?.base?.name)
    //                 .filter(Boolean)
    //                 .join(" , ") || "";

    //             const areaNames = distributor_workplace
    //                 .map(info => info?.area?.name)
    //                 .filter(Boolean)
    //                 .join(" , ") || "";

    //             const regionNames = distributor_workplace
    //                 .map(info => info?.region?.name)
    //                 .filter(Boolean)
    //                 .join(" , ") || "";

    //             return {
    //                 ...item,
    //                 zoneNames,
    //                 baseNames,
    //                 areaNames,
    //                 regionNames,
    //             };
    //         });
    //     } catch (error) {
    //         console.error("Export error:", error);
    //         showAlert("Failed to export data", "danger");
    //         return [];
    //     } finally {
    //         setExporting(false);
    //     }
    // }, []);


    const fetchAllData = useCallback(async () => {
        try {
            setExporting(true);
            const response = await Http.get(`/report/all-distributor-stock-report?limit=10000000`);

            // Apply the same formatting logic as in the main data fetch
            return response.data.data.map(item => {
                const distributor_workplace = Array.isArray(item.distributor_workplace) ? item.distributor_workplace : [];
                const sr_base_info = Array.isArray(item.sr_base_info) ? item.sr_base_info : [];

                const zoneNames = Array.from(
                    new Set(distributor_workplace.map(info => info?.zone?.name).filter(Boolean))
                ).join(" , ") || "";

                const baseNames = sr_base_info
                    .map(info => info?.base?.name)
                    .filter(Boolean)
                    .join(" , ") || "";

                const areaNames = distributor_workplace
                    .map(info => info?.area?.name)
                    .filter(Boolean)
                    .join(" , ") || "";

                const regionNames = distributor_workplace
                    .map(info => info?.region?.name)
                    .filter(Boolean)
                    .join(" , ") || "";

                // Add the calculated fields
                const formattedDue = parseNumber(item.due || 0).toFixed(2);
                const formattedTotalStockValue = parseNumber(item.totalStockValue || 0).toFixed(2);
                const formattedMinimumStockValue = parseNumber(item.minimum_stock_value || 0).toFixed(2);

                const stock = parseNumber(formattedTotalStockValue);
                const resultNeededStock = (stock + parseNumber(formattedDue)) - parseNumber(formattedMinimumStockValue);
                const resultTotalStock = stock + parseNumber(formattedDue);

                return {
                    ...item,
                    zoneNames,
                    baseNames,
                    areaNames,
                    regionNames,
                    due: formattedDue,
                    totalStockValue: formattedTotalStockValue,
                    minimum_stock_value: formattedMinimumStockValue,
                    neededStock: resultNeededStock.toFixed(2),
                    totalStock: resultTotalStock.toFixed(2),
                };
            });
        } catch (error) {
            console.error("Export error:", error);
            showAlert("Failed to export data", "danger");
            return [];
        } finally {
            setExporting(false);
        }
    }, []);
    const handleExportPDF = async () => {
        const allData = await fetchAllData(); // Function to get all records
        exportToPDF({
            cols,
            data: allData,
            title: "Your Report Title",
            filename: "download"
        });
    };

    const handleExportCSV = async () => {
        const allData = await fetchAllData();
        exportToCSV({
            cols,
            data: allData,
            filename: "download"
        });
    };
    const handleSearchChange = async (e, page = 1, customLimit = limit) => {
        const value = e.target.value;
        setLoading(true);

        try {
            const response = await Http.post(`/report/search-distributor-stock-report`, {
                search: value,
            });

            // Format the received data the same way as in fetchData
            const formattedData = response.data.data.map(item => {
                const formattedDue = parseNumber(item.due || 0).toFixed(2);
                const formattedTotalStockValue = parseNumber(item.totalStockValue || 0).toFixed(2);
                const formattedMinimumStockValue = parseNumber(item.minimum_stock_value || 0).toFixed(2);

                const stock = parseNumber(formattedTotalStockValue);
                const resultNeededStock = (stock + parseNumber(formattedDue)) - parseNumber(formattedMinimumStockValue);
                const resultTotalStock = stock + parseNumber(formattedDue);

                // Also include the workplace mapping like in your main data processing
                const distributor_workplace = Array.isArray(item.distributor_workplace) ? item.distributor_workplace : [];
                const sr_base_info = Array.isArray(item.sr_base_info) ? item.sr_base_info : [];

                const zoneNames = Array.from(
                    new Set(distributor_workplace.map(info => info?.zone?.name).filter(Boolean))
                ).join(" , ") || "";

                const baseNames = sr_base_info
                    .map(info => info?.base?.name)
                    .filter(Boolean)
                    .join(" , ") || "";

                const areaNames = distributor_workplace
                    .map(info => info?.area?.name)
                    .filter(Boolean)
                    .join(" , ") || "";

                const regionNames = distributor_workplace
                    .map(info => info?.region?.name)
                    .filter(Boolean)
                    .join(" , ") || "";

                return {
                    ...item,
                    due: formattedDue,
                    totalStockValue: formattedTotalStockValue,
                    minimum_stock_value: formattedMinimumStockValue,
                    neededStock: resultNeededStock.toFixed(2),
                    totalStock: resultTotalStock.toFixed(2),
                    zoneNames,
                    baseNames,
                    areaNames,
                    regionNames,
                };
            });

            setReceiveData(formattedData);
            const { current_page, per_page, total } = response.data;
            setPagination({ current_page, per_page, total });
        } catch (error) {
            console.error("Search error:", error);
            showAlert("Failed to perform search", "danger");
        } finally {
            setLoading(false);
        }
    }

    const formatDistributorData = (item) => {
        const formattedDue = parseNumber(item.due || 0).toFixed(2);
        const formattedTotalStockValue = parseNumber(item.totalStockValue || 0).toFixed(2);
        const formattedMinimumStockValue = parseNumber(item.minimum_stock_value || 0).toFixed(2);

        const stock = parseNumber(formattedTotalStockValue);
        const resultNeededStock = (stock + parseNumber(formattedDue)) - parseNumber(formattedMinimumStockValue);
        const resultTotalStock = stock + parseNumber(formattedDue);

        const distributor_workplace = Array.isArray(item.distributor_workplace) ? item.distributor_workplace : [];
        const sr_base_info = Array.isArray(item.sr_base_info) ? item.sr_base_info : [];

        const zoneNames = Array.from(
            new Set(distributor_workplace.map(info => info?.zone?.name).filter(Boolean))
        ).join(" , ") || "";

        const baseNames = sr_base_info
            .map(info => info?.base?.name)
            .filter(Boolean)
            .join(" , ") || "";

        const areaNames = distributor_workplace
            .map(info => info?.area?.name)
            .filter(Boolean)
            .join(" , ") || "";

        const regionNames = distributor_workplace
            .map(info => info?.region?.name)
            .filter(Boolean)
            .join(" , ") || "";

        return {
            ...item,
            due: formattedDue,
            totalStockValue: formattedTotalStockValue,
            minimum_stock_value: formattedMinimumStockValue,
            neededStock: resultNeededStock.toFixed(2),
            totalStock: resultTotalStock.toFixed(2),
            zoneNames,
            baseNames,
            areaNames,
            regionNames,
        };
    };

    return (
        <div>
            <IsLogin></IsLogin>
            {/* <LoaderComponent /> */}
            <div>
                <div className="am-mainpanel">
                    <div className="am-pagetitle">
                        <h5 className="am-title">All Distributors Stock Reports</h5>
                    </div>

                    <div className="am-pagebody" id="AllDistributorStockReport">
                        <Alert alert={alert} />

                        <div className="card">
                            <div className="col-lg-6 px-0 mb-3 ">
                                <div className="col-lg-auto">
                                    <button
                                        className="btn btn-success"
                                        onClick={handleExportCSV}
                                        disabled={exporting}
                                    >
                                        {exporting ? (
                                            <i className="fa fa-spinner fa-spin mg-r-6"></i>
                                        ) : (
                                            <i className="fa fa-file-excel-o mg-r-6"></i>
                                        )}
                                        CSV
                                    </button>
                                </div>
                                <div className="col-lg-4  mb-3 text-align-right" style={{ textAlign: "end" }}>
                                    <label>Search</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ zIndex: 99999 }}
                                        name="search"
                                        placeholder="Search..."
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            <ReactDataTable

                                cols={cols}
                                receiveData={mappedData}
                                // imageBodyTemplate={imageBodyTemplate}
                                exportCsvOrPdf={false}
                                totalNumber={pagination.total}
                                actionTemplate={actionTemplate}
                                // detailOnName={detailOnName}
                                deleteData={deleteData}
                                // statusChange={statusChange}
                                isLoading={loading}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center p-2">
                        <Pagination
                            pagination={pagination}
                            totalPages={Math.ceil(pagination.total / pagination.per_page)}
                            onPageChange={(page) => fetchData(page, limit)} // use current limit
                            onLimitChange={handleLimitChange} />
                        {/* <nav aria-label="Pagination">
                            <ul className="pagination d-flex justify-content-center">

                                <li className={`page-item  ${pagination.current_page === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => fetchData(pagination.current_page - 1)} disabled={pagination.current_page === 1}>
                                        ❮
                                    </button>
                                </li>

                                {getPageNumbers().map((page) => (
                                    page <= totalPages && (
                                        <li key={page} className={`page-item ${pagination.current_page === page ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => fetchData(page)}>
                                                {page}
                                            </button>
                                        </li>
                                    )
                                ))}

                                <li className={`page-item ${pagination.current_page === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => fetchData(pagination.current_page + 1)} disabled={pagination.current_page === totalPages}>
                                        ❯
                                    </button>
                                </li>
                            </ul>
                        </nav> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const actionTemplate = (rowData, deleteData, statusChange, outSideCompany) => {
    return (
        <div className="text-xs text-nowrap">
            <Link
                to={{ pathname: "/distributor-details/" + rowData.id }}
                className="btn btn-info btn-sm mx-1"
                title="View"
            >
                <i className="fa fa-list" aria-hidden="true"></i>
            </Link>
        </div>
    );
};

export default List;
