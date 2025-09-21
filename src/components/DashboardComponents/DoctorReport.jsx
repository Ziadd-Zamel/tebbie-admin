/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getDocotrReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import OneSelectDropdown from "../OneSelectDropdown";
import { FaUserDoctor } from "react-icons/fa6";
import DocotrReportTable from "./DocotrReportTable";
import { utils, writeFile } from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);

  return debouncedValue;
};

// eslint-disable-next-line react/prop-types
const DoctorReport = ({ hospitalsData, doctorsData }) => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedHospital: null,
    selectedDoctor: null,
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(rawSearchTerm, 300);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);

  const {
    data: doctorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "doctors-Report",
      token,
      filters.selectedDoctor,
      filters.selectedHospital,
      filters.fromDate,
      filters.toDate,
      currentPage,
    ],
    queryFn: () =>
      getDocotrReport({
        token,
        doctor_id: filters.selectedDoctor,
        hospital_id: filters.selectedHospital,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        page: currentPage,
      }),
    enabled: !!token,
  });
  const {
    data: allDoctorData,
    refetch: refetchAllData,
    isFetching: isExporting,
  } = useQuery({
    queryKey: [
      "doctors-Report-all",
      token,
      filters.selectedDoctor,
      filters.selectedHospital,
      filters.fromDate,
      filters.toDate,
    ],
    queryFn: () =>
      getDocotrReport({
        token,
        doctor_id: filters.selectedDoctor,
        hospital_id: filters.selectedHospital,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        // No page parameter - this will return all data
      }),
    enabled: false, // Don't run automatically
  });
  const exportToExcel = async () => {
    try {
      const result = await refetchAllData();

      if (result.data && result.data.data) {
        const worksheet = utils.json_to_sheet(
          result.data.data.map((data) => ({
            [t("doctor")]: data.doctor_name || t("Na"),
            [t("total_bookings")]: data.total_count || t("Na"),
          }))
        );
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Doctor Report");
        writeFile(
          workbook,
          `Doctor_Report_All_${new Date().toISOString().split("T")[0]}.xlsx`
        );
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert(t("export_failed") || "Export failed. Please try again.");
    }
  };
  const doctorOptions = useMemo(
    () =>
      doctorsData?.map((doctor) => ({ value: doctor.id, label: doctor.name })),
    [doctorsData]
  );

  const hospitalOptions = useMemo(
    () =>
      hospitalsData?.map((hospital) => ({
        value: hospital.id,
        label: hospital.name,
      })),
    [hospitalsData]
  );

  const filteredData = useMemo(() => {
    if (!doctorData?.data || !Array.isArray(doctorData.data)) return [];

    return doctorData.data.filter((review) => {
      const matchesSearch =
        !filters.searchTerm ||
        review.doctor_name
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      const matchesUser =
        !filters.selectedUser || review.user_id === filters.selectedUser;
      return matchesSearch && matchesUser;
    });
  }, [doctorData, filters.searchTerm, filters.selectedUser]);

  const totalPages = doctorData?.last_page || 1;
  const totalRecords = doctorData?.total || 0;

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedHospital: null,
      selectedUser: null,
      selectedDoctor: null,
      fromDate: "",
      toDate: "",
    });
    setRawSearchTerm("");
    setCurrentPage(1);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;
  return (
    <div className="p-4 flex flex-col gap-4 font-sans">
      <p className="font-bold text-xl md:text-2xl mb-5 flex gap-2 items-center">
        <FaUserDoctor size={30} className="text-[#3CAB8B]" />
        {t("doctorReport")}
      </p>
      <div className="flex xl:flex-row flex-col gap-4">
        <div className="xl:w-1/2 w-full">
          <input
            type="text"
            placeholder={t("search")}
            value={rawSearchTerm}
            onChange={(e) => setRawSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="xl:w-1/2 w-full">
          {filteredData.length > 0 && (
            <button
              onClick={exportToExcel}
              disabled={isExporting}
              className={`px-6 h-10 w-full shrink-0 flex items-center justify-center gap-2 ${
                isExporting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] hover:from-[#2A8AA7] hover:to-[#2F8B6B]"
              } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-base sm:text-lg`}
              aria-label={t("Excel-Export")}
            >
              {isExporting
                ? t("exporting") || "Exporting..."
                : t("Excel-Export")}
              <FaFileExcel aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="flex xl:flex-row flex-col gap-4">
        <div className="xl:w-1/2 w-full">
          <OneSelectDropdown
            options={doctorOptions}
            onChange={(value) => handleFilterChange("selectedDoctor", value)}
            selectedValues={
              filters.selectedDoctor ? [filters.selectedDoctor] : []
            }
            placeholder={t("select_doctor")}
            searchPlaceholder={t("search")}
            fallbackMessage={t("noUsersFound")}
          />
        </div>
        <div className="xl:w-1/2 w-full">
          <OneSelectDropdown
            options={hospitalOptions}
            onChange={(value) => handleFilterChange("selectedHospital", value)}
            selectedValues={
              filters.selectedHospital ? [filters.selectedHospital] : []
            }
            placeholder={t("selectHospital")}
            searchPlaceholder={t("search")}
            fallbackMessage={t("noUsersFound")}
          />
        </div>
      </div>
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
      <DocotrReportTable
        translation="doctor"
        currentStates={filteredData}
        isLoading={isLoading}
      />
      <div className="flex justify-between items-end mt-4 w-full">
        {totalPages > 1 && (
          <div className="flex justify-between items-end mt-4 w-full">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <p className="text-2xl text-gray-500 text-end">
              {t("Total")}: {totalRecords}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorReport;
