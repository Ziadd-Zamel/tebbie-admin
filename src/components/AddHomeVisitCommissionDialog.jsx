import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getHospitals,
  addHomeVisitCommission,
  updateHomeVisitCommission,
} from "../utlis/https";
import { toast } from "react-toastify";
import { IoCloseCircle } from "react-icons/io5";
import PropTypes from "prop-types";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";

const AddHomeVisitCommissionDialog = ({ isOpen, onClose, editData = null }) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    hospital_id: "",
    tabi_commission_percentage: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        hospital_id: editData.hospital_id?.toString() || "",
        tabi_commission_percentage: editData.tabi_commission_percentage || "",
      });
    } else {
      setFormData({
        hospital_id: "",
        tabi_commission_percentage: "",
      });
    }
  }, [editData]);

  // Fetch hospitals for the select dropdown
  const { data: hospitalsData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });

  // Add/Update home visit commission mutation
  const { mutate: saveCommission, isPending } = useMutation({
    mutationFn: (data) => {
      if (editData) {
        if (!hasPermission("homevisit-commissions-update")) {
          throw new Error(
            `You don't have permission to ${getPermissionDisplayName(
              "homevisit-commissions-update"
            )}`
          );
        }
        return updateHomeVisitCommission({
          ...data,
          token,
          commissionId: editData.id,
        });
      } else {
        if (!hasPermission("homevisit-commissions-store")) {
          throw new Error(
            `You don't have permission to ${getPermissionDisplayName(
              "homevisit-commissions-store"
            )}`
          );
        }
        return addHomeVisitCommission({ ...data, token });
      }
    },
    onSuccess: () => {
      toast.success(
        editData
          ? t("commission_updated_successfully")
          : t("commission_added_successfully")
      );
      queryClient.invalidateQueries(["homevisit-commissions"]);
      handleClose();
    },
    onError: (error) => {
      if (error.message && error.message.includes("permission")) {
        toast.error(error.message);
        return;
      }
      toast.error(
        error.message ||
          (editData
            ? t("failed_to_update_commission")
            : t("failed_to_add_commission"))
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.hospital_id || !formData.tabi_commission_percentage) {
      toast.error(t("please_fill_all_fields"));
      return;
    }

    saveCommission(formData);
  };

  const handleClose = () => {
    setFormData({
      hospital_id: "",
      tabi_commission_percentage: "",
    });
    onClose();
  };

  const textAlignment = t("language") === "ar" ? "text-right" : "text-left";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div
          className={`flex items-center justify-between text-2xl font-bold mb-4 bg-[#E6F6F5] rounded-t-3xl h-[70px] w-full ${textAlignment}`}
        >
          <div className="flex justify-between items-center w-full m-8">
            <button onClick={handleClose} className="text-primary">
              <IoCloseCircle size={35} />
            </button>
            <h1 className="flex items-center">
              {editData
                ? t("edit_home_visit_commission")
                : t("add_home_visit_commission")}
            </h1>
          </div>
        </div>

        <div
          className={`mx-auto container flex justify-center flex-col p-6 ${textAlignment}`}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            style={{ direction: "rtl" }}
          >
            {/* Hospital Selection */}
            <div>
              <label
                htmlFor="hospital_id"
                className="block text-sm font-medium text-gray-700 mb-2 text-start"
              >
                {t("hospitals")}
              </label>
              <select
                id="hospital_id"
                value={formData.hospital_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hospital_id: e.target.value,
                  }))
                }
                disabled={!!editData}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  editData ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
                }`}
                required
              >
                <option value="">{t("select_hospital")}</option>
                {hospitalsData?.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Commission Percentage */}
            <div>
              <label
                htmlFor="tabi_commission_percentage"
                className="block text-sm font-medium text-gray-700 mb-2 text-start"
              >
                {t("tabi_commission_percentage")}
              </label>
              <input
                type="number"
                id="tabi_commission_percentage"
                value={formData.tabi_commission_percentage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tabi_commission_percentage: e.target.value,
                  }))
                }
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g., 10.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-5 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#5CB2AF] transition-colors disabled:opacity-50"
              >
                {isPending
                  ? editData
                    ? t("updating")
                    : t("adding")
                  : editData
                  ? t("update_commission")
                  : t("add_commission")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddHomeVisitCommissionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default AddHomeVisitCommissionDialog;
