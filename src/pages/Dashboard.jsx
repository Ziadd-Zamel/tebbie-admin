import TodaySales from "../components/DashboardComponents/TodaySales";
import { useTranslation } from "react-i18next";
import StateAndCitiesReport from "../components/DashboardComponents/StateAndCitiesReport";
import ReviewsReport from "../components/DashboardComponents/ReviewsReport";
import CancelledReport from "../components/DashboardComponents/CancelledReport";
import DoctorReport from "../components/DashboardComponents/DoctorReport";
import HospitalsReport from "../components/DashboardComponents/HospitalsReport";
import UsersReport from "../components/DashboardComponents/UsersReport";
import HomeVisitReporteport from "../components/DashboardComponents/HomeVisitReporteport";
import HomeVisitBookingsSummary from "../components/DashboardComponents/HomeVisitBookingsSummary";
import PaymentReporte from "../components/DashboardComponents/paymentReport";

import { useQuery } from "@tanstack/react-query";
import {
  getAllHospitals,
  getAllUsers,
  getAllDoctors,
  getAllHomeVisit,
} from "../utlis/https";
import Loader from "./Loader";
import UserWalletReport from "../components/DashboardComponents/UserWalletReport";
import PermissionWrapper from "../utlis/PermissionWrapper";
import { hasPermission } from "../utlis/permissionUtils";
const Dashboard = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Check if user has permissions
  const canViewAllDoctors = hasPermission("doctors-index");
  const canViewAllUsers = hasPermission("getAllUsers");
  const canViewAllHospitals = hasPermission("getAllHospitals");
  const canViewHomeVisitServices = hasPermission("getAllHomeVisitServices");

  const { data: hospitalsData = [], isLoading: hospitalsIsLoading } = useQuery({
    queryKey: ["Hospitals-Data"],
    queryFn: getAllHospitals,
    enabled: canViewAllHospitals, // Only fetch if user has permission
  });

  const { data: usersData, isLoading: usersIsLoading } = useQuery({
    queryKey: ["users-Data"],
    queryFn: () => getAllUsers(),
    enabled: canViewAllUsers, // Only fetch if user has permission
  });
  const { data: DoctorsData, isLoading: DoctorsIsLoading } = useQuery({
    queryKey: ["Doctors-Data"],
    queryFn: () => getAllDoctors(),
    enabled: canViewAllDoctors, // Only fetch if user has permission
  });
  const { data: HomeVisitData, isLoading: HomeVisitIsLoading } = useQuery({
    queryKey: ["HomeVisit-Data"],
    queryFn: () => getAllHomeVisit(),
    enabled: canViewHomeVisitServices, // Only fetch if user has permission
  });

  const reverseSmallGridCols =
    direction === "rtl"
      ? "xl:grid-cols-6 xl:flex-row-reverse"
      : "xl:grid-cols-6";
  // If user doesn't have any required permissions, return null for all components
  if (
    !canViewAllDoctors &&
    !canViewAllUsers &&
    !canViewAllHospitals &&
    !canViewHomeVisitServices
  ) {
    return null;
  }

  if (
    (canViewAllHospitals && hospitalsIsLoading) ||
    (canViewAllUsers && usersIsLoading) ||
    (canViewAllDoctors && DoctorsIsLoading) ||
    (canViewHomeVisitServices && HomeVisitIsLoading)
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
              <PermissionWrapper
                permissionName="HospitalReport"
                hideOnNoPermission={true}
              >
                <HospitalsReport hospitalsData={hospitalsData} />
              </PermissionWrapper>
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <PermissionWrapper
                permissionName="viewStateReports"
                hideOnNoPermission={true}
              >
                <StateAndCitiesReport />
              </PermissionWrapper>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6 p-4`}
          >
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <PermissionWrapper
                permissionName="BookingReport"
                hideOnNoPermission={true}
              >
                <CancelledReport
                  doctorsData={DoctorsData}
                  usersData={usersData}
                  hospitalsData={hospitalsData}
                />
              </PermissionWrapper>
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <PermissionWrapper
                permissionName="HomeVisitReport"
                hideOnNoPermission={true}
              >
                <HomeVisitReporteport
                  hospitalsData={hospitalsData}
                  doctorsData={DoctorsData}
                  usersData={usersData}
                />
              </PermissionWrapper>
            </div>
          </div>

          <div
            className={`grid grid-cols-1 ${reverseSmallGridCols} gap-3 mt-6 p-4`}
          >
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <PermissionWrapper
                permissionName="UserReport"
                hideOnNoPermission={true}
              >
                <UsersReport
                  doctorsData={DoctorsData}
                  usersData={usersData}
                  hospitalsData={hospitalsData}
                />
              </PermissionWrapper>
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm">
              <PermissionWrapper
                permissionName="HomeVisitReport"
                hideOnNoPermission={true}
              >
                <HomeVisitBookingsSummary />
              </PermissionWrapper>
            </div>
            <div className="col-span-1 xl:col-span-3 bg-white  rounded-[20px] shadow-sm ">
              <PermissionWrapper
                permissionName="DoctorReport"
                hideOnNoPermission={true}
              >
                <DoctorReport
                  hospitalsData={hospitalsData}
                  doctorsData={DoctorsData}
                />
              </PermissionWrapper>
            </div>
          </div>
          <PermissionWrapper
            permissionName="HospitalAccountReport"
            hideOnNoPermission={true}
          >
            <PaymentReporte
              hospitalsData={hospitalsData}
              doctorsData={DoctorsData}
              usersData={usersData}
            />
          </PermissionWrapper>
          <PermissionWrapper
            permissionName="usersWithWallets"
            hideOnNoPermission={true}
          >
            <UserWalletReport />
          </PermissionWrapper>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
