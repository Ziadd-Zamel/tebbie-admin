/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../pages/Loader";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { decrementUserWallet } from "../../utlis/https";
import { toast } from "react-toastify";

const UserWalletReportTable = ({ currentStates, isLoading, reviewData }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newBalance, setNewBalance] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return t("Na");
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return t("Na");
    }
  };

  const updateWalletMutation = useMutation({
    mutationFn: ({ userId, newBalance }) =>
      decrementUserWallet({ token, userId, newBalance }),
    onSuccess: () => {
      toast.success(
        t("wallet_updated_successfully") || "Wallet updated successfully"
      );
      queryClient.invalidateQueries(["user-wallet-report"]);
      setDialogOpen(false);
      setSelectedUser(null);
      setNewBalance("");
    },
    onError: (error) => {
      toast.error(
        error.message || t("error_updating_wallet") || "Error updating wallet"
      );
    },
  });

  const handleBalanceClick = (e, user) => {
    e.stopPropagation(); // Prevent row click navigation
    setSelectedUser(user);
    setNewBalance(user.balance || "");
    setDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser || !newBalance) return;
    updateWalletMutation.mutate({
      userId: selectedUser.id,
      newBalance: parseFloat(newBalance),
    });
  };

  const exportToExcel = () => {
    if (!currentStates?.length) return;

    const worksheet = utils.json_to_sheet(
      reviewData.map((data) => ({
        [t("id")]: data?.id || t("Na"),
        [t("user_name")]: data?.name || t("Na"),
        [t("email")]: data?.email || t("Na"),
        [t("phone")]: data?.phone || t("Na"),
        [t("balance")]: data?.balance ?? t("Na"),
        [t("wallet_updated_at")]: formatDate(data?.wallet_updated_at),
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "User Wallet Report");
    writeFile(workbook, "User_Wallet_Report.xlsx");
  };

  return (
    <>
      {/* Update Balance Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            dir={i18n.dir()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {t("update_wallet_balance")}
            </h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                {t("user_name")}:{" "}
                <span className="font-semibold">{selectedUser?.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                {t("current_balance")}:{" "}
                <span className="font-semibold">{selectedUser?.balance}</span>
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("new_balance")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDialogOpen(false);
                    setSelectedUser(null);
                    setNewBalance("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={updateWalletMutation.isPending}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] transition-colors disabled:opacity-50"
                  disabled={updateWalletMutation.isPending}
                >
                  {updateWalletMutation.isPending ? t("updating") : t("update")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!isLoading && currentStates?.length > 0 && (
        <div className="flex justify-between ">
          <p className="font-bold text-xl md:text-2xl mb-5 flex gap-2 items-center">
            <MdAccountBalanceWallet size={30} className="text-[#3CAB8B]" />
            {t("userWalletReport")}
          </p>
          <button
            onClick={exportToExcel}
            className="px-6 h-10 flex items-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm"
            aria-label={t("Excel-Export")}
            type="button"
          >
            {t("Excel-Export")}
            <FaFileExcel aria-hidden="true" />
          </button>
        </div>
      )}

      <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center">{t("user_name")}</th>
            <th className="py-3 px-6 text-center">{t("email")}</th>
            <th className="py-3 px-6 text-center">{t("phone")}</th>
            <th className="py-3 px-6 text-center">{t("balance")}</th>
            <th className="py-3 px-6 text-center">{t("wallet_updated_at")}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 md:text-lg text-md font-light">
          {isLoading ? (
            <tr>
              <td colSpan="6" className="py-4 px-6 text-center">
                <Loader />
              </td>
            </tr>
          ) : currentStates?.length > 0 ? (
            currentStates.map((data, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
                onClick={() =>
                  data.id
                    ? navigate(`/user-wallet-report/${data.id}`)
                    : undefined
                }
              >
                <td className="py-2 px-6 text-center">
                  {data?.name || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.email || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.phone || t("Na")}
                </td>
                <td
                  className="py-2 px-6 text-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 font-semibold transition-colors"
                  onClick={(e) => handleBalanceClick(e, data)}
                  title={t("click_to_update_balance")}
                >
                  {data?.balance ?? t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {formatDate(data?.wallet_updated_at)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                {t("noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default UserWalletReportTable;
