import { useMutation } from "@tanstack/react-query";
import { addRechargeCards } from "../utlis/https";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCard = () => {
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    count: "",
    expire_date: "",
    price: "",
    batch_number: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      addRechargeCards({
        count: formData.count,
        expire_date: formData.expire_date,
        price: formData.price,
        batch_number: formData.batch_number,
        token,
      }),
    onSuccess: () => {
      toast.success(t("successfully_added"));
      navigate("/recharge-card");
      setMessage("");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إضافة البطاقة.");
      setMessage(error.message || "حدث خطأ أثناء إضافة البطاقة.");
    },
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };
  console.log(formData);
  return (
    <section dir={direction} className="container mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-xl mx-auto min-h-[50vh] h-auto flex flex-col justify-center  bg-white p-6 rounded-2xl"
      >
        <div>
          <label htmlFor="count" className="block text-gray-600 mb-2">
            {t("count")}
          </label>
          <input
            type="text"
            id="count"
            value={formData.count}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="expire_date" className="block text-gray-600 mb-2">
            {t("expireDate")}
          </label>
          <input
            type="date"
            id="expire_date"
            value={formData.expire_date}
            onChange={handleChange}
            required
            placeholder="MM/DD/YYYY"
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-600 mb-2">
            {t("price")}
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="batch_number" className="block text-gray-600 mb-2">
            {t("batchNumber")}
          </label>
          <input
            type="text"
            id="batch_number"
            value={formData.batch_number}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary"
          />
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className={`px-6 py-3 w-auto min-w-32 flex justify-center items-center text-white gap-2 text-lg rounded-[8px] focus:outline-none text-center ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] hover:bg-[#048c87]"
            }`}
          >
            {isPending ? t("adding") : t("add")}
          </button>
        </div>
        {message && (
          <div
            className={`mt-4 p-4 rounded-md text-center ${
              message.includes("نجاح") ? "text-green-500" : "text-red-500"
            } `}
          >
            {message}
          </div>
        )}
      </form>
    </section>
  );
};

export default AddCard;
