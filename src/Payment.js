import React, { useState } from "react";
import axios from "axios";

// Backend API URL
const API_URL = "https://multiservice-backend.onrender.com";

function Payment() {
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    if (!service || !amount) {
      alert("⚠️ Please enter service and amount!");
      return;
    }

    try {
      // ✅ Step 1: Create Razorpay order in backend
      const { data } = await axios.post(`${API_URL}/order`, { amount });

      const options = {
        key: "rzp_test_RBUMBs6tYOY0J3", // Replace with your Razorpay key
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
              customerId: "CURRENT_USER_ID", // Replace with logged-in userId from Firebase
            });

            alert(`✅ Payment successful for ${service}!`);
          } catch (err) {
            console.error("Verification error:", err);
            alert("❌ Payment verification failed!");
          }
        },

        theme: { color: "#6633ff" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("❌ Payment failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Make a Payment</h2>

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
          background: "#6633ff",
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

export default Payment;
