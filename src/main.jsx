import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import i18n from "./utlis/i18n.js";
import { AuthProvider } from "./_auth/authContext/JWTProvider.jsx";
import { ToastContainer } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
        <App />
    </AuthProvider>
  </React.StrictMode>
);
