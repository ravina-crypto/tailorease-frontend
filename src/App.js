import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

import Signup from "./Signup";
import Login from "./Login";
import CustomerDashboard from "./CustomerDashboard";
import TailorDashboard from "./TailorDashboard";
import DeliveryDashboard from "./DeliveryDashboard";

const API_URL = "https://multiservice-backend.onrender.com";

// ---------------- Payment Component ----------------
function Payment() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayPayment = async () => {
    try {
      // ✅ Step 1: Create Razorpay Order from backend
      const { data } = await axios.post(`${API_URL}/order`, {
        amount: amount,
      });

      const options = {
        key: "rzp_test_RBUMBs6tY0YOJ3", // ✅ Replace with your Razorpay Key_ID
        amount: data.amount,
        currency: "INR",
        name: "TailorEase",
        description: `Payment for ${service}`,
        order_id: data.id,
        handler: async function (response) {
          try {
            // ✅ Step 2: Verify payment in backend
            await axios.post(`${API_URL}/payment/verify`, {
              orderId: data.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              customerId: "CURRENT_USER_ID", // ✅ Replace with logged in userId from Firebase Auth
            });

            alert(`✅ Payment successful for ${service}!`);
          } catch (err) {
            console.error("Verification error:", err);
            alert("❌ Payment verification failed");
          }
        },
        theme: { color: "#66c3ff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("❌ Payment failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>🧵 TailorEase</h1>
      <p>Book tailoring services & pay online</p>

      <input
        type="text"
        placeholder="Enter service (e.g., Blouse Stitching)"
        value={service}
        onChange={(e) => setService(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      />
      <br />
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      />
      <br />
      <button
        onClick={handlePayPayment}
        style={{
          padding: "10px 20px",
          background: "#66c3ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

// ---------------- Main App with Routes ----------------
function App() {
  return (
    <Router>
      <nav style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/signup" style={{ margin: "10px" }}>Signup</Link>
        <Link to="/login" style={{ margin: "10px" }}>Login</Link>
        <Link to="/payment" style={{ margin: "10px" }}>Payment</Link>
      </nav>

      <Routes>
        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Payment */}
        <Route path="/payment" element={<Payment />} />

        {/* Dashboards */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/tailor" element={<TailorDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
