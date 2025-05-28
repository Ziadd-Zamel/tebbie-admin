/* eslint-disable no-undef */
//firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCsDflLnpLi_KEWs9zfVSugG9ehdPTy-Y4",
  authDomain: "tebbi-1fda2.firebaseapp.com",
  databaseURL: "https://tebbi-1fda2-default-rtdb.firebaseio.com",
  projectId: "tebbi-1fda2",
  storageBucket: "tebbi-1fda2.firebasestorage.app",
  messagingSenderId: "922205311973",
  appId: "1:922205311973:web:f33c211eafa473499a950c",
  measurementId: "G-G9FY96CGGX"
};

try {
  if (!self.firebase) {
    console.error("Service Worker: Firebase global not found");
  } else {
    self.firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Service Worker: Firebase initialization failed:", error);
}

try {
  const messaging = self.firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/firebase-logo.png",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {
  console.error("Service Worker: Messaging initialization failed:", error);
}
