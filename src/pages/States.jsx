import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteState, getstates, updateState, addState } from "../utlis/https";
import Loader from "./Loader";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillSave,
  AiFillPlusCircle,
} from "react-icons/ai";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { IoTrashSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const States = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const [editableId, setEditableId] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [newStateName, setNewStateName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: statesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["states", token],
    queryFn: () => getstates({ token }),
  });
  const hospitalPerPage = 9;
  const indexOfLastHospital = currentPage * hospitalPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalPerPage;

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };
  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteState({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["states", token]);
      toast.success("تم حذف الولاية بنجاح!");
    },
    onError: () => {
      toast.error("فشل في حذف الولاية حاول مرة أخرى!");
    },
  });
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
  const { mutate: handleUpdate } = useMutation({
    mutationFn: ({ id, name }) => updateState({ id, name, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["states", token]);
      setEditableId(null);
      toast.success("تم تحديث الولاية بنجاح!");
    },
    onError: () => {
      toast.error("فشل في تحديث الولاية حاول مرة أخرى!");
    },
  });

  const { mutate: handleAdd } = useMutation({
    mutationFn: ({ name }) => addState({ name, token }),
    onMutate: async ({ name }) => {
      await queryClient.cancelQueries(["states", token]);

      const previousStates = queryClient.getQueryData(["states", token]);

      queryClient.setQueryData(["states", token], (oldStates) => [
        ...(oldStates || []),
        { id: Date.now(), name },
      ]);

      setNewStateName("");

      return { previousStates };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["states", token], context.previousStates);
      toast.error("فشل في إضافة الولاية الجديدة. حاول مرة أخرى!");
    },
    onSuccess: () => {
      toast.success("تم إضافة الولاية بنجاح!");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["states", token]);
    },
  });

  const handleEditClick = (id, currentName) => {
    setEditableId(id);
    setUpdatedName(currentName);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleSaveClick = (id) => {
    handleUpdate({ id, name: updatedName });
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete({ id: selectedId });
    }
    handleCloseDialog();
  };
  const currentHospital = statesData?.slice(
    indexOfFirstHospital,
    indexOfLastHospital
  );
  const handleAddClick = () => {
    if (newStateName.trim()) {
      handleAdd({ name: newStateName });
    } else {
      alert("Please enter a name for the new state.");
    }
  };
  const totalPages =
    statesData?.length > 0 ? Math.ceil(statesData.length / hospitalPerPage) : 0;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto p-4">
      <div className="rounded-3xl p-4 bg-white overflow-auto ">
        <div className="flex justify-end my-4">
          <Link
            to={"/states/trashed-state"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            {t("trash")}
            <IoTrashSharp />
          </Link>
        </div>
        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-start">#</th>
                <th className="py-3 px-6 text-start"> {t("name")}</th>
                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {currentHospital?.map((state) => (
                <tr
                  key={state.id}
                  className="border-b border-gray-200 hover:bg-gray-100 text-lg"
                >
                  <td className="py-3 px-6 text-start whitespace-nowrap">
                    {state.id}
                  </td>
                  <td className="py-3 px-6 text-start">
                    {editableId === state.id ? (
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    ) : (
                      state.name
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center items-center gap-4">
                      {editableId === state.id ? (
                        <button
                          className="text-green-500 hover:text-green-700 focus:outline-none"
                          onClick={() => handleSaveClick(state.id)}
                        >
                          <AiFillSave size={28} />
                        </button>
                      ) : (
                        <button
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          onClick={() => handleEditClick(state.id, state.name)}
                        >
                          <AiFillEdit size={28} />
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        onClick={() => handleDeleteClick(state.id)}
                      >
                        <AiFillDelete size={28} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="hover:bg-gray-100 text-lg">
                <td className="py-3 px-6 text-start whitespace-nowrap">
                  {t("new")}
                </td>
                <td className="py-3 px-6 text-start">
                  <input
                    type="text"
                    placeholder="Enter new state name"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    className="border border-gray-300 rounded p-2 md:w-full min-w-44"
                  />
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="text-green-500 hover:text-green-700 focus:outline-none"
                    onClick={handleAddClick}
                  >
                    <AiFillPlusCircle size={28} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-2xl text-gray-500 text-start">
            {t("Total")} : {statesData.length}
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
            <p className="text-gray-600">{t("areYouSureDeleteState")}</p>
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

export default States;
