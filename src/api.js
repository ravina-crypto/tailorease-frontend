// src/api.js

// Hardcoded backend URL (Render live backend)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper: POST
async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Helper: GET
async function getJson(path) {
  const res = await fetch(`${API_URL}${path}`);
  return res.json();
}

// Wallet APIs
export function addMoney(userId, amount) {
  return postJson("/wallet/add", { userId, amount });
}

export function payWithWallet(userId, amount) {
  return postJson("/wallet/pay", { userId, amount });
}

export function walletHistory(userId) {
  return getJson(`/wallet/${userId}`);
}

// Orders APIs
export function createOrder(customerId, service, amount, address) {
  return postJson("/orders", { customerId, service, amount, address });
}

export function updateOrderStatus(orderId, status) {
  return postJson("/orders/update", { orderId, status });
}

// Payment APIs
export function createRazorOrder(amount) {
  return postJson("/order", { amount });
}

export function verifyPayment(orderId, paymentId, signature, customerId) {
  return postJson("/payment/verify", {
    orderId,
    paymentId,
    signature,
    customerId,
  });
}

// Export API_URL for debugging
export default { API_URL };
