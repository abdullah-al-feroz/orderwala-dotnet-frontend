import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import IsLogin from "../../../../Common/IsLogin";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Select from "react-select";

const Create = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { checkRequiredFields } = useRequiredFields();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const getCurrentDateInput = () => {
        const dateObj = new Date();

        // get the month in this format of 04, the same for months
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const year = dateObj.getFullYear();

        const shortDate = `${year}-${month}-${day}`;

        setInputs((values) => ({ ...values, ["started_from"]: shortDate }));
    };

    const formSubmit = () => {
        if (checkRequiredFields()) {
            const payload = {
                channelId: inputs.channelId,
                hmo: inputs.hmo,
                name: inputs.name || "",
                startedFrom: inputs.started_from || inputs.startedFrom || new Date().toISOString(),
                status: 1,
                remarks: inputs.remarks || "",
            };

            HttpSupplyChain.post("/Zone/Create", payload)
                .then((res) => {
                    const message = res?.data?.message || "Zone has been saved successfully";
                    navigate("/zone", {
                        state: { message: message, type: "success" },
                    });
                })
                .catch(function (e) {
                    const msg = e?.response?.data?.message || e?.message || "Failed to save zone";
                    setError(msg);
                });
        }
    };

    const getUsers = () => {
        HttpSupplyChain.get("/Channel/paginated?Page=1&PageSize=10")
            .then((res) => {
                const data = res?.data?.data || [];
                const formatted = data.map((item) => ({
                    value: item.assignPersonId,
                    label: item.name,
                }));
                setUsers(formatted);
            })
            .catch(function (e) {
                setError(e?.response?.data?.message || "Failed to load users");
            });
    };

    useEffect(() => {
        getUsers();
        getCurrentDateInput();
    }, []);

    const selectHandleChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";
        setInputs((values) => ({ ...values, [name]: value }));
        setSelectedUser(selectedOption);
    };
    const userOptions = users;

    return (
        <div>
            <IsLogin></IsLogin>
            {/* <LoaderComponent /> */}
            <div className="am-mainpanel">
                <div className="am-pagetitle">
                    <h5 className="am-title">Create Zone</h5>
                </div>
                <div className="am-pagebody">
                    <div className="card pd-20 pd-sm-40">
                        <h6 className="card-body-title mg-sm-b-30">Create Zone Form</h6>
                        <div className="row">
                            <div className="col-lg">
                                <FormValidation error={error} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg">
                                <label htmlFor="">
                                    Zone Name <i className="fa fa-star required"></i>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={inputs.name || ""}
                                    onChange={handleChange}
                                    placeholder="Input Name"
                                    data-required
                                />
                            </div>
                            <div className="col-lg">
                                <label htmlFor="">
                                    Date <i className="fa fa-star required"></i>
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="started_from"
                                    value={inputs.started_from || ""}
                                    onChange={handleChange}
                                    data-required
                                />
                            </div>
                            <div className="col-lg">
                                <label htmlFor="">
                                    Bangal In Charge
                                </label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="hmo"
                                    placeholder="Select Bangal In Charge"
                                    options={userOptions}
                                    isClearable
                                    isSearchable
                                    value={selectedUser}
                                    onChange={selectHandleChange}
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-lg">
                                <label htmlFor="">Remarks</label>
                                <textarea
                                    className="form-control"
                                    name="remarks"
                                    value={inputs.remarks || ""}
                                    onChange={handleChange}
                                    placeholder="Remarks"
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <div className="col-3">
                                <button
                                    className="btn btn-primary btn-block mg-b-10"
                                    onClick={formSubmit}
                                >
                                    <i className="fa fa-send mg-r-10"></i> Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Create;