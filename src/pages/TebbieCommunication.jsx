import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getDoctorCommissions, getHomeVisitCommissions } from "../utlis/https";
import HospitalCommissionTable from "../components/HospitalCommissionTable";
import HomeVisitCommissionTable from "../components/HomeVisitCommissionTable";
import Pagination from "../components/Pagination";
import ErrorMessage from "./ErrorMessage";

const TebbieCommunication = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("hospital");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("authToken");
  const statesPerPage = 10;

  // Fetch hospital commissions data
  const {
    data: hospitalCommissionData = { data: [] },
    isLoading: hospitalLoading,
    error: hospitalError,
  } = useQuery({
    queryKey: ["doctor-commissions", token],
    queryFn: () => getDoctorCommissions({ token }),
    enabled: !!token && activeTab === "hospital",
  });

  // Fetch home visit commissions data
  const {
    data: homeVisitCommissionData = { data: [] },
    isLoading: homeVisitLoading,
    error: homeVisitError,
  } = useQuery({
    queryKey: ["homevisit-commissions", token],
    queryFn: () => getHomeVisitCommissions({ token }),
    enabled: !!token && activeTab === "home-service",
  });

  // Get current data based on active tab
  const currentData =
    activeTab === "hospital" ? hospitalCommissionData : homeVisitCommissionData;
  const currentLoading =
    activeTab === "hospital" ? hospitalLoading : homeVisitLoading;
  const currentError =
    activeTab === "hospital" ? hospitalError : homeVisitError;

  // Pagination logic
  const totalPages = Math.ceil(currentData.data?.length / statesPerPage) || 1;

  const currentStates = useMemo(
    () =>
      currentData.data?.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ) || [],
    [currentData, currentPage, statesPerPage]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Reset to first page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-end">
          {t("tebbie_communication")}
        </h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 flex justify-end">
          <nav className=" gap-10">
            <button
              onClick={() => handleTabChange("hospital")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hospital"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("hospitals")}
            </button>
            <button
              onClick={() => handleTabChange("home-service")}
              className={`py-2 px-1 border-b-2 ml-8  font-medium text-sm ${
                activeTab === "home-service"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("home_service")}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "hospital" && (
            <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
              {currentError ? (
                <ErrorMessage message={currentError.message} />
              ) : (
                <>
                  <HospitalCommissionTable
                    currentStates={currentStates}
                    isLoading={currentLoading}
                    commissionData={currentData}
                  />

                  {currentData.data?.length > 0 && (
                    <div className="flex justify-between items-end mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                      <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
                        {t("Total")}: {currentData.data?.length}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "home-service" && (
            <div className="p-4 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm">
              {currentError ? (
                <ErrorMessage message={currentError.message} />
              ) : (
                <>
                  <HomeVisitCommissionTable
                    currentStates={currentStates}
                    isLoading={currentLoading}
                    commissionData={currentData}
                  />

                  {currentData.data?.length > 0 && (
                    <div className="flex justify-between items-end mt-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                      <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
                        {t("Total")}: {currentData.data?.length}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TebbieCommunication;
