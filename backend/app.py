from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE ----------------
def connect_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# ---------------- HOME ----------------
@app.route("/")
def home():
    return "Backend Running Successfully"

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)

    try:
        cur.execute(
            "INSERT INTO students (name, email, password) VALUES (?, ?, ?)",
            (data["name"], data["email"], data["password"])
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Registered Successfully"})
    except:
        conn.close()
        return jsonify({"status": "failed", "message": "Email already exists"})

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM students WHERE email=? AND password=?",
        (data["email"], data["password"])
    )

    user = cur.fetchone()
    conn.close()

    if user:
        role = "admin" if user["email"] == "admin@gmail.com" else "student"

        return jsonify({
            "status": "success",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": role
            }
        })

    return jsonify({"status": "failed", "message": "Invalid credentials"})

# ---------------- COMPANIES ----------------
@app.route("/companies", methods=["GET"])
def companies():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            role TEXT,
            package TEXT
        )
    """)

    cur.execute("SELECT * FROM companies")
    rows = cur.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])

# ---------------- ADD COMPANY ----------------
@app.route("/add_company", methods=["POST"])
def add_company():
    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO companies (name, role, package) VALUES (?, ?, ?)",
        (data["name"], data["role"], data["package"])
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Company Added Successfully"})

# ---------------- APPLICATIONS ----------------
@app.route("/applications", methods=["GET"])
def applications():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            company_name TEXT,
            status TEXT
        )
    """)

    cur.execute("SELECT * FROM applications")
    rows = cur.fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows])

# ---------------- APPLY ----------------
@app.route("/apply", methods=["POST"])
def apply():
    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO applications (student_name, company_name, status) VALUES (?, ?, ?)",
        (data["student_name"], data["company_name"], "Applied")
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Applied Successfully"})

# ---------------- UPDATE STATUS ----------------
@app.route("/update_status", methods=["POST"])
def update_status():
    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "UPDATE applications SET status=? WHERE id=?",
        (data["status"], data["id"])
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Status Updated"})

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True)