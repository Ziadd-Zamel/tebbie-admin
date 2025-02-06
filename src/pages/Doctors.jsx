import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { getDoctors } from "../utlis/https";
import placeholder from "../assets/placeholder.svg";
import { Link } from "react-router-dom";
import { IoPersonAddSharp, IoTrashSharp } from "react-icons/io5";

const token = localStorage.getItem("authToken");

const Doctors = () => {
  const {
    data: doctors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors({ token }),
  });
  const { t, i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }
  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="flex justify-between my-4 mx-4">
        <div className="flex justify-end items-end gap-2">
          <Link
            to={"/doctors/add-doctor"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            Add Doctor
            <IoPersonAddSharp  />
          </Link>
        </div>
        <div className="flex justify-end">
          <Link
            to={"/doctors/trashed-doctors"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            {t("recyclebin")}
            <IoTrashSharp  />
          </Link>
        </div>
      </div>

      <div className="flex items-center flex-wrap sm:justify-start justify-center  gap-6 w-full">
      {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white h-56 md:w-[320px] w-[300px] shadow-md rounded-xl md:p-4 p-3 lg:text-lg md:text-md text-sm"
          >
            <div className="flex">
              <div className="w-1/3">
                <img
                  src={doctor.image || placeholder}
                  alt={doctor.name}
                  className="w-full h-24 object-cover rounded-md"
                  onError={(e) => (e.target.src = placeholder)}

                />
              </div>
              <div className="p-4 w-2/3">
                <h2 className="text-lg font-bold text-gray-800">
                  {doctor.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{doctor.job_title}</p>
                <p className="text-sm text-gray-600">
                  {doctor.bio.length > 150
                    ? `${doctor.bio.substring(0, 78)}...`
                    : doctor.bio}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span
                className={`px-3 py-2 rounded-full text-sm ${
                  doctor.is_visitor === "yes"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {doctor.is_visitor === "yes" ? t("visitor") : t("notvisitor")}
              </span>

              <Link
                to={`/doctors/${doctor.id}`}
                className="text-md text-[#3CAB8B] underline ]"
              >
                {t("viewDetailsDoc")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Doctors;
