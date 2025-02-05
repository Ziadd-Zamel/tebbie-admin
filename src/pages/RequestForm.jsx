import { useQuery } from "@tanstack/react-query";
import { getRequestForm } from "../utlis/https";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";

const RequestForm = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: requestsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["requests", token],
    queryFn: () => getRequestForm({ token }),
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <div dir={direction} className="min-h-screen p-6 m-auto container w-full">
      <h1 className="text-black text-3xl font-bold almarai mb-8">
        {t("request_forms", "نماذج الطلبات")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-6 gap-4 w-full">
        {requestsData.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg lg:p-6 p-4 border border-gray-200 w-full "
          >
            <h2 className="text-xl text-black font-semibold mb-4">
              {request.name}
            </h2>
            <p className="text-gray-600 mb-2 flex items-center gap-2">
              <FaHome className="text-[#33A9C7] shrink-0" />
              <span className="font-semibold whitespace-nowrap">
                {t("address", "العنوان")}:
              </span>{" "}
              {request.address}
            </p>
            <p className="text-gray-600 mb-2 flex flex-wrap items-center gap-2">
              <FaEnvelope className="text-[#33A9C7] shrink-0" />
              <span className="font-semibold whitespace-nowrap">
                {t("email")}:
              </span>
              <span className="break-all">{request.email}</span>
            </p>

            <p className="text-gray-600 mb-2 flex items-center gap-2">
              <FaPhone className="text-[#33A9C7]" />
              <span className="font-semibold">الهاتف الرئيسي:</span>{" "}
              {request.main_phone}
            </p>
            <p className="text-gray-600 mb-2 flex items-center gap-2">
              <FaPhone className="text-[#33A9C7]" />
              <span className="font-semibold">الهاتف المسؤول:</span>{" "}
              {request.responsible_phone}
            </p>
            <p className="text-gray-600 mb-2 flex items-center gap-2">
              <FaIdCard className="text-[#33A9C7]" />
              <span className="font-semibold">رقم الترخيص:</span>{" "}
              {request.license_number}
            </p>
            <p className="text-gray-600 mb-2 flex items-center gap-2">
              {request.home_visit ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <span className="font-semibold">زيارات منزلية:</span>{" "}
              {request.home_visit ? "نعم" : "لا"}
            </p>
            <p className="text-gray-600 mb-2 flex items-center gap-2">
              <FaClipboardList className="text-[#33A9C7]" />
              <span className="font-semibold">عدد التخصصات:</span>{" "}
              {request.specialties_count}
            </p>
            {request.specializations  && (
              <div className="mt-4">
                <span className="font-semibold text-gray-700">التخصصات:</span>
                    <p
                      className="text-gray-600 flex items-center gap-2"
                    >
                      <FaClipboardList className="text-[#33A9C7]" />
                      {request.specializations}
                    </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestForm;
