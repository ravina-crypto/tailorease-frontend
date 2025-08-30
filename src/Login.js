import React, { useState } from "react";
import { auth, db, saveFcmToken } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 🔹 Login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 🔹 Save FCM token (for notifications)
      await saveFcmToken(user);

      // 🔹 Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // 🔹 Redirect based on role
        if (role === "customer") {
          navigate("/customer");
        } else if (role === "tailor") {
          navigate("/tailor");
        } else if (role === "delivery") {
          navigate("/delivery");
        } else if (role === "admin") {
          navigate("/admin"); // ✅ New update for Admin Dashboard
        } else {
          alert("⚠️ User role not found!");
        }
      } else {
        alert("⚠️ User data not found!");
      }
    } catch (error) {
      alert("❌ Login Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔑 Login</h2>

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
