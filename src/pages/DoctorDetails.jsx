import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDoctor, getSpecificDoctor } from "../utlis/https";
import Loader from "./Loader";
import { MdEmail } from "react-icons/md";
import { FaPhoneVolume, FaLocationDot, FaAward } from "react-icons/fa6";
import { placeholder } from "../assets";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";

const DoctorDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const token = localStorage.getItem("authToken");
  const [openDialog, setOpenDialog] = useState(false);

  const {
    data: doctorData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["doctor-details", doctorId],
    queryFn: () => getSpecificDoctor({ id: doctorId, token }),
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => {
      if (!hasPermission("restoreDoctors")) {
        const displayName = getPermissionDisplayName("restoreDoctors");
        alert(`ليس لديك صلاحية لحذف الطبيب (${displayName})`);
        return Promise.reject(new Error("No permission"));
      }
      return deleteDoctor({ id: doctorId, token });
    },
    onSuccess: () => {
      navigate("/doctors");
    },
    onError: () => {
      alert(t("deleteFailed"));
    },
  });

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    handleCloseDialog();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4 h-[60vh] flex justify-center items-center text-2xl">
        <p>{t("errorFetchingData")}</p>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    bio,
    address,
    image,
    job_title,
    is_visitor,
    id,
    isAbleToCancel,
  } = doctorData;

  return (
    <section className="container mx-auto py-8 min-h-[80vh] flex items-center justify-center">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-lg p-6 md:p-8 w-full max-w-4xl"
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-shrink-0">
            <img
              src={image || placeholder}
              alt={`${name}'s profile`}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary shadow-md"
              onError={(e) => (e.target.src = placeholder)}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {name}
            </h1>
            <p className="text-lg text-gray-500 mt-1">
              {job_title || t("jobTitleNotProvided")}
            </p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  is_visitor === "yes"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {is_visitor === "yes" ? t("visitor") : t("notvisitor")}
              </span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                  isAbleToCancel === "yes"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isAbleToCancel === "yes" ? t("special") : t("not-special")}
                <FaAward />
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            {t("doctorInformation")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
            <div className="flex items-center gap-3">
              <MdEmail size={24} className="text-primary" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneVolume size={24} className="text-primary" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <FaLocationDot size={24} className="text-primary" />
              <span>
                {t("address")}: {address || t("notProvided")}
              </span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            {t("bio")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-4 rounded-lg">
            {bio || t("noBioProvided")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            {t("delete")}
          </button>
          <Link
            to={`/doctors/update-doctor/${id}`}
            className="px-6 py-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white rounded-lg hover:bg-[#048c87] transition-colors duration-300 text-center"
          >
            {t("edit")}
          </Link>
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
            <p className="text-gray-600">{t("areYouSureDeleteDoctor")}</p>
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

export default DoctorDetails;
