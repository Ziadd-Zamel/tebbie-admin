/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import Loader from "../../pages/Loader";
import { useNavigate } from "react-router-dom";

const DocotrReportTable = ({ currentStates, isLoading, translation }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const hasAvgRating = Array.isArray(currentStates)
    ? currentStates.some(
        (row) => row && row.avg_rating !== undefined && row.avg_rating !== null
      )
    : false;

  return (
    <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
      <thead>
        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-center">{t(`${translation}`)}</th>
          <th className="py-3 px-6 text-center">{t("total_bookings")}</th>
          {hasAvgRating && (
            <th className="py-3 px-6 text-center">{t("avg_rating")}</th>
          )}
        </tr>
      </thead>
      <tbody className="text-gray-600 md:text-lg text-md font-light">
        {isLoading ? (
          <tr>
            <td
              colSpan={hasAvgRating ? 3 : 2}
              className="py-4 px-6 text-center"
            >
              <Loader />
            </td>
          </tr>
        ) : currentStates?.length > 0 ? (
          currentStates?.map((data, index) => (
            <tr
              key={index}
              onClick={
                translation === "hospital"
                  ? () => navigate(`/hospital-report/${data.hospital_id}`)
                  : undefined
              }
              className={`border-b border-gray-200 ${
                translation === "hospital"
                  ? "hover:bg-gray-100 cursor-pointer"
                  : ""
              }`}
            >
              <td className="py-2 px-6 text-center">
                {data?.doctor_name ||
                  data?.hospital_name ||
                  data?.user_name ||
                  data?.service_name}
              </td>
              <td className="py-2 px-6 text-center">
                {data?.total_count || data?.total_bookings || t("Na")}
              </td>
              {hasAvgRating && (
                <td className="py-2 px-6 text-center">
                  {data?.avg_rating !== undefined && data?.avg_rating !== null
                    ? Number.parseFloat(data.avg_rating).toFixed(1)
                    : t("Na")}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={hasAvgRating ? 3 : 2}
              className="py-4 px-6 text-center text-gray-500"
            >
              {t("noData")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DocotrReportTable;
