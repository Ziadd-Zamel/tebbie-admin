import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getUserWalletReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import UserWalletReportTable from "./UserWalletReportTable";

const UserWalletReport = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });
  const statesPerPage = 10;

  const {
    data: reviewData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-wallet-report", token, filters.fromDate, filters.toDate],
    queryFn: () =>
      getUserWalletReport({
        token,
        from_date: filters.fromDate,
        to_date: filters.toDate,
      }),
    enabled: !!token,
  });

  // No frontend filtering needed - backend handles it
  const filteredData = reviewData || [];

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

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      fromDate: "",
      toDate: "",
    });
    setCurrentPage(1);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <label className="block mb-1 text-sm font-medium">
            {t("fromDate")}
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block mb-1 text-sm font-medium">
            {t("toDate")}
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-1/3 flex justify-end items-end">
          <button
            onClick={clearFilters}
            className="text-xl bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] p-2 text-white rounded-xl font-semibold w-full max-w-48"
          >
            {t("clearFilter")}
          </button>
        </div>
      </div>

      <UserWalletReportTable
        translation="users"
        currentStates={currentStates}
        isLoading={isLoading}
        reviewData={reviewData}
      />

      <div className="flex justify-between items-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
          {t("Total")}: {filteredData.length}
        </p>
      </div>
    </div>
  );
};

export default UserWalletReport;
