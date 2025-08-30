import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

function CustomerDashboard() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Place new order
  const handlePlaceOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("⚠ Please login first!");
        return;
      }

      await addDoc(collection(db, "orders"), {
        customerId: user.uid,
        service,
        amount: Number(amount),
        address,
        status: "Pending",
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

  // Real-time fetch customer's orders
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "orders"), where("customerId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🧵 Customer Dashboard</h2>
      <p>Book tailoring services with pickup & delivery</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Place new order */}
      <div style={{ marginBottom: "30px" }}>
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
      </div>

      {/* Order status tracking */}
      <h3>📋 Your Orders</h3>
      {orders.length === 0 ? (
        <p>No orders placed yet</p>
      ) : (
        <table
          style={{
            margin: "auto",
            borderCollapse: "collapse",
            width: "90%",
            maxWidth: "900px",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Service
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Amount
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Address
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.service}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ₹{order.amount}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.address}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Pending" && <span>⏳ Pending</span>}
                  {order.status === "Completed" && <span>✅ Completed</span>}
                  {order.status === "Delivered" && <span>📦 Delivered</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerDashboard;
