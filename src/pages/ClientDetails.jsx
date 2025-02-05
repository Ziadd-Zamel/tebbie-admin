import React, { useState, useRef, useEffect } from "react";
import { profile } from "../assets";
import { useTranslation } from "react-i18next";
import Devices from "../components/customers/Devices";
import Maintenance from "../components/Invoices/Maintenance";
import CustomerMaintenance from "../components/customers/CustomerMaintenance";
import CustomerStore from "../components/customers/CustomerStore";

const ClientDetails = () => {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState("devices");

  // Create refs for each button
  const devicesRef = useRef(null);
  const maintenanceRef = useRef(null);
  const storeRef = useRef(null);

  // State to track the underline style (width and position)
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });

  // Update the underline width and position whenever the active section changes
  useEffect(() => {
    const updateUnderline = () => {
      const activeButton =
        activeSection === "devices"
          ? devicesRef.current
          : activeSection === "maintenance"
          ? maintenanceRef.current
          : storeRef.current;

      if (activeButton) {
        setUnderlineStyle({
          width: activeButton.offsetWidth,
          left: activeButton.offsetLeft,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline); // Adjust on window resize

    return () => {
      window.removeEventListener("resize", updateUnderline); // Clean up listener
    };
  }, [activeSection, i18n.language]);

  return (
    <section className="flex container mx-auto justify-center h-full py-10">
      <div
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className="w-full bg-white rounded-2xl py-10"
      >
        <div className="grid gap-12 lg:grid-cols-12 md:grid-cols-6 grid-cols-1 max-w-7xl mx-auto p-4">
          {/* Sidebar */}
          <div className="lg:col-span-3 md:col-span-2 col-span-1 h-auto lg:h-screen border-[1px] bg-gradient-to-tr from-[#D7F0EF] to-[#F2FAFA] rounded-xl border-primary p-6 font-semibold">
            {/* Profile details */}
            <div className="flex flex-col items-center space-y-2">
              <img
                src={profile}
                className="rounded-full bg-cover w-28 h-28"
                alt={t("profileImageAlt")}
              />
              <p className="font-semibold">{t("name")}</p>
              <p className="text-lg">إبراهيم علي السيد</p>
            </div>
            <div className="bg-[#E1E8E7] h-[1px] w-full my-3"></div>
            {/* More info */}
            <div className="text-md my-8 space-y-1">
              <p>{t("phone")}</p>
              <p>0123456789</p>
            </div>
            <div className="text-md my-8 space-y-1">
              <p>{t("email")}</p>
              <p>Ibrahim@example.com</p>
            </div>
            <div className="text-md my-8 space-y-1">
              <p>{t("address")}</p>
              <p>عباس العقاد - مدينة نصر</p>
            </div>
          </div>

          {/* Main section */}
          <div className="lg:col-span-9 md:col-span-4 col-span-1">
            <div className="relative flex md:gap-4 gap-1 py-3 flex-wrap md:text-xl text-md">
              {/* Navigation Buttons */}
              <button
                ref={devicesRef}
                onClick={() => setActiveSection("devices")}
                className={`${
                  activeSection === "devices"
                    ? "relative px-3 py-2 font-bold text-center"
                    : "relative font-semibold text-center px-3 py-2"
                }`}
              >
                {t("devices")}
              </button>
              <button
                ref={maintenanceRef}
                onClick={() => setActiveSection("maintenance")}
                className={`${
                  activeSection === "maintenance"
                    ? "relative px-3 py-2 font-bold text-center"
                    : "relative font-semibold text-center px-3 py-2"
                }`}
              >
                {t("maintenance")}
              </button>
              <button
                ref={storeRef}
                onClick={() => setActiveSection("store")}
                className={`${
                  activeSection === "store"
                    ? "relative px-4 py-2 text-xl text-center font-bold"
                    : "relative font-semibold text-center px-4 py-2"
                }`}
              >
                {t("store")}
              </button>

              {/* Underline animation */}
              <div className="relative w-full border-b-[2px] border-gray-200 mt-1">
                <div
                  className="absolute rounded-xl h-[2px] bg-primary transition-all duration-300"
                  style={{
                    width: `${underlineStyle.width}px`,
                    left: `${underlineStyle.left}px`,
                  }}
                ></div>
              </div>
            </div>

            {/* Conditional Sections */}
            {activeSection === "devices" && <Devices />}

            {activeSection === "maintenance" && <CustomerMaintenance />}

            {activeSection === "store" && <CustomerStore />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientDetails;
