import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "./firebase";

const API_URL = "https://multiservice-backend.onrender.com";

function CustomerDashboard() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState(5);

  // ✅ Place new order
  const handlePlaceOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("⚠ Please login first!");
        return;
      }

      const newOrder = {
        customerId: user.uid,
        service,
        amount,
        address,
      };

      const { data } = await axios.post(`${API_URL}/orders`, newOrder);
      setOrders([...orders, data]);
      setMessage("✅ Order placed successfully!");
      setService("");
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error placing order");
    }
  };

  // ✅ Fetch customer orders
  const fetchOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const { data } = await axios.get(`${API_URL}/orders/customer/${user.uid}`);
      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching orders");
    }
  };

  // ✅ Submit Review
  const submitReview = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login first!");

      await axios.post(`${API_URL}/reviews`, {
        userId: user.uid,
        rating,
        comment: reviews,
      });

      setMessage("✅ Review submitted!");
      setReviews("");
      setRating(5);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit review");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Status labels
  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "⏳ Pending (Waiting for tailor)";
      case "InProgress":
        return "🔧 In Progress (Tailor working)";
      case "Completed":
        return "✅ Completed (Ready for pickup)";
      case "PickedUp":
        return "📦 Picked up by Delivery";
      case "OutForDelivery":
        return "🚚 Out for Delivery";
      case "Delivered":
        return "🎉 Delivered!";
      default:
        return status;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧵 Customer Dashboard</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Order Form */}
      <h3>📌 Place Order</h3>
      <input
        type="text"
        placeholder="Enter service (e.g., Blouse Stitching)"
        value={service}
        onChange={(e) => setService(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "250px" }}
      />
      <br />
      <button
        onClick={handlePlaceOrder}
        style={{
          padding: "10px 20px",
          background: "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Place Order
      </button>

      {/* Orders List */}
      <h3 style={{ marginTop: "30px" }}>📦 Your Orders</h3>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <table
          style={{ margin: "auto", borderCollapse: "collapse", width: "90%" }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>Service</th>
              <th>Amount</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.service}</td>
                <td>₹{order.amount}</td>
                <td>{order.address}</td>
                <td>{getStatusLabel(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Submit Review */}
      <h3 style={{ marginTop: "30px" }}>⭐ Leave a Review</h3>
      <textarea
        placeholder="Write your review..."
        value={reviews}
        onChange={(e) => setReviews(e.target.value)}
        style={{ margin: "10px", padding: "10px", width: "300px", height: "80px" }}
      />
      <br />
      <label>
        Rating:{" "}
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>
      </label>
      <br />
      <button
        onClick={submitReview}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Submit Review
      </button>
    </div>
  );
}

export default CustomerDashboard;
