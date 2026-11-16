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
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 50,
        total: 0,
    });

    const parseNumber = (val) => Number(String(val).replace(/,/g, '')) || 0;

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

    const fetchData = async (page = 1, customLimit = limit) => {
        setLoading(true);
        try {
            const userResponse = await Http.get("/me");
            setOutSideCompany(userResponse.data);

            let response;
            console.log(searchTerm)
            if (!searchTerm.trim()) {
                response = await Http.post(`/report/search-distributor-stock-report`, {
                    search: searchTerm,
                    page,
                    limit: customLimit,
                });
            } else {
                response = await Http.get(`/report/all-distributor-stock-report?page=${page}&limit=${customLimit}`);
            }

            const formattedData = response.data.data.map(formatDistributorData);
            setReceiveData(formattedData);

            const { current_page, per_page, total } = response.data;
            setPagination({ current_page, per_page, total });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
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

    const mappedData = (receiveData || []).map(formatDistributorData);

    const fetchAllData = useCallback(async () => {
        try {
            setExporting(true);
            let response = await Http.get(`/report/all-distributor-stock-report?limit=10000000`);
            return response.data.data.map(formatDistributorData);
        } catch (error) {
            console.error("Export error:", error);
            showAlert("Failed to export data", "danger");
            return [];
        } finally {
            setExporting(false);
        }
    }, []);

    const handleExportPDF = async () => {
        const allData = await fetchAllData();
        exportToPDF({
            cols,
            data: allData,
            title: "Distributor Stock Report",
            filename: "distributor_stock_report"
        });
    };

    const handleExportCSV = async () => {
        const allData = await fetchAllData();
        exportToCSV({
            cols,
            data: allData,
            filename: "distributor_stock_report"
        });
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
     

        // If search term is empty, fetch all data
        if (!value.trim()) {
            setSearchTerm(''); // Clear search term
            console.log(value)
            fetchData(1, limit); // Fetch first page with all data
        } else {
            // Otherwise perform search
            setLoading(true);
            try {
                setSearchTerm(value);
                const response = await Http.post(`/report/search-distributor-stock-report`, {
                    search: value,
                    page: 1,
                    limit: limit,
                });

                const formattedData = response.data.data.map(formatDistributorData);
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
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        fetchData(1, newLimit); // Reset to page 1 when changing limit
    };

    return (
        <div>
            <IsLogin></IsLogin>
            <div className="am-mainpanel">
                <div className="am-pagetitle">
                    <h5 className="am-title">All Distributors Stock Reports</h5>
                </div>

                <div className="am-pagebody" id="AllDistributorStockReport">
                    <Alert alert={alert} />

                    <div className="card SearchHide">
                        <div className="row justify-content-between align-items-center">
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
                                    {/* <button
                                        className="btn btn-danger ml-2"
                                        onClick={handleExportPDF}
                                        disabled={exporting}
                                    >
                                        {exporting ? (
                                            <i className="fa fa-spinner fa-spin mg-r-6"></i>
                                        ) : (
                                            <i className="fa fa-file-pdf-o mg-r-6"></i>
                                        )}
                                        PDF
                                    </button> */}
                                </div>
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
                                    value={searchTerm}
                                />
                            </div>
                        </div>
                        <ReactDataTable
                            cols={cols}
                            receiveData={mappedData}
                            exportCsvOrPdf={false}
                            totalNumber={pagination.total}
                            actionTemplate={(rowData) => actionTemplate(rowData, deleteData, null, outSideCompany)}
                            deleteData={deleteData}
                            isLoading={loading}
                        />
                    </div>
                    <div className="d-flex justify-content-center align-items-center p-2">
                        <Pagination
                            pagination={pagination}
                            totalPages={Math.ceil(pagination.total / pagination.per_page)}
                            onPageChange={(page) => fetchData(page, limit)}
                            onLimitChange={handleLimitChange}
                        />
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