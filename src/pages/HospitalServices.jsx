import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteHospitalService, getHospitalServices } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = localStorage.getItem("authToken");

const HospitalServices = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const queryClient = useQueryClient();

  const servicesPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: servicesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hospital-services", token],
    queryFn: () => getHospitalServices({ token }),
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteHospitalService({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["hospital-services", token]);
      toast.success(t("Deleted successfully"));
    },
    onError: () => {
      toast.error(t("Delete failed"));
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

  const filteredServices = useMemo(() => {
    if (!servicesData) return [];
    return servicesData.filter((svc) =>
      (svc?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [servicesData, searchTerm]);

  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;
  const current = filteredServices.slice(indexOfFirst, indexOfLast);

  const totalPages =
    filteredServices.length > 0
      ? Math.ceil(filteredServices.length / servicesPerPage)
      : 0;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto md:p-4 p-0  w-full">
      <div className="bg-white rounded-3xl md:p-8 p-4 w-full ">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <input
            type="text"
            placeholder={t("search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
          <div className="flex justify-end w-full md:w-1/3">
            <Link
              to="/hospital-services/add"
              className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
            >
              <IoMdAddCircle />
              {t("add")}
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">#</th>
                <th className="py-3 px-6 text-center">{t("name")}</th>
                <th className="py-3 px-6 text-center">{t("hospital")}</th>
                <th className="py-3 px-6 text-center">
                  {t("tabi_commission")}
                </th>
                <th className="py-3 px-6 text-center">
                  {t("hospital_commission")}
                </th>
                <th className="py-3 px-6 text-center">{t("status")}</th>
                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-lg font-light">
              {current.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {t("noData")}
                  </td>
                </tr>
              ) : (
                current.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="py-3 px-6 text-center">{row.name}</td>
                    <td className="py-3 px-6 text-center">
                      {row?.hospital?.name || row?.hospital?.name}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {row.tabi_commission}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {row.hospital_commission}
                    </td>
                    <td className="py-3 px-6 text-center">{row.status}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          onClick={() => handleDeleteClick(row.id)}
                        >
                          <AiFillDelete size={28} />
                        </button>
                        <Link
                          to={`/hospital-services/${row.id}`}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
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

        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="lg:text-2xl md:text-xl text-lg text-gray-500 text-end">
            {t("Total")}: {filteredServices.length}
          </p>
        </div>
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
          <p className="text-gray-600">{t("areYouSureDeleteService")}</p>
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
    </section>
  );
};

export default HospitalServices;
