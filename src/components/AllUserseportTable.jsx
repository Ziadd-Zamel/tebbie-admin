/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../pages/Loader";
import { utils, writeFile } from "xlsx";
import { FaFileExcel } from "react-icons/fa6";

const AllUserReportTable = ({ userData, isLoading }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("user");

  const user = userData?.data?.user;
  const bookings = userData?.data?.bookings || [];
  const homeVisits = userData?.data?.home_visits || [];

  const handleExport = () => {
    let exportData = [];

    // --- Add User Info ---
    exportData.push({
      Section: "User",
      [t("name")]: user?.name || t("Na"),
      [t("email")]: user?.email || t("Na"),
      [t("user_phone")]: user?.phone || t("Na"),
    });

    // Add an empty row for spacing
    exportData.push({});

    // --- Add Bookings ---
    if (bookings.length > 0) {
      bookings.forEach((b) => {
        exportData.push({
          Section: "Booking",
          [t("doctor_name")]: b.doctor_name || t("Na"),
          [t("hospital_name")]: b.hospital_name || t("Na"),
          [t("date")]: b.date || t("Na"),
          [t("time")]: `${b.start_time} - ${b.end_time}`,
          [t("price")]: b.price || t("Na"),
          [t("status")]: b.status || t("Na"),
          [t("payment_status")]: b.payment_status || t("Na"),
        });
      });
    } else {
      exportData.push({ Section: "Booking", [t("noData")]: "" });
    }

    // Add an empty row for spacing
    exportData.push({});

    // --- Add Home Visits ---
    if (homeVisits.length > 0) {
      homeVisits.forEach((h) => {
        exportData.push({
          Section: "Home Visit",
          [t("service_name")]: h.service_name || t("Na"),
          [t("hospital_name")]: h.hospital_name || t("Na"),
          [t("date")]: h.date || t("Na"),
          [t("time")]: `${h.start_from} - ${h.end_at}`,
          [t("price")]: h.price || t("Na"),
          [t("status")]: h.status || t("Na"),
          [t("payment_status")]: h.payment_status || t("Na"),
        });
      });
    } else {
      exportData.push({ Section: "Home Visit", [t("noData")]: "" });
    }

    // --- Export to One Sheet ---
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "All Data");
    writeFile(wb, "all_user_data.xlsx");
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-5 flex-row-reverse mt-5">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "bookings"
                ? "bg-[#3CAB8B] text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            الحجوزات
          </button>
          <button
            onClick={() => setActiveTab("home_visits")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "home_visits"
                ? "bg-[#3CAB8B] text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            الزيارات المنزلية
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "user"
                ? "bg-[#3CAB8B] text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            المستخدم
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          <FaFileExcel />
          {t("Export")}
        </button>
      </div>

      {/* Tables */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table dir="rtl" className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                {activeTab === "user" && (
                  <>
                    <th className="py-3 px-4 text-center">{t("name")}</th>
                    <th className="py-3 px-4 text-center">{t("email")}</th>
                    <th className="py-3 px-4 text-center">{t("user_phone")}</th>
                  </>
                )}

                {activeTab === "bookings" && (
                  <>
                    <th className="py-3 px-4 text-center">{t("doctorName")}</th>
                    <th className="py-3 px-4 text-center">
                      {t("hospital_name")}
                    </th>
                    <th className="py-3 px-4 text-center">{t("date")}</th>
                    <th className="py-3 px-4 text-center">{t("time")}</th>
                    <th className="py-3 px-4 text-center">{t("price")}</th>
                    <th className="py-3 px-4 text-center">{t("status")}</th>
                    <th className="py-3 px-4 text-center">
                      {t("payment_status")}
                    </th>
                  </>
                )}

                {activeTab === "home_visits" && (
                  <>
                    <th className="py-3 px-4 text-center">
                      {t("service_name")}
                    </th>
                    <th className="py-3 px-4 text-center">{t("doctorName")}</th>
                    <th className="py-3 px-4 text-center">{t("date")}</th>
                    <th className="py-3 px-4 text-center">{t("time")}</th>
                    <th className="py-3 px-4 text-center">{t("price")}</th>
                    <th className="py-3 px-4 text-center">{t("status")}</th>
                    <th className="py-3 px-4 text-center">
                      {t("payment_status")}
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : activeTab === "user" ? (
                <tr>
                  <td className="py-3 px-4 text-center">
                    {user?.name || t("Na")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user?.email || t("Na")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user?.phone || t("Na")}
                  </td>
                </tr>
              ) : activeTab === "bookings" ? (
                bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-4 text-center">
                        {b.doctor_name || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.hospital_name || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.date || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {`${b.start_time} - ${b.end_time}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.price || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.status || t("Na")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {b.payment_status || t("Na")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-500">
                      {t("noData")}
                    </td>
                  </tr>
                )
              ) : homeVisits.length > 0 ? (
                homeVisits.map((h) => (
                  <tr key={h.id}>
                    <td className="py-3 px-4 text-center">
                      {h.service_name || t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {h.hospital_name || t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {h.date || t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {`${h.start_from} - ${h.end_at}`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {h.price || t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {h.status || t("Na")}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {h.payment_status || t("Na")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-gray-500">
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

export default AllUserReportTable;
