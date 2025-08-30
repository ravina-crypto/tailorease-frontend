import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

// This is your Payment page code (kept inside App.js for now)
import axios from "axios";

function Payment() {
  const [service, setService] = React.useState("");
  const [amount, setAmount] = React.useState("");

  const handlePayment = async () => {
    try {
      // Call backend to create order
      const { data } = await axios.post("https://multiservice-backend.onrender.com/order", {
        amount: amount,
      });

      const options = {
        key: "rzp_test_RBUM85t6T0YOJ3", // Replace with your Razorpay Key_ID
        amount: data.amount,
        currency: "INR",
        name: "TailorEase",
        description: `Payment for ${service}`,
        order_id: data.id,
        handler: function (response) {
          alert(`✅ Payment successful for ${service}! Payment ID: ${response.razorpay_payment_id}`);
        },
        theme: {
          color: "#6c63ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>💙 TailorEase</h1>
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
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          background: "#6c63ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

// Main App with Routes
function App() {
  return (
    <Router>
      <nav style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/signup" style={{ margin: "10px" }}>Signup</Link>
        <Link to="/login" style={{ margin: "10px" }}>Login</Link>
        <Link to="/payment" style={{ margin: "10px" }}>Payment</Link>
      </nav>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
