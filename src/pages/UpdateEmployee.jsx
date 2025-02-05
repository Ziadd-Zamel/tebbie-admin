import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {  useParams } from "react-router-dom";
import {
  getHospitals,
  getSpecializations,
  getSpecificEmployee,
  updateEmployee,
} from "../utlis/https";
import { useTranslation } from "react-i18next";
import { FaCamera } from "react-icons/fa";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";

const UpdateEmployee = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();
  const { data: hospitalData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });
  const { empId } = useParams();

  const { data: specializations, isLoading: specializationsisLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    });
  const {
    data: initialData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee" ,empId],
    queryFn: () => getSpecificEmployee({ token, id:empId }),
  });
  const [formState, setFormState] = useState({
    name: "",
    media: "",
    phone: "",
    email: "",
    password: "",
    hospital_id: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (empId && initialData) {
      setFormState((prev) => ({
        ...prev,
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        media: initialData.media || "",
        hospital_id: initialData.hospital_id || "",
      }));
      setImagePreview(initialData.media_url || null);
    }
  }, [empId, initialData]);

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
      updateEmployee({ ...data, token });
    },
    onSuccess: () => {
      toast.success("تم تعديل بيانات الموظف بنجاح");
    },
    onError: (error) => {
        toast.error("فضل في تعديل بيانات الموظف بنجاح");
    },
  });

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
       id: empId ,
      email: formState.email !== initialData.email ? formState.email : undefined,
    };
  
    mutation.mutate(dataToSubmit);
  };
  
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="container mx-auto p-4 w-full flex justify-center items-center  ">
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
        <div>
          <label className="block text-md almarai-semibold mb-4 text-center">
            البريد الالكتروني
          </label>
          <input
            type="text"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            required
          />
        </div>
        <div>
          <label className="block text-md almarai-semibold mb-4 text-center">
            الهاتف
          </label>
          <input
            type="text"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            required
          />
        </div>
        <div className="my-5">
          <label
            className="block almarai-semibold mb-4 text-center"
            htmlFor="hospital"
          >
            {t("hospital")}
          </label>
          <select
            name="hospital_id"
            id="hospital_id"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          >
            <option value="">Select Hospital</option>
            {hospitalData?.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </select>
        </div>

        <div className="my-5 w-full">
          <label
            className="block almarai-semibold mb-4 text-center"
            htmlFor="specialization"
          >
            {t("specialization")}
          </label>
          {specializationsisLoading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <select
              name="specialization_id"
              id="specialization_id"
              onChange={handleChange}
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

        <div>
          <label className="block text-md almarai-semibold mb-4 text-center">
            كلمة المرور
          </label>
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            required
          />
        </div>
        <div className="flex justify-center items-center w-full py-6">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              mutation.isPending
                ? "bg-gray-400"
                : " px-6 py-2 hover:bg-[#048c87] w-60 flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-centere"
            }`}
            disabled={mutation.isPending}
          >
            تعديل
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateEmployee;
