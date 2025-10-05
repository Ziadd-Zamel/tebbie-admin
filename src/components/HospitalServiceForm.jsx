/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import {
  addHospitalService,
  updateHospitalService,
  getHospitals,
} from "../utlis/https";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ErrorMessage from "../pages/ErrorMessage";
import Loader from "../pages/Loader";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const HospitalServiceForm = ({
  initialData,
  mode = "add",
  isLoading,
  error,
}) => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    hospital_id: "",
    name: "",
    tabi_commission: "",
    hospital_commission: "",
    status: "active",
    hospital_main_service_id: "",
  });
  const [errors, setErrors] = useState();

  useEffect(() => {
    if (initialData) {
      setFormData({
        hospital_id: initialData.hospital_id || initialData.hospital?.id || "",
        name: initialData.name || "",
        tabi_commission: initialData.tabi_commission ?? "",
        hospital_commission: initialData.hospital_commission ?? "",
        status: initialData.status || "active",
        hospital_main_service_id: initialData.hospital_main_service_id || "",
      });
    }
  }, [initialData]);

  const { data: hospitals = [] } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
    enabled: !!token,
  });

  const hospitalsOptions = useMemo(
    () =>
      (Array.isArray(hospitals) ? hospitals : []).map((h) => ({
        id: h.id,
        name: h.name,
      })),
    [hospitals]
  );

  // Auto-select main service if main_service_id is in URL
  useEffect(() => {
    const mainServiceId = searchParams.get("main_service_id");
    if (mainServiceId) {
      setFormData((prev) => ({
        ...prev,
        hospital_main_service_id: mainServiceId,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addHospitalService(data)
        : updateHospitalService({ ...data, id });
    },
    onSuccess: () => {
      // Check if we're adding a sub-service (main_service_id in URL)
      const mainServiceId = searchParams.get("main_service_id");

      // Check if we came from a sub-services page (referrer check)
      const cameFromSubServices =
        document.referrer.includes("/main-services/") &&
        document.referrer.includes("/sub-services");

      if (mainServiceId || cameFromSubServices) {
        // Extract mainServiceId from referrer if not in URL params
        let targetMainServiceId = mainServiceId;
        if (!targetMainServiceId && cameFromSubServices) {
          const referrerMatch = document.referrer.match(
            /\/main-services\/(\d+)\/sub-services/
          );
          if (referrerMatch) {
            targetMainServiceId = referrerMatch[1];
          }
        }

        if (targetMainServiceId) {
          // Return to sub-services for this main service
          navigate(
            `/hospital-services/main-services/${targetMainServiceId}/sub-services`
          );
        } else {
          navigate("/hospital-services");
        }
      } else {
        // Return to main services
        navigate("/hospital-services");
      }
      toast.success(
        mode === "add" ? t("تم الإضافة بنجاح") : t("تم التحديث بنجاح")
      );
    },
    onError: (err) => {
      toast.error(t("فشل في الإرسال"));
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      setErrors(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ token, ...formData });
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="container mx-auto p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl bg-white h-auto p-6 shadow-lg flex flex-col justify-center items-center"
      >
        <div className="px-3 my-4 md:mb-0">
          <select
            name="hospital_id"
            id="hospital_id"
            value={formData.hospital_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-md 2 px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="">{t("المستشفى")}</option>
            {hospitalsOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="px-3 my-4 md:mb-0">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            id="name"
            placeholder={t("اسم الخدمة")}
            className="border border-gray-300 rounded-lg px-4 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <input
            type="number"
            name="tabi_commission"
            value={formData.tabi_commission}
            onChange={handleChange}
            placeholder={t("عمولة طبي")}
            className="border border-gray-300 rounded-lg px-4 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <input
            type="number"
            name="hospital_commission"
            value={formData.hospital_commission}
            onChange={handleChange}
            placeholder={t("عمولة المستشفى")}
            className="border border-gray-300 rounded-lg px-4 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-md 2 px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="active">{t("نشط")}</option>
            <option value="inactive">{t("غير نشط")}</option>
          </select>
        </div>

        <div className="text-center py-10 flex justify-center w-full">
          <button
            type="submit"
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg w-40   text-white  py-3 rounded-[8px] focus:outline-none"
          >
            {mode === "add" ? t("إضافة") : t("تحديث")}
          </button>
        </div>
        <p className="text-xl text-red-500 py-4">{errors}</p>
      </form>
    </section>
  );
};

export default HospitalServiceForm;
