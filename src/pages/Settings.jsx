import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../utlis/https";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const Settings = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: settingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Settings"],
    queryFn: () => getSettings({ token }),
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section dir={direction} className="container mx-auto p-6 bg-gray-50">
      <div className="overflow-x-auto md:w-full w-[90vw] md:text-md text-sm">
        <table className="w-full bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">#</th>
              <th className="p-4 whitespace-nowrap">
                {t("pointsForRegister")}
              </th>
              <th className="p-4 whitespace-nowrap">{t("pointsForReview")}</th>
              <th className="p-4 whitespace-nowrap">{t("pointsForBooking")}</th>
              <th className="p-4 whitespace-nowrap">{t("pointsValue")}</th>
              <th className="p-4">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {settingsData.map((setting) => (
              <tr key={setting.id} className="text-center border border-b">
                <td className="p-4">{setting.id}</td>
                <td className="p-4">{setting.points_for_register}</td>
                <td className="p-4 whitespace-nowrap">
                  {setting.points_for_review}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {setting.points_for_booking}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {Object.entries(setting.points_value).map(
                    ([points, value]) => (
                      <div key={points}>
                        {i18n.language === "ar"
                          ? `${points} ${t("point")} = ${value} ${t("dinar")}`
                          : `${points} ${t("point")} = ${value} ${t("dinar")}`}
                      </div>
                    )
                  )}
                </td>
                <td className="p-4 flex justify-center items-center">
                  <div>
                    <Link
                      to={`/settings/${setting.id}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEdit size={28} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Settings;
