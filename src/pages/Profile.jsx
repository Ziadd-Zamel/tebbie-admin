import { useState, useEffect } from "react";
import { ashraf } from "../assets";
import { useTranslation } from "react-i18next";
import { CiEdit } from "react-icons/ci";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUserData } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const {
    data: userdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUser({ token }),
  });

  const [mediaFile, setMediaFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    media_url: null,
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required(t("nameRequired")),
    email: Yup.string()
      .email(t("invalidEmail"))
      .required(t("emailRequired")),
    phone: Yup.string().required(t("phone_required")),
    address: Yup.string().required(t("address_required")),
    password_confirmation: Yup.string().when("password", (password, schema) =>
      password
        ? schema.oneOf([Yup.ref("password")], t("passwords_must_match"))
        : schema
    ),
  });

  const mutation = useMutation({
    mutationFn: (userData) => {
      const { ...dataToSend } = userData;
      return updateUserData({ token, ...dataToSend });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userData"]);
      toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      toast.error(t("errorUpdatingUserData"), error);
    },
  });

  useEffect(() => {
    if (userdata) {
      setFormData({
        name: userdata.name,
        email: userdata.email,
        phone: userdata.phone,
        address: userdata.address,
        media_url: null,
        password: "",
        password_confirmation: "",
      });
    }
  }, [userdata]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = async (name) => {
    try {
     
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setFormData((prevData) => ({
        ...prevData,
        media_url: file,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate(formData, {
        abortEarly: false,
        context: { isPasswordChanged: formData.password.length > 0 }
      });
      setErrors({});
      mutation.mutate(formData);
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Error in submission", error);
      }
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="min-h-screen  flex items-center justify-center p-4">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
        <div className="relative flex flex-col items-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12 ">
            <div className="relative group">
              <img
                src={mediaFile ? URL.createObjectURL(mediaFile) : userdata.media_url || ashraf}
                alt={t("profileImageAlt")}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <label className="absolute bottom-0 right-0 translate-x-[-20%] translate-y-[20%] bg-white rounded-full p-2 shadow-lg border-2 border-primary cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200">
                <CiEdit className="h-6 w-6" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`peer w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="name"
                className={`absolute end-4 top-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary ${
                  formData.name ? "-top-6 text-sm text-primary" : ""
                } ${errors.name ? "text-red-500" : ""}`}
              >
                {t("name")}
              </label>
              {errors.name && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.name}</p>}
            </div>

            <div className="relative">
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`peer w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`absolute end-4 top-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary ${
                  formData.email ? "-top-6 text-sm text-primary" : ""
                } ${errors.email ? "text-red-500" : ""}`}
              >
                {t("email")}
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`peer w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className={`absolute end-4 top-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary ${
                  formData.phone ? "-top-6 text-sm text-primary" : ""
                } ${errors.phone ? "text-red-500" : ""}`}
              >
                {t("phone")}
              </label>
              {errors.phone && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>}
            </div>

            <div className="relative">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`peer w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="address"
                className={`absolute end-4 top-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary ${
                  formData.address ? "-top-6 text-sm text-primary" : ""
                } ${errors.address ? "text-red-500" : ""}`}
              >
                {t("address")}
              </label>
              {errors.address && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.address}</p>}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`peer w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={`absolute start-4 top-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary ${
                  formData.password ? "-top-6 text-sm text-primary" : ""
                } ${errors.password ? "text-red-500" : ""}`}
              >
                {t("password")}
              </label>
              <button
                type="button"
                className="absolute end-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiOutlineEye className="h-5 w-5" />
                )}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password}</p>}
            </div>

            <div className="relative">
              <input
                type={showPasswordConfirmation ? "text" : "password"}
                name="password_confirmation"
                id="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                className={`peer w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.password_confirmation ? "border-red-500" : "border-gray-300"
                }`}
                placeholder=" "
              />
              <label
                htmlFor="password_confirmation"
                className={`absolute start-4 top-3 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-primary ${
                  formData.password_confirmation ? "-top-6 text-sm text-primary" : ""
                } ${errors.password_confirmation ? "text-red-500" : ""}`}
              >
                {t("password_confirmation")}
              </label>
              <button
                type="button"
                className="absolute end-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
              >
                {showPasswordConfirmation ? (
                  <AiOutlineEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiOutlineEye className="h-5 w-5" />
                )}
              </button>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password_confirmation}</p>
              )}
            </div>
          </div>

            <div className="text-center py-10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 hover:bg-[#048c87] w-36 flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? t("saving") : t("save")}
              </button>
            </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;