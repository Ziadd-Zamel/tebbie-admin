/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../pages/Loader";
import { utils, writeFile } from "xlsx";
import { FaFileExcel } from "react-icons/fa6";
import { FaHome, FaPlus, FaEdit } from "react-icons/fa";
import AddHomeVisitCommissionDialog from "./AddHomeVisitCommissionDialog";

const HomeVisitCommissionTable = ({
  currentStates,
  isLoading,
  commissionData,
}) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const exportToExcel = () => {
    if (!commissionData?.data?.length) return;

    const worksheet = utils.json_to_sheet(
      commissionData.data.map((data) => ({
        [t("hospital_name")]: data?.hospital?.name || t("Na"),
        [t("tabi_commission_percentage")]: `${
          data?.tabi_commission_percentage || 0
        }%`,
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Home Visit Commissions");
    writeFile(workbook, "Home_Visit_Commissions_Report.xlsx");
  };

  return (
    <div className="w-full">
      {!isLoading && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-10 mb-5">
          <div className="flex gap-3">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-lg hover:from-[#0D9B6B] hover:to-[#047857] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition-colors text-sm whitespace-nowrap"
              aria-label={t("add_commission")}
              type="button"
            >
              <FaPlus aria-hidden="true" />
              {t("add_commission")}
            </button>
            {currentStates?.length > 0 && (
              <button
                onClick={exportToExcel}
                className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm whitespace-nowrap"
                aria-label={t("Excel-Export")}
                type="button"
              >
                <FaFileExcel aria-hidden="true" />
                {t("Excel-Export")}
              </button>
            )}
          </div>
          <p className="font-bold text-xl md:text-2xl flex gap-2 items-center">
            {t("home_visit_commissions")}
            <FaHome size={30} className="text-[#3CAB8B]" />
          </p>
        </div>
      )}

      {/* Scrollable table container */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-scroll">
          <table dir="rtl" className="w-full overflow-x-scroll">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[200px]">
                  {t("hospital_name")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[150px]">
                  {t("tabi_commission_percentage")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 min-w-[100px]">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 md:text-lg text-md font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="py-8 px-6 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : currentStates?.length > 0 ? (
                currentStates.map((data, index) => (
                  <tr
                    key={data.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <div
                        className="max-w-[200px] truncate"
                        title={data?.hospital?.name}
                      >
                        {data?.hospital?.name || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {data?.tabi_commission_percentage || 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setEditData(data);
                          setIsDialogOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title={t("edit")}
                      >
                        <FaEdit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
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

      {/* Add/Edit Commission Dialog */}
      <AddHomeVisitCommissionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditData(null);
        }}
        editData={editData}
      />
    </div>
  );
};

export default HomeVisitCommissionTable;
