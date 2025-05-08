/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminMessages, fetchAdminUsersList } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { useUser } from "../chatcontext/UserContext";
import { mainLogo } from "../../src/assets";
import AdminChatList from "./AdminChatList";
import Skeleton from "@mui/material/Skeleton";

const AdminChat = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const chatContainerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { selectedUser, setSelectedUser } = useUser();

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    queryClient.invalidateQueries(["messages"]);
  };

  const { data: usersData, isLoading: usersIsLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: () => fetchAdminUsersList({ token }),
    enabled: !!token,
  });

  useEffect(() => {
    if (usersData?.length && !selectedUser) {
      const reversedUsers = usersData.slice();
      setSelectedUser(reversedUsers[0].chat_id);
    }
  }, [usersData, selectedUser]);

  const {
    data: initialMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", selectedUser],
    queryFn: () => getAdminMessages({ token, id: selectedUser }),
    enabled: !!selectedUser,
  });

  const AdminChatSkeleton = () => (
    <section dir={direction}>
      <div className="w-full mx-auto container flex flex-col">
        <div className="flex m-4 md:gap-6 gap-0">
          <div className="md:w-1/4 w-full">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              className="mb-2 rounded-md"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              className="mb-2 rounded-md"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              className="mb-2 rounded-md"
            />
          </div>
          <div className="md:w-3/4 w-full relative lg:p-8 md:p-6 p-4 bg-white rounded-md">
            <div className="flex-grow h-[80vh] overflow-auto">
              <div className="grid pb-11 p-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className={`flex gap-2.5 mb-4 ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      className="shrink-0"
                    />
                    <div className="grid w-full">
                      <Skeleton
                        variant="text"
                        width="20%"
                        height={20}
                        className="mb-1"
                      />
                      <Skeleton
                        variant="rectangular"
                        width="60%"
                        height={50}
                        className="rounded-xl"
                      />
                      <Skeleton
                        variant="text"
                        width="10%"
                        height={15}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (isLoading || usersIsLoading) {
    return <AdminChatSkeleton />;
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col justify-center items-center text-red-500">
        <p>حدث خطأ أثناء تحميل الرسائل. يرجى المحاولة لاحقًا.</p>
        <button
          onClick={() =>
            queryClient.invalidateQueries(["messages", selectedUser])
          }
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <section dir={direction}>
      <div className="w-full mx-auto container flex flex-col">
        <div className="flex m-4 md:gap-6 gap-0">
          {usersData && (
            <AdminChatList
              users={usersData}
              selectedUser={selectedUser}
              onSelectUser={handleUserSelect}
            />
          )}
          <div className="md:w-3/4 w-full relative lg:p-8 md:p-6 p-4 bg-white rounded-md">
            <div
              ref={chatContainerRef}
              className="flex-grow h-[80vh] overflow-auto"
            >
              <div className="grid pb-11 p-4">
                {initialMessages?.messages?.length > 0 ? (
                  initialMessages?.messages?.map((message) => (
                    <div
                      key={message.id || message.created_at}
                      className={`flex gap-2.5 mb-4 ${
                        message.send_from === "user"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      {message.send_from === "user" && (
                        <img
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0"
                          src={message.admin_image || mainLogo}
                          alt="Admin"
                        />
                      )}

                      <div className="grid">
                        <h5
                          className={`text-md font-semibold leading-snug pb-1 ${
                            message.send_from === "customer_service"
                              ? "text-right"
                              : "text-gray-900"
                          }`}
                        >
                          {message.send_from === "user"
                            ? initialMessages.user_name || "User"
                            : initialMessages.customer_service_name || "Admin"}
                        </h5>
                        <div
                          className={`px-3.5 py-2 inline-flex ${
                            message.send_from === "customer_service"
                              ? "bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] rounded-tl-full rounded-b-full rounded-xl text-white"
                              : "bg-gradient-to-bl from-[#33A9C7] to-[#3a96ab] text-white rounded-tr-full rounded-b-full rounded-xl"
                          }`}
                        >
                          <h5 className="md:text-md text-sm font-normal leading-snug">
                            {message.content}
                          </h5>
                        </div>
                        <div
                          className={`inline-flex ${
                            message.send_from === "customer_service"
                              ? "justify-end"
                              : "justify-end"
                          } items-center`}
                        >
                          <h6 className="text-gray-500 md:text-sm text-xs font-normal leading-4 py-1">
                            {message.created_at &&
                            !isNaN(new Date(message.created_at))
                              ? new Intl.DateTimeFormat("ar-eg", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }).format(new Date(message.created_at))
                              : "N/A"}
                          </h6>
                        </div>
                      </div>

                      {message.send_from === "customer_service" && (
                        <img
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0"
                          src={message.user_image || mainLogo}
                          alt="Customer Service"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-[70vh] flex justify-center items-center text-red-500">
                    <p>عذرا لا يوجد رسائل لعرضها</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminChat;