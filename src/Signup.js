import React, { useState } from "react";
import { auth, db, saveFcmToken } from "./firebase"; // ✅ from firebase.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Customer"); // Default role

  const handleSignup = async () => {
    try {
      // 🔹 Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 🔹 Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        role, // Customer | Tailor | Delivery Partner | Admin
        walletBalance: 0,
        createdAt: new Date(),
      });

      // 🔹 Save FCM token
      await saveFcmToken(user);

      alert("✅ Signup successful!");
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>📝 Signup</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />
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

      {/* Role Dropdown */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      >
        <option value="Customer">Customer</option>
        <option value="Tailor">Tailor</option>
        <option value="Delivery">Delivery Partner</option>
        <option value="Admin">Admin</option>
      </select>
      <br />

      <button
        onClick={handleSignup}
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
        Signup
      </button>
    </div>
  );
}

export default Signup;
