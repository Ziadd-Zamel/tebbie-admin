import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getHospitalWallet } from "../utlis/https";
import WalletTable from "../components/WalletTable";
import Pagination from "../components/Pagination";
import ErrorMessage from "./ErrorMessage";

const HospitalWallet = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("authToken");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    hospital_id: "",
    date_from: "",
    date_to: "",
  });
  const itemsPerPage = 10;

  // Fetch hospital wallet data
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
  } = useQuery({
    queryKey: ["hospital-wallet-data"],
    queryFn: () => getHospitalWallet({ token }),
  });

  // Filter data based on filters
  const filteredData = useMemo(() => {
    if (!walletData?.data) return [];

    return walletData.data.filter((item) => {
      // Filter by hospital
      if (
        filters.hospital_id &&
        item.hospital?.id !== parseInt(filters.hospital_id)
      ) {
        return false;
      }

      // Filter by date range
      if (filters.date_from && item.date < filters.date_from) {
        return false;
      }

      if (filters.date_to && item.date > filters.date_to) {
        return false;
      }

      return true;
    });
  }, [walletData?.data, filters]);

  // Pagination logic
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const currentStates = useMemo(() => {
    if (!filteredData) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Current data for display
  const currentData = walletData;
  const currentLoading = walletLoading;
  const currentError = walletError;

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {currentError ? (
          <ErrorMessage message={currentError.message} />
        ) : (
          <>
            <WalletTable
              currentStates={currentStates}
              isLoading={currentLoading}
              walletData={currentData}
              onFilterChange={handleFilterChange}
              showTotal={true}
              totalLabel="total_hospital_wallet"
            />
            {filteredData?.length > 0 && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HospitalWallet;
