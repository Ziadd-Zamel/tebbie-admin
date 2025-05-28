import { useState } from "react";
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

  // Function to get FCM token
  const getFCMToken = async () => {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Retrieve FCM token
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });

        if (token) {
          
          return token;
        } else {
          return null;
        }
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
    remember: Yup.boolean(),
  });

  const initialValues = {
    email: "",
    password: "",
    remember: false,
  };

  const formikCustomer = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!CustomerServicelogin) {
          
          throw new Error("JWTProvider is required for this form.");
        }
        const fcmToken = await getFCMToken();
        await CustomerServicelogin(
          values.email,
          values.password,
          fcmToken
        );
        if (values.remember) {
          localStorage.setItem("email", values.email);
        } else {
          localStorage.removeItem("email");
        }
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.message === "Failed to fetch") {
          setStatus("فشل الاتصال بالخادم. تحقق من الشبكة أو حاول لاحقًا.");
        } else if (error.status === 500) {
          setStatus("حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.");
        } else if (error.status === 401) {
          setStatus("كلمة المرور أو البريد الإلكتروني غير صحيحين.");
        } else {
          setStatus(
            error.message || "كلمة المرور أو البريد الإلكتروني غير صحيحين."
          );
        }
        setSubmitting(false);
      }
      setLoading(false);
    },
  });

  const formikAdmin = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!login) {
          throw new Error("JWTProvider is required for this form.");
        }
        const fcmToken = await getFCMToken();

        await login(values.email, values.password ,fcmToken);
        if (values.remember) {
          localStorage.setItem("email", values.email);
        } else {
          localStorage.removeItem("email");
        }
        navigate(from, { replace: true });
      } catch (error) {
        console.log(error);
        if (error.message === "Failed to fetch") {
          setStatus("فشل الاتصال بالخادم. تحقق من الشبكة أو حاول لاحقًا.");
        } else if (error.status === 500) {
          setStatus("حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.");
        } else if (error.status === 401) {
          setStatus("كلمة المرور أو البريد الإلكتروني غير صحيحين.");
        } else {
          setStatus(
            error.message || "كلمة المرور أو البريد الإلكتروني غير صحيحين."
          );
        }
        setSubmitting(false);
      }
      setLoading(false);
    },
  });
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem("role",newValue)
    setShowPassword(false);
  };

  const renderForm = (formik) => (
    <form className="w-full" onSubmit={formik.handleSubmit}>
      <div className=" mb-3">
        <label
          htmlFor="email"
          className="block text-lg almarai-thin  mb-3 text-right"
        >
          البريد الالكتروني
        </label>
        <input
          placeholder="البريد الالكتروني"
          type="email"
          id="email"
          name="email"
          autoComplete="off"
          {...formik.getFieldProps("email")}
          className="mt-1 block w-full px-5  py-3 text-md border border-gray-300 text-black text-lg shadow-sm focus:outline-none rounded-[8px]"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
        ) : null}
      </div>

      {/* Password Input */}
      <div className=" mb-3 relative">
        <label
          htmlFor="password"
          className="block text-lg almarai-thin  mb-3 text-right"
        >
          كلمة المرور
        </label>
        <input
          placeholder="********"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className="mt-1 block w-full px-5  py-3 text-md border border-gray-300 text-black text-lg shadow-sm focus:outline-none rounded-[8px]"
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute top-1/2 left-4 transform translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
        </button>
    
      </div>
          {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500 text-sm mt-2">
            {formik.errors.password}
          </div>
        ) : null}
      {formik.status && (
        <div className="text-red-500 text-sm mt-4">{formik.status}</div>
      )}
      {/* Submit Button */}
      <div className="flex justify-center md:justify-end mt-6">
        {loading ? (
          <button
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white w-full h-14 text-lg font-bold rounded-tr-lg rounded-bl-lg hover:bg-transparent my-6 flex items-center justify-center"
            disabled
          >
            <FaSpinner className="animate-spin" />
          </button>
        ) : (
          <button
            type="submit"
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white w-full h-14 text-lg font-bold rounded-tr-lg rounded-bl-lg hover:bg-transparent xl:my-6 my-5"
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
        className="min-h-screen flex flex-col justify-center items-center custom-radial-gradient p-4"
      >
        <div className="w-full max-w-md h-full flex flex-col justify-center items-center">
          <div className="my-6 flex w-full justify-center items-center">
            <img className="h-auto xl:w-40 w-36" src={mainLogo} alt="Logo" />
          </div>
          <h1 className="xl:text-3xl text-2xl almarai-medium xl:mb-12 mb-8 text-center md:text-right">
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
