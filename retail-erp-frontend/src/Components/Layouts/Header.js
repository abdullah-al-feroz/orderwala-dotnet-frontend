import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Http from "../Common/Http";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import $ from "jquery";

const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [notification, setNotification] = useState({});

  const fetchData = () => {
    Http.get("/me").then((res) => {
      setUser(res.data.data);
    });
  };

  useEffect(() => {
    $("#naviconLeftMobiles").on("click touchstart", function (e) {
      e.preventDefault();
      $("body").toggleClass("show-left");
    });
    fetchData();
  }, []);

  useEffect(() => {
    // const fetchNotificationData = () => {
    //   Http.get("/unread-notification")
    //     .then((res) => {
    //       setNotification(res.data);
    //       document.getElementById("app-title").innerText =
    //         res.data.length > 0
    //           ? `(${res.data.length}) Limtech ERP`
    //           : "Limtech ERP";
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching notifications:", error);
    //     });
    // };

    // const interval = setInterval(fetchNotificationData, 50000);

    // return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const signOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (location.pathname == "/" || location.pathname == "/login") return null;
  return (
    <div>
      <div className="am-header">
        <div className="am-header-left">
          <a id="naviconLeft" className="am-navicon d-none d-lg-flex">
            <i className="icon ion-navicon-round" />
          </a>
          <a id="naviconLeftMobiles" className="am-navicon d-lg-none">
            <i className="icon ion-navicon-round" />
          </a>
          <a href="index.html" className="am-logo">
            Orderwala
          </a>
        </div>
        {/* am-header-left */}
        <div className="am-header-right">
          {/* <div className="dropdown dropdown-notification">
            <a className="nav-link pd-x-7 pos-relative" data-toggle="dropdown">
              <i className="icon ion-ios-bell-outline tx-24" />
              <span className="square-8 bg-danger pos-absolute t-15 r-0 rounded-circle" />
            </a>
            <div className="dropdown-menu wd-300 pd-0-force">
              <div className="dropdown-menu-header">
                <label>Notifications</label>
                <a>Mark All as Read</a>
              </div>
              <div className="media-list">
                <a className="media-list-link read">
                  <div className="media pd-x-20 pd-y-15">
                    <img
                      src="assets/img/img8.jpg"
                      className="wd-40 rounded-circle"
                    />
                    <div className="media-body">
                      <p className="tx-13 mg-b-0">
                        <strong className="tx-medium">Suzzeth Bungaos</strong>{" "}
                        tagged you and 18 others in a post.
                      </p>
                      <span className="tx-12">October 03, 2017 8:45am</span>
                    </div>
                  </div>
                </a>
                <a className="media-list-link read">
                  <div className="media pd-x-20 pd-y-15">
                    <img
                      src="assets/img/img9.jpg"
                      className="wd-40 rounded-circle"
                    />
                    <div className="media-body">
                      <p className="tx-13 mg-b-0">
                        <strong className="tx-medium">Mellisa Brown</strong>{" "}
                        appreciated your work{" "}
                        <strong className="tx-medium">
                          The Social Network
                        </strong>
                      </p>
                      <span className="tx-12">October 02, 2017 12:44am</span>
                    </div>
                  </div>
                </a>
                <a className="media-list-link read">
                  <div className="media pd-x-20 pd-y-15">
                    <img
                      src="assets/img/img10.jpg"
                      className="wd-40 rounded-circle"
                    />
                    <div className="media-body">
                      <p className="tx-13 mg-b-0">
                        20+ new items added are for sale in your{" "}
                        <strong className="tx-medium">Sale Group</strong>
                      </p>
                      <span className="tx-12">October 01, 2017 10:20pm</span>
                    </div>
                  </div>
                </a>
                <a className="media-list-link read">
                  <div className="media pd-x-20 pd-y-15">
                    <img
                      src="assets/img/img5.jpg"
                      className="wd-40 rounded-circle"
                    />
                    <div className="media-body">
                      <p className="tx-13 mg-b-0">
                        <strong className="tx-medium">Julius Erving</strong>{" "}
                        wants to connect with you on your conversation with{" "}
                        <strong className="tx-medium">Ronnie Mara</strong>
                      </p>
                      <span className="tx-12">October 01, 2017 6:08pm</span>
                    </div>
                  </div>
                </a>
                <div className="media-list-footer">
                  <a className="tx-12">
                    <i className="fa fa-angle-down mg-r-5" /> Show All
                    Notifications
                  </a>
                </div>
              </div>
            </div>
          </div> */}
          {/* dropdown */}
          <div className="dropdown dropdown-notification">
            <Link to="/notification">
              <a className="nav-link pd-x-7 pos-relative">
                <i className="icon ion-ios-bell-outline tx-24" />
                {notification.length > 0 ? (
                  <span className="square-8 bg-danger pos-absolute t-15 r-0 rounded-circle" />
                ) : (
                  ""
                )}
              </a>
            </Link>
          </div>
          <div className="dropdown dropdown-notification">
            <Link to="/profile-edit">
              <a className="nav-link pd-x-7 pos-relative">
                <i className="icon ion-settings tx-24"></i>
              </a>
            </Link>
          </div>
          <div className="dropdown dropdown-profile">
            <a className="nav-link nav-link-profile" data-toggle="dropdown">
              <img
                src="assets/img/default_user.png"
                style={{ marginTop: "-20px" }}
                className="wd-32 rounded-circle img-thumbnail"
              />
              <span className="logged-name">
                {user.name}
                <span
                  className="hidden-xs-down"
                  style={{ cursor: "pointer" }}
                  onClick={signOut}
                >
                  <i></i> <br />
                  <i className="icon ion-power" /> Sign Out
                </span>
              </span>
            </a>
            <div className="dropdown-menu wd-200">
              <ul className="list-unstyled user-profile-nav">
                <li>
                  <a>
                    <i className="icon ion-ios-person-outline" /> Edit Profile
                  </a>
                </li>
                <li>
                  <a>
                    <i className="icon ion-ios-gear-outline" /> Settings
                  </a>
                </li>
                <li>
                  <a>
                    <i className="icon ion-ios-download-outline" /> Downloads
                  </a>
                </li>
                <li>
                  <a>
                    <i className="icon ion-ios-star-outline" /> Favorites
                  </a>
                </li>
                <li>
                  <a>
                    <i className="icon ion-ios-folder-outline" /> Collections
                  </a>
                </li>
                <li>
                  <a>
                    <i className="icon ion-power" /> Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* am-header-right */}
      </div>
      {/* am-header */}
    </div>
  );
};

export default Header;
