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
  const [searchName, setSearchName] = useState("");
  const statesPerPage = 10;

  const {
    data: reviewData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-wallet-report", token, searchName],
    queryFn: () => getUserWalletReport({ token, name: searchName }),
    enabled: !!token,
  });

  const totalPages = Math.ceil(reviewData?.length / statesPerPage) || 1;

  const currentStates = useMemo(
    () =>
      reviewData?.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [reviewData, currentPage]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchName(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={t("Search by name...")}
          value={searchName}
          onChange={handleSearchChange}
          className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] focus:border-transparent"
        />
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
          {t("Total")}: {reviewData?.length}
        </p>
      </div>
    </div>
  );
};

export default UserWalletReport;
