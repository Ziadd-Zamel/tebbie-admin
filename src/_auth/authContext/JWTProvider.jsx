import { createContext, useState } from "react";
import { useContext } from "react";
const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/dashboard/v1/admin/login`;
export const LOGOUT_URL = `${API_URL}/dashboard/v1/admin/logout`;
export const REGISTER_URL = `${API_URL}/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/dashboard/v1/admin/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/dashboard/v1/admin/reset-password`;
export const OTP_FORGOT_PASSWORD = `${API_URL}/dashboard/v1/admin/otp-forgot-password`;

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          throw new Error(data.message || "خطأ في تسجيل الدخول");
        }
  

      const data = await response.json();
      if (data.data) {
        localStorage.setItem("authToken", data.data);
     
      }else {
        throw new Error(data.message || "خطأ في تسجيل الدخول");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };
  const otpforgotPassword = async (email, otp) => {
    try {
      const response = await fetch(OTP_FORGOT_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      alert(error);
      console.error("something go wrong with sending  Otp", error.message);
    }
  };
  const logout = async () => {

    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        const response = await fetch(LOGOUT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || "Logout failed");
        }

        localStorage.removeItem("authToken");
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        login,
        logout,
        otpforgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
