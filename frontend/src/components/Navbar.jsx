import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar" id="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-icon">📝</span>
        <span>Todo App</span>
      </Link>
      <Link to="/" className="navbar-link" id="nav-home">
        Home
      </Link>
    </nav>
  );
}

export default Navbar;