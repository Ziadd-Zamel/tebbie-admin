import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrashedDoctor, restoreDoctor } from "../utlis/https";
import Loader from "./Loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const token = localStorage.getItem("authToken");

const TrashedDoctor = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Pagination and search states
  const doctorsPerPage = 9; // Same as TrashedHospital
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: doctorData, // Fixed typo: doctorlData -> doctorData
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trashed-doctor", token],
    queryFn: () => getTrashedDoctor({ token }),
  });

  const mutation = useMutation({
    mutationFn: (id) => restoreDoctor({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["trashed-doctor"]);
      navigate("/doctors");
    },
  });

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

  // Filter doctors based on search query
  const filteredDoctors = doctorData?.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDoctors = filteredDoctors?.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const totalPages =
    filteredDoctors?.length > 0
      ? Math.ceil(filteredDoctors.length / doctorsPerPage)
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

  if (!doctorData?.length) {
    return (
      <div className="text-gray-600 text-center text-2xl py-4 h-[50vh] flex justify-center items-center">
        <p>{t("noTrashedDoctors")}</p>
      </div>
    );
  }

  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="rounded-3xl md:p-8 p-4 bg-white overflow-auto min-h-screen">
        <h2 className="text-2xl font-bold mb-6">{t("trashedDoctors")}</h2>

        {/* Search Bar */}
        <div className="my-4 w-full text-end">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t("doctorNameSearch")}
            className="border border-gray-300 rounded-lg py-2 px-4 h-[50px] focus:outline-none focus:border-primary w-full"
          />
        </div>

        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full table-auto mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-center whitespace-nowrap">#</th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("phone")}
                </th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("doctorName")}
                </th>
                <th className="p-4 text-center whitespace-nowrap">
                  {t("hospital")}
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
              {currentDoctors.map((doctor, index) => (
                <tr key={doctor.id} className="border-b">
                  <td className="p-4 text-center whitespace-nowrap">
                    {indexOfFirstDoctor + index + 1}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                  {doctor.phone}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {doctor.name}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {doctor.hospitals.map(hospital => <p key={hospital.id}> {hospital.name} </p>) || t("none")}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {doctor.address || t("none")}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => mutation.mutate(doctor.id)}
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
          <p className="xl:text-2xl text-xl text-gray-500 text-end">
            {t("Total")}: {filteredDoctors.length}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrashedDoctor;