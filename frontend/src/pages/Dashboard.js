import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchApplications = async (username) => {
    const res = await fetch("http://127.0.0.1:5000/applications");
    const data = await res.json();

    const filtered = data.filter(
      (a) => a.student_name === username
    );

    setApplications(filtered);
  };

  useEffect(() => {
    if (user?.name) {
      fetchApplications(user.name);
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="container">

      <h1>🎓 Student Dashboard</h1>

      {user && <h2>Welcome, {user.name} 👋</h2>}

      <button onClick={logout}>Logout</button>

      <hr />

      <h2>📌 Your Applications</h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {applications.length === 0 ? (
          <p>No Applications Yet</p>
        ) : (
          applications.map((a) => (
            <div className="dashboard-card" key={a.id}>
              <h3>{a.company_name}</h3>
              <p>Status: {a.status}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}