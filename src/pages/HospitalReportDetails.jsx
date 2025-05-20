/* eslint-disable react/prop-types */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHospitalReport } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { CiHospital1 } from "react-icons/ci";
import { FaFileExcel } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";

const HospitalReportDetails = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const { hosId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const {
    data: hospitalData = { hospital_name: "", bookings: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors-Report", token, hosId],
    queryFn: () => getHospitalReport({ token, hospital_id: hosId }),
    enabled: !!token,
    select: (data) => data,
  });

  // Pagination logic
  const indexOfLastState = currentPage * statesPerPage;
  const indexOfFirstState = indexOfLastState - statesPerPage;
  const currentStates = hospitalData.bookings.slice(indexOfFirstState, indexOfLastState);
  const totalPages =
    hospitalData.bookings.length > 0
      ? Math.ceil(hospitalData.bookings.length / statesPerPage)
      : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Excel export function
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(
      hospitalData.bookings.map((data) => ({
        [t("patientName")]: data.patient_name || t("Na"),
        [t("phone")]: data.patient_phone || t("Na"),
        [t("doctorName")]: data.doctor_name || t("Na"),
        [t("payment_method")]: data.payment_method || t("Na"),
        [t("payment_status")]: data.booking_status || t("Na"),
        [t("status")]: data.payment_status || t("Na"),
        [t("cancellation_reason")]: data.cancellation_reason || t("Na"),
        [t("original_price")]: data.original_price || t("Na"),
        [t("final_price")]: data.final_price || t("Na"),
        [t("discount_amount")]: data.discount_amount || t("Na"),
        [t("booking_date")]: data.booking_date || t("Na"),
      }))
    );
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Hospital Report");
    writeFile(workbook, `${hospitalData.hospital_name}_Report.xlsx`);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div
      className="p-4 sm:p-6  w-full mx-auto"
      dir={i18n.dir()}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
        <h1 className="font-bold md:text-xl text-lg lg:text-2xl flex items-center gap-2 text-gray-800">
          <CiHospital1
            size={35}
            className="text-[#3CAB8B]"
            aria-hidden="true"
          />
          {t("hospitalReport")}
          {hospitalData.hospital_name ? `- ${hospitalData.hospital_name}` : ""}
        </h1>
        <button
          onClick={exportToExcel}
          className="px-6 py-2 flex items-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-base sm:text-lg"
          aria-label={t("Excel-Export")}
        >
          {t("Excel-Export")}
          <FaFileExcel aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-x-auto lg:w-full md:w-[100vw] w-[90vw] rounded-lg">
        <table
          className="w-full border border-gray-200 bg-white text-sm sm:text-base"
          aria-label={t("hospitalReportTable")}
        >
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
            <tr>
              {[
                "patientName",
                "phone",
                "doctorName",
                "payment_method",
                "payment_status",
                "status",
                "cancellation_reason",
                "original_price",
                "final_price",
                "discount_amount",
                "booking_date",
              ].map((key) => (
                <th
                  key={key}
                  className="py-3 px-3 text-center transition-colors"
                  scope="col"
                >
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="py-8 text-center">
                  <Loader />
                </td>
              </tr>
            ) : currentStates.length > 0 ? (
              currentStates.map((data, index) => (
                <tr
                  key={data.booking_id || index}
                  className={`border-b border-gray-200 transition-colors ${
                    data.booking_status === "cancelled" ? "bg-red-50" : ""
                  }`}
                >
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {data.patient_name || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {data.patient_phone || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {data.doctor_name || t("Na")}
                  </td>
                  <td>{data.payment_method || t("Na")}</td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <p
                      className={`p-2 ${
                        data.booking_status === "cancelled"
                          ? "bg-red-400 text-white rounded-full"
                          : data.booking_status === "finished"
                          ? "bg-green-400 text-white rounded-full"
                          : "bg-blue-400 text-white rounded-full"
                      }`}
                    >
                      {t(data.booking_status)}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {data.payment_status || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {data.cancellation_reason || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {data.original_price || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {data.final_price || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {data.discount_amount || t("Na")}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {data.booking_date || t("Na")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-8 text-center text-gray-500">
                  {t("noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
{hospitalData.bookings.length> 10 && (
        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-end">
            {t("Total")}: {hospitalData.bookings.length}
          </p>
        </div>
      )}
   
    </div>
  );
};

export default HospitalReportDetails;