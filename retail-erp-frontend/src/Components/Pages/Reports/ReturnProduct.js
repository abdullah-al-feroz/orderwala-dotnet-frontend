import React, { useEffect, useState } from 'react'
import ReactDataTable from '../../Common/ReactDataTable';
import LoaderComponent from '../../Common/LoaderComponent';
import IsLogin from '../../Common/IsLogin';
import Http from '../../Common/Http';
import DatatableFunc from '../../Common/DatatableFunc';
import { useLocation } from 'react-router-dom';

const ReturnProduct = () => {
    const location = useLocation();
    const [receiveData, setReceiveData] = useState([]);
    const [factory, setFactory] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatDate = (dateStr) => {
        const match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
        return match ? match[0] : '';
    };

    const fetchData = () => {
        setLoading(true);
        Http.get("/report/return-product").then((res) => {
            // setReceiveData(res.data.report);

            const transformedData = res.data.report.flatMap((group) => {
                const headerRow = {
                    isGroupHeader: true,
                    distributor_name: group.distributor_name
                };

                const productRows = group.items.map((item, index) => ({
                    ...item,
                    isGroupHeader: false,
                    sl: index + 1 // Serial per distributor group
                }));

                return [headerRow, ...productRows];
            });

            setReceiveData(transformedData);


            // const rawReport = res.data.report;

            // // Flatten the grouped data
            // const flattened = rawReport.flatMap((entry) =>
            //     entry.items.map((item) => ({
            //         distributor_name: entry.distributor_name,
            //         product_name: item.product_name,
            //         qty: item.qty,
            //     }))
            // );

            // setReceiveData(flattened);


            setInputs((prev) => ({
                ...prev,
                start_date: formatDate(res.data.start_date),
                end_date: formatDate(res.data.end_date),
            }));
            setLoading(false);
        });
    };
    useEffect(() => {
        DatatableFunc();
        fetchData();
    }, []);

    console.log(receiveData)

    const cols = [
        {
            field: "sl",
            header: "SL",
            body: (rowData) =>
                rowData.isGroupHeader ? null : rowData.sl,
        },
        { // Keep this as a string for search/sort
            field: (rowData) =>
                rowData.isGroupHeader ? (
                    <strong className="text-base py-4">{rowData.distributor_name}</strong>
                ) : (
                    rowData.product_name
                ),
        },
        {
            header: "Return Qty",
            field: (rowData) =>
                rowData.isGroupHeader ? null : rowData.qty,
        },
    ];

    factory.forEach((item, index) => {
        cols.push({
            field: (rowData) =>
                rowData[item.name.toLowerCase().replace(/\s+/g, "_")] || "0",
            header: item.name,
        });
    });

    //Date range start


    const [inputs, setInputs] = useState({
        date: new Date().toISOString().substr(0, 10),
        status: "active",
        start_date: "",
        end_date: "",
    });

    //Date range end

    //Date range start
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const formSubmit = () => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        const submissionInputs = { ...inputs };
        if (submissionInputs.start_date) {
            queryParams.append("start_date", submissionInputs.start_date);
        }
        if (submissionInputs.end_date) {
            queryParams.append("end_date", submissionInputs.end_date);
        }
        if (inputs)
            Http.get(`/report/return-product?${queryParams.toString()}`).then((res) => {
                // setReceiveData(res.data.report);

                const transformedData = res.data.report.flatMap((group) => {
                    const headerRow = {
                        isGroupHeader: true,
                        distributor_name: group.distributor_name
                    };
    
                    const productRows = group.items.map((item, index) => ({
                        ...item,
                        isGroupHeader: false,
                        sl: index + 1 // Serial per distributor group
                    }));
    
                    return [headerRow, ...productRows];
                });
    
                setReceiveData(transformedData);

                setInputs((prev) => ({
                    ...prev,
                    start_date: formatDate(res.data.start_date),
                    end_date: formatDate(res.data.end_date),
                }));
                setLoading(false);
            });
    };

    const getFullDateRangeText = () => {
        if (!inputs.start_date || !inputs.end_date) return "";

        const start = new Date(inputs.start_date);
        const end = new Date(inputs.end_date);

        const formatDate = (date) =>
            `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;

        const startFormatted = formatDate(start);
        const endFormatted = formatDate(end);

        return startFormatted === endFormatted
            ? `Showing report for ${startFormatted}`
            : `Showing report from ${startFormatted} to ${endFormatted}`;
    };


    //Date range end

    return (
        <div>
            <IsLogin></IsLogin>
            <div>
                {/* <h2>Hello</h2> */}
                <div className="am-mainpanel">
                    <div className="am-pagetitle">
                        <h5 className="am-title">Return Product</h5>
                    </div>
                    <div className="am-pagebody">
                        <div className="card pd-20 pd-sm-40">
                            <h3 className="card-body-title mt-4 text-center">
                                Return Product
                            </h3>
                            <p className="text-center text-danger mg-sm-b-30">{getFullDateRangeText()}</p>

                            {/* Date range start */}
                            <div className="card pd-sm-40">
                                <div className="row">
                                    <div className="col-lg">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="start_date"
                                            value={inputs.start_date || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-lg">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="end_date"
                                            value={inputs.end_date || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-lg mt-4">
                                        <button
                                            className="btn btn-primary btn-block mg-b-10"
                                            onClick={formSubmit}
                                        >
                                            <i className="fa fa-send mg-r-10"></i> Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Date range end */}
                            <hr />
                            <div className="card">
                                <ReactDataTable cols={cols} receiveData={receiveData} isLoading={loading} />

                                {/* <table className="table-auto border-collapse w-full border my-3">

                                    {receiveData.map((group, index) => (
                                        <React.Fragment key={index}>
                                            <thead>
                                                <tr>
                                                    <th colSpan="2" className="bg-gray-200 text-left p-2">  {group.distributor_name}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.items.map((item, itemIndex) => (
                                                    <tr key={itemIndex}>
                                                        <td className="p-2">{item.product_name}</td>
                                                        <td className="p-2">{item.qty}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </React.Fragment>
                                    ))}
                                </table> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ReturnProduct
