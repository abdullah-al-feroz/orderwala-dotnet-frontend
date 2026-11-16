import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HttpSupplyChain from "../../../../Common/HttpSupplyChain";
import FormValidation from "../../../../Common/FormValidation";
import useRequiredFields from "../../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../../Common/LoaderComponent";
import Select from "react-select";

const Edit = (props) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const zoneId = parseInt(id);
  const [error, setError] = useState({});
  const { checkRequiredFields } = useRequiredFields();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const fetchData = () => {
    HttpSupplyChain.get("/Zone/GetById/" + zoneId).then((res) => {
      const d = res?.data?.data || {};
      const channelId = d.channelId ?? d.channel?.assignPersonId ?? d.channel?.id ?? 0;
      setInputs({
        name: d.name,
        remarks: d.remarks,
        hmo: Number(channelId) || 0,
        status: d.status,
        startedFrom: d.startedFrom?.split("T")[0]
      });
      if (channelId) {
        const user = (d.channel) ? { value: d.channel.assignPersonId || d.channel.id, label: d.channel.name } : null;
        if (user && user.value) {
          setSelectedUser({ value: Number(user.value), label: user.label || d.channel?.name });
        }
      }
    });
  };

  useEffect(() => {
    fetchData();
    getUsers();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "status") {
      const numeric = value === "" ? "" : parseInt(value, 10);
      setInputs((values) => ({ ...values, [name]: numeric }));
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const getUsers = () => {
    HttpSupplyChain.get(`/Channel/paginated?Page=${page}&PageSize=${size}`)
      .then((res) => {
        const responseData = res?.data?.data?.map(item => ({
          id: item?.id,
          name: item?.name
        }));
        setUsers(responseData);
      })
      .catch(function (e) {
        setError(e?.response?.data?.message);
      });
  };

    const selectHandleChange = (selectedOption, actionMeta) => {
    const name = actionMeta.name;
    const value = selectedOption ? selectedOption.value : "";
    setInputs((values) => ({ ...values, [name]: value }));
    setSelectedUser(selectedOption);
  };

  const formSubmit = () => {
    if (checkRequiredFields()) {
      const payload = {
        channelId: inputs.hmo || inputs.channelId || 0,
        name: inputs.name || "",
        startedFrom: inputs.startedFrom || inputs.started_from || new Date().toISOString(),
        status: typeof inputs.status === "number" ? inputs.status : parseInt(inputs.status || 0, 10),
        remarks: inputs.remarks || "",
        id: zoneId,
        updatedAt: new Date().toISOString(),
      };

        HttpSupplyChain.put("/Zone/Update/" + zoneId, payload)
          .then((res) => {
            navigate("/zone", {
              state: { message: res?.data?.message || "Zone updated successfully", type: "success" },
            });
          })
        .catch(function (e) {
          setError(e?.response?.data?.message || "Failed to update zone");
        });
    }
  };
  
  const selectedHmo = userOptions.find(option => option.value === Number(inputs.hmo));

  return (
    <div>
      {/* <LoaderComponent /> */}
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Create Designation</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">
              Edit Designation Form
            </h6>
            <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <label htmlFor="">
                  zone Name <i className="fa fa-star required"></i>
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
              {/* col */}
              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label htmlFor="">
                  Date <i className="fa fa-star required"></i>
                </label>
                <input
                  type="date"
                  className="form-control select2"
                  name="startedFrom"
                  value={inputs.startedFrom || ""}
                  onChange={handleChange}
                  placeholder="Input Date"
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
                  value={selectedUser || selectedHmo || null}
                  name="hmo"
                  options={userOptions}
                  isClearable
                  isSearchable
                  onChange={selectHandleChange}
                />
              </div>

              <div className="col-lg mg-t-10 mg-lg-t-0">
                <label htmlFor="">Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={inputs.status ?? 0}
                  onChange={handleChange}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
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
                  <i className="fa fa-send mg-r-10"></i> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;