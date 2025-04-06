import { useTranslation } from "react-i18next";
import { getHospitals } from "../utlis/https";
import Loader from "./Loader";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { IoTrashSharp } from "react-icons/io5";
import { FaHospitalUser } from "react-icons/fa";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import Pagination from "../components/Pagination";

const token = localStorage.getItem("authToken");

const Hospitals = () => {
  const { t, i18n } = useTranslation();
  const hospitalPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: hospitalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });

  const indexOfLastHospital = currentPage * hospitalPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalPerPage;

  const filteredHospitals = hospitalData?.filter((hospital) => {
    if (!statusFilter && !searchQuery) return true;
    const nameMatch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter ? hospital.active === statusFilter : true;
    return nameMatch && statusMatch;
  });

  const currentHospital = filteredHospitals?.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };

  const totalPages =
    filteredHospitals?.length > 0
      ? Math.ceil(filteredHospitals.length / hospitalPerPage)
      : 0;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section dir={direction} className="container mx-auto p-6 bg-gray-50">
      <div className="rounded-3xl md:p-8 p-4 min-h-screen overflow-auto bg-white">
        <div className="flex justify-between my-4">
          <Link
            to={"/hospitals/add-hospital"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            <FaHospitalUser />
            {t("AddHospital")}
          </Link>
          <Link
            to={"/hospitals/trashed-hospitals"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            <IoTrashSharp />
            {t("trash")}
          </Link>
        </div>

        <div className="flex gap-2">
          {/* Search Bar */}
          <div className="my-4 w-full text-end">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t("hospitalNameSearch")}
              className="border border-gray-300 rounded-lg py-2 px-4  h-[50px] focus:outline-none focus:border-primary w-full "
              />
          </div>

          <div className="my-4 w-full">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 rounded-lg py-2 px-4  h-[50px] focus:outline-none focus:border-primary w-full "
              >
              <option value="">{t("All")}</option>
              <option value="1">{t("active")}</option>
              <option value="0">{t("inactive")}</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto md:w-full w-[90vw]">

        <table className="min-w-full table-auto mt-4 border-collapse ">
          <thead>
          <tr className="bg-gray-100">
          <th  className="p-4 text-start whitespace-nowrap">{t("HospitalName")}</th>
              <th  className="p-4 text-start whitespace-nowrap">{t("address")}</th>
              <th  className="p-4 text-start whitespace-nowrap">{t("status")}</th>
              <th  className="p-4 text-start whitespace-nowrap">{t("email")}</th>
              <th  className="p-4 text-start whitespace-nowrap">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentHospital.map((hospital) => (
              <tr key={hospital.id} className="border-b">
                <td  className="p-4 whitespace-nowrap" >
                  {hospital.name}
                </td>
                <td  className="p-4 whitespace-nowrap" >
                  {hospital.address || "Na"}
                </td>
                <td  className="p-4 whitespace-nowrap" >
                  <span
                    className={`px-3 py-2 rounded-full text-sm ${
                      hospital.active === "1"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {hospital.active === "1" ? t("active") : t("inactive")}
                  </span>
                </td>
                <td  className="p-4 whitespace-nowrap" >
                  {hospital.email}
                </td>
                <td  className="p-4 whitespace-nowrap" >
                  <Link
                    to={`/hospitals/${hospital.id}`}
                    className="text-md text-[#3CAB8B]"
                  >
                    <FaRegEye size={25} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-end">
            {t("Total")} : {filteredHospitals.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hospitals;
