/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import Loader from "../pages/Loader";
import { utils, writeFile } from "xlsx";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa6";

const HomeVisitReportTable = ({
  currentStates,
  isLoading,
  serviceName,
  visitData,
}) => {
  const { t } = useTranslation();

  const exportToExcel = () => {
    if (!visitData.data.data.length) return;

    const worksheet = utils.json_to_sheet(
      visitData.data.data.map((data) => ({
        [t("visit_id")]: data?.visit_id || t("Na"),
        [t("service_name")]: data?.service_name || t("Na"),
        [t("user_name")]: data?.user_name || t("Na"),
        [t("user_phone")]: data?.user_phone || t("Na"),
        [t("user_address")]: data?.user_address || t("Na"),
        [t("hospital_name")]: data?.hospital_name || t("Na"),
        [t("date")]: data?.date || t("Na"),
        [t("time")]: `${data?.start_from || t("Na")} - ${
          data?.end_at || t("Na")
        }`,
        [t("human_type")]:
          data?.human_type === "0"
            ? t("male")
            : data?.human_type === "1"
            ? t("female")
            : t("Na"),
        [t("price")]: data?.price ?? t("Na"),
        [t("status")]: data?.status || t("Na"),
        [t("payment_status")]: data?.payment_status || t("Na"),
        [t("notes")]: data?.notes || t("Na"),
        [t("created_at")]: data?.created_at || t("Na"),
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Home Visit Report");
    writeFile(workbook, `${serviceName || "Home_Visit"}_Report.xlsx`);
  };

  return (
    <div className="w-full">
      {!isLoading && currentStates?.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-10 mb-5">
          <button
            onClick={exportToExcel}
            className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm whitespace-nowrap"
            aria-label={t("Excel-Export")}
            type="button"
          >
            <FaFileExcel aria-hidden="true" />
            {t("Excel-Export")}
          </button>
          <p className="font-bold text-xl md:text-2xl flex gap-2 items-center">
            {serviceName || t("homeVisitReport")}
            <MdOutlineMedicalServices size={30} className="text-[#3CAB8B]" />
          </p>
        </div>
      )}

      {/* Scrollable table container */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className=" overflow-x-scroll">
          <table dir="rtl" className="w-full overflow-x-scroll">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[120px]">
                  {t("service_name")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[120px]">
                  {t("client")}
                </th>

                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[120px]">
                  {t("user_phone")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[200px]">
                  {t("user_address")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[150px]">
                  {t("hospital_name")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[100px]">
                  {t("human_type")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[80px]">
                  {t("price")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[100px]">
                  {t("status")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[120px]">
                  {t("payment_status")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[150px]">
                  {t("notes")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[120px]">
                  {t("created_at")}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 md:text-lg text-md font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="py-8 px-6 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : currentStates?.length > 0 ? (
                currentStates.map((data, index) => (
                  <tr
                    key={data.visit_id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[120px] truncate"
                        title={data?.service_name}
                      >
                        {data?.service_name || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[120px] truncate"
                        title={data?.user_name}
                      >
                        {data?.user_name || t("Na")}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[120px] truncate"
                        title={data?.user_phone}
                      >
                        {data?.user_phone || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[200px] truncate"
                        title={data?.user_address}
                      >
                        {data?.user_address || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[150px] truncate"
                        title={data?.hospital_name}
                      >
                        {data?.hospital_name || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {data?.human_type === "0"
                        ? t("male")
                        : data?.human_type === "1"
                        ? t("female")
                        : t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {data?.price ?? t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[100px] truncate"
                        title={data?.status}
                      >
                        {data?.status || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[120px] truncate"
                        title={data?.payment_status}
                      >
                        {data?.payment_status || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[150px] truncate"
                        title={data?.notes}
                      >
                        {data?.notes || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[120px] truncate"
                        title={data?.created_at}
                      >
                        {data?.created_at || t("Na")}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeVisitReportTable;
