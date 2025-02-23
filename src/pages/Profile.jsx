import  { useState, useEffect } from "react";
import { ashraf } from "../assets";
import { useTranslation } from "react-i18next";
import { CiEdit } from "react-icons/ci";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUser, updateUserData } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const token = localStorage.getItem("authToken");

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
  });

  const mutation = useMutation({
    mutationFn: (userData) => updateUserData({ token, ...userData }),
    onSuccess: (data) => {
      toast.success("User data updated successfully", data);
    },
    onError: (error) => {
      toast.error("Error updating user data:", error);
    },
  });

  useEffect(() => {
    if (userdata) {
      setFormData({
        name: userdata.name,
        email: userdata.email,
        phone: userdata.phone,
        address: userdata.address,
        media_url: userdata.media_url,
      });
    }
  }, [userdata]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      mutation.mutate(formData);
    } catch (error) {
      console.error("Error in submission", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }

  return (
    <section className="container mx-auto p-4">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full rounded-md bg-white"
      >
        <form
          className="max-w-full lg:max-w-fit md:m-20 m-8 py-8 lg:mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="relative flex flex-col items-center bg-Secondary rounded-xl p-6 mb-8 max-w-xl mx-auto h-auto lg:h-[137px]">
            <div className="absolute -top-12 flex justify-center">
              <img
                src={
                  mediaFile
                    ? URL.createObjectURL(mediaFile)
                    : userdata.media_url || ashraf
                }
                alt={t("profileImageAlt")}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0 translate-x-[-30%] translate-y-[30%]  rounded-full shadow-xl p-[1px] border-[2px] border-primary">
                <label id="file-input" className="cursor-pointer">
                  <CiEdit className="h-8 w-8 text-primary hover:text-secondary" />
                  <input
                    type="file"
                    id="file-input"
                    name="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-8 lg:pt-12 pb-8 mb-4 flex flex-col">
            <div className="lg:flex justify-between">
              <div className="px-3 my-6 md:mb-0">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="name"
                >
                  {t("name")}
                </label>
                <input
                  type="text"
                  name="name"
                  id="grid-name"
                  placeholder={t("firstName")}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
                />
              </div>

              <div className="px-3 my-6 md:mb-0">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="email"
                >
                  {t("email")}
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder={t("email")}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
                />
              </div>
            </div>

            <div className="lg:flex mb-6 justify-between">
              <div className="px-3 my-6 md:mb-0">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="phone"
                >
                  {t("phone")}
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder={t("phone")}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
                />
              </div>

              <div className="px-3 my-6 md:mb-0">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="address"
                >
                  {t("address")}
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder={t("address")}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
                />
              </div>
            </div>

            <div className="text-center py-10 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 hover:bg-[#048c87] w-36 flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? t("saving") : t("save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
