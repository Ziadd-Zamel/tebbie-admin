import { useTranslation } from "react-i18next";
import { 
  FaHospital, 
  FaCalendarCheck, 
  FaUserMd, 
  FaUsers, 
  FaHome, 
  FaStar, 
  FaStethoscope 
} from "react-icons/fa";
import { getGeneralStatistics } from "../../utlis/https";
import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "../../pages/ErrorMessage";
import Loader from "../../pages/Loader";

const TodaySales = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("authToken");

  const {
    data: StatisticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["genral-statistcs", token],
    queryFn: () => getGeneralStatistics({ token }),
    enabled: !!token,
  });

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  if (!StatisticsData) return <ErrorMessage />;
  return (
    <>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4 my-6">
        {/* Hospitals */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("hospitals")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.hospitals_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] flex justify-center items-center">
              <FaHospital className="text-white" size={25} />
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("total_bookings")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.bookings_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#4ECDC4] to-[#A3E4E1] flex justify-center items-center">
              <FaCalendarCheck className="text-white" size={25} />
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("doctors")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.doctors_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#45B7D1] to-[#96D4E8] flex justify-center items-center">
              <FaUserMd className="text-white" size={25} />
            </div>
          </div>
        </div>

        {/* Home Visit Services */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("home_visit")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.home_visit_services_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#FF69B4] to-[#FFB6C1] flex justify-center items-center">
              <FaHome className="text-white" size={25} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("reviews")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.reviews_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#FFD700] to-[#FFFACD] flex justify-center items-center">
              <FaStar className="text-white" size={25} />
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("specializations")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.specializations_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#6A5ACD] to-[#B0A4E6] flex justify-center items-center">
              <FaStethoscope className="text-white" size={25} />
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("users")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.users_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#20B2AA] to-[#90EE90] flex justify-center items-center">
              <FaUsers className="text-white" size={25} />
            </div>
          </div>
       
        </div>

        {/* Users Last 30 Days */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("users_30_days")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.users_last_30_days_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#FFA500] to-[#FFDAB9] flex justify-center items-center shrink-0">
              <FaUsers className="text-white" size={25} />
            </div>
          </div>
       
        </div>

        {/* Users Last Month */}
        <div className="p-6 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px]">
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">{t("users_last_month")}</p>
              <span className="font-bold text-3xl">{StatisticsData?.users_last_month_count || 0}</span>
            </div>
            <div className="size-12 rounded-full bg-gradient-to-bl from-[#9370DB] to-[#D8BFD8] flex justify-center items-center shrink-0">
              <FaUsers className="text-white" size={25} />
            </div>
          </div>
      
        </div>
      </div>
    </>
  );
};

export default TodaySales;