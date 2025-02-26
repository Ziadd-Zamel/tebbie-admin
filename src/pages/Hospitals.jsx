import { useTranslation } from "react-i18next";
import { getHospitals } from "../utlis/https";
import Loader from "./Loader";
import { useQuery } from "@tanstack/react-query";
import { placeholder } from "../assets";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { IoTrashSharp } from "react-icons/io5";
import { FaHospitalUser } from "react-icons/fa";
import { useState } from "react";
import Pagination from "../components/Pagination";

const token = localStorage.getItem("authToken");

const Hospitals = () => {
  const { t, i18n } = useTranslation();
  const hospitalPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: hospitalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });

  const indexOfLastCoupon = currentPage * hospitalPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - hospitalPerPage;
  const currentHospital = hospitalData?.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const totalPages =
  hospitalData?.length > 0
      ? Math.ceil(hospitalData.length / hospitalPerPage)
      : 0;


  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section dir={direction} className="container mx-auto py-8 w-full">
      <div className=" rounded-3xl md:p-8 p-4">
        <div className="flex justify-between my-4">
          <Link
            to={"/hospitals/add-hospital"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            <FaHospitalUser />
            {t("AddHospital")}
          </Link>
          <Link
            to={"/hospitals/trashed-hospitals"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            trash
            <IoTrashSharp />
          </Link>
        </div>
        <div className="flex items-center flex-wrap sm:justify-start justify-center  gap-6 w-full">
          {currentHospital.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white xl:w-[380px] w-[320px] shadow-md rounded-xl md:p-4 p-3 lg:text-lg md:text-md text-sm"
            >
              <div className="flex">
                <div className="w-2/3">
                  <h2 className="md:text-xl text-lg font-semibold truncate text-gray-800 mb-2">
                    {hospital.name}
                  </h2>
                  <p className="text-gray-600">
                    <strong>{t("address")}: </strong>
                    {hospital.address}
                  </p>
                </div>
                <div className="w-1/3">
                  <img
                    className="w-full h-24 object-cover rounded-md"
                    src={hospital.media_url?.[0] || placeholder}
                    alt={`${hospital.name} image`}
                    onError={(e) => (e.target.src = placeholder)}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-2 rounded-full text-sm ${
                    hospital.active === "1"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {hospital.active === "1" ? t("active") : t("inactive")}
                </span>
                <Link
                  to={`/hospitals/${hospital.id}`}
                  className="text-md text-[#3CAB8B] underline ]"
                >
                  {t("viewDetails")}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Hospitals;
