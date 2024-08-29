import React from "react";
import "./dashboard.css";
import { auth } from "../../firebase.js";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="dashoard-wrapper">
      <div className="side-nav">
        <div className="profile-info">
          <img src={localStorage.getItem("photoURL")} />
          <div>
            {" "}
            <p>{localStorage.getItem("cName")}</p>
          </div>
        </div>{" "}
        <hr />
        <div className="menu">
          <Link to="/dashboard/home" className="menu-link">
            <i className="fa-solid fa-house"></i> Home
          </Link>
          <Link to="/dashboard/invoices" className="menu-link">
            <i className="fa-solid fa-file-invoice"></i> Invoice
          </Link>
          <Link to="/dashboard/newInvoice" className="menu-link">
            <i className="fa-solid fa-file-circle-plus"></i> New Invoice
          </Link>
          <Link to="/dashboard/setting" className="menu-link">
            <i className="fa-solid fa-gear"></i> Setting
          </Link>
          <Link className="menu-link" onClick={logout}>
            <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
          </Link>
        </div>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
