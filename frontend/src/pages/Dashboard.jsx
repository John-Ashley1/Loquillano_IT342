import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../api/session";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const current = getSession();
    if (!current) {
      navigate("/login");
      return;
    }
    setSession(current);
  }, [navigate]);

  if (!session) return null;

  return (
    <div className="page">
      <div className="card">
        <h1>Dashboard</h1>
        <p className="subtitle">You are logged in.</p>

        <div className="dashboard-info">
          <div className="info-row">
            <span className="info-label">User ID</span>
            <span className="info-value">{session.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Username</span>
            <span className="info-value">{session.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
