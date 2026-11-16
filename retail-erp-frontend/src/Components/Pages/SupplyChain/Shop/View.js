import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../../../Common/Http";
import FormValidation from "../../../Common/FormValidation";
import Info from "./Info";
import OrderList from "./OrderList";
import OrderReturnList from "./OrderReturnList";
import LoaderComponent from "../../../Common/LoaderComponent";

const Edit = (props) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const { id } = useParams();
  const [orderList, setOrderList] = useState({});
  const [orderReturnList, setOrderReturnList] = useState({});
  const [error, setError] = useState({});
  const [receiveData, setReceiveData] = useState({});

  const fetchData = () => {
    Http.get("/customer/" + id).then((res) => {
      setReceiveData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const orderListLoad = () => {
    Http.get("/customer-order-list/" + id).then((res) => {
      setOrderList(res.data);
    });
  };
  const orderReturnLoad = () => {
    Http.get("/customer-order-return-list/" + id).then((res) => {
      setOrderReturnList(res.data);
    });
  };

  return (
    <div>
      <LoaderComponent/>
      <div className="am-mainpanel">
        <div className="am-pagetitle">
          <h5 className="am-title">{receiveData.owner_name}</h5>
        </div>
        <div className="am-pagebody">
          <div className="card pd-20 pd-sm-40">
            <h6 className="card-body-title mg-sm-b-30">Profile</h6>
            {/* <div className="row">
              <div className="col-lg">
                <FormValidation error={error} />
              </div>
            </div> */}
            <div className="row row-sm">
              <div className="col-lg-12 mb-5">
                <div className="card" style={{ backgroundColor: "#D0D0D0" }}>
                  <div className="wd-100p">
                    <div className="pd-x-20 pd-20">
                      <section className="content">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="box box-primary">
                              <div className="box-body box-profile">
                                <img
                                  className="profile-user-img img-responsive img-circle"
                                  style={{ margin: "0 auto" }}
                                  src="https://members.familycentre.online/assets/images/default_user.png"
                                  alt="User profile picture"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <div className="box box-primary">
                              <div className="box-body box-profile text-center">
                                <ul className="list-group list-group-unbordered">
                                  <li className="list-group-item text-left pt-3">
                                    <h3 className="profile-username text-center">
                                      {receiveData.owner_name}
                                    </h3>
                                  </li>
                                  <li className="list-group-item text-left pt-2">
                                    <b>Customer Code</b>{" "}
                                    <span className="pull-right">
                                      {receiveData.code}
                                    </span>
                                  </li>
                                  <li className="list-group-item text-left pt-2">
                                    <b>Shop Name</b>{" "}
                                    <span className="pull-right">
                                      {receiveData.shop_name}
                                    </span>
                                  </li>
                                  <li className="list-group-item text-left">
                                    <b>Phone</b>{" "}
                                    <a className="pull-right">
                                      {receiveData.phone}
                                    </a>
                                  </li>
                                  <li className="list-group-item text-left">
                                    <b>Email</b>{" "}
                                    <a className="pull-right">
                                      {receiveData.email}
                                    </a>
                                  </li>
                                  <li className="list-group-item text-left pb-3">
                                    <b>Status</b>{" "}
                                    <a className="pull-right">
                                      {receiveData.status}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#home"
                      type="button"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      Home
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="salary-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#orderList"
                      type="button"
                      role="tab"
                      aria-controls="orderList"
                      aria-selected="false"
                      onClick={orderListLoad}
                    >
                      Order List
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="salary-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#orderReturnList"
                      type="button"
                      role="tab"
                      aria-controls="orderReturnList"
                      aria-selected="false"
                      onClick={orderReturnLoad}
                    >
                      Return Order
                    </button>
                  </li>
                </ul>
                <div className="tab-content mt-4" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <Info data={receiveData} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="orderList"
                    role="tabpanel"
                    aria-labelledby="salary-tab"
                  >
                    <OrderList data={orderList} />
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="orderReturnList"
                    role="tabpanel"
                    aria-labelledby="salary-tab"
                  >
                    <OrderReturnList data={orderReturnList} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card */}
        </div>
      </div>
    </div>
  );
};

export default Edit;
