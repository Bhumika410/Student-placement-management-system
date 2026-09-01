export default function Home() {
  return (
    <div className="container">
      <h1>🎓 Student Placement Management System</h1>
      <p>Full Stack Project (React + Flask + SQLite)</p>

      <a href="/login"><button>Login</button></a>
      <a href="/register"><button>Register</button></a>
      <a href="/dashboard"><button>Dashboard</button></a>
      <a href="/admin"><button style={{ background: "darkred" }}>Admin</button></a>
    </div>
  );
}