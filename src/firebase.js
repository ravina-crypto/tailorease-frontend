import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// 🔹 Get FCM token
export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.log("⚠️ No registration token available");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
    return null;
  }
};

// 🔹 Save FCM token to Firestore (user → users/{uid})
export const saveFcmToken = async (user) => {
  if (!user) return;

  try {
    const token = await requestFCMToken();
    if (token) {
      await setDoc(
        doc(db, "users", user.uid),
        { fcmToken: token },
        { merge: true }
      );
      console.log("✅ FCM token saved to Firestore for:", user.uid);
    }
  } catch (error) {
    console.error("❌ Error saving FCM token:", error);
  }
};

// 🔹 Foreground notifications
onMessage(messaging, (payload) => {
  console.log("📩 Message received: ", payload);
  alert(payload.notification.title + " - " + payload.notification.body);
});
