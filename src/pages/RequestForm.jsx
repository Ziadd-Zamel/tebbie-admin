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
  FaCalendarAlt,
} from "react-icons/fa";
import Pagination from "../components/Pagination";
import { useState } from "react";

const RequestForm = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const isArabic = i18n.language === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8; 
  const {
    data: requestsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["requests", token],
    queryFn: () => getRequestForm({ token }),
  });
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentRequests = requestsData
  ? requestsData.slice(indexOfFirstDoctor, indexOfLastDoctor)
  : [];
const totalPages =
  requestsData?.length > 0 ? Math.ceil(requestsData.length / doctorsPerPage) : 0;


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <div dir={direction} className="min-h-screen p-6 mx-auto container w-full bg-gray-50">
      <h1 className="text-black text-3xl font-bold almarai mb-8 text-center lg:text-start">
        {t("request_forms")}
      </h1>

      {(!currentRequests || currentRequests.length === 0) ? (
        <div className="flex h-[40vh] justify-center items-center">
          <p className="text-center text-gray-600 text-lg font-semibold">
            {t("noData")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6 w-full">
          {currentRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl p-6  border border-gray-200 w-full"
            >
              <h2 className="text-xl text-black font-semibold mb-4 border-b pb-2 border-gray-200">
                {request.name}
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600 flex items-center gap-2">
                  <FaHome className="text-[#33A9C7] shrink-0" />
                  <span className="font-semibold whitespace-nowrap">
                    {t("address")}:
                  </span>{" "}
                  {request.address}
                </p>
                <p className="text-gray-600 flex flex-wrap items-center gap-2">
                  <FaEnvelope className="text-[#33A9C7] shrink-0" />
                  <span className="font-semibold whitespace-nowrap">
                    {t("email")}:
                  </span>
                  <span className="break-all">{request.email}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-[#33A9C7]" />
                  <span className="font-semibold">
                    {t("main_phone", "الهاتف الرئيسي")}:
                  </span>{" "}
                  {request.main_phone}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-[#33A9C7]" />
                  <span className="font-semibold">
                    {t("responsible_phone", "الهاتف المسؤول")}:
                  </span>{" "}
                  {request.responsible_phone}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaIdCard className="text-[#33A9C7]" />
                  <span className="font-semibold">
                    {t("license_number", "رقم الترخيص")}:
                  </span>{" "}
                  {request.license_number}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#33A9C7]" />
                  <span className="font-semibold">
                    {t("created_at", "تاريخ الإنشاء")}:
                  </span>{" "}
                  {formatDate(request.created_at)}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  {request.home_visit ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  <span className="font-semibold">
                    {t("home_visit", "زيارات منزلية")}:
                  </span>{" "}
                  {request.home_visit ? t("yes", "نعم") : t("no", "لا")}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaClipboardList className="text-[#33A9C7]" />
                  <span className="font-semibold">
                    {t("specialties_count", "عدد التخصصات")}:
                  </span>
                  {request.specialties_count}
                </p>
                {request.specializations && (
                  <div className="mt-4">
                    <span className="font-semibold text-gray-700 block">
                      {t("specializations")}:
                    </span>
                    <p className="text-gray-600 flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                      <FaClipboardList className="text-[#33A9C7]" />
                      {request.specializations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
          <div className="flex justify-between items-end mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <p className="text-2xl text-gray-500 text-end">
                {t("Total")}: {requestsData.length}
              </p>
            </div>
    </div>
  );
};

export default RequestForm;