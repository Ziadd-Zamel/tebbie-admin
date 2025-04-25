/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import {
  addDoctor,
  getHospitals,
  getHospitalsByspecialization,
  getSpecializations,
  updateDoctor,
} from "../utlis/https";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Loader from "../pages/Loader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelectDropdown from "./MultiSelectDropdown";

const DoctorForm = ({ initialData, mode = "add", isLoading, error }) => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const [selectedSpecializationId, setSelectedSpecializationId] = useState(
    initialData?.specialization?.specialization_id || ""
  );
  const DoctorSchema = Yup.object().shape({
    name: Yup.string().required(t("name_required")),
    email: Yup.string().email("invalid_email").required(t("email_required")),
    phone: Yup.string().required(t("phone_required")),
    hospital_ids: Yup.array()
      .of(Yup.number().required())
      .min(1, t("choose_hospitals_required"))
      .required(t("choose_hospitals_required")),
    address: Yup.string().required(t("address_required")),
    bio: Yup.string().required(t("bio_required")),
    specialization_id: Yup.string().required(t("specialization_required")),
    is_visitor: Yup.string(),
    isAbleToCancel: Yup.string(),
  });
  const { doctorId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  // Queries
  const { data: specializations, isLoading: specializationsLoading } = useQuery(
    {
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    }
  );

  const { data: hospitalData, isLoading: hospitalDataLoading } = useQuery({
    queryKey: ["hospitalData", token, selectedSpecializationId],
    queryFn: () =>
      getHospitalsByspecialization({
        token,
        id: selectedSpecializationId,
      }),
    enabled: !!selectedSpecializationId, // Only fetch when specialization_id is selected
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addDoctor(data, token)
        : updateDoctor(data, token);
    },
    onSuccess: () => {
      navigate("/doctors");
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      toast.error(`${error} حدث خطأ فى تعديل بيانات الدكتور`);
    },
  });

  // Initial values
  const initialValues = initialData
    ? {
        name: initialData.name || "",
        bio: initialData.bio || "",
        address: initialData.address || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        city: initialData.city || "",
        job_title: initialData.job_title || "",
        specialization_id: initialData.specialization?.specialization_id || "",
        is_visitor: initialData.is_visitor === "yes" ? "yes" : "no",
        isAbleToCancel: initialData.isAbleToCancel === "yes" ? "yes" : "no",
        hospital_ids:
          initialData.hospitals?.map((hospital) => hospital.id) || [],
        media: initialData.image || null,
      }
    : {
        name: "",
        bio: "",
        address: "",
        email: "",
        phone: "",
        city: "",
        job_title: "",
        specialization_id: "",
        is_visitor: "no",
        isAbleToCancel: "no",
        hospital_ids: [],
        media: null,
      };

  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  if (isLoading) return <Loader />;
  if (error) return <div>{t("error")}</div>;

  return (
    <section dir={direction} className="container mx-auto p-4 w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={DoctorSchema}
        onSubmit={(values) => {
          const dataToSubmit = {
            ...values,
            ...(mode === "update" && { id: doctorId }),
          };
          mutation.mutate(dataToSubmit);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="w-auto rounded-3xl bg-white lg:p-12 p-6 shadow-lg flex justify-center flex-col mx-auto">
            {/* Image Upload */}
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                      setFieldValue("media", file);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="name"
                >
                  {" "}
                  <span className="text-red-500">*</span> {t("name")}
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder={t("firstName")}
                  className="border border-gray-300 rounded-lg py-4 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="!text-red-700  !my-2"
                />{" "}
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="bio"
                >
                  {" "}
                  <span className="text-red-500">*</span> {t("bio")}
                </label>
                <Field
                  type="text"
                  name="bio"
                  id="bio"
                  placeholder={t("bio")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="bio"
                  component="div"
                  className="!text-red-700 mt-1"
                />
              </div>
            </div>

            {/* Add other fields similarly */}
            <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="email"
                >
                  {" "}
                  <span className="text-red-500">*</span> {t("email")}
                </label>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  placeholder={t("email")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="address"
                >
                  {" "}
                  <span className="text-red-500">*</span> {t("address")}
                </label>
                <Field
                  type="text"
                  name="address"
                  id="address"
                  placeholder={t("address")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>
            </div>

            <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="phone"
                >
                  {" "}
                  <span className="text-red-500">*</span> {t("phone")}
                </label>
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder={t("phone")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="job_title"
                >
                  {t("jobtitle")}
                </label>
                <Field
                  type="text"
                  name="job_title"
                  id="job_title"
                  placeholder={t("jobtitle")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="job_title"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>
            </div>

             

              <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="specialization_id"
                >
                  <span className="text-red-500">*</span>{" "}
                  {t("specializations")}
                </label>
                {specializationsLoading ? (
                  <div className="text-gray-500">{t("loading")}</div>
                ) : (
                  <Field
                    as="select"
                    name="specialization_id"
                    id="specialization_id"
                    value={values.specialization_id}
                    onChange={(e) => {
                      setFieldValue("specialization_id", e.target.value);
                      setSelectedSpecializationId(e.target.value); // Update state for hospital query
                      setFieldValue("hospital_ids", []); // Reset hospital_ids when specialization changes
                    }}
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  >
                    <option value="">{t("select_specialization")}</option>
                    {specializations?.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </Field>
                )}
                <ErrorMessage
                  name="specialization_id"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="hospital_ids"
                >
                  <span className="text-red-500">*</span> {t("hospitals")}
                </label>
                {!selectedSpecializationId ? (
                  <div className="text-gray-500">
                    {t("select_specialization_first")}
                  </div>
                ) : hospitalDataLoading ? (
                  <div className="text-gray-500">{t("loading")}</div>
                ) : (
                  <MultiSelectDropdown
                    doctors={hospitalData}
                    selectedDoctors={values.hospital_ids}
                    handleDoctorChange={(selectedHospitalIds) =>
                      setFieldValue("hospital_ids", selectedHospitalIds)
                    }
                    translation="hospitals"
                  />
                )}
                <ErrorMessage
                  name="hospital_ids"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-2">
              <div className="text-2xl font-medium gap-2 flex justify-start items-center my-4 px-4">
                <label>{t("visitor")}</label>
                <Field
                  type="checkbox"
                  name="is_visitor"
                  className="InputPrimary"
                  checked={values.is_visitor === "yes"}
                  onChange={(e) =>
                    setFieldValue("is_visitor", e.target.checked ? "yes" : "no")
                  }
                />
              </div>
              <div className="text-2xl font-medium gap-2 flex justify-start items-center my-4 px-4">
                <label>{t("special")}</label>
                <Field
                  type="checkbox"
                  name="isAbleToCancel"
                  className="InputPrimary"
                  checked={values.isAbleToCancel === "yes"}
                  onChange={(e) =>
                    setFieldValue(
                      "isAbleToCancel",
                      e.target.checked ? "yes" : "no"
                    )
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end items-end w-full my-4">
              <button
                type="submit"
                className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
              >
                {mode === "add" ? t("add-doctor") : t("update-doctor")}
              </button>
            </div>

            {/* Error Messages */}
            {mutation.error && (
              <div className="w-full flex justify-start">
                <ul className="text-red-700 px-4 py-3 rounded mb-4 list-disc ml-4">
                  {(Array.isArray(mutation.error)
                    ? mutation.error
                    : [mutation.error.message || "حدث خطأ غير متوقع"]
                  ).map((error, index) => (
                    <li key={index}>{String(error).trim()}</li>
                  ))}
                </ul>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default DoctorForm;
