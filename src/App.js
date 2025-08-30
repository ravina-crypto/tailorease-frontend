import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import CustomerDashboard from "./CustomerDashboard";
import TailorDashboard from "./TailorDashboard";
import DeliveryDashboard from "./DeliveryDashboard";
import AdminDashboard from "./AdminDashboard";
import Wallet from "./Wallet";
import Reviews from "./Reviews";
import Payment from "./Payment";
import Notifications from "./Notifications";

function App() {
  return (
    <Router>
      <nav style={{ textAlign: "center", margin: "20px" }}>
        <Link to="/signup" style={{ margin: "10px" }}>Signup</Link>
        <Link to="/login" style={{ margin: "10px" }}>Login</Link>
        <Link to="/customer" style={{ margin: "10px" }}>Customer</Link>
        <Link to="/tailor" style={{ margin: "10px" }}>Tailor</Link>
        <Link to="/delivery" style={{ margin: "10px" }}>Delivery</Link>
        <Link to="/admin" style={{ margin: "10px" }}>Admin</Link>
        <Link to="/wallet" style={{ margin: "10px" }}>Wallet</Link>
        <Link to="/reviews" style={{ margin: "10px" }}>Reviews</Link>
        <Link to="/payment" style={{ margin: "10px" }}>Payment</Link>
        <Link to="/notifications" style={{ margin: "10px" }}>Notifications</Link>
      </nav>

      <Routes>
        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/tailor" element={<TailorDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Features */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
