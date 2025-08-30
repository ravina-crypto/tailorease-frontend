import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

function TailorDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all orders from Firestore
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching orders: " + error.message);
    }
  };

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setMessage(`✅ Order ${orderId} updated to "${newStatus}"`);
      fetchOrders(); // refresh orders
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
      <h2>👔 Tailor Dashboard</h2>
      <p>Manage tailoring orders</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <div style={{ marginTop: "20px" }}>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <table
            style={{
              margin: "auto",
              borderCollapse: "collapse",
              width: "80%",
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
                    {order.status}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <button
                      onClick={() => updateStatus(order.id, "In Progress")}
                      style={{
                        margin: "5px",
                        padding: "5px 10px",
                        background: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "Completed")}
                      style={{
                        margin: "5px",
                        padding: "5px 10px",
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Completed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TailorDashboard;
