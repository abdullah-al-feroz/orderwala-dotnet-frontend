// AdvancedPagination.jsx
import { useCallback, useState } from "react";
import Pagination from "../Pagination"; // Make sure this path is correct
import { exportToCSV, exportToPDF } from "../ExportUtils";
import Http from "../Http";

export const usePaginationState = (
  initialPerPage = 50,
  url,
  cols,
  searchUrl,
) => {
  const [alert, setAlert] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: initialPerPage,
    total: 0,
  });

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      per_page: newLimit,
      current_page: 1,
    }));
  };

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

   const fetchAllData = useCallback(async (page = pagination.current_page, limit = pagination.per_page) => {
    try {
      setExporting(true);
      let response = null;
      if(url.includes('?')){
        response = await Http.get(`/${url}&page=${page}&limit=${limit}`);
      }else{
        response = await Http.get(`/${url}?page=${page}&limit=${limit}`);
      }
      if(response.data.workPlaceRoute) {
        return response.data.workPlaceRoute.data;
      }
      if (response.data.list) {
        return response.data.list;
      }else if(response.data.data) {
        return response.data.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error("Export error:", error);
      showAlert("Failed to export data", "danger");
      return [];
    } finally {
      setExporting(false);
    }
  }, [url, pagination.current_page, pagination.per_page]);

  const handleExportPDF = async () => {
    const allData = await fetchAllData(); // Function to get all records
    exportToPDF({
      cols,
      data: allData,
      title: "Your Report Title",
      filename: "download",
    });
  };

  const handleExportCSV = async () => {
    const allData = await fetchAllData();
    exportToCSV({
      cols,
      data: allData,
      filename: "download",
    });
  };

  const AdvancePagination = ({ onPageChange, onLimitChange, showPerPage = false }) => (
    <Pagination
      pagination={pagination}
      totalPages={Math.ceil(pagination.total / pagination.per_page)}
      onPageChange={onPageChange}
      showPerPage={showPerPage}
      onLimitChange={(limit) => {
        handleLimitChange(limit);
        onLimitChange?.(limit);
      }}
    />
  );

  const handleSearch = useCallback(async (searchTerm) => {
    try {
      // setLoading(true);
      const response = await Http.get(`${searchUrl}&search=${searchTerm}`);
      if (response.data.list) {
        return response.data.list;
      }else if (response.data.data) {
        return response.data.data;
      } else {
      const { data, current_page, per_page, total } = response.data;
      setPagination({ current_page, per_page, total })
      return data; // Return the search results
      }
    } catch (error) {
      console.error("Search error:", error);
      showAlert("Search failed", "danger");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);


 const searchTemplate = (handleSearchChange) => {
  return (
    <div className="row justify-content-between align-items-center">
      <div className="col-lg-6 px-0 mb-3">
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
      </div>
      <div className="col-lg-4 mb-3 text-align-right" style={{ textAlign: "end" }}>
        <label>Search</label>
        <input
          type="text"
          className="form-control"
          name="search"
          placeholder="Search..."
          onChange={handleSearchChange} // 👈 Now comes from List
        />
      </div>
    </div>
  );
};


  return {
    pagination,
    setPagination,
    handleLimitChange,
    AdvancePagination,
    fetchAllData,
    handleSearch,
    searchTemplate
  };
};
