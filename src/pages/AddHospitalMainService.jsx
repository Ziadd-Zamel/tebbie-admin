import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addHospitalMainService, getHospitals } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = localStorage.getItem("authToken");

const AddHospitalMainService = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospital_id: "",
    name: "",
    status: "active",
  });

  const {
    data: hospitalsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hospitals", token],
    queryFn: () => getHospitals({ token }),
  });

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: (data) => addHospitalMainService({ ...data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["hospital-main-services", token]);
      toast.success(t("تم إضافة الخدمة الرئيسية بنجاح"));
      navigate("/hospital-services");
    },
    onError: (error) => {
      toast.error(error.message || t("فشل في إضافة الخدمة الرئيسية"));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.hospital_id || !formData.name) {
      toast.error(t("يرجى ملء جميع الحقول المطلوبة"));
      return;
    }
    handleSubmit(formData);
  };

  const hospitalsOptions =
    hospitalsData?.map((hospital) => ({
      id: hospital.id,
      name: hospital.name,
    })) || [];

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto md:p-4 p-0 w-full">
      <div className="bg-white rounded-3xl md:p-8 p-4 w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {t("إضافة خدمة رئيسية جديدة")}
        </h1>

        <form
          onSubmit={handleFormSubmit}
          className="space-y-6 w-full flex flex-col justify-center items-center"
        >
          <div className="px-3 my-4 md:mb-0">
            <label
              htmlFor="hospital_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("المستشفى")} *
            </label>
            <select
              name="hospital_id"
              id="hospital_id"
              value={formData.hospital_id}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
              required
            >
              <option value="">{t("اختر المستشفى")}</option>
              {hospitalsOptions.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>

          <div className="px-3 my-4 md:mb-0">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("اسم الخدمة الرئيسية")} *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
              placeholder={t("أدخل اسم الخدمة الرئيسية")}
              required
            />
          </div>

          <div className="px-3 my-4 md:mb-0">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("الحالة")} *
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
              required
            >
              <option value="active">{t("نشط")}</option>
              <option value="inactive">{t("غير نشط")}</option>
            </select>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/hospital-services/main-services")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              {t("إلغاء")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg hover:from-[#048c87] hover:to-[#048c87] focus:outline-none disabled:opacity-50"
            >
              {isPending ? t("جاري الإضافة...") : t("إضافة")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddHospitalMainService;
