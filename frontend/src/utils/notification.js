import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { registerDevice } from "../services/deviceService";

export const initializeNotifications = async () => {
  try {
    if (!("Notification" in window)) {
      console.log("Browser doesn't support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!currentToken) {
      console.log("No FCM token received.");
      return;
    }

    console.log("FCM Token:", currentToken);

    await registerDevice(currentToken);

    console.log("Device registered successfully.");

    onMessage(messaging, (payload) => {
      console.log("Foreground Notification:", payload);

      if (payload.notification) {
        window.dispatchEvent(
          new CustomEvent("medicine-reminder", {
            detail: payload.data,
          }),
        );
      }
    });
  } catch (error) {
    console.log("Notification Error:", error);
  }
};
