import React, { useState, useEffect } from "react";
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

const SpecializationsForm = ({ initialData = {}, mode = "add" }) => {
  const { spId } = useParams();
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();
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
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      console.error(error);
      alert(t("submission_failed"));
    },
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formState,
      points_value: { [formState.key]: formState.value },
      ...(mode === "update" && { id: spId }),
    };

    mutation.mutate(dataToSubmit);
  };

  return (
    <section className="container mx-auto p-4 w-full flex justify-center items-center  h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-8 rounded-3xl shadow w-full h-[60vh] max-w-xl"
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
          <label className="block text-md almarai-semibold mb-4 text-center">
            الاسم
          </label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            required
          />
        </div>
        <div className="px-3 my-6 md:mb-0 w-full">
          <label
            className="block text-md almarai-semibold mb-4 text-center"
            htmlFor="specialization_id"
          >
            {t("hospitals")}
          </label>

          <MultiSelectDropdown
            doctors={hospitalData || []}
            selectedDoctors={formState.hospital_ids}
            handleDoctorChange={handlehospitalChange}
            translation="hospitals"
          />
        </div>

        <div className="flex justify-center items-center w-full py-6">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              mutation.isPending
                ? "bg-gray-400"
                : " px-6 py-3 hover:bg-[#048c87] w-full flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "جارٍ الإرسال..."
              : mode === "update"
              ? "تعديل "
              : "إضافة "}
          </button>
        </div>
      </form>
    </section>
  );
};

export default SpecializationsForm;
