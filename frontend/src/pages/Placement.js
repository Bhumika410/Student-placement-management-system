import { useEffect, useState } from "react";

export default function Placement() {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pkg, setPkg] = useState("");

  // FETCH COMPANIES
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/companies");
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Fetch error:", error);
      setCompanies([]);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ADD COMPANY
  const addCompany = async () => {
    if (!name || !role || !pkg) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/add_company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          package: pkg
        })
      });

      await res.json();

      setName("");
      setRole("");
      setPkg("");

      fetchCompanies();
    } catch (error) {
      console.log("Add company error:", error);
      alert("Backend not responding");
    }
  };

  return (
    <div className="container">

      <h1>🏢 Placement Module</h1>

      <div>
        <input
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          placeholder="Package"
          value={pkg}
          onChange={(e) => setPkg(e.target.value)}
        />

        <button onClick={addCompany}>Add Company</button>
      </div>

      <hr />

      <h2>Available Companies</h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {companies.length === 0 ? (
          <p>No Companies Found</p>
        ) : (
          companies.map((c) => (
            <div className="dashboard-card" key={c.id}>
              <h3>{c.name}</h3>
              <p>{c.role}</p>
              <p>{c.package}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}