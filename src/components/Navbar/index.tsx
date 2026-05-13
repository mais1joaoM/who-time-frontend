import "./styles.css";

import whoTimeLogo from "../../assets/who-time-logo.png";

function Navbar() {

  /*
    DECODIFICA JWT
  */
  const token =
    localStorage.getItem("token");

  let userRole = "";

  if (token) {

    try {

      /*
        JWT = header.payload.signature
      */
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

  /*
    PERMISSÃO
  */
  const canManageCompanies =
    userRole === "admin" ||
    userRole === "manager";

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <header className="navbar">

      {/* LOGO */}
      <div className="brand-logo-wrapper">

        <img
          src={whoTimeLogo}
          alt="Who Time"
          className="brand-logo"
        />

      </div>

      {/* NOME */}
      <div
        className={`navbar-logo ${
          canManageCompanies
            ? "navbar-logo-admin"
            : "navbar-logo-user"
        }`}
      >
        Who Time
      </div>

      {/* LINKS */}
      <nav className="navbar-links">

        <a href="/dashboard">
          Dashboard
        </a>

        <a href="/reports">
          Reports
        </a>

        <a href="/statistics">
          Statistics
        </a>

        {canManageCompanies && (

          <a href="/companiescontracts">
            Companies & Contracts
          </a>

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