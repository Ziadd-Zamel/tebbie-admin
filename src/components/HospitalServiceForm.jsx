/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import {
  addHospitalService,
  updateHospitalService,
  getHospitals,
} from "../utlis/https";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../pages/ErrorMessage";
import Loader from "../pages/Loader";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const HospitalServiceForm = ({
  initialData,
  mode = "add",
  isLoading,
  error,
}) => {
  const token = localStorage.getItem("authToken");
  const { id } = useParams();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    hospital_id: "",
    name: "",
    tabi_commission: "",
    hospital_commission: "",
    status: "active",
  });
  const [errors, setErrors] = useState();

  useEffect(() => {
    if (initialData) {
      setFormData({
        hospital_id: initialData.hospital_id || initialData.hospital?.id || "",
        name: initialData.name || "",
        tabi_commission: initialData.tabi_commission ?? "",
        hospital_commission: initialData.hospital_commission ?? "",
        status: initialData.status || "active",
      });
    }
  }, [initialData]);

  const { data: hospitals = [] } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
    enabled: !!token,
  });

  const hospitalsOptions = useMemo(
    () =>
      (Array.isArray(hospitals) ? hospitals : []).map((h) => ({
        id: h.id,
        name: h.name,
      })),
    [hospitals]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addHospitalService(data)
        : updateHospitalService({ ...data, id });
    },
    onSuccess: () => {
      navigate("/hospital-services");
      toast.success(
        mode === "add" ? t("successfully_added") : t("successfully_updated")
      );
    },
    onError: (err) => {
      toast.error(t("submission_failed"));
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "An unknown error occurred.";
      setErrors(errorMessage);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ token, ...formData });
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="container mx-auto p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl bg-white h-auto p-6 shadow-lg flex flex-col justify-center items-center"
      >
        <div className="px-3 my-4 md:mb-0">
          <select
            name="hospital_id"
            id="hospital_id"
            value={formData.hospital_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-md 2 px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="">{t("hospitals")}</option>
            {hospitalsOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="px-3 my-4 md:mb-0">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            id="name"
            placeholder={t("name")}
            className="border border-gray-300 rounded-lg px-4 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <input
            type="number"
            name="tabi_commission"
            value={formData.tabi_commission}
            onChange={handleChange}
            placeholder={t("tabi_commission")}
            className="border border-gray-300 rounded-lg px-4 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <input
            type="number"
            name="hospital_commission"
            value={formData.hospital_commission}
            onChange={handleChange}
            placeholder={t("hospital_commission")}
            className="border border-gray-300 rounded-lg px-4 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          />
        </div>

        <div className="px-3 my-4 md:mb-0">
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-md 2 px-6 bg-[#F7F8FA] py-3 focus:outline-none focus:border-primary md:w-[494px] w-[300px]"
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
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

export default HospitalServiceForm;
