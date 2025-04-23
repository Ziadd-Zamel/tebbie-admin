import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { useState } from "react";
import { getAllCustomerService } from "../../utlis/https";
import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";
import Pagination from "../../components/Pagination";
import { AiFillEdit } from "react-icons/ai";

const token = localStorage.getItem("authToken");

const CustomerService = () => {
  const { t, i18n } = useTranslation();
  const agentsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: customerData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customer-service", token],
    queryFn: () => getAllCustomerService({ token }),
  });

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;

  const filteredAgents = customerData?.filter((agent) => {
    if (!statusFilter && !searchQuery) return true;
    const nameMatch = agent.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter
      ? agent.is_active === Number(statusFilter)
      : true;
    return nameMatch && statusMatch;
  });

  const currentAgents = filteredAgents?.slice(
    indexOfFirstAgent,
    indexOfLastAgent
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
    filteredAgents?.length > 0
      ? Math.ceil(filteredAgents.length / agentsPerPage)
      : 0;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section dir={direction} className="container mx-auto bg-gray-50">
      <div className="rounded-3xl md:p-8 p-4 md:m-4 m-0 min-h-screen overflow-auto bg-white">
        <div className="flex justify-between md:flex-row flex-col gap-2 my-4">
          <Link
            to={"/agents/add-agent"}
            className="lg:px-6 px-4 shrink-0 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
          >
            <FaUserTie />
            {t("AddAgent")}
          </Link>
        </div>

        <div className="flex md:flex-row flex-col gap-2">
          {/* Search Bar */}
          <div className="my-4 md:w-1/2 w-full text-end">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t("search")}
              className="border border-gray-300 rounded-lg py-2 px-4 h-[50px] focus:outline-none focus:border-primary w-full"
            />
          </div>

          <div className="my-4 md:w-1/2 w-full">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 rounded-lg py-2 px-4 h-[50px] focus:outline-none focus:border-primary w-full"
            >
              <option value="">{t("All")}</option>
              <option value="1">{t("active")}</option>
              <option value="0">{t("inactive")}</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full table-auto mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-start whitespace-nowrap">
                  {t("name")}
                </th>
                <th className="p-4 text-start whitespace-nowrap">
                  {t("phone")}
                </th>
                <th className="p-4 text-start whitespace-nowrap">
                  {t("status")}
                </th>
                <th className="p-4 text-start whitespace-nowrap">
                  {t("email")}
                </th>
                <th className="p-4 text-start whitespace-nowrap">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAgents.map((agent) => (
                <tr key={agent.id} className="border-b">
                  <td className="p-4 whitespace-nowrap">{agent.name}</td>
                  <td className="p-4 whitespace-nowrap">
                    {agent.phone || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-2 rounded-full text-sm ${
                        agent.is_active === 1
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {agent.is_active === 1 ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">{agent.email}</td>
                  <td className="p-4 whitespace-nowrap">
                    <Link
                      to={`/customer-service/${agent.id}`}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <AiFillEdit size={28} />
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
            {t("Total")} : {filteredAgents.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomerService;
