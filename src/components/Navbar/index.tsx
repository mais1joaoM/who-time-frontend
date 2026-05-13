import "./styles.css";

function Navbar() {

  return (
    <header className="navbar">

      <div className="navbar-logo">
        WHO TIME
      </div>

      <nav className="navbar-links">

        <a href="#">
          Dashboard
        </a>

        <a href="#">
          Users
        </a>

        <a href="#">
          Reports
        </a>

      </nav>

    </header>
  );
}

export default Navbar;