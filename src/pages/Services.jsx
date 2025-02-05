import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteService, getServices, postServices } from "../utlis/https";
import Loader from "./Loader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import ErrorMessage from "./ErrorMessage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Services = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const {
    data: servicesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServices({ token }),
  });
  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteService({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["services", token]);
      toast.success("تم حذف الخدمة بنجاح!");
    },
    onError: () => {
      toast.error("فشل في حذف الخدمة حاول مرة أخرى!");
    },
  });
  const handleDeleteClick = (id) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذه الخدمة")) {
      handleDelete({ id });
      toast.info("جاري حذف الخدمة...");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto p-6">
      <div className="overflow-x-auto ">
        <div className="flex justify-start items-end gap-2">
          <Link
            to={"/services/add-service"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            اضافة خدمة زيارة منزليه
            <IoMdAddCircle />
          </Link>
        </div>
        <div className="flex justify-end my-4"></div>
        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">{t("name")}</th>
                <th className="py-3 px-6 text-center">نوع الزياره المنزلية</th>

                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {servicesData?.map((ser) => (
                <tr
                  key={ser.id}
                  className="border-b border-gray-200 hover:bg-gray-100 text-lg"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {ser.id}
                  </td>
                  <td className="py-3 px-6 text-left">{ser.name}</td>
                  <td className="py-3 px-6 text-center">
                    {ser.type === "1"
                      ? "دكتور"
                      : ser.type === "2"
                      ? "مريض"
                      : ser.type === "3"
                      ? "علاج طبيعي"
                      : "others"}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {ser.type !== "4" && (
                      <div className="flex justify-center items-center space-x-4 gap-2">
                        <button
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          onClick={() => handleDeleteClick(ser.id)}
                        >
                          <AiFillDelete size={28} />
                        </button>
                        <Link
                          to={`/services/${ser.id}`}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          <AiFillEdit size={28} />
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Services;
