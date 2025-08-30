import React, { useState } from "react";
import axios from "axios";

function App() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      // Call backend to create order
      const { data } = await axios.post("https://multiservice-backend.onrender.com/order", {
        amount: amount,
      });

      const options = {
        key: "rzp_test_RBUW8S6t70YO3J", // 🔑 Replace with your Razorpay Key_ID
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
      <h1>👗 TailorEase</h1>
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

export default App;
