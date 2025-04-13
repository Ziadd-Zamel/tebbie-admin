import TodaySales from "../components/DashboardComponents/TodaySales";
import { useTranslation } from "react-i18next";
import StateAndCitiesReport from "../components/DashboardComponents/StateAndCitiesReport";
import ReviewsReport from "../components/DashboardComponents/ReviewsReport";
import CancelledReport from "../components/DashboardComponents/CancelledReport";
import DoctorReport from "../components/DashboardComponents/DoctorReport";
import HospitalsReport from "../components/DashboardComponents/HospitalsReport";
import UsersReport from "../components/DashboardComponents/UsersReport";
const Dashboard = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const reverseSmallGridCols =
    direction === "rtl"
      ? "lg:grid-cols-6 lg:flex-row-reverse"
      : "lg:grid-cols-6";

  return (
    <>
      <section className="container mx-auto p-4">
        <div dir={direction} className="w-full flex flex-col gap-4 ">
          <div>
            <TodaySales />
          </div>
          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6`}>
            <div className="col-span-1 lg:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <HospitalsReport />
            </div>
            <div className="col-span-1 lg:col-span-3 bg-white p-4 rounded-[20px] shadow-sm">
              <UsersReport/>
            </div>
          </div>
          <div className=" bg-white  rounded-[20px] shadow-sm">
            <CancelledReport />
          </div>
          <div className=" bg-white  rounded-[20px] shadow-sm">
            <ReviewsReport />
          </div>
          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6`}>
            <div className="col-span-1 lg:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <StateAndCitiesReport />
            </div>
            <div className="col-span-1 lg:col-span-3 bg-white p-4 rounded-[20px] shadow-sm">
              <DoctorReport/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
