import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCity, getcities } from "../utlis/https";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoTrashSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { IoMdAddCircle } from "react-icons/io";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const token = localStorage.getItem("authToken");

const Cities = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const citiesPerPage = 9;

  const {
    data: citiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cities", token],
    queryFn: () => getcities({ token }),
  });

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteCity({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["cities", token]);
      const previousCities = queryClient.getQueryData(["cities", token]);
      queryClient.setQueryData(["cities", token], (oldCities) =>
        oldCities.filter((city) => city.id !== id)
      );
      return { previousCities };
    },
    onSuccess: () => {
      toast.success(t("cityDeletedSuccess"));
    },
    onError: (error, context) => {
      queryClient.setQueryData(["cities", token], context.previousCities);
      toast.error(t("cityDeleteFailed", { error: error.message }));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cities", token]);
    },
  });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete({ id: selectedId });
    }
    handleCloseDialog();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredCities = useMemo(() => {
    if (!citiesData) return [];
    return citiesData.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [citiesData, searchTerm]);

  const indexOfLastCity = currentPage * citiesPerPage;
  const indexOfFirstCity = indexOfLastCity - citiesPerPage;
  const currentCities = filteredCities.slice(indexOfFirstCity, indexOfLastCity);

  const totalPages =
    filteredCities.length > 0
      ? Math.ceil(filteredCities.length / citiesPerPage)
      : 0;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto lg:p-8 md:p-6 p-4  w-full">
      <div className="rounded-3xl   p-4 bg-white overflow-auto min-h-screen">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <input
            type="text"
            placeholder={t("citySearchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
          <div className="flex md:flex-row flex-col justify-end gap-4 w-full ">
            <Link
              to="/cities/add-city"
              className="px-6 py-2 shrik-0 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
            >
              {t("addCity")}
              <IoMdAddCircle className="shrink-0" />
            </Link>
            <Link
              to="/cities/trashed-cities"
              className="px-6 py-2 shrik-0 border-[#048c87] border-2  text-[#048c87] text-lg rounded-[8px]  flex justify-center items-center gap-2 shrink-0"
              >
              {t("trash")}
              <IoTrashSharp className="shrik-0" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">#</th>
                <th className="py-3 px-6 text-center">{t("cityName")}</th>
                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-lg font-light">
              {currentCities.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    {t("noCitiesAvailable")}
                  </td>
                </tr>
              ) : (
                currentCities.map((city, index) => (
                  <tr
                    key={city.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {indexOfFirstCity + index + 1}
                    </td>
                    <td className="py-3 px-6 text-center">{city.name}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center gap-4">
                        <Link
                          to={`/cities/${city.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AiFillEdit size={28} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(city.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiFillDelete size={28} />
                        </button>
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
            {t("Total")}: {filteredCities.length}
          </p>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { borderRadius: "12px", padding: "16px" } }}
        >
          <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {t("confirmDelete")}
          </DialogTitle>
          <DialogContent>
            <p className="text-gray-600">{t("areYouSureDeleteCity")}</p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: "16px" }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: "#3AAB95",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#33A9C7" },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: "#DC3545",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#a71d2a" },
              }}
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

export default Cities;
