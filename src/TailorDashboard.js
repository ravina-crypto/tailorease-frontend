import React, { useEffect, useState } from "react";
import axios from "axios";
import { message as antdMessage } from "antd"; // Toast notifications

// Backend URL
const API_URL = "https://multiservice-backend.onrender.com";

function TailorDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching orders");
    }
  };

  // ✅ Update status and notify customer
  const updateStatus = async (orderId, customerId, newStatus) => {
    try {
      // 1. Update backend
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus });

      // 2. Send push notification to customer
      await axios.post(`${API_URL}/notify`, {
        userId: customerId,
        title: "👔 Tailoring Update",
        body: `Your order is now ${newStatus}`,
      });

      setMessage(`✅ Order ${orderId} updated to "${newStatus}"`);
      antdMessage.success(`Order ${orderId} is now ${newStatus}`);

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating order");
      antdMessage.error("Failed to update order");
    }
  };

  // ✅ Load orders on page load
  useEffect(() => {
    fetchOrders();
  }, []);

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
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Customer</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Service</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Address</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.customerId}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.service}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ₹{order.amount}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.address}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>
                  {order.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Pending" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "InProgress")
                      }
                      style={{
                        marginRight: "5px",
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
