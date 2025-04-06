/* eslint-disable react/prop-types */
import { useState } from "react";
import CustomModal from "./CustomModal";
import { getHospitals, getSpecializations, newEmployee } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { placeholder } from "../assets";
import { IoCamera } from "react-icons/io5";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Employeesmodal = ({ token, setIsModalOpen, isModalOpen }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const { t } = useTranslation();

  const { data: specializations, isLoading: specializationsisLoading } = useQuery({
    queryKey: ["specializations"],
    queryFn: () => getSpecializations({ token }),
  });

  const { data: hospitalData } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });

  const mutation = useMutation({
    mutationFn: (userData) => newEmployee({ token, ...userData }),
    onSuccess: () => {
      toast.success(t("employeeAddedSuccess"));
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(t("employeeAddFailed", { error: error.message }));
    },
  });

  const handleCloseModal = () => setIsModalOpen(false);

  // Yup validation schema
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
    media: Yup.mixed().required(t("imageRequired")),
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFieldValue("media", file); // Update Formik field value
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
            // Pass plain object to mutation.mutate instead of FormData
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
          {({ isSubmitting, setFieldValue }) => (
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
                <span className="text-red-500">*</span>  {t("name")}
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
                <span className="text-red-500">*</span>  {t("phone")}
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
                <label className="block almarai-semibold mb-4" htmlFor="password">
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
                <label className="block almarai-semibold mb-4" htmlFor="hospital_id">
                <span className="text-red-500">*</span> {t("hospital")}
                </label>
                <Field
                  as="select"
                  name="hospital_id"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                >
                  <option value="">{t("selectHospital")}</option>
                  {hospitalData?.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="hospital_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

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
                  <Field
                    as="select"
                    name="specialization_id"
                    className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  >
                    <option value="">{t("selectSpecialization")}</option>
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