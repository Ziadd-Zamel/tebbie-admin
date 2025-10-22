/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getcities, addRegion, updateRegion } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";

const RegionForm = ({ initialData, mode = "add", isLoading, error }) => {
  const { t } = useTranslation();
  const { regionId } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const { data: cities } = useQuery({
    queryKey: ["cities", token],
    queryFn: () => getcities({ token }),
  });

  const [formData, setFormData] = useState({
    name: "",
    city_id: "",
    id: regionId,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        city_id: initialData.city_id || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add" ? addRegion(data) : updateRegion(data);
    },
    onSuccess: () => {
      navigate("/regions");
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: () => {
      toast.error(t("submission_failed"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      token,
      ...(mode === "update" && { id: regionId }),
    };
    mutation.mutate(payload);
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="container mx-auto p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md bg-white h-[70vh] p-6 shadow-lg flex flex-col justify-center items-center"
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
            name="city_id"
            id="city_id"
            value={formData.city_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-md py-2 px-6 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="">Select city</option>
            {cities?.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
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
      </form>
    </section>
  );
};

export default RegionForm;
