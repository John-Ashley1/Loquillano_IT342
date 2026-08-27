import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUsername, clearSession } from "../api/session";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Activity 1</span>
      <div className="navbar-links">
        {loggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/requests">My Requests</Link>
            <span className="navbar-user">Signed in as {getUsername()}</span>
            <button className="navbar-link-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
