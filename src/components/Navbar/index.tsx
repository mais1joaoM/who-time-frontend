import "./styles.css";

import { useState } from "react";

import {
  FiMenu,
  FiX,
} from "react-icons/fi";

import whoTimeIcon from "../../assets/favz.svg";

function Navbar() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const token =
    localStorage.getItem("token");

  let userRole = "";

  if (token) {

    try {

      const payload =
        JSON.parse(
          atob(
            token.split(".")[1]
          )
        );

      userRole = payload.role;

    } catch (error) {

      console.error(
        "Erro ao decodificar token",
        error
      );
    }
  }

  const canManageCompanies =
    userRole === "admin" ||
    userRole === "manager";

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const closeMenu = () => {

    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <div className="navbar-brand">

        <div className="brand-logo-wrapper">

          <img
            src={whoTimeIcon}
            alt="Who Time"
            className="brand-logo"
          />

        </div>

        <div className="navbar-logo">
          Who Time
        </div>

      </div>

      <button
        className="menu-button"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        {menuOpen ? (
          <FiX />
        ) : (
          <FiMenu />
        )}
      </button>

      <nav
        className={`navbar-links ${
          menuOpen
            ? "navbar-links-open"
            : ""
        }`}
      >

        <a href="/dashboard" onClick={closeMenu}>
          Dashboard
        </a>

        <a href="/reports" onClick={closeMenu}>
          Reports
        </a>

        <a href="/statistics" onClick={closeMenu}>
          Statistics
        </a>

        {canManageCompanies && (
          <>
            <a
              href="/companiescontracts"
              onClick={closeMenu}
            >
              Companies & Contracts
            </a>

            <a href="/users" onClick={closeMenu}>
              Users
            </a>
          </>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

    </header>
  );
}

export default Navbar;