import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAdmins } from "../utlis/https";
import Pagination from "../components/Pagination";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { FaUserShield } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";

const token = localStorage.getItem("authToken");

const Admins = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const adminsPerPage = 9;

  const {
    data: adminsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admins", token],
    queryFn: () => getAdmins({ token }),
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredAdmins = useMemo(() => {
    if (!adminsData) return [];
    return adminsData.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [adminsData, searchTerm]);

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  const totalPages =
    filteredAdmins.length > 0
      ? Math.ceil(filteredAdmins.length / adminsPerPage)
      : 0;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section
      dir={direction}
      className="container mx-auto lg:p-8 md:p-6 p-4 w-full"
    >
      <div className="rounded-3xl p-4 bg-white overflow-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <input
            type="text"
            placeholder={t("Search admins...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
          <div className="flex md:flex-row flex-col justify-end gap-4 w-full">
            <Link
              to="/admins/add-admin"
              className="px-6 py-2 shrink-0 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
            >
              {t("Add Admin")}
              <IoMdAddCircle className="shrink-0" />
            </Link>
            <div className="px-6 py-2 shrink-0 w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center">
              <FaUserShield className="shrink-0" />
              {t("Admins")}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-right">#</th>
                <th className="py-3 px-6 text-right">{t("name")}</th>
                <th className="py-3 px-6 text-right">{t("email")}</th>
                <th className="py-3 px-6 text-right">{t("phone")}</th>
                <th className="py-3 px-6 text-right">{t("address")}</th>
                <th className="py-3 px-6 text-right">{t("role")}</th>
                <th className="py-3 px-6 text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-lg font-light">
              {currentAdmins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {t("No admins found")}
                  </td>
                </tr>
              ) : (
                currentAdmins.map((admin, index) => (
                  <tr
                    key={admin.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-right whitespace-nowrap">
                      {indexOfFirstAdmin + index + 1}
                    </td>
                    <td className="py-3 px-6 text-right">{admin.name}</td>
                    <td className="py-3 px-6 text-right">{admin.email}</td>
                    <td className="py-3 px-6 text-right">{admin.phone}</td>
                    <td className="py-3 px-6 text-right">{admin.address}</td>
                    <td className="py-3 px-6 text-right">
                      {admin.role ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {admin.role.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {t("No Role")}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end gap-4">
                        <Link
                          to={`/admins/${admin.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AiFillEdit size={28} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination and Total */}
        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-end">
            {t("total")}: {filteredAdmins.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Admins;
