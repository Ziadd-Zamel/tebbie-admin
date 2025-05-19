import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IoMdPersonAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { getEmployees, deleteEmployee } from "../utlis/https";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { teamsIcon } from "../assets";
import Employeesmodal from "../components/Employeesmodal";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const token = localStorage.getItem("authToken");

const Employees = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const employeesPerPage = 9;

  const {
    data: employeesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employeesData", token],
    queryFn: () => getEmployees({ token }),
    retry: false,
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteEmployee({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["employeesData", token]);
      const previousEmployees = queryClient.getQueryData([
        "employeesData",
        token,
      ]);
      queryClient.setQueryData(["employeesData", token], (oldEmployeesData) =>
        oldEmployeesData.filter((employee) => employee.id !== id)
      );
      return { previousEmployees };
    },
    onSuccess: () => {
      toast.success(t("employeeDeletedSuccess"));
    },
    onError: (error, context) => {
      queryClient.setQueryData(
        ["employeesData", token],
        context.previousEmployees
      );
      toast.error(t("employeeDeleteFailed", { error: error.message }));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["employeesData", token]);
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);

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

  const filteredEmployees = useMemo(() => {
    if (!employeesData) return [];
    return employeesData.filter((employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employeesData, searchTerm]);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages =
    filteredEmployees.length > 0
      ? Math.ceil(filteredEmployees.length / employeesPerPage)
      : 0;

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">
        {t("errorFetchingData")}
      </div>
    );

  return (
   <>
    <section dir={direction} className="container mx-auto py-8 w-full">
      <div className="bg-white rounded-3xl md:p-8 p-4 w-full min-h-screen">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <input
            type="text"
            placeholder={t("employeeSearchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
          <div className="flex justify-end w-full md:w-1/3">
            <button
              onClick={handleOpenModal}
              className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
            >
              {t("addEmployee")}
              <IoMdPersonAdd className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto lg:w-full w-[90vw]">
          <table className="min-w-full bg-white rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">#</th>
                <th className="py-3 px-6 text-center">{t("name")}</th>
                <th className="py-3 px-6 text-center">{t("email")}</th>
                <th className="py-3 px-6 text-center">{t("phone")}</th>
                <th className="py-3 px-6 text-center">{t("hospital")}</th>
                <th className="py-3 px-6 text-center">{t("specializations")}</th>
                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-lg">
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {t("noEmployeesAvailable")}
                  </td>
                </tr>
              ) : (
                currentEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {indexOfFirstEmployee + index + 1}
                    </td>
                    <td className="py-3 px-6 text-center flex items-center justify-center gap-2">
                      <img
                        src={employee.media_url || teamsIcon}
                        alt={employee.name || "No Name"}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => (e.target.src = teamsIcon)}
                      />
                      <span>{employee.name || t("noName")}</span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {employee.email || t("noEmail")}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {employee.phone || t("noPhone")}
                    </td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {employee.hospital?.name || t("noHospital")}
                    </td>
                    <td className="py-3 px-6 text-center whitespace-nowrap">
                      {employee.specialization || t("noSpecialization")}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleDeleteClick(employee.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <AiFillDelete size={25} />
                        </button>
                        <button
                          onClick={() => navigate(`/clinics/${employee.id}`)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          <AiFillEdit size={25} />
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
            {t("Total")}: {filteredEmployees.length}
          </p>
        </div>
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
          <p className="text-gray-600">{t("areYouSureDeleteEmployee")}</p>
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
    {isModalOpen && (
        <Employeesmodal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          token={token}
        />
      )}
   </>
  );
};

export default Employees;