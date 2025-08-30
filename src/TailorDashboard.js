import React, { useEffect, useState } from "react";
import axios from "axios";

// 🌍 Backend URL
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

  // ✅ Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus });
      setMessage(`✅ Order ${orderId} updated to "${newStatus}"`);
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🧵 Tailor Dashboard</h2>
      <p>Manage tailoring orders</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

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
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Customer ID</th>
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
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.customerId}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.service}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.amount}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.address}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px", fontWeight: "bold" }}>
                  {order.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "InProgress")}
                      style={{
                        marginRight: "5px",
                        padding: "5px 10px",
                        background: "#6c63ff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Start Work
                    </button>
                  )}
                  {order.status === "InProgress" && (
                    <button
                      onClick={() => updateStatus(order.id, "Completed")}
                      style={{
                        marginRight: "5px",
                        padding: "5px 10px",
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Mark Completed
                    </button>
                  )}
                  {order.status === "Completed" && (
                    <span>✅ Ready for Pickup</span>
                  )}
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
