import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <h2 className="logo">PrepAI</h2>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/performance">Performance</Link>
        <Link to="/resume">Resume</Link>
        <Link to="/">Logout</Link>

        <button onClick={toggleTheme} className="theme-btn">
          {theme === "light" ? "🌙" : "☀"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
