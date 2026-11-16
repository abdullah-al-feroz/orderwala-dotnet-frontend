import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Payroll = (props) => {
  const [active, setActive] = useState(window.location.pathname);
  return (
    <>
      <li className="nav-item">
        <Link
          to
          className={`nav-link with-sub ${
            active === "arrear" ||
            active === "incentive" ||
            active === "overtime" ||
            active === "holiday" ||
            active === "night-hold" ||
            active === "tada" ||
            active === "salary-advance" ||
            active === "deduction" ||
            active === "canteen" ||
            active === "phonebill" ||
            active === "incometax" ||
            active === "bonous" ||
            active === "salary" ||
            active === "apa"
              ? "active show-sub"
              : ""
          }`}
        >
          <i className="fa fa-coffee" aria-hidden="true"></i>
          <span>Payroll</span>
        </Link>
        <ul className="nav-sub">
          <li className="nav-item">
            <Link
              to="/arrear"
              className={`nav-link ${active === "arrear" ? "active" : ""}`}
              onClick={() => setActive("arrear")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Arrear
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/incentive"
              className={`nav-link ${active === "incentive" ? "active" : ""}`}
              onClick={() => setActive("incentive")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Incentive
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/overtime"
              className={`nav-link ${active === "overtime" ? "active" : ""}`}
              onClick={() => setActive("overtime")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Overtime
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/holiday"
              className={`nav-link ${active === "holiday" ? "active" : ""}`}
              onClick={() => setActive("holiday")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Holiday
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/night-hold"
              className={`nav-link ${active === "night-hold" ? "active" : ""}`}
              onClick={() => setActive("night-hold")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Night Hold
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/tada"
              className={`nav-link ${active === "tada" ? "active" : ""}`}
              onClick={() => setActive("tada")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; TaDa
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/salary-advance"
              className={`nav-link ${
                active === "salary-advance" ? "active" : ""
              }`}
              onClick={() => setActive("salary-advance")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Salary Advance
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/deduction"
              className={`nav-link ${active === "deduction" ? "active" : ""}`}
              onClick={() => setActive("deduction")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Deduction
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/canteen"
              className={`nav-link ${active === "canteen" ? "active" : ""}`}
              onClick={() => setActive("canteen")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Canteen
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/phonebill"
              className={`nav-link ${active === "phonebill" ? "active" : ""}`}
              onClick={() => setActive("phonebill")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Phone Bill
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/incometax"
              className={`nav-link ${active === "incometax" ? "active" : ""}`}
              onClick={() => setActive("incometax")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Income Tax
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/bonous"
              className={`nav-link ${active === "bonous" ? "active" : ""}`}
              onClick={() => setActive("bonous")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Bonus
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/salary"
              className={`nav-link ${active === "salary" ? "active" : ""}`}
              onClick={() => setActive("salary")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; Salary
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/apa"
              className={`nav-link ${active === "apa" ? "active" : ""}`}
              onClick={() => setActive("apa")}
            >
              <i className="fa fa-clone" aria-hidden="true"></i>
              &nbsp;&nbsp; APA
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
};

export default Payroll;
