import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getHomeVisitServices } from "../utlis/https";
import HomeVisitServicesTable from "../components/HomeVisitServicesTable";
import Pagination from "../components/Pagination";
import ErrorMessage from "./ErrorMessage";

const HomeVisitServices = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [hospitalFilter, setHospitalFilter] = useState("");
  const token = localStorage.getItem("authToken");
  const statesPerPage = 10;

  // Fetch home visit services data with hospital filter
  const {
    data: servicesData = { data: [] },
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["home-visit-services", token, hospitalFilter],
    queryFn: () =>
      getHomeVisitServices({
        token,
        hospital_id: hospitalFilter || undefined,
      }),
    enabled: !!token,
  });

  // Pagination logic
  const totalPages = Math.ceil(servicesData.data?.length / statesPerPage) || 1;

  const currentStates = useMemo(
    () =>
      servicesData.data?.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ) || [],
    [servicesData, currentPage, statesPerPage]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleFilterChange = useCallback((newHospitalFilter) => {
    setHospitalFilter(newHospitalFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Content */}
        <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
          {servicesError ? (
            <ErrorMessage message={servicesError.message} />
          ) : (
            <>
              <HomeVisitServicesTable
                currentStates={currentStates}
                isLoading={servicesLoading}
                servicesData={servicesData}
                onFilterChange={handleFilterChange}
              />

              {servicesData.data?.length > 0 && (
                <div className="flex justify-between items-end mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                  <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
                    {t("Total")}: {servicesData.data?.length}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeVisitServices;
