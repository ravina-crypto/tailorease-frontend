import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

function TailorDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Real-time listener for orders
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
      <h2>🧵 Tailor Dashboard</h2>
      <p>Manage tailoring orders</p>

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
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Pending" && <span>⏳ Pending</span>}
                  {order.status === "InProgress" && <span>✂️ In Progress</span>}
                  {order.status === "Completed" && <span>✅ Completed (Ready for Pickup)</span>}
                  {order.status === "PickedUp" && <span>📦 Picked Up by Delivery</span>}
                  {order.status === "OutForDelivery" && <span>🚚 Out for Delivery</span>}
                  {order.status === "Delivered" && <span>✔️ Delivered</span>}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "InProgress")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark as In Progress
                    </button>
                  )}
                  {order.status === "InProgress" && (
                    <button
                      onClick={() => updateStatus(order.id, "Completed")}
                      style={{ marginRight: "5px" }}
                    >
                      Mark as Completed
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

export default TailorDashboard;
