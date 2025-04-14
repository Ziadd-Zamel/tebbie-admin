/* eslint-disable react/prop-types */
import { useState } from "react";
import CustomModal from "./CustomModal";
import { getHospitals, getSpecializations, newEmployee } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { placeholder } from "../assets";
import { IoCamera } from "react-icons/io5";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MultiSelectDropdown from "./MultiSearchSelector";

const Employeesmodal = ({ token, setIsModalOpen, isModalOpen }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const { t } = useTranslation();
  const query = useQueryClient();
  const { data: specializations, isLoading: specializationsisLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    });

  const { data: hospitalData } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });

  const validationSchema = Yup.object({
    name: Yup.string().required(t("nameRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    phone: Yup.string()
      .matches(/^[0-9]+$/, t("phoneMustBeNumeric"))
      .min(10, t("phoneTooShort"))
      .required(t("phoneRequired")),
    password: Yup.string()
      .min(6, t("passwordTooShort"))
      .required(t("passwordRequired")),
    hospital_id: Yup.string().required(t("hospitalRequired")),
    specialization_id: Yup.string().required(t("specializationRequired")),
  });
  const hospitalOptions =
    hospitalData?.map((data) => ({
      value: data.id,
      label: data.name,
    })) || [];

  const specializationOptions =
    specializations?.map((data) => ({
      value: data.id,
      label: data.name,
    })) || [];
  const mutation = useMutation({
    mutationFn: (userData) => newEmployee({ token, ...userData }),
    onSuccess: () => {
      toast.success(t("employeeAddedSuccess"));
      query.invalidateQueries("employeesData");
      setIsModalOpen(false);
    },
    onError: (error) => {
      if (error.errors) {
        const fieldErrors = error.errors;

        const emailError = fieldErrors.email?.[0];
        const phoneError = fieldErrors.phone?.[0];

        if (emailError) {
          toast.error(emailError);
        }
        if (phoneError) {
          toast.error(phoneError);
        }
        if (!emailError && !phoneError) {
          toast.error(t("employeeAddFailed", { error: error.message }));
        }
      } else {
        toast.error(
          t("employeeAddFailed", {
            error: error.message || "Unknown error occurred",
          })
        );
      }
    },
  });

  const handleCloseModal = () => setIsModalOpen(false);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFieldValue("media", file); 
    }
  };

  return (
    <CustomModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={t("addEmployee")}
    >
      <div className="flex justify-center items-center">
        <Formik
          initialValues={{
            name: "",
            media: "",
            email: "",
            phone: "",
            password: "",
            hospital_id: "",
            specialization_id: "",
            active: "1",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
         
            const userData = {
              name: values.name,
              email: values.email,
              phone: values.phone,
              password: values.password,
              hospital_id: values.hospital_id,
              specialization_id: values.specialization_id,
              active: values.active,
              media: values.media,
            };

            mutation.mutate(userData);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="px-3 max-w-lg text-md w-full">
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={imagePreview || placeholder}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover"
                    onError={(e) => (e.target.src = placeholder)}
                  />
                  <label className="absolute bottom-[-12px] left-2 bg-white shadow-md p-2 rounded-full cursor-pointer">
                    <IoCamera color="#D9D9D9" size={25} />
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="hidden"
                    />
                  </label>
                  <ErrorMessage
                    name="media"
                    component="div"
                    className="text-red-500 text-sm mt-2 text-center"
                  />
                </div>
              </div>

              <div className="my-5">
                <label className="block almarai-semibold mb-4" htmlFor="name">
                  <span className="text-red-500">*</span> {t("name")}
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder={t("name")}
                  className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-5">
                <label className="block almarai-semibold mb-4" htmlFor="email">
                  <span className="text-red-500">*</span> {t("email")}
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder={t("email")}
                  className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-5">
                <label className="block almarai-semibold mb-4" htmlFor="phone">
                  <span className="text-red-500">*</span> {t("phone")}
                </label>
                <Field
                  type="text"
                  name="phone"
                  placeholder={t("phone")}
                  className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-5">
                <label
                  className="block almarai-semibold mb-4"
                  htmlFor="password"
                >
                  <span className="text-red-500">*</span> {t("password")}
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder={t("password")}
                  className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="my-5">
                <label
                  className="block almarai-semibold mb-4"
                  htmlFor="hospital_id"
                >
                  <span className="text-red-500">*</span> {t("hospital")}
                </label>
                <MultiSelectDropdown
                  options={hospitalOptions}
                  onChange={(value) => setFieldValue("hospital_id", value)}
                  selectedValues={
                    values.hospital_id ? [values.hospital_id] : []
                  }
                  placeholder={t("selectHospital")}
                  searchPlaceholder={t("search")}
                  fallbackMessage={t("no_hospitals_found")}
                />
                <ErrorMessage
                  name="hospital_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Specialization MultiSelectDropdown */}
              <div className="my-5">
                <label
                  className="block almarai-semibold mb-4"
                  htmlFor="specialization_id"
                >
                  <span className="text-red-500">*</span> {t("specialization")}
                </label>
                {specializationsisLoading ? (
                  <div className="text-gray-500">{t("loading")}</div>
                ) : (
                  <MultiSelectDropdown
                    options={specializationOptions}
                    onChange={(value) =>
                      setFieldValue("specialization_id", value)
                    }
                    selectedValues={
                      values.specialization_id ? [values.specialization_id] : []
                    }
                    placeholder={t("select_specialization")}
                    searchPlaceholder={t("selectSpecialization")}
                    fallbackMessage={t("no_specializations_found")}
                  />
                )}
                <ErrorMessage
                  name="specialization_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isLoading}
                  className="px-6 py-2 hover:bg-[#048c87] w-32 flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center disabled:opacity-50"
                >
                  {t("save")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </CustomModal>
  );
};

export default Employeesmodal;
