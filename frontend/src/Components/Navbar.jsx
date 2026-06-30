import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">CloudDrive</div>

      <div className="navLinks">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active link" : "link")}
        >
          Home
        </NavLink>

        <NavLink
          to="/shared"
          className={({ isActive }) => (isActive ? "active link" : "link")}
        >
          Shared With Me
        </NavLink>

       

        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
