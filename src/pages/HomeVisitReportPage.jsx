/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getHomeVisitReportById } from "../utlis/https";
import HomeVisitReportTable from "../components/HomeVisitReportTable";
import ErrorMessage from "./ErrorMessage";
import Pagination from "../components/Pagination";

const HomeVisitReportPage = () => {
  const token = localStorage.getItem("authToken");
  const { serviceId } = useParams();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const {
    data: visitData = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["home-visit-report", token, serviceId],
    queryFn: () => getHomeVisitReportById({ token, serviceId }),
    enabled: !!token && !!serviceId,
  });

  const totalPages =
    Math.ceil(visitData.data?.data?.length / statesPerPage) || 1;

  const currentStates = useMemo(
    () =>
      visitData.data?.data?.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [visitData, currentPage]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className=" px-5 pb-5 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm container mx-auto">
      <HomeVisitReportTable
        currentStates={currentStates}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-end mt-4 ">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
          {t("Total")}: {visitData.data?.total}
        </p>
      </div>
    </div>
  );
};

export default HomeVisitReportPage;
