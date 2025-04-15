/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { updateCity, addCity, getstates } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";

const CityForm = ({ initialData, mode = "add", isLoading, error }) => {
  const { t } = useTranslation();
  const { cityId } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const { data: states, isLoading: stateIsLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => getstates({ token }),
  });
  const [formData, setFormData] = useState({
    name: "",
    state_id: "",
    id: cityId,
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        state_id: initialData.state_id || "",
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

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add" ? addCity(data, token) : updateCity(data, token);
    },
    onSuccess: () => {
      navigate("/cities")
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    // eslint-disable-next-line no-unused-vars
    onError: (error) => {
      toast.error(t("submission_failed"))
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      ...(mode === "update" && { id: cityId }),
    };

    mutation.mutate(dataToSubmit);
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
            name="state_id"
            id="state_id"
            value={formData.state_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-md py-2 px-6 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="">Select state</option>
            {states?.map((data) => (
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
      </form>
    </section>
  );
};

export default CityForm;
