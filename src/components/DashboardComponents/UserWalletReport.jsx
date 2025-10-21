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
    searchName: "",
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

  // Frontend filtering for search by name
  const filteredData = useMemo(() => {
    const users = reviewData.users || [];
    if (!filters.searchName) return users;

    return users.filter((user) =>
      user.name?.toLowerCase().includes(filters.searchName.toLowerCase())
    );
  }, [reviewData?.users, filters.searchName]);

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
      searchName: "",
    });
    setCurrentPage(1);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
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
        <div className="w-full md:w-1/4">
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
        <div className="w-full md:w-1/4">
          <label className="block mb-1 text-sm font-medium">
            {t("searchByName") || "Search by Name"}
          </label>
          <input
            type="text"
            value={filters.searchName}
            onChange={(e) => handleFilterChange("searchName", e.target.value)}
            placeholder={t("searchByName") || "Search by name..."}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-1/4 flex justify-end items-end">
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
        allFilteredData={filteredData}
      />

      <div className="flex justify-between items-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="flex flex-col items-end">
          <p className="lg:text-2xl md:text-xl text-lg text-gray-600 text-end">
            {t("balance")}: {reviewData?.total_balance ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserWalletReport;
