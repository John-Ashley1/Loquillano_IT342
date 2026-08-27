import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUsername } from "../api/session";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    setUsername(getUsername());
  }, [navigate]);

  if (!username) return null;

  return (
    <div className="page">
      <div className="card">
        <h1>Dashboard</h1>
        <p className="subtitle">You are logged in as {username}.</p>

        <Link to="/requests" className="btn-primary" style={{ display: "inline-block", marginTop: "1rem" }}>
          Go to My Service Requests
        </Link>
      </div>
    </div>
  );
}
