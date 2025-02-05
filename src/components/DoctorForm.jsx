import { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import {
  addDoctor,
  getHospitals,
  getSpecializations,
  updateDoctor,
} from "../utlis/https";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Loader from "../pages/Loader";
import { ErrorMessage } from "formik";
import { useParams } from "react-router-dom";
import MultiSelectDropdown from "./MultiSelectDropdown";

const DoctorForm = ({ initialData, mode = "add", isLoading, error }) => {
  const token = localStorage.getItem("authToken");
  const { t ,i18n} = useTranslation();
  const { doctorId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const { data: specializations, isLoading: specializationsisLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    });
  const { data: hospitalData, isLoading: hospitalDataLoading } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const [doctorData, setDoctorData] = useState({
    name: "",
    bio: "",
    address: "",
    email: "",
    phone: "",
    city: "",
    job_title: "",
    specialization_id: "",
    is_visitor: false,
    hospital_ids: [],
    media: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      const hospitalIds = initialData.hospitals.map((hospital) => hospital.id);
      setDoctorData({
        name: initialData.name || "",
        bio: initialData.bio || "",
        address: initialData.address || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        city: initialData.city || "",
        job_title: initialData.job_title || "",
        specialization_id: initialData.specialization?.specialization_id || "",
        media: initialData.image || null,
        is_visitor: initialData.is_visitor || "",
        hospital_ids: hospitalIds || [],
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDoctorData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setDoctorData((prevData) => ({
        ...prevData,
        media: file,
      }));
    }
  };
  const handlehospitalChange = (selectedHospitalIds) => {
    setDoctorData((prev) => ({
      ...prev,
      hospital_ids: selectedHospitalIds,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addDoctor(data, token)
        : updateDoctor(data, token);
    },
    onSuccess: () => {
      setErrorMessage("");
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      setErrorMessage(error);
      toast.error(`${error} حدث خطأ فى تعديل بيانات الدكتور `);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...doctorData,
      is_visitor: doctorData.is_visitor ? "yes" : "no",
      ...(mode === "update" && { id: doctorId }),
    };

    mutation.mutate(dataToSubmit);
  };
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  return (
    <section dir={direction} className="container mx-auto p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-auto rounded-3xl bg-white lg:p-12 p-6 shadow-lg flex justify-center md:items-center flex-col  mx-auto"
      >
        <div className="flex justify-center items-center my-6">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Doctor"
                className="w-36 h-36 rounded-full object-cover"
              />
            ) : (
              <div className="h-36 w-36 rounded-full bg-gray-200 p-3 flex justify-center items-center">
                <FaCamera size={20} className="text-gray-500" />
              </div>
            )}
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer"
            >
              <FaCamera size={20} />
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="lg:flex w-full justify-center">
          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="name"
            >
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              required
              value={doctorData.name}
              onChange={handleInputChange}
              id="name"
              placeholder={t("firstName")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>

          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="bio"
            >
              {t("bio")}
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={doctorData.bio}
              onChange={handleInputChange}
              placeholder={t("bio")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>
        </div>
        <div className="lg:flex w-full justify-center">
          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="email"
            >
              {t("email")}
            </label>
            <input
              type="text"
              name="email"
              value={doctorData.email}
              onChange={handleInputChange}
              id="email"
              required
              placeholder={t("email")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>

          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="address"
            >
              {t("address")}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={doctorData.address}
              onChange={handleInputChange}
              placeholder={t("address")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>
        </div>
        <div className="lg:flex w-full justify-center">
          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="phone"
            >
              {t("phone")}
            </label>
            <input
              type="text"
              name="phone"
              required
              value={doctorData.phone}
              onChange={handleInputChange}
              id="phone"
              placeholder={t("phone")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>

          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="job_title"
            >
              {t("jobtitle")}
            </label>
            <input
              type="text"
              id="job_title"
              name="job_title"
              value={doctorData.job_title}
              onChange={handleInputChange}
              placeholder={t("jobtitle")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>
        </div>
        <div className="lg:flex w-full justify-center">
          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="specialization_id"
            >
              {t("specializations")}
            </label>
            {specializationsisLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <select
                name="specialization_id"
                id="specialization_id"
                required
                value={doctorData.specialization_id}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
              >
                <option value="">{t("select_specialization")}</option>
                {specializations?.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="specialization_id"
            >
              {t("hospitals")}
            </label>
            {hospitalDataLoading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <MultiSelectDropdown
                doctors={hospitalData}
                selectedDoctors={hospitalData.hospital_ids}
                handleDoctorChange={handlehospitalChange}
                translation="hospitals"
              />
            )}
          </div>
        </div>
        <div className="text-2xl font-medium gap-2 flex justify-start items-center w-full my-4 px-4">
        <label>{t("visitor")}</label>

          <input
            type="checkbox"
            name="is_visitor"
            className="InputPrimary"
            checked={doctorData.is_visitor === "yes"}
            onChange={(e) =>
              setDoctorData((prevData) => ({
                ...prevData,
                is_visitor: e.target.checked ? "yes" : "no",
              }))
            }
          />
        </div>
        <div className="flex justify-end items-end w-full my-4">
          <button
            type="submit"
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            {mode === "add" ? (t("add-doctor")) : (t("update-doctor"))}
          </button>
        </div>
        <div className="w-full flex justify-start">
          {errorMessage && (
            <ul className="text-red-700 px-4 py-3 rounded mb-4 list-disc ml-4">
              {(Array.isArray(errorMessage)
                ? errorMessage
                : (errorMessage?.message || "حدث خطأ غير متوقع").split(",")
              ).map((error, index) => (
                <li key={index}>{String(error).trim()}</li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </section>
  );
};

export default DoctorForm;
