import React from "react";
import {  useLocation } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import Notifcation from "./Notifcation";
import MenuBar from "./MenuBar";
import LanguageDropdown from "./LanguageDropdown";
import { useTranslation } from "react-i18next";
import { pageTranslations } from "../utlis/translations";
import Profile from "./navBarComponents/Profile";

const Navbar = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const language = i18n.language;

const translatePageName = (pathname) => {
  if (pathname.startsWith("/orders/")) {
    return pageTranslations[language]["/orders/:OrderId"];
  }
  if (pathname.startsWith("/hospitals/")) {
    return pageTranslations[language]["/hospitals/:HospitalId"];
  }
  if (pathname.startsWith("/recharge-card/add-card")) {
    return pageTranslations[language]["/recharge-card/add-card"];
  }
  if (pathname.startsWith("/doctors/add-doctor")) {
    return pageTranslations[language]["/doctors/add-doctor"];
  }
  if (pathname.startsWith("/doctors/")) {
    return pageTranslations[language]["/doctors/:doctorId"];
  }
  if (pathname.startsWith("/cities/")) {
    return pageTranslations[language]["/cities/:cityId"];
  }
  if (pathname.startsWith("/sliders/")) {
    return pageTranslations[language]["/sliders/:sliderId"];
  }
  if (pathname.startsWith("/employees/")) {
    return pageTranslations[language]["/employees/:empId"];
  }
  if (pathname.startsWith("/settings/")) {
    return pageTranslations[language]["/settings/:settingId"];
  }
  
  return (
    pageTranslations[language][pathname] || pageTranslations[language].default
  );
};

  const pageName = translatePageName(location.pathname);

  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <nav
      dir={direction}
      className="bg-[#FFFFFF] font-almarai md:h-[90px] h-auto my-5 lg:flex"
    >
      <div className="container py-4 mx-auto justify-between items-center hidden lg:flex">
        <div
          className={`xl:text-4xl text-2xl almarai-bold text-black whitespace-nowrap ${
            direction === "rtl" ? "text-right" : "text-left"
          }`}
        >
          {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
        </div>

        <div
          className={`relative w-1/3 text-[#737791] ${
            direction === "rtl" ? "text-right" : "text-left"
          }`}
        >
          <input
            type="text"
            placeholder={
              direction === "rtl" ? "ابحث هنا ..." : "Search here..."
            }
            className="w-full h-16 pr-14 pl-4 rounded-lg text-xl focus:outline-none focus:border-primary bg-[#F9FAFB]"
          />
          <IoSearch
            className={`absolute ${
              direction === "rtl" ? "left-3" : "right-3"
            } top-4`}
            size={25}
          />
        </div>

        {/* Dropdown */}
        <LanguageDropdown />

        <div className="flex items-center space-x-6">
          {/* notification */}
          <Notifcation />
          {/* profile */}
        <Profile direction={direction}/>
        </div>
      </div>

      <MenuBar pageName={pageName} />
    </nav>
  );
};

export default Navbar;
