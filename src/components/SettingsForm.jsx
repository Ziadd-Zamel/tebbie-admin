import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { addSettings, updateSetting } from "../utlis/https";
import { toast } from "react-toastify";

const SettingsForm = ({ initialData = {}, mode = "add" }) => {
  const { settingId } = useParams();
  const token = localStorage.getItem("authToken");
  

  const [formState, setFormState] = useState({
    points_for_register: initialData.points_for_register || "",
    points_for_review: initialData.points_for_review || "",
    points_for_booking: initialData.points_for_booking || "",
    key: "",
    value: "",
  });

  useEffect(() => {
    if (mode === "update" && Object.keys(initialData).length > 0) {
      const [key, value] = Object.entries(initialData.points_value || {})[0] || ["", ""];
      setFormState((prev) => ({
        ...prev,
        points_for_register: initialData.points_for_register || "",
        points_for_review: initialData.points_for_review || "",
        points_for_booking: initialData.points_for_booking || "",
        key,
        value,
      }));
    }
  }, [initialData, mode]);

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addSettings({ ...data, token })
        : updateSetting({ ...data, token });
    },
    onSuccess: () =>   { mode === "add" ? toast.success("تم اضافة الاعدادات") : toast.success("تم تعديل الاعدادات") },

    onError: (error) => {
      console.error(error);
      alert("فشل الإرسال");
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
      points_value: { [formState.key]: formState.value },
      ...(mode === "update" && { id: settingId }),
    };

    mutation.mutate(dataToSubmit);
  };

  return (
    <section className="container mx-auto p-4 w-full flex justify-center items-center  h-[80vh]">
     <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-8 rounded flex flex-col justify-center  shadow w-full h-[50vh] max-w-3xl"
    >
      <div>
        <label className="block mb-1 font-medium">النقاط عند التسجيل</label>
        <input
          type="number"
          name="points_for_register"
          value={formState.points_for_register}
          onChange={handleChange}
          className=" border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
          required
        />
      </div>
     <div  className="flex gap-4 w-full">
     <div className="w-full">
        <label className="block mb-1 font-medium">النقاط عند التقييم</label>
        <input
          type="number"
          name="points_for_review"
          value={formState.points_for_review}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary  "
          required
        />
      </div>
      <div className="w-full">
      <label className="block mb-1 font-medium">النقاط عند الحجز</label>
        <input
          type="number"
          name="points_for_booking"
          value={formState.points_for_booking}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary  "
          required
        />
      </div>
     </div>
      <div>
        <label className="block mb-1 font-medium">قيمة النقاط</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="key"
            placeholder="Key"
            value={formState.key}
            onChange={handleChange}
            className="w-1/2 border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary "
            required
          />
          <input
            type="text"
            name="value"
            placeholder="Value"
            value={formState.value}
            onChange={handleChange}
            className="w-1/2 border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary "
            required
          />
        </div>
      </div>
<div className="flex justify-center items-center w-full py-6">
<button
        type="submit"
        className={`px-4 py-2 rounded-lg text-white ${
          mutation.isPending ? "bg-gray-400" : " px-6 py-3 hover:bg-[#048c87] w-36 flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
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

export default SettingsForm;
