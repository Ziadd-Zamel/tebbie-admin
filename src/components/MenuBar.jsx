import React, { useEffect, useState } from "react";
import { sidebarLinks, therestofSidebarLinks } from "./Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ashraf, mainLogo } from "../assets";
import { IoMdLogOut } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../_auth/authContext/JWTProvider";

const MenuBar = ({ pageName }) => {
  const { i18n, t } = useTranslation();
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const { logout } = useAuthContext();
  const handleLogut = async () => {
    try {
      await logout(); 
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const isActiveclassMenu =
    "flex justify-start px-4 py-3 text-xl rounded-[8px] text-center text-primary";
  const isNotActiveclassMenu =
    "flex justify-start px-4 py-3 text-xl rounded-[8px] text-center text-black hover:text-white hover:bg-[#5CB2AF]";
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const textAlignment = direction === "rtl" ? "text-right" : "text-left";
  const marginLeftRight = direction === "rtl" ? "ml-4" : "mr-4";

  const translatedPageName = t(pageName);
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Sidebar for Mobile */}
      <div className="lg:hidden ">
        <div className="flex items-center justify-between p-6 ">
          <div className="flex gap-4">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`text-lg ${
                direction === "rtl" ? "ml-auto" : "mr-auto"
              }`}
            >
              <FaBars color={"#02A09B"} size={30} />
            </button>
            <Link
              className={`flex items-center border-2 border-primary rounded-full transition-transform transform-gpu duration-300 ease-in-out  hover:scale-110 hover:shadow-lg delay-75 shrink-0 ${
                direction === "rtl" ? "ml-4" : "mr-4"
              }`}
              to="/profile"
            >
              <img
                src={ashraf}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
            </Link>
          </div>
          <div
            className={`text-xl almarai-bold text-black whitespace-nowrap ${textAlignment}`}
          >
            {translatedPageName}
          </div>
        </div>

        <aside
          dir={direction}
          className={`font-almarai almarai-medium bg-[#ffffff] text-black p-4   fixed top-0 h-screen overflow-y-auto ${
            direction === "rtl" ? "left-0" : "right-0"
          } z-50 shadow-lg rounded-3xl transition-transform duration-300
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} w-full`}
        >
          <div
            className={`flex items-center justify-between px-4 mb-6 ${textAlignment}`}
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-xl text-primary"
            >
              <FaTimes size={32} />
            </button>
            <Link to="/">
              <img
                src={mainLogo}
                alt="Logo"
                className="object-contain w-34 h-34"
              />
            </Link>
          </div>
          <div className={`relative w-full text-[#737791] ${textAlignment}`}>
            <input
              type="text"
              placeholder={t("search-placeholder")}
              className={`w-full h-16 ${
                direction === "rtl" ? "pr-14 pl-4" : "pl-14 pr-4"
              } rounded-lg text-xl focus:outline-none bg-[#F9FAFB]`}
            />
            <IoSearch
              className={`absolute ${
                direction === "rtl" ? "left-3" : "right-3"
              } top-4`}
              size={25}
            />
          </div>
          <nav className="space-y-1  text-lg  mt-4">
            <div>
              {sidebarLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? isActiveclassMenu : isNotActiveclassMenu
                  }
                >
                  <div className="flex items-center">
                    {link.icon && (
                      <span
                        className={`inline-block transition-all duration-300 ${marginLeftRight}`}
                      >
                        {link.icon}
                      </span>
                    )}
                    <span>{t(link.label)}</span>
                  </div>
                </NavLink>
              ))}
            </div>
            <div className="border-full border-t-2 mt-4">
              {therestofSidebarLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? isActiveclassMenu : isNotActiveclassMenu
                  }
                >
                  <div className="flex items-center">
                    {link.icon && (
                      <span
                        className={`inline-block transition-all duration-300 ${marginLeftRight}`}
                      >
                        {link.icon}
                      </span>
                    )}
                    <span>{t(link.label)}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </nav>
          <div className="mt-auto border-t-2">
            <button
        onClick={handleLogut}
        className={`flex justify-start items-center px-4 py-5 text-xl rounded-[8px] w-full`}
            >
              <IoMdLogOut
                size={22}
                className={`inline-block ${marginLeftRight}`}
              />
              {t("logout")}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default MenuBar;
