import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ErrorMessage from "../../pages/ErrorMessage";
import Loader from "../../pages/Loader";
import { getStateAndCitiesReport } from "../../utlis/https";
import { useTranslation } from "react-i18next";
import Pagination from "../Pagination";

const StateAndCitiesReport = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

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
    filteredData.length > 0 ? Math.ceil(filteredData.length / statesPerPage) : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  return (
    <div className="p-4 flex flex-col gap-4 font-sans" dir={direction}>
      {/* Search Input */}
      <div className="flex justify-start">
        <input
          type="text"
          placeholder={t("citySearchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
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
                        className="text-blue-500 hover:text-blue-700"
                        aria-label={
                          expanded === state.id ? t("hideCities") : t("showCities")
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
    </div>
  );
};

export default StateAndCitiesReport;