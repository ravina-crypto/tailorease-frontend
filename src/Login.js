import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://multiservice-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Save token (optional)
        localStorage.setItem("token", data.token);

        // Redirect based on role
        const role = data.role;
        if (role === "customer") navigate("/customer");
        else if (role === "tailor") navigate("/tailor");
        else if (role === "delivery") navigate("/delivery");
        else if (role === "admin") navigate("/admin");
        else alert("⚠️ User role not found");
      } else {
        alert("❌ Login failed: " + data.error);
      }
    } catch (error) {
      alert("⚠️ Login Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
