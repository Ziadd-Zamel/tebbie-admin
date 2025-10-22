import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRegions, deleteRegion } from "../utlis/https";
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

const Regions = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const regionsPerPage = 9;

  const {
    data: regionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["regions", token],
    queryFn: () => getRegions({ token }),
  });

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteRegion({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["regions", token]);
      const previous = queryClient.getQueryData(["regions", token]);
      queryClient.setQueryData(["regions", token], (old) =>
        old.filter((r) => r.id !== id)
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success(t("successfully_deleted"));
    },
    onError: (error, context) => {
      queryClient.setQueryData(["regions", token], context.previous);
      toast.error(t("delete_failed", { error: error.message }));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["regions", token]);
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

  const filtered = useMemo(() => {
    if (!regionsData) return [];
    return regionsData.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [regionsData, searchTerm]);

  const indexOfLast = currentPage * regionsPerPage;
  const indexOfFirst = indexOfLast - regionsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages =
    filtered.length > 0 ? Math.ceil(filtered.length / regionsPerPage) : 0;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section
      dir={direction}
      className="container mx-auto lg:p-8 md:p-6 p-4  w-full"
    >
      <div className="rounded-3xl p-4 bg-white overflow-auto ">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
          <div className="flex md:flex-row flex-col justify-end gap-4 w-full ">
            <Link
              to="/regions/add-region"
              className="px-6 py-2 shrik-0 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
            >
              {t("add")}
              <IoMdAddCircle className="shrink-0" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">#</th>
                <th className="py-3 px-6 text-center">{t("name")}</th>
                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-lg font-light">
              {current.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    {t("noDataAvailable")}
                  </td>
                </tr>
              ) : (
                current.map((region, index) => (
                  <tr
                    key={region.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="py-3 px-6 text-center">{region.name}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center gap-4">
                        <Link
                          to={`/regions/${region.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AiFillEdit size={28} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(region.id)}
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

        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-end">
            {t("Total")}: {filtered.length}
          </p>
        </div>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { borderRadius: "12px", padding: "16px" } }}
        >
          <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {t("confirmDelete")}
          </DialogTitle>
          <DialogContent>
            <p className="text-gray-600">{t("areYouSureDelete")}</p>
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

export default Regions;
