import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import axios from "axios";
import { message as antMessage } from "antd";

const API_URL = "https://multiservice-backend.onrender.com";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // 🔹 Real-time fetch orders
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

  // 🔹 Update order status + notify customer
  const updateStatus = async (orderId, customerId, newStatus) => {
    try {
      // Update Firestore order
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });

      // Notify customer via backend
      await axios.post(`${API_URL}/notify`, {
        userId: customerId,
        title: "Order Update",
        body: `Your order is now "${newStatus}".`,
      });

      setMessage(`✅ Order updated to "${newStatus}"`);
    } catch (err) {
      console.error("Error updating status:", err);
      antMessage.error("❌ Failed to update order");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🚚 Delivery Partner Dashboard</h2>
      <p>Manage pickups & deliveries in real-time</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <table
          style={{
            margin: "auto",
            borderCollapse: "collapse",
            width: "90%",
            maxWidth: "1000px",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={tdStyle}>{order.customerId}</td>
                <td style={tdStyle}>{order.service}</td>
                <td style={tdStyle}>{order.address}</td>
                <td style={tdStyle}>{order.status}</td>
                <td style={tdStyle}>
                  {order.status === "Completed" && (
                    <button
                      style={btnStyle("#007bff")}
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "PickedUp")
                      }
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {order.status === "PickedUp" && (
                    <button
                      style={btnStyle("#ff9800")}
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "OutForDelivery")
                      }
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === "OutForDelivery" && (
                    <button
                      style={btnStyle("#28a745")}
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "Delivered")
                      }
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === "Delivered" && <span>✅ Delivered</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

const btnStyle = (bg) => ({
  marginRight: "5px",
  background: bg,
  color: "white",
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});

export default DeliveryDashboard;
