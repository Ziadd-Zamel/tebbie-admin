import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCity, getcities } from "../utlis/https";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoTrashSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { IoMdAddCircle } from "react-icons/io";

const Cities = () => {
  const token = localStorage.getItem("authToken");
  const { t } = useTranslation();

  const {
    data: citiesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cities", token],
    queryFn: () => getcities({ token }),
  });

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteCity({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["cities", token]);

      const previousCities = queryClient.getQueryData(["cities", token]);

      queryClient.setQueryData(["cities", token], (oldCities) =>
        oldCities.filter((city) => city.id !== id)
      );

      return { previousCities };
    },
    onSuccess: () => {
      toast.success("تم حذف المدينه");
    },
    onError: ( context) => {
      queryClient.setQueryData(["cities", token], context.previousCities);
      toast.error("فشل في حذف المدينه");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cities", token]);
    },
  });

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      handleDelete({ id });
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <Link
          className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          to="/cities/add-city"
        >
          {t("add-city")}
          <IoMdAddCircle />
        </Link>
        <div className="flex justify-end">
          <Link
            to={"/cities/trashed-cities"}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          >
            trash
            <IoTrashSharp />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">المدينة</th>
              <th className="py-3 px-6 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 md:text-xl text-lg font-light">
            {citiesData?.map((city) => (
              <tr
                key={city.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{city.id}</td>

                <td className="py-3 px-6 text-left">{city.name}</td>

                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/cities/${city.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <AiFillEdit size={28} />
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(city.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <AiFillDelete size={28} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {citiesData?.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 text-lg"
                >
                  لا توجد مدن متاحة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Cities;
