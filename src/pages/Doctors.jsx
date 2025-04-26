import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { getDoctors } from "../utlis/https";
import placeholder from "../assets/placeholder.svg";
import { Link } from "react-router-dom";
import { IoPersonAddSharp, IoTrashSharp } from "react-icons/io5";
import { FaAward } from "react-icons/fa";
import Pagination from "../components/Pagination";
import { useState } from "react";

const token = localStorage.getItem("authToken");

const Doctors = () => {
  const {
    data: doctors = [], // Default to empty array if no data
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors({ token }),
  });

  const doctorsPerPage = 8; // Number of doctors per page
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Pagination calculations
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages =
    doctors.length > 0 ? Math.ceil(doctors.length / doctorsPerPage) : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section dir={direction} className="container max-auto md:px-4 px-2 ">
      <div className="flex md:justify-between justify-center items-center md:flex-row flex-col gap-2 my-4">
        <div className="flex justify-end items-end gap-2">
          <Link
            to={"/doctors/add-doctor"}
            className="lg:px-6 px-4 shrink-0 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            {t("add-doctor")}
            <IoPersonAddSharp />
          </Link>
        </div>
        <div className="flex justify-end">
          <Link
            to={"/doctors/trashed-doctors"}
            className="lg:px-6 px-4 shrink-0 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            {t("recyclebin")}
            <IoTrashSharp />
          </Link>
        </div>
      </div>

      <div className="flex items-center flex-wrap sm:justify-start justify-center gap-6 w-full">
        {currentDoctors.length > 0 ? (
          currentDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white h-60 2xl:w-[320px] w-[300px] shadow-md rounded-xl md:p-4 p-3 lg:text-lg md:text-md text-sm"
            >
              <div className="flex">
                <div className="w-1/3">
                  <img
                    src={doctor.image || placeholder}
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
                  <p className="text-sm text-gray-600 ">
                    {doctor.bio.length > 40
                      ? `${doctor.bio.substring(0, 40)}...`
                      : doctor.bio}
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

      <div className="flex justify-between items-end mt-4 p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <p className="md:text-2xl text-xl text-gray-500 text-end">
          {t("Total")}: {doctors.length}
        </p>
      </div>
    </section>
  );
};

export default Doctors;
