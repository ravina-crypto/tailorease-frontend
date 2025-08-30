import React, { useState } from "react";
import { auth, db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function CustomerDashboard() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handlePlaceOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("⚠️ Please login first!");
        return;
      }

      // Add new order in Firestore
      await addDoc(collection(db, "orders"), {
        customerId: user.uid,
        service: service,
        amount: Number(amount),
        address: address,
        status: "Pending", // default
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Order placed successfully!");
      setService("");
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error placing order: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>👗 Customer Dashboard</h2>
      <p>Book tailoring services with pickup & delivery</p>

      <input
        type="text"
        placeholder="Enter service (e.g., Blouse Stitching)"
        value={service}
        onChange={(e) => setService(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />

      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />

      <button
        onClick={handlePlaceOrder}
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
        Place Order
      </button>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

export default CustomerDashboard;
