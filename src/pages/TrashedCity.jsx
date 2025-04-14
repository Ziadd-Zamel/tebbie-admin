import Loader from "./Loader";
import {  getTrashedCity, restoreCity, } from "../utlis/https";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const token = localStorage.getItem("authToken");

const TrashedCity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {  i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const {
    data: cityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trashed-cities", token],
    queryFn: () => getTrashedCity({ token }),
  });

  const mutation = useMutation({
    mutationFn: (id) => restoreCity({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["trashed-cities"]);
      navigate("/cities");

    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">حدث خطأ أثناء جلب البيانات. الرجاء المحاولة لاحقًا.</div>;
  }

   if (!cityData?.length) {
    return (
      <div className="text-gray-600 text-center text-2xl py-4 h-[60vh] flex justify-center items-center">
        <p>
        لا توجد مدن محذوفة لعرضها.
        </p>
      </div>
    );
  }

  return (
    <section dir={direction}  className="container mx-auto py-8">
      <div className="rounded-3xl md:p-8 p-4 bg-white shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-6">المدن المحذوفة</h2>
        <table className="max-w-[100vh] lg:w-full mx-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">#</th>
              <th className="border border-gray-200 p-2">اسم الولاية</th>
              <th className="border border-gray-200 p-2">الإجراء</th>

            
            </tr>
          </thead>
          <tbody>
            {cityData.map((data, index) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2 text-center">{index + 1}</td>
       
                <td className="border border-gray-200 p-2">{data.name}</td>
               
                <td className="border border-gray-200 p-2 text-center">
                  <button
                    onClick={() => mutation.mutate(data.id)}
                    className={`text-blue-500 hover:text-blue-700 ${
                      mutation.isLoading && "opacity-50 pointer-events-none"
                    }`}
                    title="استعادة"
                  >
                    <FaUndo size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TrashedCity;
