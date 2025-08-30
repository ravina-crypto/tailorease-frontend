import React, { useEffect } from "react";
import { requestFcmToken, messaging } from "./firebase";
import { onMessage } from "firebase/messaging";

function Notifications() {
  useEffect(() => {
    // ✅ Request permission & get token
    requestFcmToken();

    // ✅ Listen for incoming foreground messages
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      alert(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
    });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🔔 Notifications</h2>
      <p>You will receive real-time updates here (order status, delivery, etc.)</p>
    </div>
  );
}

export default Notifications;
