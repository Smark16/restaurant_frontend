importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyDJoXbSgkrFbrqBt4pG2O-3awVHHSga9Xo",
  authDomain: "restaurant-system-bad31.firebaseapp.com",
  projectId: "restaurant-system-bad31",
  storageBucket: "restaurant-system-bad31.firebasestorage.app",
  messagingSenderId: "654263112189",
  appId: "1:654263112189:web:3b3f6804951ecac1cb8994",
  measurementId: "G-H9PXT2D6NC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: payload.notification.image,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});