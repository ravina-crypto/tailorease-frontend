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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Save FCM token for this user
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
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
