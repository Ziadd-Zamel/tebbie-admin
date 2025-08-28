/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getPaymentReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import PaymentReportTable from "./PaymentReportTable";

const PaymentReporte = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const {
    data: reviewData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-Payment-Report", token],
    queryFn: () => getPaymentReport({ token }),
    enabled: !!token,
  });
  console.log(reviewData);

  // No filtering, just use all data
  const totalPages = Math.ceil(reviewData.data?.length / statesPerPage) || 1;

  const currentStates = useMemo(
    () =>
      reviewData.data?.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [reviewData, currentPage]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
      <PaymentReportTable
        translation="users"
        currentStates={currentStates}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
          {t("Total")}: {reviewData.data?.length}
        </p>
      </div>
    </div>
  );
};

export default PaymentReporte;
