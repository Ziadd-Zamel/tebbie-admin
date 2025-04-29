/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { addCustomerService, updateCustomerService } from "../utlis/https";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Loader from "../pages/Loader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const CustomerServiseForm = ({
  initialData,
  mode = "add",
  isLoading,
  error,
}) => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const { customerId } = useParams();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  const DoctorSchema = Yup.object().shape({
    name: Yup.string().required(t("name_required")),
    email: Yup.string().email(t("invalid_email")).required(t("email_required")),
    phone: Yup.string().required(t("phone_required")),
    is_active: Yup.string(),
    isAbleToCancel: Yup.string(),
    password: Yup.string()
      .min(8, t("password_too_short")) 
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t("password_requirements")
      )
  ,
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwords_must_match"))
  });  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addCustomerService(data, token)
        : updateCustomerService(data, token);
    },
    onSuccess: () => {
      navigate("/customer-service");
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      toast.error(`${error} حدث خطأ `);
    },
  });

  const initialValues = initialData
    ? {
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        is_active: initialData.is_active === 1 ? 1 : 0,
      }
    : {
        password: "",
        password_confirmation: "",
        name: "",
        email: "",
        phone: "",
        is_active: 0,
      };

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
            ...(mode === "update" && { id: customerId }),
          };
          mutation.mutate(dataToSubmit);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="w-auto rounded-3xl bg-white lg:p-12 p-6 shadow-lg flex justify-center flex-col mx-auto">
            {/* Form Fields */}
            <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="name"
                >
                  <span className="text-red-500">*</span> {t("name")}
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  placeholder={t("firstName")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full my-2"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="!text-red-700 my-2"
                 
                />
              </div>
            </div>

            <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="phone"
                >
                  <span className="text-red-500">*</span> {t("phone")}
                </label>
                <Field
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder={t("phone")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full my-2"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="!text-red-700 mt-1"
                 
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="email"
                >
                  <span className="text-red-500">*</span> {t("email")}
                </label>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  placeholder={t("email")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full my-2"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-700 mt-1"
                 
                />
              </div>
            </div>

          
            <div className="lg:flex w-full justify-center">
              <div className="px-3 my-6 md:mb-0 w-full relative">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="password"
                >
                  <span className="text-red-500">*</span> {t("password")}
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder={t("password")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full my-2"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute  top-1/2 end-5 transform translate-y-1/2 text-gray-500 text-xl"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="!text-red-700 mt-1"
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="password_confirmation"
                >
                  <span className="text-red-500">*</span>
                  {t("password_confirmation")}
                </label>
                <Field
                  type="text"
                  name="password_confirmation"
                  id="password_confirmation"
                  placeholder={t("password_confirmation")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full my-2"
                />
                <ErrorMessage
                  name="password_confirmation"
                  component="div"
                  className="text-red-700 mt-1"
                />
              </div>
            </div>
              {/* Checkboxes */}
              <div className="flex gap-2">
              <div className="text-2xl font-medium gap-2 flex justify-start items-center my-4 px-4">
                <label>{t("active")}</label>
                <Field
                  type="checkbox"
                  name="is_active"
                  className="InputPrimary"
                  checked={values.is_active === 1}
                  onChange={(e) =>
                    setFieldValue("is_active", e.target.checked ? 1 : 0)
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
                {mode === "add" ? t("add") : t("update")}
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

export default CustomerServiseForm;
