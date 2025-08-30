import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "./firebase";
import { onMessage } from "firebase/messaging";
import { message as antdMessage } from "antd"; // Using Ant Design for toast notifications
import { messaging } from "./firebase";

// Backend URL
const API_URL = "https://multiservice-backend.onrender.com";

function CustomerDashboard() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Place new order
  const handlePlaceOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        antdMessage.error("⚠️ Please login first!");
        return;
      }

      const newOrder = {
        customerId: user.uid,
        service,
        amount,
        address,
      };

      const { data } = await axios.post(`${API_URL}/orders`, newOrder);

      setMessage("✅ Order placed successfully!");
      setService("");
      setAmount("");
      setAddress("");

      // Add new order locally
      setOrders([...orders, data]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error placing order");
    }
  };

  // ✅ Fetch customer's orders
  const fetchOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const { data } = await axios.get(`${API_URL}/orders/customer/${user.uid}`);
      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching orders");
    }
  };

  // ✅ Auto fetch orders on load
  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Listen for push notifications (live updates)
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 New push notification: ", payload);

      antdMessage.info(
        `${payload.notification.title} - ${payload.notification.body}`
      );

      // Refresh orders automatically
      fetchOrders();
    });

    return () => unsubscribe();
  }, []);

  // ✅ Status with emojis
  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "🟡 Pending (Waiting for tailor)";
      case "InProgress":
        return "🛠️ In Progress (Tailor working)";
      case "Completed":
        return "✅ Completed (Ready for pickup)";
      case "PickedUp":
        return "📦 Picked up by Delivery";
      case "OutForDelivery":
        return "🚚 Out for Delivery";
      case "Delivered":
        return "🎉 Delivered";
      default:
        return status;
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>👗 Customer Dashboard</h2>
      <p>Book tailoring services & track your orders live</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Order Form */}
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
            background: "#0663ff",
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

      {/* Orders List */}
      <h3>📋 Your Orders</h3>
      {orders.length === 0 ? (
        <p>No orders yet</p>
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
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {getStatusLabel(order.status)}
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
