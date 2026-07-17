importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCyoxkyp4jwOOBzO-mqVsCVasAFWrROvmo",
  authDomain: "medsync-2204a.firebaseapp.com",
  projectId: "medsync-2204a",
  storageBucket: "medsync-2204a.firebasestorage.app",
  messagingSenderId: "294936359546",
  appId: "1:294936359546:web:3b5b9e704f8fa6e7fcc1c3",
});

const messaging = firebase.messaging();

// Handles notifications when the app is in background
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", // optional
    data: payload.data, // we'll use this later
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const scheduleId = event.notification.data?.scheduleId;
  const url = scheduleId ? `/dashboard?scheduleId=${scheduleId}` : "/dashboard";

  event.waitUntil(clients.openWindow(url));
});

firebase.messaging();
