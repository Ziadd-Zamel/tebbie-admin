import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { getDoctors } from "../utlis/https";
import placeholder from "../assets/placeholder.svg";
import { Link } from "react-router-dom";
import { IoPersonAddSharp, IoTrashSharp } from "react-icons/io5";
import { FaAward } from "react-icons/fa";
import { useState, useEffect } from "react";
import RechargeCardsPagination from "../components/RechargeCardsPagination";
import { Skeleton, Box } from "@mui/material";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const token = localStorage.getItem("authToken");


const Doctors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSpecialFilter, setIsSpecialFilter] = useState("");
  const [isVisitorFilter, setIsVisitorFilter] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: doctors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors", currentPage, debouncedSearchTerm, isSpecialFilter, isVisitorFilter],
    queryFn: () => getDoctors({ token, page: currentPage, search: debouncedSearchTerm, isSpecial: isSpecialFilter, isVisitor: isVisitorFilter }),
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleSpecialFilter = (value) => {
    setIsSpecialFilter(value);
    setCurrentPage(1); 
  };

  const handleVisitorFilter = (value) => {
    setIsVisitorFilter(value);
    setCurrentPage(1); 
  };

  if (isLoading) {
    return (
      <section dir={direction} className="container max-auto md:px-4 px-2">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {[...Array(8)].map((_, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "white",
                height: 240,
                width: { xs: "100%", md: 300 },
                borderRadius: 2,
                p: 2,
                display: "flex",
              }}
            >
              <Box sx={{ width: "40%", p: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={96} sx={{ borderRadius: 1 }} />
              </Box>
              <Box sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 1 ,p: 2  }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="90%" />
              </Box>
            </Box>
          ))}
        </Box>
      </section>
    );
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section dir={direction} className="container max-auto md:px-4 px-2">
      <div className="flex md:justify-between justify-center gap-2 items-center my-4 lg:text-lg text-md flex-wrap">
        <div className="flex md:flex-row flex-col gap-2 items-center">
          <input
            type="text"
            placeholder={t("doctorNameSearch")}
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CAB8B]"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSpecialFilter(isSpecialFilter === "yes" ? "" : "yes")}
              className={`px-3 py-2 rounded-lg w-20 ${isSpecialFilter === "yes" ? "bg-yellow-100 text-yellow-600 " : "bg-gray-100 text-gray-600 border-2  "}`}
            >
              {t("special")}
            </button>
            <button
              onClick={() => handleVisitorFilter(isVisitorFilter === "yes" ? "" : "yes")}
              className={`px-3 py-2 rounded-lg w-20 ${isVisitorFilter === "yes" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600 border-2 "}`}
            >
              {t("visitor")}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={"/doctors/add-doctor"}
            className="lg:px-6 md:px-4 px-2 shrink-0 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] rounded-[8px] focus:outline-none text-center"
          >
            {t("add-doctor")}
            <IoPersonAddSharp />
          </Link>
          <Link
            to={"/doctors/trashed-doctors"}
            className="lg:px-6 md:px-4 px-2 py-2 border-[#048c87] border-2 text-[#048c87] rounded-[8px] flex justify-center items-center gap-2 shrink-0"
          >
            {t("recyclebin")}
            <IoTrashSharp />
          </Link>
        </div>
      </div>
      <div className="flex items-center flex-wrap sm:justify-start justify-center md:gap-4 gap-3 w-full">
        {doctors?.data?.length > 0 ? (
          doctors?.data.map((doctor) => (
            <div
              key={doctor?.id}
              className="bg-white h-60 md:w-[300px] w-full shadow-md rounded-xl md:p-4 p-3 lg:text-lg md:text-md text-sm"
            >
              <div className="flex">
                <div className="w-1/3">
                  <img
                    src={doctor?.image || placeholder}
                    alt={doctor.name}
                    className="w-full h-24 object-cover rounded-md"
                    onError={(e) => (e.target.src = placeholder)}
                  />
                </div>
                <div className="p-4 w-2/3">
                  <h2 className="text-lg font-bold text-gray-800 truncate">
                    {doctor.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {doctor.job_title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {doctor.bio && doctor.bio.length > 40
                      ? `${doctor.bio.substring(0, 40)}...`
                      : doctor.bio || ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 items-center w-full my-2">
                <span
                  className={`px-3 py-2 rounded-full text-sm ${
                    doctor.is_visitor === "yes"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {doctor.is_visitor === "yes" ? t("visitor") : t("notvisitor")}
                </span>
                <span
                  className={`px-3 py-2 rounded-full text-sm flex gap-2 items-center ${
                    doctor.isAbleToCancel === "yes"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {doctor.isAbleToCancel === "yes"
                    ? t("special")
                    : t("not-special")}
                  <FaAward />
                </span>
              </div>
              <Link
                to={`/doctors/${doctor.id}`}
                className="text-md text-[#3CAB8B] underline pt-4"
              >
                {t("viewDetailsDoc")}
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">
            {t("no_doctors_found")}
          </p>
        )}
      </div>
      <div className="flex justify-between items-end gap-4 flex-wrap p-4">
        <RechargeCardsPagination
          currentPage={currentPage}
          totalPages={doctors?.last_page || 1}
          onPageChange={setCurrentPage}
        />
        <p className="md:text-2xl text-xl text-gray-500 text-end">
          {t("total")} : {doctors?.total || 0}
        </p>
      </div>
    </section>
  );
};

export default Doctors;