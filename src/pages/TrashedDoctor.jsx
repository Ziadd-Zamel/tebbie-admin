import Loader from "./Loader";
import { getTrashedDoctor, restoreDoctor } from "../utlis/https";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const token = localStorage.getItem("authToken");

const TrashedDoctor = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { i18n ,t } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const {
    data: doctorlData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trashed-doctor", token],
    queryFn: () => getTrashedDoctor({ token }),
  });

  const mutation = useMutation({
    mutationFn: (id) => restoreDoctor({ token, id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["trashed-doctor"]);
      navigate("/doctors");
    },
  });
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        حدث خطأ أثناء جلب البيانات. الرجاء المحاولة لاحقًا.
      </div>
    );
  }

  if (!doctorlData?.length) {
    return (
      <div className="text-gray-600 text-center text-xl py-4 h-full flex justify-center items-center">
        <p>
        لا توجد دكاترة محذوفة لعرضها.
        </p>
      </div>
    );
  }

  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="rounded-3xl md:p-8 p-4 bg-white shadow-lg overflow-auto">
        <h2 className="text-2xl font-bold mb-6"> {t("deletedDoctors")}</h2>
        <table className=" w-full mx-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">#</th>
              <th className="border border-gray-200 p-2">الصورة</th>
              <th className="border border-gray-200 p-2">اسم المستشفى</th>
              <th className="border border-gray-200 p-2">الوصف</th>
              <th className="border border-gray-200 p-2">العنوان</th>
              <th className="border border-gray-200 p-2">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {doctorlData.map((doctor, index) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {doctor.media_url?.length > 0 ? (
                    <img
                      src={doctor.media_url[0]}
                      alt={doctor.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    "لا توجد صورة"
                  )}
                </td>
                <td className="border border-gray-200 p-2">{doctor.name}</td>
                <td className="border border-gray-200 p-2">
                  {doctor.description || "لا يوجد"}
                </td>
                <td className="border border-gray-200 p-2">
                  {doctor.address || "لا يوجد"}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  <button
                    onClick={() => mutation.mutate(doctor.id)}
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

export default TrashedDoctor;
