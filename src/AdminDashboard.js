import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://multiservice-backend.onrender.com";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/users`);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching users");
    }
  };

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      setOrders(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching orders");
    }
  };

  // ✅ Fetch all reviews
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reviews`);
      setReviews(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching reviews");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchReviews();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👑 Admin Dashboard</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Users Table */}
      <h3>👥 Users</h3>
      <table border="1" width="100%" style={{ marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Orders Table */}
      <h3>📦 Orders</h3>
      <table border="1" width="100%" style={{ marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.customerId}</td>
              <td>{o.service}</td>
              <td>₹{o.amount}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reviews Table */}
      <h3>⭐ Reviews</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r, index) => (
            <tr key={index}>
              <td>{r.userId}</td>
              <td>{r.rating} ⭐</td>
              <td>{r.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
