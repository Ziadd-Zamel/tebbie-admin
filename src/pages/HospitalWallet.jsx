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

  // Fetch hospital wallet data with filters
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
  } = useQuery({
    queryKey: ["hospital-wallet-data", filters],
    queryFn: () =>
      getHospitalWallet({
        token,
        hospital_id: filters.hospital_id || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
      }),
  });

  const totalPages = Math.ceil((walletData?.data?.length || 0) / itemsPerPage);

  const currentStates = useMemo(() => {
    if (!walletData?.data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return walletData.data.slice(startIndex, endIndex);
  }, [walletData?.data, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

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
            {walletData?.data?.length > 0 && (
              <div className="flex justify-between items-end mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
                  {t("Total")}: {walletData.data.length}
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
