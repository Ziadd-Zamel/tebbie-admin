/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import Loader from "../../pages/Loader";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa6";

const UserWalletReportTable = ({ currentStates, isLoading, reviewData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return t("Na");
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return t("Na");
    }
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
                <td className="py-2 px-6 text-center">
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
