import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getHospitals,
  getSpecializations,
  getSpecificEmployee,
  updateEmployee,
} from "../utlis/https";
import { useTranslation } from "react-i18next";
import { FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import MultiSelectDropdown from "..//components/MultiSearchSelector";

const UpdateEmployee = () => {
  const token = localStorage.getItem("authToken");
  const { i18n, t } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { clinId } = useParams();
  const [imagePreview, setImagePreview] = useState(null);
  const queryClient = useQueryClient();
const navigate= useNavigate()
  const { data: hospitalData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });

  const { data: specializations, isLoading: specializationsisLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
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

  const handleHospitalChange = (value) => {
    formik.setFieldValue("hospital_id", value);
  };

  const handleSpecializationChange = (value) => {
    formik.setFieldValue("specialization_id", value);
  };
  const {
    data: initialData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee", clinId],
    queryFn: () => getSpecificEmployee({ token, id: clinId }),
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required(t("nameRequired")),
    email: Yup.string().email(t("invalidEmail")).required(t("emailRequired")),
    phone: Yup.string()
      .matches(/^[0-9]+$/, t("phoneMustBeNumeric"))
      .min(10, t("phoneTooShort"))
      .required(t("phoneRequired")),
    hospital_id: Yup.string().required(t("hospitalRequired")),
    specialization_id: Yup.string().required(t("specializationRequired")),
    password: Yup.string().min(6, t("passwordTooShort")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      media: "",
      phone: "",
      email: "",
      password: "",
      hospital_id: "",
      specialization_id: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const dataToSubmit = {
        ...values,
        id: clinId,
        email: values.email !== initialData.email ? values.email : undefined,
      };
      mutation.mutate(dataToSubmit);
    },
  });

  useEffect(() => {
    if (clinId && initialData) {
      formik.setValues({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        media: initialData.media || "",
        hospital_id: initialData.hospital.id || "",
        specialization_id: initialData.specialization_id || "",
        password: "",
      });
      setImagePreview(initialData.media_url || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinId, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      formik.setFieldValue("media", file);
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => updateEmployee({ ...data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] });
navigate("/clinics")
      toast.success("تم تعديل بيانات الموظف بنجاح");
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

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section
      dir={direction}
      className="container mx-auto p-4 w-full flex justify-center items-center"
    >
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 bg-white p-8 rounded-3xl shadow w-full max-w-xl"
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
              <div className="w-32 h-32 rounded-full bg-gray-200 flex justify-center items-center">
                <FaCamera size={24} className="text-gray-500" />
              </div>
            )}
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
            >
              <FaCamera />
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
        <div>
          <label className="block text-md almarai-semibold mb-4 text-start">
            <span className="text-red-500">*</span> {t("name")}
          </label>
          <input
            type="text"
            name="name"
            {...formik.getFieldProps("name")}
            className="border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-md almarai-semibold mb-4 text-start">
            <span className="text-red-500">*</span> {t("email")}
          </label>
          <input
            type="text"
            name="email"
            {...formik.getFieldProps("email")}
            className="border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div>
          <label className="block text-md almarai-semibold mb-4 text-start">
            <span className="text-red-500">*</span> {t("phone")}
          </label>
          <input
            type="text"
            name="phone"
            {...formik.getFieldProps("phone")}
            className="border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.phone}
            </div>
          )}
        </div>

        <div className="my-5">
          <label className="block almarai-semibold mb-4 ">
            <span className="text-red-500">*</span> {t("hospital")}
          </label>
          <MultiSelectDropdown
            options={hospitalOptions}
            onChange={handleHospitalChange}
            selectedValues={
              formik.values.hospital_id ? [formik.values.hospital_id] : []
            }
            placeholder={t("select_hospital")}
            searchPlaceholder={t("search")}
            fallbackMessage={t("no_hospitals_found")}
          />
          {formik.touched.hospital_id && formik.errors.hospital_id && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.hospital_id}
            </div>
          )}
        </div>

        <div className="my-5 w-full">
          <label className="block almarai-semibold mb-4 text-start">
            <span className="text-red-500">*</span> {t("specialization")}
          </label>
          {specializationsisLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <MultiSelectDropdown
              options={specializationOptions}
              onChange={handleSpecializationChange}
              selectedValues={
                formik.values.specialization_id
                  ? [formik.values.specialization_id]
                  : []
              }
              placeholder={t("select_specialization")}
              searchPlaceholder={t("search")}
              fallbackMessage={t("no_specializations_found")}
            />
          )}
          {formik.touched.specialization_id &&
            formik.errors.specialization_id && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.specialization_id}
              </div>
            )}
        </div>

        <div className="relative">
          <label className="block text-md almarai-semibold mb-4 text-start">
            {t("password")}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            {...formik.getFieldProps("password")}
            className="border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute  top-1/2 end-4 transform translate-y-1/2 text-gray-500 text-xl"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center w-full py-6">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              mutation.isPending
                ? "bg-gray-400"
                : "px-6 py-2 hover:bg-[#048c87] w-60 flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-start"
            }`}
            disabled={mutation.isPending}
          >
            {t("edit")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateEmployee;
