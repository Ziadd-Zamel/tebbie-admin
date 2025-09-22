import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./global.css";
import Login from "./_auth/Login";
import RootLayout from "./pages/RootLayout";
import Financial from "./pages/Financial";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import AddHospital from "./pages/AddHospital";
import Doctors from "./pages/Doctors";
import UpdateHospital from "./pages/UpdateHospital";
import DoctorDetails from "./pages/DoctorDetails";
import UpdateDoctor from "./pages/UpdateDoctor";
import AddDoctor from "./pages/AddDoctor";
import Sliders from "./pages/Sliders";
import UpdateSlider from "./pages/UpdateSlider";
import AddSlider from "./pages/AddSlider";
import CommonQuestions from "./pages/CommonQuestions";
import UpdateCommonQuestions from "./pages/UpdateCommonQuestions";
import AddQuestion from "./pages/AddQuestion";
import Cities from "./pages/Cities";
import UpdateCity from "./pages/UpdateCity";
import AddCity from "./pages/AddCity";
import States from "./pages/States";
import TrashedHospital from "./pages/TrashedHospital";
import TrashedDoctor from "./pages/TrashedDoctor";
import TrashedState from "./pages/TrashedState";
import TrashedCity from "./pages/TrashedCity";
import RechargeCards from "./pages/RechargeCards";
import AddCard from "./pages/AddCard";
import Settings from "./pages/Settings";
import EditSetting from "./pages/EditSetting";
import AddSetting from "./pages/AddSetting";
import { AuthMiddleware, GuestMiddleware } from "./middlewares/authMiddleware";
import ChatPage from "./pages/ChatPage";
import Specializations from "./pages/Specializations";
import UpdateSpecial from "./pages/UpdateSpecial";
import AddSpecial from "./pages/AddSpecial";
import Coupons from "./pages/Coupons";
import Employees from "./pages/Employees";
import UpdateEmployee from "./pages/UpdateEmployee";
import RequestForm from "./pages/RequestForm";
import Services from "./pages/Services";
import HospitalServices from "./pages/HospitalServices";
import AddHospitalService from "./pages/AddHospitalService";
import UpdateHospitalService from "./pages/UpdateHospitalService";
import AddService from "./pages/AddService";
import UpdateService from "./pages/UpdateService";
import { UserProvider } from "./chatcontext/UserContext";
import HospitalLayout from "./pages/HospitalLayout";
import Refunds from "./pages/Refunds";
import RefundsDetails from "./pages/RefundsDetails";
import NotFound from "./pages/NotFound";
import CustomerService from "./pages/CustomerService/CustomerService";
import UpdateCustomerService from "./pages/CustomerService/UpdateCustomerService";
import AddCustomerService from "./pages/CustomerService/AddCustomerService";
import { ChatOnlyMiddleware } from "./middlewares/ChatOnlyMiddleware";
import ChatLayout from "./pages/ChatLayout";
import useFirebaseNotifications from "./hooks/useFirebaseNotifications";
import SendNotification from "./pages/SendNotification";
import AdminChat from "./pages/AdminChat";
import HospitalReportDetails from "./pages/HospitalReportDetails";
import TermsAndConditions from "./pages/TermsAndConditions";
import HomeVisitReportPage from "./pages/HomeVisitReportPage";
import UserseportPage from "./pages/UserReportPage";
import WhatsappPage from "./pages/WhatsappPage";
import TebbieCommunication from "./pages/TebbieCommunication";
import TebbieWallet from "./pages/TebbieWallet";
import HospitalWallet from "./pages/HospitalWallet";
import HomeVisitServices from "./pages/HomeVisitServices";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthMiddleware />,
    children: [
      {
        path: "",
        element: <RootLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: "hospital-report/:hosId",
            element: <HospitalReportDetails />,
          },
          {
            path: "/whatsapp",
            element: <WhatsappPage />,
          },
          {
            path: "/tebbie-communication",
            element: <TebbieCommunication />,
          },
          {
            path: "/tebbie-wallet",
            element: <TebbieWallet />,
          },
          {
            path: "/hospital-wallet",
            element: <HospitalWallet />,
          },
          {
            path: "/home-visit-services",
            element: <HomeVisitServices />,
          },
          {
            path: "/home-visit-report/:serviceId",
            element: <HomeVisitReportPage />,
          },
          {
            path: "/users-report/:userid",
            element: <UserseportPage />,
          },
          {
            path: "doctors",
            children: [
              { index: true, element: <Doctors /> },
              { path: ":doctorId", element: <DoctorDetails /> },
              { path: "update-doctor/:doctorId", element: <UpdateDoctor /> },
              { path: "add-doctor", element: <AddDoctor /> },
              { path: "trashed-doctors", element: <TrashedDoctor /> },
            ],
          },
          {
            path: "hospitals",
            element: <HospitalLayout />,

            children: [
              { index: true, element: <Hospitals /> },
              {
                path: "update-hospital/:HospitalId",
                element: <UpdateHospital />,
              },
              { path: ":HospitalId", element: <HospitalDetails /> },
              { path: "trashed-hospitals", element: <TrashedHospital /> },
              { path: "add-hospital", element: <AddHospital /> },
            ],
          },
          {
            path: "services",
            children: [
              { index: true, element: <Services /> },
              { path: ":servId", element: <UpdateService /> },
              { path: "add-service", element: <AddService /> },
            ],
          },
          {
            path: "hospital-services",
            children: [
              { index: true, element: <HospitalServices /> },
              { path: "add", element: <AddHospitalService /> },
              { path: ":id", element: <UpdateHospitalService /> },
            ],
          },
          {
            path: "clinics",
            children: [
              { index: true, element: <Employees /> },
              { path: ":clinId", element: <UpdateEmployee /> },
            ],
          },
          { path: "admin-chat", element: <AdminChat /> },
          {
            path: "specializations",
            children: [
              { index: true, element: <Specializations /> },
              { path: ":spId", element: <UpdateSpecial /> },
              { path: "add", element: <AddSpecial /> },
            ],
          },
          { path: "/send-notification", element: <SendNotification /> },

          { path: "coupons", element: <Coupons /> },
          { path: "financial", element: <Financial /> },
          {
            path: "recharge-card",
            children: [
              { index: true, element: <RechargeCards /> },
              { path: "add-card", element: <AddCard /> },
            ],
          },
          {
            path: "common-questions",
            children: [
              { index: true, element: <CommonQuestions /> },
              { path: ":questionId", element: <UpdateCommonQuestions /> },
              { path: "add-question", element: <AddQuestion /> },
            ],
          },
          {
            path: "cities",
            children: [
              { index: true, element: <Cities /> },
              { path: ":cityId", element: <UpdateCity /> },
              { path: "add-city", element: <AddCity /> },
              { path: "trashed-cities", element: <TrashedCity /> },
            ],
          },
          {
            path: "customer-service",
            children: [
              { index: true, element: <CustomerService /> },
              { path: ":customerId", element: <UpdateCustomerService /> },
              { path: "add-customer-service", element: <AddCustomerService /> },
            ],
          },
          { path: "profile", element: <Profile /> },
          {
            path: "sliders",
            children: [
              { index: true, element: <Sliders /> },
              { path: ":sliderId", element: <UpdateSlider /> },
              { path: "add-slider", element: <AddSlider /> },
            ],
          },
          {
            path: "states",
            children: [
              { index: true, element: <States /> },
              { path: "trashed-state", element: <TrashedState /> },
            ],
          },
          {
            path: "settings",
            children: [
              { index: true, element: <Settings /> },
              { path: ":settingId", element: <EditSetting /> },
              { path: "add", element: <AddSetting /> },
            ],
          },
          { path: "request-Form", element: <RequestForm /> },
          { path: "terms", element: <TermsAndConditions /> },
          {
            path: "refunds",
            children: [
              { index: true, element: <Refunds /> },
              { path: ":refundsId", element: <RefundsDetails /> },
            ],
          },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
  {
    path: "auth/login",
    element: <GuestMiddleware />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/chat",
    element: <ChatOnlyMiddleware />,
    children: [
      {
        path: "",
        element: <ChatLayout />,
        children: [
          { index: true, element: <ChatPage /> },
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
  },
]);

function App() {
  useFirebaseNotifications();

  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </QueryClientProvider>
    </main>
  );
}

export default App;
