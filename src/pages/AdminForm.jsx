/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { updateAdmin, createAdmin, getEmployeeRoles } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const AdminForm = ({ initialData, mode = "add", isLoading, error }) => {
  const { t } = useTranslation();
  const { adminId } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Fetch employee roles for role selection
  const { data: roles } = useQuery({
    queryKey: ["employee-roles"],
    queryFn: () => getEmployeeRoles({ token }),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone: "",
    media: null,
    role: "",
    id: adminId,
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        password_confirmation: "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        media: null,
        role: initialData.role?.id || "",
      });
      if (initialData.media_url) {
        setPreviewImage(initialData.media_url);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        media: file,
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? createAdmin({ ...data, token })
        : updateAdmin({ ...data, token, id: adminId });
    },
    onSuccess: () => {
      navigate("/admins");
      mode === "add"
        ? toast.success(t("Admin added successfully"))
        : toast.success(t("Admin updated successfully"));
    },
    onError: (error) => {
      toast.error(error.message || t("Submission failed"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      mode === "add" &&
      (!formData.password || !formData.password_confirmation)
    ) {
      toast.error(t("Password is required"));
      return;
    }

    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      toast.error(t("Passwords do not match"));
      return;
    }

    const dataToSubmit = {
      ...formData,
      ...(mode === "update" && { id: adminId }),
    };

    mutation.mutate(dataToSubmit);
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={"rtl"} className="container mx-auto p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md bg-white min-h-[70vh] p-6 shadow-lg flex flex-col justify-center items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {/* Name */}
          <div className="px-3 my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              id="name"
              placeholder={t("name")}
              required
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full text-right"
            />
          </div>

          {/* Email */}
          <div className="px-3 my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              id="email"
              placeholder={t("email")}
              required
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full text-right"
            />
          </div>

          {/* Phone */}
          <div className="px-3 my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("phone")} *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              id="phone"
              placeholder={t("phone")}
              required
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full text-right"
            />
          </div>

          {/* Role */}
          <div className="px-3 my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("role")}
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full text-right"
            >
              <option value="">{t("Select Role")}</option>
              {roles?.data?.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="px-3 my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("password")} {mode === "add" ? "*" : ""}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              id="password"
              placeholder={t("password")}
              required={mode === "add"}
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full text-right"
            />
          </div>

          {/* Password Confirmation */}
          <div className="px-3 my-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("Confirm Password")} {mode === "add" ? "*" : ""}
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              id="password_confirmation"
              placeholder={t("Confirm Password")}
              required={mode === "add"}
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full text-right"
            />
          </div>

          {/* Address */}
          <div className="px-3 my-4 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("address")} *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              id="address"
              placeholder={t("address")}
              required
              rows={3}
              dir={"rtl"}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] focus:outline-none focus:border-primary w-full text-right"
            />
          </div>

          {/* Media Upload */}
          <div className="px-3 my-4 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              {t("Profile Image")}
            </label>
            <div className="flex justify-center items-center">
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex justify-center items-center">
                    <FaCamera size={24} className="text-gray-500" />
                  </div>
                )}
                <label
                  htmlFor="media"
                  className="absolute bottom-0 right-0 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white p-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <FaCamera />
                </label>
                <input
                  type="file"
                  name="media"
                  onChange={handleFileChange}
                  id="media"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {t("Click the camera icon to upload profile image")}
            </p>
          </div>
        </div>

        <div className="text-center py-10 flex justify-center w-full">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg w-40 text-white py-3 rounded-[8px] focus:outline-none disabled:opacity-50"
          >
            {mutation.isPending
              ? t("Loading...")
              : mode === "add"
              ? t("Add Admin")
              : t("Update Admin")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminForm;
