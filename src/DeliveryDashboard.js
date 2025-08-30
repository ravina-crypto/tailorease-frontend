import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Real-time listener for orders
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    });

    return () => unsubscribe(); // cleanup
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
            width: "800px",
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
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.customerId}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.service}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.amount}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.address}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.status}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Completed" && (
                    <button
                      onClick={() => updateStatus(order.id, "Delivered")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {order.status === "Pending" && <span>⏳ Waiting for tailor</span>}
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
