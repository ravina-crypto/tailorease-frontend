import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth, db, messaging } from "./firebase";
import { doc, updateDoc, setDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { onMessage } from "firebase/messaging";
import { message as antdMessage } from "antd";

// 🔹 Backend URL
const API_URL = "https://multiservice-backend.onrender.com";

function CustomerDashboard() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Place new order + payment
  const handlePlaceOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("⚠ Please login first!");
        return;
      }

      // Step 1️⃣ Create new Firestore order as PendingPayment
      const newOrder = {
        customerId: user.uid,
        service,
        amount,
        address,
        status: "PendingPayment",
        createdAt: new Date(),
      };

      const orderRef = doc(db, "orders", `${Date.now()}_${user.uid}`);
      await setDoc(orderRef, newOrder);

      // Step 2️⃣ Create Razorpay order
      const { data } = await axios.post(`${API_URL}/order`, {
        amount: amount,
      });

      const options = {
        key: "rzp_test_RBUMBs6tY0YOJ3", // 🔹 Replace with your Razorpay Key
        amount: data.amount,
        currency: "INR",
        name: "TailorEase",
        description: `Payment for ${service}`,
        order_id: data.id,
        handler: async function (response) {
          try {
            // Step 3️⃣ Verify payment in backend
            const verifyRes = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderRef.id,
            });

            if (verifyRes.data.success) {
              await updateDoc(orderRef, { status: "Pending" }); // ✅ Update to active
              setMessage("✅ Order placed & payment verified!");
            } else {
              setMessage("❌ Payment verification failed!");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setMessage("❌ Error verifying payment.");
          }
        },
        theme: { color: "#663ff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error placing order.");
    }
  };

  // ✅ Live tracking orders (Firestore onSnapshot)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "orders"), where("customerId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Push notifications (toast style)
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Push notification: ", payload);
      antdMessage.info(`${payload.notification.title} - ${payload.notification.body}`);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Status labels
  const getStatusLabel = (status) => {
    switch (status) {
      case "PendingPayment":
        return "💳 Awaiting Payment";
      case "Pending":
        return "⏳ Waiting for tailor";
      case "InProgress":
        return "🧵 Tailor working";
      case "Completed":
        return "✅ Ready for pickup";
      case "PickedUp":
        return "📦 Picked up by delivery";
      case "OutForDelivery":
        return "🚚 Out for delivery";
      case "Delivered":
        return "🎉 Delivered";
      default:
        return status;
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>👗 Customer Dashboard</h2>
      <p>Book tailoring services & track your orders live</p>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* 🔹 Order Form */}
      <div style={{ marginBottom: "30px" }}>
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
            background: "#663ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Place Order & Pay
        </button>
      </div>

      {/* 🔹 Orders List */}
      <h3>📋 Your Orders</h3>
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
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Service</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Address</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.service}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  ₹{order.amount}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.address}
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {getStatusLabel(order.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerDashboard;
