importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyDnNFszqf2n5P8ekFhbIcR_HDufhtHXzdk",
    authDomain: "restaurant-management-sy-4c2c8.firebaseapp.com",
    projectId: "restaurant-management-sy-4c2c8",
    storageBucket: "restaurant-management-sy-4c2c8.appspot.com",
    messagingSenderId: "736422553584",
    appId: "1:736422553584:web:121ecad67feef01837df35",
    measurementId: "G-HLBB29FJ4C"
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