import { useTranslation } from "react-i18next";
import { AiFillEdit } from "react-icons/ai";
import { getwhatsapp, updateWhatsapp } from "../utlis/https";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";

const token = localStorage.getItem("authToken");

const WhatsappPage = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  console.log(phone);
  const {
    data: whatsapp,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["whatsapp"],
    queryFn: () => getwhatsapp({ token }),
  });

  const updateMutation = useMutation({
    mutationFn: (newWhatsapp) =>
      updateWhatsapp({ whatsapp: newWhatsapp, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
      setIsDialogOpen(false);
      phone("");
    },
    onError: (error) => {
      console.error("Failed to update WhatsApp:", error);
    },
  });

  const handleEditClick = () => {
    if (!hasPermission("viewAnySettingWhatsapp")) {
      const displayName = getPermissionDisplayName("viewAnySettingWhatsapp");
      alert(`ليس لديك صلاحية لعرض إعدادات الواتساب (${displayName})`);
      return;
    }
    setPhone(whatsapp?.whatsapp || "");
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!hasPermission("updateSettingWhatsapp")) {
      const displayName = getPermissionDisplayName("updateSettingWhatsapp");
      alert(`ليس لديك صلاحية لتحديث إعدادات الواتساب (${displayName})`);
      return;
    }
    if (phone.trim()) {
      updateMutation.mutate(phone.trim());
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPhone("");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  console.log(whatsapp);

  return (
    <section dir={"rtl"} className="container mx-auto bg-gray-50">
      <div className="rounded-3xl md:p-8 p-4 md:m-4 m-0 overflow-auto bg-white">
        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full table-auto mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-start whitespace-nowrap">
                  {t("whatsapp")}
                </th>
                <th className="p-4 text-start whitespace-nowrap">
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td
                  style={{ direction: "ltr" }}
                  className="p-4 whitespace-nowrap flex justify-end"
                >
                  {whatsapp.whatsapp || " "}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <button
                    onClick={handleEditClick}
                    className="text-[#3CAB8B]  transition-colors"
                  >
                    <AiFillEdit size={28} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              تعديل رقم الواتساب
            </h2>

            <div className="mb-4">
              <PhoneInput
                style={{ direction: "ltr", width: "100%" }}
                defaultCountry="ly"
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputClassName="w-full"
                countrySelectorStyleProps={{
                  borderRadius: "6px 0 0 6px",
                  border: "1px solid #d1d5db",
                  borderRight: "none",
                  background: "#f9fafb",
                }}
              />
            </div>

            <div className="flex justify-end gap-5">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={updateMutation.isPending}
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#3CAB8B] text-white rounded-md transition-colors disabled:bg-[#3CAB8B]"
                disabled={updateMutation.isPending || !phone.trim()}
              >
                {updateMutation.isPending ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>

            {updateMutation.error && (
              <div className="mt-3 text-red-600 text-sm">
                فشل في تحديث رقم الواتساب. الرجاء المحاولة مرة أخرى.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WhatsappPage;
