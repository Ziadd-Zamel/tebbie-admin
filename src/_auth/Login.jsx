import { useState, useEffect } from "react";
import { mainLogo } from "../assets";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./authContext/JWTProvider";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Tabs, Tab, Box } from "@mui/material";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/config";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { login, CustomerServicelogin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Safari LocalStorage Fix (persist login)
  useEffect(() => {
    try {
      localStorage.setItem("test", "ok");
      const check = localStorage.getItem("test");
      if (!check) {
        console.warn(
          "⚠️ localStorage not accessible on this browser (Safari private mode?)"
        );
      }
    } catch (err) {
      console.warn("⚠️ localStorage blocked:", err);
    }
  }, []);

  // ✅ Function to get FCM token safely (with timeout to avoid Safari freeze)
  const getFCMToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await Promise.race([
          getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY }),
          new Promise((_, reject) => setTimeout(() => reject("timeout"), 5000)),
        ]);
        return token || null;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error retrieving FCM token:", err);
      return null;
    }
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Email is required"),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Password is required"),
  });

  const initialValues = {
    email: localStorage.getItem("email") || "",
    password: "",
    remember: localStorage.getItem("remember") === "true",
  };

  const handleLogin = async (values, authFunction, navigateTo) => {
    setLoading(true);
    try {
      const fcmToken = await getFCMToken();
      await authFunction(values.email, values.password, fcmToken);

      // ✅ Safari-safe localStorage write
      try {
        if (values.remember) {
          localStorage.setItem("email", values.email);
          localStorage.setItem("remember", "true");
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("remember");
        }
      } catch (err) {
        console.warn("localStorage write blocked:", err);
      }

      navigate(navigateTo, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const formikAdmin = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => handleLogin(values, login, from),
  });

  const formikCustomer = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => handleLogin(values, CustomerServicelogin, "/chat"),
  });

  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("role", newValue);
    setShowPassword(false);
  };

  const renderForm = (formik) => (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <div className="mb-2">
        <label htmlFor="email" className="block text-lg mb-2 text-right">
          البريد الالكتروني
        </label>
        <input
          placeholder="البريد الالكتروني"
          type="email"
          id="email"
          name="email"
          autoComplete="off"
          {...formik.getFieldProps("email")}
          className="mt-1 block w-full px-5 py-2 text-md border border-gray-300 text-black text-lg rounded-[8px]"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
        )}
      </div>

      <div className="mb-2 relative">
        <label htmlFor="password" className="block text-lg mb-2 text-right">
          كلمة المرور
        </label>
        <input
          placeholder="********"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className="mt-1 block w-full px-5 py-2 text-md border border-gray-300 text-black text-lg rounded-[8px]"
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
        </button>
      </div>

      {formik.touched.password && formik.errors.password && (
        <div className="text-red-500 text-sm mt-2">
          {formik.errors.password}
        </div>
      )}
      {formik.status && (
        <div className="text-red-500 text-sm mt-4">{formik.status}</div>
      )}

      <div className="flex justify-center md:justify-end mt-4">
        {loading ? (
          <button
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white w-full h-14 text-lg font-bold rounded-tr-lg rounded-bl-lg flex items-center justify-center"
            disabled
          >
            <FaSpinner className="animate-spin" />
          </button>
        ) : (
          <button
            type="submit"
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white w-full h-14 text-lg font-bold rounded-tr-lg rounded-bl-lg"
          >
            تسجيل دخول
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="w-full">
      <div
        dir="rtl"
        className="min-h-screen flex flex-col justify-center items-center p-4 custom-radial-gradient"
      >
        <div className="w-full max-w-md flex flex-col justify-center items-center">
          <div className="my-6 flex justify-center items-center">
            <img className="h-auto xl:w-40 w-36" src={mainLogo} alt="Logo" />
          </div>
          <h1 className="xl:text-3xl text-2xl mb-6 text-center">
            اهلًا بعودتك
          </h1>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                "& .MuiTab-root": {
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  fontFamily: "Almarai, sans-serif",
                },
              }}
            >
              <Tab label="الإدارة" />
              <Tab label="خدمة العملاء" />
            </Tabs>
            <Box sx={{ p: 3 }}>
              {tabValue === 1 && renderForm(formikCustomer)}
              {tabValue === 0 && renderForm(formikAdmin)}
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Login;
