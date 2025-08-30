import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Real-time listener for all orders
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setMessage(`✅ Order ${orderId} updated to "${newStatus}"`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error updating order: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🚚 Delivery Partner Dashboard</h2>
      <p>Manage pickups and deliveries</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {orders.length === 0 ? (
        <p>No orders available</p>
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
                Customer
              </th>
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
                  ₹{order.amount}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.address}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Pending" && <span>⏳ Pending</span>}
                  {order.status === "Completed" && (
                    <span>🧵 Ready for Pickup</span>
                  )}
                  {order.status === "PickedUp" && <span>📦 Picked Up</span>}
                  {order.status === "OutForDelivery" && (
                    <span>🚚 Out for Delivery</span>
                  )}
                  {order.status === "Delivered" && <span>✅ Delivered</span>}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Completed" && (
                    <button
                      onClick={() => updateStatus(order.id, "PickedUp")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark as Picked Up
                    </button>
                  )}
                  {order.status === "PickedUp" && (
                    <button
                      onClick={() => updateStatus(order.id, "OutForDelivery")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark as Out for Delivery
                    </button>
                  )}
                  {order.status === "OutForDelivery" && (
                    <button
                      onClick={() => updateStatus(order.id, "Delivered")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark as Delivered
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
