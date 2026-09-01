import { useEffect, useState } from "react";

export default function Admin() {
  const [apps, setApps] = useState([]);

  const fetchApps = async () => {
    const res = await fetch("http://127.0.0.1:5000/admin_applications");
    const data = await res.json();
    setApps(data);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("http://127.0.0.1:5000/update_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });

    fetchApps();
  };

  return (
    <div className="container">
      <h1>🛠 Admin Panel</h1>

      <h2>Student Applications</h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {apps.length === 0 ? (
          <p>No Applications</p>
        ) : (
          apps.map((a) => (
            <div className="dashboard-card" key={a.id}>
              <h3>{a.student_name}</h3>
              <p>{a.company_name}</p>
              <p>Status: {a.status}</p>

              <button onClick={() => updateStatus(a.id, "Accepted")}>
                Accept
              </button>

              <button onClick={() => updateStatus(a.id, "Rejected")}>
                Reject
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}