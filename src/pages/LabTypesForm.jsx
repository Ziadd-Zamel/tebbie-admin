import { useParams } from "react-router-dom";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { newLabType, updateLabType } from "../utlis/https";
import { FaCamera } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const LabTypesForm = ({ initialData, mode = "add", isLoading, error }) => {
  const { labTypeId } = useParams();
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const [labData, setLabData] = useState({
    name: "",
    description: "",
    media: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setLabData({
        name: initialData.name || "",
        description: initialData.description || "",
        media: initialData.media || null,
      });
      setImagePreview(initialData.media || null);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLabData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setLabData((prevData) => ({
        ...prevData,
        media: file,
      }));
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? newLabType(data, token)
        : updateLabType(data, token);
    },
    onSuccess: () => {
   
       { mode === "add" ? toast.success("تم اضافة نوع التحليل") : toast.success("تم تعديل نوع التحليل") }

   
    },
    onError: (error) => {
        toast.error("حدث خطا ما");
        console.log(error);
        
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...labData,
      ...(mode === "update" && { id: labTypeId }),
    };

    mutation.mutate(dataToSubmit);
  };
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  return (
    <section className="container mx-auto p-4 w-full flex justify-center items-center  h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-8 rounded-3xl shadow w-full h-auto scrollbar-hide  overflow-auto max-w-xl"
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
            value={labData.name}
            onChange={handleInputChange}
            className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            required
          />
        </div>
        <div className="px-3 my-6 md:mb-0 w-full">
          <label
            className="block text-md almarai-semibold mb-4 text-center"
            htmlFor="description"
          >
            {t("description")}
          </label>
          <textarea
          name="description"
            value={labData.description}
            onChange={handleInputChange}
            className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
          />
        </div>

        <div className="flex justify-center items-center w-full py-6">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg text-white ${
              mutation.isPending
                ? "bg-gray-400"
                : " px-6 py-2 hover:bg-[#048c87] w-60 flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
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

export default LabTypesForm;
