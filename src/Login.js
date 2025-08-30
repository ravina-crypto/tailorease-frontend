import React, { useState } from "react";
import { auth, db } from "./firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        alert(`Welcome ${userData.name}! You are logged in as ${userData.role}`);
      } else {
        alert("User profile not found ❌");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
