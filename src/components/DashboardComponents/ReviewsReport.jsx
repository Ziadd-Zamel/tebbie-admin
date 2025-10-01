/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import { getReviewsReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { MdRateReview } from "react-icons/md";
import OneSelectDropdown from "../OneSelectDropdown";
import ReviewsReportTable from "./ReviewsReportTable";

const ReviewsReport = ({
  HospitalsData,
  usersData,
  DoctorsData,
  HomeVisitData,
}) => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedReviewableId, setSelectedReviewableId] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const {
    data: ReviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "Reviews-Report",
      token,
      selectedUser,
      selectedType,
      selectedReviewableId,
    ],
    queryFn: () =>
      getReviewsReport({
        token,
        user_id: selectedUser,
        type: selectedType,
        reviewable_id: selectedReviewableId,
      }),
    enabled: !!token,
  });

  // خيارات المستخدمين
  const userOptions = useMemo(() => {
    if (!usersData) return [];
    return usersData.map((user) => ({
      value: user.id,
      label: user.name,
    }));
  }, [usersData]);

  const typeOptions = [
    { value: "App\\Models\\Hospital", label: t("hospital") },
    { value: "App\\Models\\Doctor", label: t("doctor") },
    { value: "App\\Models\\HomeVisit", label: t("homevisit") },
  ];
  const getReviewablePlaceholder = () => {
    switch (selectedType) {
      case "App\\Models\\Hospital":
        return t("selectHospital");
      case "App\\Models\\Doctor":
        return t("select_doctor");
      case "App\\Models\\HomeVisit":
        return t("selectHomeVisit");
      default:
        return t("selectReviewableId");
    }
  };

  const reviewableIdOptions = useMemo(() => {
    if (!selectedType) return [];
    switch (selectedType) {
      case "App\\Models\\Hospital":
        return (
          HospitalsData?.map((hospital) => ({
            value: hospital.id,
            label: hospital.name,
          })) || []
        );
      case "App\\Models\\Doctor":
        return (
          DoctorsData?.map((doctor) => ({
            value: doctor.id,
            label: doctor.name,
          })) || []
        );
      case "App\\Models\\HomeVisit":
        return (
          HomeVisitData?.map((visit) => ({
            value: visit.id,
            label: visit.name || `Home Visit ${visit.id}`,
          })) || []
        );
      default:
        return [];
    }
  }, [selectedType, HospitalsData, DoctorsData, HomeVisitData]);

  const filteredData = useMemo(() => {
    if (!ReviewData || !Array.isArray(ReviewData)) return [];
    let filtered = [...ReviewData];

    if (searchTerm) {
      filtered = filtered.filter((review) =>
        review.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedUser) {
      filtered = filtered.filter((review) => review.user_id === selectedUser);
    }

    if (selectedReviewableId) {
      filtered = filtered.filter((review) =>
        review.reviews.some((r) => r.reviewable_id === selectedReviewableId)
      );
    }

    // Date filtering
    if (filters.fromDate || filters.toDate) {
      filtered = filtered.filter((review) => {
        const itemDate = review.created_at || review.date || review.review_date;
        if (!itemDate) return true;

        const itemDateObj = new Date(itemDate);
        const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
        const toDate = filters.toDate ? new Date(filters.toDate) : null;

        if (fromDate && itemDateObj < fromDate) return false;
        if (toDate) {
          toDate.setDate(toDate.getDate() + 1); // Include the entire day
        }
        if (toDate && itemDateObj >= toDate) return false;
        return true;
      });
    }

    return filtered;
  }, [
    ReviewData,
    searchTerm,
    selectedUser,
    selectedReviewableId,
    filters.fromDate,
    filters.toDate,
  ]);

  const indexOfLastState = currentPage * statesPerPage;
  const indexOfFirstState = indexOfLastState - statesPerPage;
  const currentStates = filteredData.slice(indexOfFirstState, indexOfLastState);
  const totalPages =
    filteredData.length > 0
      ? Math.ceil(filteredData.length / statesPerPage)
      : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleUserSelect = (value) => {
    setSelectedUser(value);
  };

  const handleTypeSelect = (value) => {
    setSelectedType(value);
    setSelectedReviewableId(null);
  };

  const handleReviewableIdSelect = (value) => {
    setSelectedReviewableId(value);
  };

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      fromDate: "",
      toDate: "",
    });
    setCurrentPage(1);
  }, []);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 md:m-4 m-0 flex flex-col gap-4 font-sans bg-white  rounded-[20px] shadow-sm">
      <p className="font-bold text-xl md:text-2xl mb-5 flex gap-2 items-center">
        <MdRateReview size={30} className="text-[#3CAB8B]" />
        {t("ReviewsReport")}
      </p>
      <div className="flex xl:flex-row flex-col gap-4 ">
        <input
          type="text"
          placeholder={t("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="xl:w-1/2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
        <div className="xl:w-1/2 w-full">
          <OneSelectDropdown
            options={userOptions}
            onChange={handleUserSelect}
            selectedValues={selectedUser ? [selectedUser] : []}
            placeholder={t("selectUser")}
            searchPlaceholder={t("search")}
            fallbackMessage={t("noUsersFound")}
          />
        </div>
      </div>
      <div className="flex xl:flex-row flex-col gap-4 ">
        <OneSelectDropdown
          options={typeOptions}
          onChange={handleTypeSelect}
          selectedValues={selectedType ? [selectedType] : []}
          placeholder={t("selectType")}
          searchPlaceholder={t("search")}
          fallbackMessage={t("noTypesFound")}
        />
        {selectedType && (
          <OneSelectDropdown
            options={reviewableIdOptions}
            onChange={handleReviewableIdSelect}
            selectedValues={selectedReviewableId ? [selectedReviewableId] : []}
            placeholder={getReviewablePlaceholder()}
            searchPlaceholder={t("search")}
            fallbackMessage={t("noOptionsFound")}
          />
        )}
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

      <ReviewsReportTable
        currentStates={currentStates || {}}
        isLoading={isLoading}
      />
      {filteredData.length > 10 && (
        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-end">
            {t("Total")}: {filteredData.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewsReport;
