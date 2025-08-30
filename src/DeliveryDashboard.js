import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Backend URL
const API_URL = "https://multiservice-backend.onrender.com";

function DeliveryDashboard() {
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

  // ✅ Update order status + send push notification
  const updateStatus = async (orderId, customerId, newStatus) => {
    try {
      // 1. Update status in backend
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus });

      // 2. Notify customer via backend FCM
      await axios.post(`${API_URL}/notify`, {
        userId: customerId,
        title: "📦 Order Update",
        body: `Your order is now ${newStatus}`,
      });

      setMessage(`✅ Order ${orderId} updated to "${newStatus}"`);
      fetchOrders(); // Refresh
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
      <h2>🚚 Delivery Partner Dashboard</h2>
      <p>Manage pickups and deliveries</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {orders.length === 0 ? (
        <p>📭 No orders available</p>
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
                  {order.address}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Completed" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "PickedUp")
                      }
                      style={{
                        marginRight: "5px",
                        background: "#007bff",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {order.status === "PickedUp" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "OutForDelivery")
                      }
                      style={{
                        marginRight: "5px",
                        background: "#ffc107",
                        color: "black",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === "OutForDelivery" && (
                    <button
                      onClick={() =>
                        updateStatus(order.id, order.customerId, "Delivered")
                      }
                      style={{
                        background: "#28a745",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
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

export default DeliveryDashboard;
