import React, { useEffect, useState } from "react";
import axios from "axios";
import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

const API_URL = "https://multiservice-backend.onrender.com";

function TailorDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Live Firestore updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const liveOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Update status & notify customer
  const updateStatus = async (orderId, customerId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus });
      await axios.post(`${API_URL}/notify`, {
        userId: customerId,
        title: "👔 Tailoring Update",
        body: `Your order is now ${newStatus}`,
      });
      setMessage(`✅ Order ${orderId} updated to "${newStatus}"`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating order");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>👔 Tailor Dashboard</h2>
      <p>Manage tailoring orders & update progress</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {orders.length === 0 ? (
        <p>No tailoring orders yet</p>
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
              <th>Customer</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.customerId}</td>
                <td>{order.service}</td>
                <td>₹{order.amount}</td>
                <td>{order.address}</td>
                <td style={{ fontWeight: "bold" }}>{order.status}</td>
                <td>
                  {order.status === "Pending" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "InProgress")
                      }
                      style={{
                        background: "#ff9800",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Start Work
                    </button>
                  )}
                  {order.status === "InProgress" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "Completed")
                      }
                      style={{
                        background: "#28a745",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Mark Completed
                    </button>
                  )}
                  {order.status === "Completed" && <span>✅ Completed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TailorDashboard;
