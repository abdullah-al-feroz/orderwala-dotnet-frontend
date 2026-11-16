import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Http from "../../../Common/Http";
import IsLogin from "../../../Common/IsLogin";
import FormValidation from "../../../Common/FormValidation";
import useRequiredFields from "../../../../hooks/useRequiredFields";
import { LoaderComponent } from "../../../Common/LoaderComponent";
import Swal from "sweetalert2";

const AssignMdo = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { checkRequiredFields } = useRequiredFields();
  const [inputs, setInputs] = useState({});
  const [mdo, setMdo] = useState([]);
  const [mdoList, setMdoList] = useState({});
  const [error, setError] = useState({});



  const fetchData = () => {
    // Fetch other data as required
    Http.get("/app/get-mdo-list-assign-with-bp/" + id)
      .then((res) => {
        const fetchedMdoList = res.data;
        setMdoList(fetchedMdoList); // Fallback to an empty array if no data
        setInputs({
          mdo_id: fetchedMdoList[0].id,
        });
      })
      .catch((error) => {
        // Handle errors for this request
        console.error("Error fetching route user data:", error);
      });

    Http.get("/app/get-mdo-list")
      .then((res) => {
        setMdo(res.data || []); // Fallback to an empty array if no data
      })
      .catch((error) => {
        // Handle errors for this request
        console.error("Error fetching route user data:", error);
      });
  };
  console.log(mdoList, 'mdoList')

  useEffect(() => {
    fetchData();
  }, [id]);

  const formSubmit = () => {
    const isSelectFieldsValid = checkRequiredFields();
    if (isSelectFieldsValid) {
      Http.post("/app/assign-mdo/" + id, inputs)
        .then((res) => {
          // Handle successful submission
          navigate("/staff", {
            state: { message: res.data.message, type: res.data.type },
          });
        })
        .catch(function (e) {
          console.log(e, 'err')
          Swal.fire("Warning!", e.response.data.message, "warning");
          // setError(e.response.data.errors);
        });
    } else {
      // Set an error message or handle the validation failure
      setError({ message: "Please select MDO for all days." });
    }
  };
  const selectHandleMdoChange = (option, dayIndex) => {
    // Update the inputs state with the selected MDO ID for the specific day
    setInputs((values) => ({
      ...values,
      [`mdo_id`]: option ? option.id : null, // Use dayIndex to create a unique key
    }));
  };
  return (
    <div>
      <LoaderComponent />
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">Assign MDO with BP</h5>
        </div>
        <div className="am-pagebody">
          <div className="card">
            <h6 className="card-body-title pb-0">Assign MDO with BP</h6>
            <div className="row">
              <div className="col-lg">
                {error.message && (
                  <div className="alert alert-danger">{error.message}</div>
                )}
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-6">
                <label>
                  Mdo  <i className="fa fa-star required"></i>
                </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="mdo_id"
                options={mdo} // list of all options
                getOptionLabel={(option) => `${option.name}`}
                getOptionValue={(option) => option.id}
                value={mdo.find((item) => item.id == inputs[`mdo_id`]) || null}
                onChange={(option) => selectHandleMdoChange(option)}
                data-required
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-3">
              <button
                className="btn btn-primary btn-block mg-b-10"
                onClick={formSubmit}
              >
                <i className="fa fa-send mg-r-10"></i> Submit
              </button>
            </div>
          </div>
        </div>
        {/* card */}
      </div>
    </div>
  );
};

export default AssignMdo;
