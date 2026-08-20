import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession } from "../api/session";

export default function Navbar() {
  const navigate = useNavigate();
  const session = getSession();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <span className="navbar-brand">Activity 1</span>
      <div className="navbar-links">
        {session ? (
          <>
            <span className="navbar-user">Signed in as {session.username}</span>
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
