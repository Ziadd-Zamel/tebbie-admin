/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getHomeVisitBookingsSummary } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomeVisitBookingsSummary = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;
  const navigate = useNavigate();

  const {
    data: hospitals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-visit-bookings-summary", token],
    queryFn: () => getHomeVisitBookingsSummary({ token }),
    enabled: !!token,
  });

  // Memoize filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(hospitals)) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return hospitals;
    return hospitals.filter((h) =>
      String(h.hospital_name || "")
        .toLowerCase()
        .includes(term)
    );
  }, [hospitals, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / statesPerPage) || 1;
  const currentStates = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [filteredData, currentPage]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 flex flex-col gap-4 font-sans">
      <p className="font-bold text-xl md:text-2xl mb-5 flex gap-2 items-center">
        <FaHome size={30} className="text-[#3CAB8B]" />
        {t("homeVisitReport")}
      </p>
      <input
        type="text"
        placeholder={t("search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                {t("hospital_name")}
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                {t("total_bookings")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <tr>
                <td className="px-4 py-4" colSpan={2}>
                  {t("loading")}
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td className="px-4 py-4" colSpan={2}>
                  {t("no_data")}
                </td>
              </tr>
            ) : (
              currentStates.map((row) => (
                <tr
                  key={row.hospital_id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    navigate(
                      `/home-visit-service-booking-details/${row.hospital_id}`
                    )
                  }
                >
                  <td className="px-4 py-3 text-sm text-gray-800 text-right">
                    {row.hospital_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center">
                    {row.total_bookings}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <p className="lg:text-2xl md:text-xl  text-lg text-gray-500 text-end">
          {t("Total")}: {filteredData.length}
        </p>
      </div>
    </div>
  );
};

export default HomeVisitBookingsSummary;
