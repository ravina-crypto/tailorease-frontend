// src/api.js
// Set API_URL to local backend when testing locally, or your Render URL when using deployed backend.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function getJson(path) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

// Wallet
export function addMoney(userId, amount) {
  return postJson("/wallet/add", { userId, amount });
}
export function payWithWallet(userId, amount) {
  return postJson("/wallet/pay", { userId, amount });
}
export function walletHistory(userId) {
  return getJson(`/wallet/${userId}`);
}

// Orders
export function createOrder(customerId, service, amount, address) {
  return postJson("/orders", { customerId, service, amount, address });
}
export function updateOrderStatus(orderId, status) {
  return postJson("/orders/update", { orderId, status });
}

// Razorpay / Payment
export function createRazorOrder(amount) {
  return postJson("/order", { amount });
}
export function verifyPayment(orderId, paymentId, signature, customerId) {
  return postJson("/payment/verify", { orderId, paymentId, signature, customerId });
}

export default { API_URL };
