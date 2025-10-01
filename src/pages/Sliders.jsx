import { deleteSliders, getSliders } from "../utlis/https";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { ErrorMessage } from "formik";
import { placeholder } from "../assets";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";
const Sliders = () => {
  const token = localStorage.getItem("authToken");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => {
      if (!hasPermission("sliders-destroy")) {
        throw new Error(
          `You don't have permission to ${getPermissionDisplayName(
            "sliders-destroy"
          )}`
        );
      }
      return deleteSliders({ id, token });
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["sliderData", token]);

      const previousSliders = queryClient.getQueryData(["sliderData", token]);

      queryClient.setQueryData(["sliderData", token], (oldSliders) =>
        oldSliders.filter((slider) => slider.id !== id)
      );

      return { previousSliders };
    },
    onSuccess: () => {
      toast.success("delete the slider successfully");
    },
    onError: (error, context) => {
      queryClient.setQueryData(["sliderData", token], context.previousSliders);
      toast.error(
        error.message || "Failed to delete the slider. Please try again."
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["sliderData", token]);
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
  const {
    data: sliderData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sliderData", token],
    queryFn: () => getSliders({ token }),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section className="container mx-auto py-8 w-full">
      <div className="rounded-3xl md:p-8 p-4 m-4 bg-white ">
        {hasPermission("sliders-store") && (
          <div className="flex md:justify-start justify-center items-center ">
            <Link
              to={"/sliders/add-slider"}
              className="flex justify-center items-center text-xl gap-2 bg-primary hover:bg-[#5CB2AF] text-white py-2 px-4 rounded-lg w-44 my-4"
            >
              Add slider
              <IoMdAdd size={30} />
            </Link>
          </div>
        )}
        <div className="flex items-center flex-wrap justify-start md:justify-center  gap-6 w-full ">
          {sliderData.length > 0 ? (
            <>
              {sliderData.map((slider) => (
                <div
                  key={slider.id}
                  className="bg-white md:w-[320px] w-[300px] shadow-md rounded-xl md:p-4 p-3 lg:text-lg md:text-md text-sm"
                >
                  <div className="w-full">
                    <img
                      src={slider.media_url || placeholder}
                      alt={slider.id}
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => (e.target.src = placeholder)}
                    />
                  </div>

                  <div className="mt-4 flex gap-2 items-center">
                    {hasPermission("sliders-update") && (
                      <Link
                        to={`/sliders/${slider.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaEdit size={30} />
                      </Link>
                    )}
                    {hasPermission("sliders-destroy") && (
                      <button
                        onClick={() => handleDeleteClick(slider.id)}
                        className="text-red-600 hover:text-red-500"
                      >
                        <MdDelete size={30} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center h-full w-full text-2xl">
              <p>Sorry, there are no sliders.</p>
            </div>
          )}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            PaperProps={{ sx: { borderRadius: "12px", padding: "16px" } }}
          >
            <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {t("confirmDelete")}
            </DialogTitle>
            <DialogContent>
              <p className="text-gray-600">{t("areYouSureDeleteSlider")}</p>
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
      </div>
    </section>
  );
};

export default Sliders;
