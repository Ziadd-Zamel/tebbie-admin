import React from "react";
import TodaySales from "../components/DashboardComponents/TodaySales";
import { useTranslation } from "react-i18next";
import TotalRevenue from "../components/TotalRevenue";
import TargetVsReality from "../components/productsComponents/TargetVsReality";
const Dashboard = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const reverseGridCols =
    direction === "rtl"
      ? "md:grid-cols-1 lg:grid-cols-5 lg:flex-row-reverse"
      : "md:grid-cols-1 lg:grid-cols-5";
  const reverseSmallGridCols =
    direction === "rtl"
      ? "md:grid-cols-6 md:flex-row-reverse"
      : "md:grid-cols-6";

  return (
    <>
      <section className="container mx-auto lg:p-3 md:p-3 p-4">
        <div dir={direction} className="w-full ">
          <div className={`grid grid-cols-1 ${reverseGridCols} gap-3`}>
            <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-white p-4 rounded-[20px] shadow-sm ">
              <TodaySales />
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6`}
          >
            <div className="col-span-1 md:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <TotalRevenue />
            </div>

            <div className="col-span-1 md:col-span-3 bg-white p-4 rounded-[20px] shadow-sm">
              <TargetVsReality />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
