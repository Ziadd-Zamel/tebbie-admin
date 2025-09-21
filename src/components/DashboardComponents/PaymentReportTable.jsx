/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import Loader from "../../pages/Loader";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import { MdOutlinePayment } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa6";

const PaymentReportTable = ({ currentStates, isLoading, reviewData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const exportToExcel = () => {
    if (!currentStates?.length) return;

    const worksheet = utils.json_to_sheet(
      reviewData.data.map((data) => ({
        [t("payment_method")]: data?.payment_method || t("Na"),
        [t("user_name")]: data?.user_name || t("Na"),
        [t("phone")]: data?.user_phone || t("Na"),
        [t("price")]: data?.price ?? t("Na"),
        [t("status")]: data?.status || t("Na"),
        [t("description")]: data?.description || t("Na"),
        [t("created_at")]: data?.created_at || t("Na"),
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Payment Report");
    writeFile(workbook, "Payment_Report.xlsx");
  };

  return (
    <>
      {!isLoading && currentStates?.length > 0 && (
        <div className="flex justify-between ">
          <p className="font-bold text-xl md:text-2xl mb-5 flex gap-2 items-center">
            <MdOutlinePayment size={30} className="text-[#3CAB8B]" />
            {t("paymentReport")}
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
            <th className="py-3 px-6 text-center">{t("payment_method")}</th>
            <th className="py-3 px-6 text-center">{t("user_name")}</th>
            <th className="py-3 px-6 text-center">{t("phone")}</th>
            <th className="py-3 px-6 text-center">{t("price")}</th>
            <th className="py-3 px-6 text-center">{t("status")}</th>
            <th className="py-3 px-6 text-center">{t("description")}</th>
            <th className="py-3 px-6 text-center">{t("created_at")}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 md:text-lg text-md font-light">
          {isLoading ? (
            <tr>
              <td colSpan="7" className="py-4 px-6 text-center">
                <Loader />
              </td>
            </tr>
          ) : currentStates?.length > 0 ? (
            currentStates.map((data, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
                onClick={() =>
                  data.hospital_id
                    ? navigate(`/hospital-report/${data.hospital_id}`)
                    : undefined
                }
              >
                <td className="py-2 px-6 text-center">
                  {data?.payment_method || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.user_name || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.user_phone || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.price ?? t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.status || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.description || t("Na")}
                </td>
                <td className="py-2 px-6 text-center">
                  {data?.created_at || t("Na")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                {t("noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default PaymentReportTable;
