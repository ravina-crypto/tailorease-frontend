import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "./firebase";

const API_URL = "https://multiservice-backend.onrender.com";

function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);

  // ✅ Fetch wallet balance + history
  const fetchWallet = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login required");

      const { data } = await axios.get(`${API_URL}/wallet/${user.uid}`);
      setBalance(data.balance);
      setHistory(data.history);
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching wallet");
    }
  };

  // ✅ Add money to wallet
  const addMoney = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login required");

      // 1. Create Razorpay order from backend
      const { data } = await axios.post(`${API_URL}/wallet/add`, {
        amount,
        customerId: user.uid,
      });

      const options = {
        key: "rzp_test_RBUMBs6tYOYOJ3", // 🔑 Replace with live Razorpay Key
        amount: data.amount,
        currency: "INR",
        name: "TailorEase",
        description: "Add Money to Wallet",
        order_id: data.id,
        handler: async function (response) {
          try {
            // 2. Verify + credit wallet
            await axios.post(`${API_URL}/wallet/verify`, {
              orderId: data.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              customerId: user.uid,
              amount,
            });
            alert("✅ Wallet updated!");
            fetchWallet();
          } catch (err) {
            console.error(err);
            alert("❌ Wallet update failed");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Payment error");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🪙 Wallet</h2>
      <h3>Balance: ₹{balance}</h3>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "10px", margin: "10px", width: "200px" }}
      />
      <br />
      <button
        onClick={addMoney}
        style={{
          padding: "10px 20px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Money
      </button>

      <h3 style={{ marginTop: "30px" }}>📜 Transaction History</h3>
      {history.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <table style={{ margin: "auto", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Date
              </th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Amount
              </th>
              <th style={{ padding: "8px", border: "1px solid #ccc" }}>
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx, i) => (
              <tr key={i}>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {new Date(tx.date).toLocaleString()}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  ₹{tx.amount}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {tx.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Wallet;
