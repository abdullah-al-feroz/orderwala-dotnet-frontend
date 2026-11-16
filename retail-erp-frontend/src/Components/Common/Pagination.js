import React from "react";

const Pagination = ({ pagination, totalPages, onPageChange, onLimitChange, showPerPage = false, hideFirstLastButtons = false }) => {
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

    return (
        <div className="d-flex justify-content-center align-items-center p-2">
            <nav aria-label="Pagination">
                <ul className="pagination d-flex justify-content-center align-items-center gap-2">
                    {/* Limit dropdown */}
                    <li className="page-item">
                        <select
                            className="form-select"
                            defaultValue={pagination.per_page || 50}
                            name="limit"
                            onChange={(e) => onLimitChange(parseInt(e.target.value))}
                            style={{ padding: '10px 20px' }}
                            aria-label="Rows per page"
                        >
                            {showPerPage === true ? (
                                <>
                                    {[10, 20, 30, 40, 50, 100, 200, 250].map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {[10, 20, 30, 40, 50, 100, 200, 250, 500, 1000].map((value) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))}
                                </>
                            )}

                        </select>
                    </li>

                    {/* First Page */}
                    {!hideFirstLastButtons && (
                        <li className={`page-item ${pagination.current_page === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                style={{ width: "80px" }}
                                onClick={() => onPageChange(1)}
                                disabled={pagination.current_page === 1}
                                title="First Page"
                            >
                                First Page
                            </button>
                        </li>
                    )}

                    {/* Previous */}
                    <li className={`page-item ${pagination.current_page === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            title="Previous Page"
                        >
                            ❮
                        </button>
                    </li>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                        <li key={page} className={`page-item ${pagination.current_page === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        </li>
                    ))}

                    {/* Next */}
                    <li className={`page-item ${pagination.current_page === totalPages ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === totalPages}
                            title="Next Page"
                        >
                            ❯
                        </button>
                    </li>

                    {/* Last Page */}
                    {!hideFirstLastButtons && (
                        <li className={`page-item ${pagination.current_page === totalPages ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                style={{ width: "80px" }}
                                onClick={() => onPageChange(totalPages)}
                                disabled={pagination.current_page === totalPages}
                                title="Last Page"
                            >
                                Last Page
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
