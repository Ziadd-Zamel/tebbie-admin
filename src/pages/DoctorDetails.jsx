import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDoctor, getSpecificDoctor } from "../utlis/https";
import Loader from "./Loader";
import { ErrorMessage } from "formik";
import { MdEmail } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { placeholder } from "../assets";

const DoctorDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const navigate = useNavigate();
  const { doctorId } = useParams();
  const token = localStorage.getItem("authToken");

  const {
    data: doctorData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctor-details", doctorId],
    queryFn: () => getSpecificDoctor({ id: doctorId, token }),
  });
  const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteDoctor({ id: doctorId, token }),
    onSuccess: () => {
      alert(t("doctorDeleted"));
      navigate("/doctors");
    },
    onError: () => {
      alert(t("deleteFailed"));
    },
  });

  const handleDeleteClick = () => {
    if (window.confirm(t("confirmDelete"))) {
      handleDelete();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }
  const { name, email, phone, bio, address, image, job_title, is_visitor ,id } =
    doctorData;

  return (
    <section className="flex justify-center items-center h-auto">
         <div 
              dir={isArabic ? "rtl" : "ltr"}
              className="p-4 text-center  mx-auto container py-10 rounded-2xl bg-white">
        <div className="flex items-center justify-center">
          <img
            src={image || placeholder}
            alt={`${name}'s profile`}
            className="w-36 h-36 rounded-full object-cover"
            onError={(e) => (e.target.src = placeholder)}

          />
        </div>
        <div>
          <h1 className="md:text-3xl text-2xl font-bold text-center my-4">{name}</h1>
          <p className="text-gray-500 text-lg">
            {job_title || "Job title not provided"}
          </p>
        </div>
        <div className="mt-6">
          <h2 className="md:text-2xl text-xl font-semibold">{t("DoctorInformation")}</h2>
          <div className="space-y-2 my-2 text-xl flex flex-col">
            <div className="flex justify-center items-center gap-2">
            <MdEmail size={25}/>
               {email}
            </div>
            <div className="flex justify-center items-center gap-2">
            <FaPhoneVolume  size={25}/>
               {phone}
            </div>
           <div className="flex justify-center items-center gap-2">
            <FaLocationDot size={25}/>
            {t("address")}: {address || t("Not provided")}
            </div>
          </div>
        </div>

        <div className="my-8 md:text-2xl text-xl max-w-3xl mx-auto">
          <h2 className="  font-semibold">{t("bio")}</h2>
          <p className="text-gray-700 !leading-normal text-[18px]">{bio || t("No bio provided")}</p>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <span
            className={`px-4 py-3 rounded-full text-md ${
              is_visitor === "yes"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {is_visitor === "yes" ? t("visitor") : t("notvisitor")}
          </span>
        </div>

        <div className="mt-6 flex justify-center gap-4 w-full">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
          >
            {t("delete")}
          </button>
          <Link to={`/doctors/update-doctor/${id}`}
            className="px-6 py-2 hover:bg-[#048c87] w-auto text-white  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
            >
            {t("edit")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
