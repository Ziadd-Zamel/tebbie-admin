import TodaySales from "../components/DashboardComponents/TodaySales";
import { useTranslation } from "react-i18next";
import StateAndCitiesReport from "../components/DashboardComponents/StateAndCitiesReport";
import ReviewsReport from "../components/DashboardComponents/ReviewsReport";
import CancelledReport from "../components/DashboardComponents/CancelledReport";
import DoctorReport from "../components/DashboardComponents/DoctorReport";
import HospitalsReport from "../components/DashboardComponents/HospitalsReport";
import UsersReport from "../components/DashboardComponents/UsersReport";
import HomeVisitReporteport from "../components/DashboardComponents/HomeVisitReporteport";
import { useQuery } from "@tanstack/react-query";
import {
  getAllHospitals,
  getAllUsers,
  getAllDoctors,
  getAllHomeVisit,
} from "../utlis/https";
import Loader from "./Loader";
const Dashboard = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { data: hospitalsData = [], isLoading: hospitalsIsLoading } = useQuery({
    queryKey: ["Hospitals-Data"],
    queryFn: getAllHospitals,
  });

  const { data: usersData, isLoading: usersIsLoading } = useQuery({
    queryKey: ["users-Data"],
    queryFn: () => getAllUsers(),
  });
  const { data: DoctorsData, isLoading: DoctorsIsLoading } = useQuery({
    queryKey: ["Doctors-Data"],
    queryFn: () => getAllDoctors(),
  });
  const { data: HomeVisitData, isLoading: HomeVisitIsLoading } = useQuery({
    queryKey: ["HomeVisit-Data"],
    queryFn: () => getAllHomeVisit(),
  });

  const reverseSmallGridCols =
    direction === "rtl"
      ? "xl:grid-cols-6 xl:flex-row-reverse"
      : "xl:grid-cols-6";
  if (
    hospitalsIsLoading ||
    usersIsLoading ||
    DoctorsIsLoading ||
    HomeVisitIsLoading
  )
    return <Loader />;
  return (
    <>
      <section className="container mx-auto ">
        <div dir={direction} className="w-full flex flex-col gap-4 ">
          <TodaySales />
          <ReviewsReport
            HomeVisitData={HomeVisitData}
            DoctorsData={DoctorsData}
            usersData={usersData}
            HospitalsData={hospitalsData}
          />

          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6 p-4`}
          >
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <HospitalsReport hospitalsData={hospitalsData} />
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <StateAndCitiesReport />
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6 p-4`}
          >
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <CancelledReport
                hospitalsData={HomeVisitData}
                doctorsData={DoctorsData}
                usersData={usersData}
                HospitalsData={hospitalsData}
              />
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <HomeVisitReporteport
                hospitalsData={HomeVisitData}
                doctorsData={DoctorsData}
                usersData={usersData}
                HospitalsData={hospitalsData}
              />
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6 p-4`}
          >
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <UsersReport
                hospitalsData={HomeVisitData}
                doctorsData={DoctorsData}
                usersData={usersData}
                HospitalsData={hospitalsData}
              />
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm ">
              <DoctorReport
                hospitalsData={HomeVisitData}
                doctorsData={DoctorsData}
                HospitalsData={hospitalsData}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
