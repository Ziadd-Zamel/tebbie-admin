/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../../pages/Loader";

const CancelledReportTable = ({ currentStates, isLoading }) => {
  const [expanded, setExpanded] = useState(null);
  const { t } = useTranslation();

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
      <thead>
        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-center">{t("user_name")}</th>
          <th className="py-3 px-6 text-center">{t("total_bookings")}</th>
          <th className="py-3 px-6 text-center">{t("details")}</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 md:text-lg text-md font-light">
        {isLoading ? (
          <tr>
            <td colSpan="3" className="py-4 px-6 text-center">
              <Loader />
            </td>
          </tr>
        ) : currentStates?.length > 0 ? (
          currentStates?.map((booking, index) => (
            <>
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-2 px-6 text-center">{booking.user_name}</td>
                <td className="py-2 px-6 text-center">
                  {booking.bookings.length}
                </td>
                <td className="py-2 px-6 text-center">
                  {booking.bookings.length > 0 && (
                    <button
                      onClick={() => toggleExpand(booking.user_id)}
                      className="text-[#3CAB8B] hover:text-[#4db799]"
                      aria-label={
                        expanded === booking.user_id
                          ? t("hideDetails")
                          : t("showDetails")
                      }
                    >
                      {expanded === booking.user_id ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  )}
                </td>
              </tr>
              {expanded === booking.user_id && booking.bookings.length > 0 && (
                <tr>
                  <td colSpan="3" className="py-4 px-6 bg-gray-50">
                    <div className="space-y-4">
                      {booking.bookings.map((book, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm font-semibold"
                        >
                          <div className="flex items-center justify-end">
                            <span className="text-sm bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] p-2 text-white rounded-xl font-semibold">
                              {formatDateTime(book.created_at)}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700 font-bold text-2xl">
                            {t("user_name")} : {booking.user_name}
                          </p>
                          <p className="mt-2 text-gray-700">
                            {t("doctor")} : {book.doctor_name}
                          </p>
                         
                          <p className="mt-1 text-gray-700">
                            {t("hospital")} : {book.hospital_name}
                          </p>
                          <p className="mt-1 text-gray-700">
                            {t("price")} : {book.price}
                          </p>
                          <p className="mt-1 text-gray-700">
                            {t("canceled_by")} :
                            {book.doctor_audience === "0"
                              ? t("doctor")
                              : book.client_audience === "0"
                              ? t("client")
                              : t("unknown")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="py-4 px-6 text-center text-gray-500">
              {t("noData")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>

  );
};

export default CancelledReportTable;