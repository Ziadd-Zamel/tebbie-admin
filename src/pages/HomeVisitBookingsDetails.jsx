/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import Pagination from "../components/Pagination";
import { getHomeVisitBookingsByService } from "../utlis/https";
import { utils, writeFile } from "xlsx";
import { FaHome } from "react-icons/fa";

const HomeVisitBookingsDetails = () => {
  const token = localStorage.getItem("authToken");
  const { hospitalId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const {
    data = { hospital_name: "", services: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-visit-bookings-details", token, hospitalId],
    queryFn: () =>
      getHomeVisitBookingsByService({
        token,
        hospital_id: hospitalId,
      }),
    enabled: !!token && !!hospitalId,
    keepPreviousData: true,
  });

  const services = useMemo(
    () => (Array.isArray(data?.services) ? data.services : []),
    [data?.services]
  );

  const totalPages = Math.ceil((services.length || 0) / statesPerPage) || 1;
  const currentStates = useMemo(
    () =>
      services.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [services, currentPage, statesPerPage]
  );

  const exportToExcel = () => {
    const rows = Array.isArray(services) ? services : [];
    if (!rows.length) return;
    try {
      const worksheet = utils.json_to_sheet(
        rows.map((row) => ({
          [t("service_name")]: row.service_name || t("Na"),
          [t("total_bookings")]: row.total_bookings || 0,
        }))
      );
      const wb = utils.book_new();
      utils.book_append_sheet(wb, worksheet, "Home Visit Services");
      writeFile(
        wb,
        `${data?.hospital_name || "Hospital"}_Home_Visit_Bookings.xlsx`
      );
    } catch (e) {
      // ignore if xlsx not available
    }
  };

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 sm:p-8 w-full mx-auto" dir={i18n.dir()}>
      <div className="bg-white min-h-screen p-4 rounded-2xl w-full overflow-x-auto ">
        <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
          <h1 className="font-bold md:text-xl text-lg lg:text-2xl flex items-center gap-2 text-gray-800">
            <FaHome size={30} className="text-[#3CAB8B]" />
            {t("home_visit_bookings_details")}{" "}
            {data?.hospital_name ? `- ${data.hospital_name}` : ""}
          </h1>
          {services.length > 0 && (
            <button
              onClick={exportToExcel}
              className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm"
              aria-label={t("Excel-Export")}
              type="button"
            >
              {t("Excel-Export")}
            </button>
          )}
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <div className="min-w-full">
            <table
              style={{ direction: i18n.dir() }}
              className="min-w-[600px] w-full bg-white text-sm"
            >
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap">
                    {t("service_name")}
                  </th>
                  <th className="py-3 px-4 text-center transition-colors whitespace-nowrap">
                    {t("total_bookings")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : currentStates.length > 0 ? (
                  currentStates.map((row, index) => (
                    <tr
                      key={row.service_id || index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/home-visit-service-booking-details/${hospitalId}`
                        )
                      }
                    >
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {row.service_name || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {row.total_bookings || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-gray-500">
                      {t("noData")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {services.length > 0 && (
          <div className="flex justify-between items-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <p className="text-2xl text-gray-500 text-end">
              {t("Total")}: {services.length || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeVisitBookingsDetails;
