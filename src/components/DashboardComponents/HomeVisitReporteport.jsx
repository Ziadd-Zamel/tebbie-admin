/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getHomeVisitReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { FaHome } from "react-icons/fa";
import HomeVisitTable from "./HomeVisitTable";

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
const HomeVisitReporteport = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    searchTerm: "",
    selectedHospital: null,
    selectedUser: null,
    selectedDoctor: null,
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(rawSearchTerm, 300);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchTerm: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);

  const {
    data: reviewData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "home-visit-Report",
      token,
      filters.selectedUser,
      filters.selectedDoctor,
      filters.selectedHospital,
      filters.fromDate,
      filters.toDate,
    ],
    queryFn: () =>
      getHomeVisitReport({
        token,
        user_id: filters.selectedUser,
        doctor_id: filters.selectedDoctor,
        hospital_id: filters.selectedHospital,
        from_date: filters.fromDate,
        to_date: filters.toDate,
      }),
    enabled: !!token,
  });
  console.log(reviewData);
  // Fetch auxiliary data (users, hospitals, doctors)

  // const userOptions = useMemo(
  //   () => usersData.map((user) => ({ value: user.id, label: user.name })),
  //   [usersData]
  // );

  // const doctorOptions = useMemo(
  //   () =>
  //     doctorsData.map((doctor) => ({ value: doctor.id, label: doctor.name })),
  //   [doctorsData]
  // );

  // const hospitalOptions = useMemo(
  //   () =>
  //     hospitalsData.map((hospital) => ({
  //       value: hospital.id,
  //       label: hospital.name,
  //     })),
  //   [hospitalsData]
  // );

  // Memoize filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(reviewData)) return [];

    return reviewData.filter((review) => {
      const matchesSearch =
        !filters.searchTerm ||
        review.service_name
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
      const matchesUser =
        !filters.selectedUser || review.user_id === filters.selectedUser;
      return matchesSearch && matchesUser;
    });
  }, [reviewData, filters.searchTerm, filters.selectedUser]);

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
        <FaHome size={30} className="text-[#3CAB8B]" />
        {t("homevisitReport")}
      </p>
      <input
        type="text"
        placeholder={t("search")}
        value={rawSearchTerm}
        onChange={(e) => setRawSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* <div className="flex xl:flex-row flex-col gap-4">
        <div className="xl:w-1/3 w-full">
          <OneSelectDropdown
            options={userOptions}
            onChange={(value) => handleFilterChange("selectedUser", value)}
            selectedValues={filters.selectedUser ? [filters.selectedUser] : []}
            placeholder={t("selectUser")}
            searchPlaceholder={t("search")}
            fallbackMessage={t("noUsersFound")}
          />
        </div>
        <div className="xl:w-1/3 w-full">
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
        <div className="xl:w-1/3 w-full">
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
      </div> */}
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
      <HomeVisitTable
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
        <p className="lg:text-2xl md:text-xl  text-lg text-gray-500 text-end">
          {t("Total")}: {filteredData.length}
        </p>
      </div>
    </div>
  );
};

export default HomeVisitReporteport;
