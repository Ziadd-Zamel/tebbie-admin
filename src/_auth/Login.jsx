import { useState } from "react";
import { mainLogo } from "../assets";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./authContext/JWTProvider";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
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
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!login) {
          throw new Error("JWTProvider is required for this form.");
        }
        await login(values.email, values.password);
        if (values.remember) {
          localStorage.setItem("email", values.email);
        } else {
          localStorage.removeItem("email");
        }
        navigate(from, {
          replace: true,
        });
      } catch (error) {
        console.log(error)
        if (error.message === "Failed to fetch") {
          setStatus("فشل الاتصال بالخادم. تحقق من الشبكة أو حاول لاحقًا.");
        } else if (error.status === 500) {
          setStatus("حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.");
        } else if (error.status === 401) {
          setStatus("كلمة المرور أو البريد الإلكتروني غير صحيحين.");
        } else {
          `setStatus`;
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

  return (
    <div className=" w-full">
      <div
        dir="rtl"
        className="min-h-screen flex flex-col justify-center items-center custom-radial-gradient p-4"
      >
        <div className="w-full max-w-md h-full flex flex-col justify-center items-center">
          <div className="xl:my-8 my-6 flex w-full justify-center items-center">
            <img className="h-auto xl:w-40 w-36-" src={mainLogo} alt="Logo" />
          </div>
          <h1 className="xl:text-3xl text-2xl almarai-medium xl:mb-12 mb-10 text-center md:text-right">
            اهلًا بعودتك
          </h1>
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/* Email Input */}
            <div className="xl:mb-4 mb-3">
              <label
                htmlFor="email"
                className="block text-lg almarai-thin xl:mb-4 mb-3 text-right"
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
                className="mt-1 block w-full px-5 xl:py-4 py-3 text-md border border-gray-300 text-black text-lg shadow-sm focus:outline-none rounded-[8px]"
              />
              {/* Display email error */}
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Password Input */}
            <div className="xl:mb-4 mb-3 relative">
              <label
                htmlFor="password"
                className="block text-lg almarai-thin xl:mb-4 mb-3 text-right"
              >
                كلمة المرور
              </label>
              <input
                placeholder="********"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                {...formik.getFieldProps("password")}
                className="mt-1 block w-full px-5 xl:py-4 py-3 text-md border border-gray-300 text-black text-lg shadow-sm focus:outline-none rounded-[8px]"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute top-1/2 left-4 transform translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
              </button>
              {/* Display password error */}
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            {formik.status && (
              <div className="text-red-500 text-sm mt-4">{formik.status}</div>
            )}
            {/* Submit Button */}
            <div className="flex justify-center md:justify-end mt-8">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
