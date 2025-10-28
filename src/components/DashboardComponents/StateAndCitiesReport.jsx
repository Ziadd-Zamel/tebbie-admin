import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ErrorMessage from "../../pages/ErrorMessage";
import Loader from "../../pages/Loader";
import { getStateAndCitiesReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";
import { MdLocationOn } from "react-icons/md";
import { utils, writeFile } from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const StateAndCitiesReport = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const {
    data: StateAndCitiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["StateAndCities", token],
    queryFn: () => getStateAndCitiesReport({ token }),
  });

  const filteredData = useMemo(() => {
    if (!StateAndCitiesData) return [];
    return StateAndCitiesData?.filter((state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [StateAndCitiesData, searchTerm]);

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

  const exportToExcel = () => {
    if (!filteredData.length) return;
    const rows = [];
    filteredData.forEach((state) => {
      if (Array.isArray(state.cities) && state.cities.length) {
        state.cities.forEach((city) => {
          rows.push({
            [t("states")]: state.name,
            [t("noOfPatients")]:
              city.users_count ?? state.total_users ?? t("Na"),
            [t("cities")]: city.name,
          });
        });
      } else {
        rows.push({
          [t("states")]: state.name,
          [t("noOfPatients")]: state.total_users ?? t("Na"),
          [t("cities")]: "-",
        });
      }
    });
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "States & Cities");
    writeFile(
      workbook,
      `States_Cities_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  return (
    <div className="p-4 flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between gap-2 mb-5">
        <p className="font-bold  text-xl md:text-2xl flex gap-2  items-center">
          <MdLocationOn size={30} className="text-[#3CAB8B]" />
          {t("GDOP")}
        </p>
        {filteredData.length > 0 && (
          <button
            onClick={exportToExcel}
            className="px-6 h-10 flex items-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm"
            aria-label={t("Excel-Export")}
            type="button"
          >
            {t("Excel-Export")} <FaFileExcel aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex justify-start ">
        <input
          type="text"
          placeholder={t("citySearchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />
      </div>

      {/* Table */}
      <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center">{t("states")}</th>
            <th className="py-3 px-6 text-center">{t("noOfPatients")}</th>
            <th className="py-3 px-6 text-center">{t("cities")}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 md:text-lg text-md font-light">
          {currentStates.length > 0 ? (
            currentStates.map((state) => (
              <>
                <tr
                  key={state.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-2 px-6 text-center">{state.name}</td>
                  <td className="py-2 px-6 text-center">{state.total_users}</td>
                  <td className="py-2 px-6 text-center">
                    {state.cities.length > 0 && (
                      <button
                        onClick={() => toggleExpand(state.id)}
                        className="text-[#3CAB8B] hover:text-[#4db799]"
                        aria-label={
                          expanded === state.id
                            ? t("hideCities")
                            : t("showCities")
                        }
                      >
                        {expanded === state.id ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
                {expanded === state.id && state.cities.length > 0 && (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 text-start bg-gray-50">
                      {state.cities.map((city) => (
                        <span
                          className="flex gap-2 flex-wrap w-full"
                          key={city.id}
                        >
                          {city.users_count} {t("noOfPatients")} {t("In")}{" "}
                          {city.name}
                        </span>
                      ))}
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 px-6 text-center text-gray-500">
                {t("noStatesMatchSearch")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

export default StateAndCitiesReport;
