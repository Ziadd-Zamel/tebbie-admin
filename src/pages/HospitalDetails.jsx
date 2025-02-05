import { useParams, useNavigate, Link } from "react-router-dom";
import { getSpecificHospital, deleteHospital } from "../utlis/https";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { placeholder } from "../assets";
import HospitalMap from "../components/HospitalMap";

const token = localStorage.getItem("authToken");

const HospitalDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { HospitalId } = useParams();
  const navigate = useNavigate();

  const {
    data: hospital,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["Hospital-details", HospitalId],
    queryFn: () => getSpecificHospital({ id: HospitalId, token }),
  });

  const { mutate: handleDelete, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteHospital({ id: HospitalId, token }),
    onSuccess: () => {
      toast.success(` ${t("hospitalDeleted")}`);

      navigate("/hospitals");
    },
    onError: (error) => {
      toast.error(`${t("deleteFailed")} ${error}`);
    },
  });

  if (isLoading || isDeleting) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{t("errorLoadingData")}</div>;
  }

  const handleDeleteClick = () => {
    if (window.confirm(t("confirmDelete"))) {
      handleDelete();
    }
  };

  return (
    <section className="container mx-auto p-4">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full rounded-md bg-white p-6 shadow-lg"
      >
        <div className="flex justify-between flex-wrap">
          <div className="md:w-1/2 w-full">
            <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-4">
              {hospital.name}
            </h2>
            <div className="flex flex-col md:flex-row md:gap-8 lg:text-xl text-lg">
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  <strong>{t("address")}: </strong> {hospital.address}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{t("description")}: </strong> {hospital.description}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{t("bio")}: </strong> {hospital.bio}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{t("email")}: </strong> {hospital.email}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{t("status")}: </strong>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      hospital.active === "1"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {hospital.active === "1" ? t("active") : t("inactive")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <HospitalMap hospital={hospital} />
        </div>

        <div className="md:w-1/2 w-full">
          <h2 className="md:text-3xl text-2xl font-bold text-gray-800 mb-4">
          {t("AvilableDoctors")}          </h2>
          <div className="flex flex-col md:flex-row md:gap-8 lg:text-xl text-lg">
            {hospital?.doctors.data.map((doc) => (
              <p key={doc.id} className="text-gray-600 mb-4">
                <strong>{t("doctor")}: </strong> {doc.name}
              </p>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {t("images")}
        </h3>
        <div className="mt-10 flex items-center flex-wrap gap-4">
          {Array.isArray(hospital.media_url) &&
          hospital.media_url.length > 0 ? (
            hospital.media_url.map((url, index) => (
              <div
                key={index}
                className="relative group lg:w-[420px] md:w-[380px] w-[250px]"
              >
                <img
                  src={url}
                  alt={`Hospital Image ${index + 1}`}
                  className="w-full h-32 md:h-40 lg:h-48 object-cover rounded-md shadow-md"
                  onError={(e) => (e.target.src = placeholder)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No media available</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
          >
            {t("delete")}
          </button>
          <Link
            to={`/hospitals/update-hospital/${hospital.id}`}
            className="px-6 py-2 hover:bg-[#048c87] w-auto text-white  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            {t("edit")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HospitalDetails;
