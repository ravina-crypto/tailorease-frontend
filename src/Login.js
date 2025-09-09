// src/Login.js
import React, { useState } from "react";
import { auth, db, saveFcmToken } from "./firebase"; // your firebase.js exports
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 1) Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2) Save FCM token (so server/backend can push notifications)
      //    saveFcmToken should be defined in your firebase.js and should accept a Firebase User
      try {
        await saveFcmToken(user);
      } catch (fcmErr) {
        // Not critical - show a console warning but continue login
        console.warn("FCM token save failed:", fcmErr);
      }

      // 3) Fetch user document from Firestore to get role & other metadata
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        // If user record doesn't exist in Firestore, show a message and stop
        alert("User record not found in Firestore. Please signup first.");
        setLoading(false);
        return;
      }

      const userData = userSnapshot.data();
      const role = (userData && userData.role) ? userData.role.toLowerCase() : null;

      // 4) Redirect based on role
      // Update the routes below to match your app's route names
      if (role === "customer") {
        navigate("/customer");
      } else if (role === "tailor") {
        navigate("/tailor");
      } else if (role === "delivery") {
        navigate("/delivery");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        alert("User role not found or invalid. Please contact support.");
      }

    } catch (error) {
      // Generic login error handling
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
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
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
