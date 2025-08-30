import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { message as antMessage } from "antd";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});

  // 🔹 Live fetch users
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(allOrders);

      // Analytics
      const totalRevenue = allOrders.reduce(
        (sum, o) => sum + (parseFloat(o.amount) || 0),
        0
      );
      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        delivered: allOrders.filter((o) => o.status === "Delivered").length,
        pending: allOrders.filter(
          (o) => o.status !== "Delivered" && o.status !== "Cancelled"
        ).length,
      });
    });

    return () => {
      unsubUsers();
      unsubOrders();
    };
  }, []);

  // 🔹 Block / Unblock user
  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      await updateDoc(doc(db, "users", userId), { blocked: !isBlocked });
      antMessage.success(
        `✅ User ${isBlocked ? "unblocked" : "blocked"} successfully`
      );
    } catch (err) {
      console.error("Error updating user:", err);
      antMessage.error("❌ Failed to update user");
    }
  };

  // 🔹 Delete an order
  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      antMessage.success("✅ Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      antMessage.error("❌ Failed to delete order");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👩‍💻 Admin Dashboard</h2>
      <p>Manage users, orders & reports</p>

      {/* Stats Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <div>📦 Total Orders: {stats.totalOrders}</div>
        <div>✅ Delivered: {stats.delivered}</div>
        <div>⌛ Pending: {stats.pending}</div>
        <div>💰 Revenue: ₹{stats.totalRevenue}</div>
      </div>

      {/* Users Section */}
      <h3>👥 Users</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={tdStyle}>{u.name || "N/A"}</td>
              <td style={tdStyle}>{u.email || "N/A"}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}>
                {u.blocked ? "🚫 Blocked" : "✅ Active"}
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => toggleBlockUser(u.id, u.blocked)}
                  style={btnStyle(u.blocked ? "#28a745" : "#dc3545")}
                >
                  {u.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Orders Section */}
      <h3 style={{ marginTop: "30px" }}>📦 Orders</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Service</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td style={tdStyle}>{o.customerId}</td>
              <td style={tdStyle}>{o.service}</td>
              <td style={tdStyle}>₹{o.amount}</td>
              <td style={tdStyle}>{o.status}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => deleteOrder(o.id)}
                  style={btnStyle("#6c757d")}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f5f5f5",
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

export default AdminDashboard;
