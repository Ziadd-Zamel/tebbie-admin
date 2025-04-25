import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  newSpecializations,
  getHospitals,
  updateSpecializations,
} from "../utlis/https";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useTranslation } from "react-i18next";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";



// eslint-disable-next-line react/prop-types
const SpecializationsForm = ({ initialData = {}, mode = "add" }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("name_required")),
    hospital_ids: Yup.array()
      .min(1, t("choose_hospitals_required") )
      .required("Hospitals are required"),
    media: Yup.mixed().nullable(), 
  });
  const { spId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { data: hospitalData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });

  const [formState, setFormState] = useState({
    name: initialData.name || "",
    media: initialData.media || "",
    hospital_ids: initialData.hospital_ids || [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({}); // State for validation errors

  useEffect(() => {
    if (mode === "update" && Object.keys(initialData).length > 0) {
      const hospitalIds = initialData.hospitals.map((hospital) => hospital.id);

      setFormState((prev) => ({
        ...prev,
        name: initialData.name || "",
        media: initialData.media || "",
        hospital_ids: hospitalIds || [],
      }));
      setImagePreview(initialData.media_url || null);
    }
  }, [initialData, mode]);

  const handlehospitalChange = (selectedHospitalIds) => {
    setFormState((prev) => ({
      ...prev,
      hospital_ids: selectedHospitalIds,
    }));
    // Clear hospital_ids error when user selects hospitals
    setErrors((prev) => ({ ...prev, hospital_ids: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormState((prevData) => ({
        ...prevData,
        media: file,
      }));
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? newSpecializations({ ...data, token })
        : updateSpecializations({ ...data, token });
    },
    onSuccess: () => {
      navigate("/specializations");
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("submission_failed"));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate formState using Yup
      await validationSchema.validate(formState, { abortEarly: false });
      setErrors({}); // Clear errors if validation passes

      const dataToSubmit = {
        ...formState,
        points_value: { [formState.key]: formState.value },
        ...(mode === "update" && { id: spId }),
      };

      mutation.mutate(dataToSubmit);
    } catch (validationError) {
      // Handle validation errors
      const formattedErrors = {};
      validationError.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      toast.error(t("please_fill_required_fields"));
    }
  };

  return (
    <section className="container mx-auto p-4 w-full flex justify-center items-center h-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-8 rounded-3xl shadow w-full h-full max-w-xl"
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
          <label
            className="block text-md almarai-semibold mb-4 text-start"
            htmlFor="specialization_id"
          >
            <span className="text-red-500"> * </span> {t("name")}
          </label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className={`border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="my-6 md:mb-0 w-full">
          <label
            className="block text-md almarai-semibold mb-4 text-start"
            htmlFor="specialization_id"
          >
            <span className="text-red-500"> * </span> {t("hospitals")}
          </label>
          <MultiSelectDropdown
            doctors={hospitalData || []}
            selectedDoctors={formState.hospital_ids}
            handleDoctorChange={handlehospitalChange}
            translation="hospitals"
          />
          {errors.hospital_ids && (
            <p className="text-red-500 text-sm mt-1">{errors.hospital_ids}</p>
          )}
        </div>

        <div className="flex justify-center items-center w-full py-6">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              mutation.isPending
                ? "bg-gray-400"
                : "px-6 py-3 hover:bg-[#048c87] w-full flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? t("sending") 
              : mode === "update"
              ? t("edit")
              : t("add")}
          </button>
        </div>
      </form>
    </section>
  );
};

export default SpecializationsForm;
