import React from "react";

const Info = (props) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <table className="table table-sm">
            <tr>
              <th>Owner Name</th>
              <td>{props.data.owner_name}</td>
            </tr>
            <tr>
              <th>Shop Name</th>
              <td>{props.data.shop_name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{props.data.email}</td>
            </tr>
            <tr>
              <th>Mobile</th>
              <td>{props.data.phone}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{props.data.address}</td>
            </tr>
            <tr>
              <th>NID</th>
              <td>{props.data.nid_no}</td>
            </tr>
            <tr>
              <th>NID Image (Front)</th>
              <td>
                <img
                  src="https://members.familycentre.online/assets/images/default_user.png"
                  alt="employee"
                  style={{
                    width: "100px",
                    height: "108px",
                    marginBottom: "10px",
                    border: "2px solid #983720",
                    borderRadius: "8px",
                    paddingTop: "8px",
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>NID Image (Back)</th>
              <td>
                <img
                  src="https://members.familycentre.online/assets/images/default_user.png"
                  alt="employee"
                  style={{
                    width: "100px",
                    height: "108px",
                    marginBottom: "10px",
                    border: "2px solid #983720",
                    borderRadius: "8px",
                    paddingTop: "8px",
                  }}
                />
              </td>
            </tr>
          </table>
        </div>
        <div className="col-lg">
          <table className="table table-sm">
            <tr>
              <th>Trade License No</th>
              <td>{props.data.trade_license_no}</td>
            </tr>
            <tr>
              <th>Trade License Image</th>
              <td>
                <img
                  src="https://members.familycentre.online/assets/images/default_user.png"
                  alt="employee"
                  style={{
                    width: "100px",
                    height: "108px",
                    marginBottom: "10px",
                    border: "2px solid #983720",
                    borderRadius: "8px",
                    paddingTop: "8px",
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>Division</th>
              <td>{props.data.division ? props.data.division.name : ""}</td>
            </tr>
            <tr>
              <th>District</th>
              <td>{props.data.district ? props.data.district.name : ""}</td>
            </tr>
            <tr>
              <th>Thana</th>
              <td>{props.data.thana ? props.data.thana.name : ""}</td>
            </tr>
            <tr>
              <th>Place</th>
              <td>{props.data.place ? props.data.place.name : ""}</td>
            </tr>
            <tr>
              <th>Route</th>
              <td>{props.data.route ? props.data.route.name : ""}</td>
            </tr>
            <tr>
              <th>Distributor</th>
              <td>
                {props.data.distributor ? props.data.distributor.name : ""}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default Info;
