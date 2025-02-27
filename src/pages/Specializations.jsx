import  { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { deleteSpecializations, getSpecializations } from "../utlis/https";
import { Link } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import LazyLoad from 'react-lazyload'; 
import { IoMdAddCircle } from "react-icons/io";
import { placeholder } from "../assets";

const token = localStorage.getItem("authToken");

const Specializations = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: specializationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Specializations", token],
    queryFn: () => getSpecializations({ token }),
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteSpecializations({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["Specializations", token]);
      const previousSliders = queryClient.getQueryData([
        "Specializations",
        token,
      ]);
      queryClient.setQueryData(
        ["Specializations", token],
        (oldSpecializations) =>
          oldSpecializations.filter((slider) => slider.id !== id)
      );
      return { previousSliders };
    },
    onError: ( context) => {
      queryClient.setQueryData(
        ["Specializations", token],
        context.previousSliders
      );
      alert("Failed to delete. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["Specializations", token]);
    },
  });

  const handleDeleteClick = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      handleDelete({ id });
    }
  };

  const filteredSpecializations = useMemo(() => {
    if (!specializationsData) return [];
    return specializationsData.filter((specialization) =>
      specialization.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [specializationsData, searchTerm]);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto p-6 rounded-3xl">
      <div className="mb-6 flex justify-between items-center  w-full">
        <input
          type="text"
          placeholder={t("search-placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
        />
        <div className="flex justify-end w-full md:w-1/3">
          <Link
            to="/specializations/add"
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
            >
                     <IoMdAddCircle  />
                     {t("add")}
          </Link>
        </div>
      </div>

      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">#</th>
            <th className="p-4">{t("images")}</th>
            <th className="p-4">{t("name")}</th>
            <th className="p-4">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredSpecializations.map((specialization) => (
            <tr key={specialization.id} className="text-center border-b">
              <td className="p-4">{specialization.id}</td>
              <td className="p-4">
                <LazyLoad height={150} offset={100}>
                  <img
                    src={specialization.media_url}
                    alt={specialization.name}
                    className="w-14 h-14 object-fit rounded-lg mx-auto"
                    loading="lazy"
                    onError={(e) => (e.target.src = placeholder)}
                    
                  />
                </LazyLoad>
              </td>
              <td className="p-4">{specialization.name}</td>
              <td className="p-4 flex justify-center items-center">
                <div className="flex justify-center items-center gap-4">
                  <Link
                    to={`/specializations/${specialization.id}`}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    <AiFillEdit size={28} />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(specialization.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <AiFillDelete size={28} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Specializations;
