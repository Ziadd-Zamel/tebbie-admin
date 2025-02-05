import { useMutation } from "@tanstack/react-query";
import { postServices, updateService } from "../utlis/https";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ErrorMessage from "../pages/ErrorMessage";
import Loader from "../pages/Loader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ServicesForm = ({ initialData, mode = "add", isLoading, error }) => {
  const token = localStorage.getItem("authToken");
  const { servId } = useParams();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    id: servId,
  });
  const [errors, setErrors] = useState();
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const homeVisit = [
    { id: 1, name: "دكتور" },
    { id: 2, name: "تمريص" },
    { id: 3, name: "علاج طبيعي" },
  ];

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? postServices(data, token)
        : updateService(data, token);
    },
    onSuccess: () => {
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      toast.error(t("submission_failed"));
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      setErrors(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      ...(mode === "update" && { id: servId }),
    };

    mutation.mutate(dataToSubmit);
  };
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="container mx-auto p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md bg-white h-[40vh] p-6 shadow-lg flex flex-col justify-center items-center"
      >
        <div className="px-3 my-4 md:mb-0">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            id="name"
            placeholder={t("name")}
            className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 rounded-md py-2 px-6 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="">Select home visit</option>
            {homeVisit?.map((data) => (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center py-10 flex justify-center w-full">
          <button
            type="submit"
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg w-40   text-white  py-3 rounded-[8px] focus:outline-none"
          >
            {mode === "add" ? "Add " : "Update "}
          </button>
        </div>
        <p className="text-xl text-red-500 py-4">{errors}</p>
      </form>
    </section>
  );
};

export default ServicesForm;
