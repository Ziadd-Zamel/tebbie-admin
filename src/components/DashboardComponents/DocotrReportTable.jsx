/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import Loader from "../../pages/Loader";

const DocotrReportTable = ({ currentStates, isLoading }) => {
    const { t } = useTranslation();
  
    return (
      <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center">{t("doctor")}</th>
            <th className="py-3 px-6 text-center">{t("total_bookings")}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 md:text-lg text-md font-light">
          {isLoading ? (
            <tr>
              <td colSpan="3" className="py-4 px-6 text-center">
                <Loader />
              </td>
            </tr>
          ) : currentStates?.length > 0 ? (
            currentStates?.map((doctor, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 px-6 text-center">{doctor.doctor_name}</td>
                <td className="py-2 px-6 text-center">{doctor.total_count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 px-6 text-center text-gray-500">
                {t("noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  

export default DocotrReportTable;