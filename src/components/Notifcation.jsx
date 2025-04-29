import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdNotificationsOutline } from "react-icons/io";
import Loader from "../pages/Loader";
import { getNotification } from "../utlis/https";
import { useUser } from "../chatcontext/UserContext";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const token = localStorage.getItem("authToken");
  const { setSelectedUser } = useUser();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const {
    data: notifications = [], // Default to empty array to avoid undefined
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications", token],
    queryFn: () => getNotification({ token }),
  });
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getNotificationDate = (createdAt, language) => {
    const today = new Date();
    const notificationDate = new Date(createdAt);

    const diffInTime =
      today.setHours(0, 0, 0, 0) - notificationDate.setHours(0, 0, 0, 0);
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    const locale = language === "ar" ? "ar-EG" : "en-US";

    if (diffInDays === 0) {
      return language === "ar"
        ? `اليوم - ${notificationDate.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : `Today - ${notificationDate.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
    } else if (diffInDays === 1) {
      return language === "ar" ? "أمس" : "Yesterday";
    } else {
      return notificationDate.toLocaleDateString(locale);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (userId) => {
    setSelectedUser(userId);
    navigate("/chat");
  };

  return (
    <div ref={dropdownRef} dir={direction} className="relative  z-50">
      <button
        className="bg-[#FFFAF1] rounded-[8px] p-4 relative"
        onClick={toggleDropdown}
      >
        <IoMdNotificationsOutline color="#FFA412" size={30} />
      </button>
      {isOpen && (
        <div className="absolute top-full end-0 mt-2 w-[370px] bg-white shadow-lg rounded-xl overflow-hidden z-50 h-96 overflow-y-auto">
          <h1 className="p-6">{t("notification")}</h1>
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">
                {t("errorMessage") || "Failed to load notifications"}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {t("noNotifications") || "No notifications available"}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.user_id)}
                  className="px-4 py-6 relative hover:bg-Secondary cursor-pointer"
                >
                  <div className="flex items-center space-x-4 px-4">
                    <span className="p-4 rounded-full bg-[#E9EBF8] ml-4">
                      <IoMdNotificationsOutline
                        className="text-primary"
                        size={24}
                      />
                    </span>
                    <div>
                      <div className="font-bold py-2">{notification.title}</div>
                      <div className="text-sm text-gray-600">
                        {notification.body}
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-2 end-2 text-sm text-gray-500">
                    {getNotificationDate(
                      notification.created_at,
                      i18n.language
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#EB5757]"></span>
    </div>
  );
};

export default NotificationDropdown;