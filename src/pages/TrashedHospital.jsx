import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrashedHospitals, restoreHospital } from "../utlis/https";
import Loader from "./Loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";

const token = localStorage.getItem("authToken");

const TrashedHospital = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Pagination and search states
  const hospitalPerPage = 9; // Same as Hospitals
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: hospitalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trashed-hospital", token],
    queryFn: () => getTrashedHospitals({ token }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      if (!hasPermission("restoreHospital")) {
        const displayName = getPermissionDisplayName("restoreHospital");
        alert(`ليس لديك صلاحية لاسترجاع المستشفى (${displayName})`);
        return Promise.reject(new Error("No permission"));
      }
      return restoreHospital({ token, id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["trashed-hospital"]);
      navigate("/hospitals");
    },
  });

  // Pagination logic
  const indexOfLastHospital = currentPage * hospitalPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalPerPage;

  // Filter hospitals based on search query
  const filteredHospitals = hospitalData?.filter((hospital) =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentHospital = filteredHospitals?.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );

  const totalPages =
    filteredHospitals?.length > 0
      ? Math.ceil(filteredHospitals.length / hospitalPerPage)
      : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {t("errorFetchingData")}
      </div>
    );
  }

  if (!hospitalData?.length) {
    return (
      <div className="text-gray-600 text-center text-2xl py-4 h-[50vh] flex justify-center items-center">
        <p>{t("noTrashedHospitals")}</p>
      </div>
    );
  }

  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="rounded-3xl md:p-8 p-4 bg-white overflow-auto min-h-screen">
        <h2 className="text-2xl font-bold mb-6">{t("trashedHospitals")}</h2>

        {/* Search Bar */}
        <div className="my-4 w-full text-end">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("hospitalNameSearch")}
            className="border border-gray-300 rounded-lg py-2 px-4 h-[50px] focus:outline-none focus:border-primary w-full"
          />
        </div>

        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full table-auto mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-center whitespace-nowrap">#</th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("image")}
                </th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("HospitalName")}
                </th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("description")}
                </th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("address")}
                </th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentHospital.map((hospital, index) => (
                <tr key={hospital.id} className="border-b">
                  <td className="p-4 text-center whitespace-nowrap">
                    {indexOfFirstHospital + index + 1}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {hospital.media_url?.length > 0 ? (
                      <img
                        src={hospital.media_url[0]}
                        alt={hospital.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      t("noImage")
                    )}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {hospital.name}
                  </td>
                  <td className="p-4 ">
                    {(hospital.description?.slice(0, 50) || t("none")) +
                      (hospital.description?.length > 50 ? "..." : "")}
                  </td>

                  <td className="p-4 text-center whitespace-nowrap">
                    {hospital.address || t("none")}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => mutation.mutate(hospital.id)}
                      className={`text-blue-500 hover:text-blue-700 ${
                        mutation.isLoading && "opacity-50 pointer-events-none"
                      }`}
                      title={t("restore")}
                    >
                      <FaUndo size={18} />
                    </button>
                  </td>
                </tr>
              ))}
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
            {t("Total")}: {filteredHospitals.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrashedHospital;
