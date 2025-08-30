import React, { useEffect, useState } from "react";
import axios from "axios";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://multiservice-backend.onrender.com/orders"
      );
      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching orders: " + error.message);
    }
  };

  // Update delivery status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://multiservice-backend.onrender.com/orders/${orderId}`,
        { status: newStatus }
      );
      setMessage(`✅ Order ${orderId} updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating order: " + error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🚚 Delivery Partner Dashboard</h2>
      <p>Manage pickups & deliveries</p>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <table
          style={{
            margin: "auto",
            borderCollapse: "collapse",
            width: "80%",
            maxWidth: "900px",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Customer
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Service
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Address
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Status
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Actions
              </th>
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
                      onClick={() => updateStatus(order.id, "PickedUp")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark Picked Up
                    </button>
                  )}
                  {order.status === "PickedUp" && (
                    <button
                      onClick={() => updateStatus(order.id, "OutForDelivery")}
                      style={{ marginRight: "5px" }}
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === "OutForDelivery" && (
                    <button
                      onClick={() => updateStatus(order.id, "Delivered")}
                    >
                      Mark Delivered
                    </button>
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

export default DeliveryDashboard;
