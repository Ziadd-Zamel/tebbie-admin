/* eslint-disable react-hooks/exhaustive-deps */
import { IoIosSend } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, getUsers, closeChat } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { useUser } from "../chatcontext/UserContext";
import UserList from "../components/UserList";
import { mainLogo } from "../../src/assets";
import { toast } from "react-toastify";
import { Tabs, Tab, Box } from "@mui/material";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const token = localStorage.getItem("authToken");
  const wss_token = localStorage.getItem("wss_token");
  const queryClient = useQueryClient();
  const chatContainerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { selectedUser, setSelectedUser } = useUser();
  const socketRef = useRef(null);
  const [isCloseChatInputVisible, setIsCloseChatInputVisible] = useState(false);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    queryClient.invalidateQueries(["messages"]);
  };

  const { data: usersData, isLoading: usersIsLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: () => getUsers({ token }),
    enabled: !!token,
  });

  const selectedChat = usersData?.find((chat) => chat.chat_id === selectedUser);
  const isChatClosed = selectedChat?.status === "closed";

  const {
    data: initialMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", selectedUser],
    queryFn: () => getMessages({ token, id: selectedUser }),
    enabled: !!selectedUser,
  });

  const closeChatMutation = useMutation({
    mutationFn: closeChat,
    onSuccess: () => {
      queryClient.invalidateQueries(["users-list"]);
      setIsCloseChatInputVisible(false);
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      setSelectedUser(null);
      toast.success("تم قفل المحادثة بنجاح");
    },
    onError: (error) => {
      console.error("Error closing chat:", error);
      toast.error(`حدث خطأ ما ${error}`);
    },
  });

  const handleCloseChatClick = () => {
    setIsCloseChatInputVisible(true);
  };

  const handleSubmitSubject = () => {
    closeChatMutation.mutate({
      token,
      chat_id: selectedUser,
    });
  };

  useEffect(() => {
    setMessages([]);
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser || !wss_token || !usersData || isChatClosed) return;
    const selectedChat = usersData.find(
      (chat) => chat.chat_id === selectedUser
    );
    const userId = selectedChat?.user?.id;

    const socketUrl = `wss://tabi-chat.evyx.lol/comm/?wss_token=${wss_token}&user_type=customer_service&chat_id=${selectedUser}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;
    socket.onopen = () => {};

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isFromUser = data.sender.id === userId;
        const newMessage = {
          id: data.id,
          chat_id: parseInt(data.chat_id),
          user_id: data.sender.id,
          type: data.type === 0 ? "text" : data.type,
          content: data.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          from_me: !isFromUser,
          message_from: isFromUser ? "user" : "admin",
          user_image: isFromUser
            ? selectedChat?.user?.image || "/default-user.png"
            : null,
          admin_image: isFromUser ? null : mainLogo,
        };
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg.id === newMessage.id
          );
          return isDuplicate ? prevMessages : [...prevMessages, newMessage];
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {};
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [selectedUser, wss_token, usersData]);

  useEffect(() => {
    if (initialMessages) {
      const formattedOldMessages = initialMessages.map((message) => ({
        id: message.id,
        chat_id: message.chat_id,
        user_id: message.user_id,
        type: message.type,
        content: message.content,
        created_at: message.created_at,
        updated_at: message.updated_at,
        from_me: message.from_me,
        message_from: message.sender ? "admin" : "user",
        user_image: message.user_image || "/default-user.png",
        admin_image: message.admin_image || mainLogo,
      }));

      setMessages((prevMessages) => {
        const oldMessagesIds = formattedOldMessages.map((msg) => msg.id);
        const newUniqueMessages = prevMessages.filter(
          (msg) => !oldMessagesIds.includes(msg.id)
        );
        return [...formattedOldMessages, ...newUniqueMessages].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      });
    }
  }, [initialMessages, selectedUser]);

  useEffect(() => {
    if (isChatClosed) {
      socketRef.current = null;
    }
  }, [isChatClosed]);

  const handleSendClick = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        msg: messageText,
      };
      socketRef.current.send(JSON.stringify(messagePayload));
      setMessageText("");
    } else {
      console.error("WebSocket not connected. Cannot send message.");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const filteredUsers = usersData?.filter((user) => {
    if (tabValue === 1) {
      return user.status == "closed";
    } else {
      return user.status === "active";
    }
  });
  useEffect(() => {
    if (filteredUsers?.length && !selectedUser) {
      setSelectedUser(filteredUsers[0].chat_id);
    }
  }, [filteredUsers, selectedUser]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedUser(null);
  };

  return (
    <section dir={direction}>
      <div className="w-full mx-auto container flex flex-col">
        <Box sx={{ borderBottom: "none" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="chat tabs"
            centered
            sx={{
              "& .MuiTabs-indicator": { display: "none" },
            }}
          >
            <Tab
              label="المحادثات النشطة"
              sx={{
                "&.Mui-selected": {
                  backgroundImage:
                    "linear-gradient(to bottom left, #3a96ab , #33A9C7)",
                  borderRadius: "1rem",
                  color: "#fff",
                },
                color: "#000",
                borderRadius: "1rem",
                margin: "0 8px",
                fontWeight: 700
        }}
            />
            <Tab
              label="المحادثات المغلقة"
              sx={{
                "&.Mui-selected": {
                  backgroundImage:
                    "linear-gradient(to bottom left, #33A9C7, #3a96ab)",
                  borderRadius: "1rem",
                  color: "#fff",
                },
                color: "#000",
                borderRadius: "1rem",
                margin: "0 8px",
                fontWeight: 700,
              }}
            />
          </Tabs>
        </Box>
        <div className="flex m-4 md:gap-6 gap-0">
          {filteredUsers && (
            <UserList
              users={filteredUsers}
              selectedUser={selectedUser}
              onSelectUser={handleUserSelect}
            />
          )}
          <div className="md:w-3/4 w-full relative lg:p-8 md:p-6 p-4 bg-white rounded-md">
            <div className="w-full flex justify-end my-4">
              {!isChatClosed && selectedUser && (
                <button
                  onClick={handleCloseChatClick}
                  className="bg-red-600 hover:bg-red-400 text-white rounded-full p-2"
                >
                  انهاء المحادثة
                </button>
              )}
            </div>
            {isCloseChatInputVisible && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={handleSubmitSubject}
                  disabled={closeChatMutation.isLoading}
                  className="bg-blue-600 hover:bg-blue-400 text-white rounded-full p-2 w-28"
                >
                  {closeChatMutation.isLoading ? "جاري التأكيد..." : "تأكيد"}
                </button>
                <button
                  onClick={() => setIsCloseChatInputVisible(false)}
                  className="bg-gray-600 hover:bg-gray-400 text-white rounded-full p-2 w-28"
                >
                  إلغاء
                </button>
              </div>
            )}
            <div
              ref={chatContainerRef}
              className="flex-grow h-[80vh] overflow-auto"
            >
              <div className="grid pb-11 p-4">
                {isLoading || usersIsLoading ? (
                  <div className="h-[70vh] flex justify-center items-center">
                    <Loader />
                  </div>
                ) : error ? (
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
                ) : messages?.length > 0 ? (
                  messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2.5 mb-4 ${
                        message.from_me ? "justify-start" : "justify-end"
                      }`}
                    >
                      {message.from_me && (
                        <img
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0"
                          src={message?.admin_image}
                        />
                      )}
                      <div className="grid">
                        <h5
                          className={`text-md font-semibold leading-snug pb-1 ${
                            message.from_me ? "text-right" : "text-gray-900"
                          }`}
                        >
                          {message.from_me ? "admin" : "User"}
                        </h5>
                        <div
                          className={`px-3.5 py-2 inline-flex ${
                            message.from_me
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
                            message.from_me ? "justify-end" : "justify-end"
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
                      {message.user_image === "user" && (
                        <img
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0"
                          src={message.user_image}
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
            <div className="w-full bg-white absolute bottom-2 left-0 pl-3 pr-1 py-2 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between">
              <div className="flex items-center gap-2 text-primary w-full">
                <CgProfile size={30} />
                <input
                  className="grow shrink basis-0 text-black text-lg font-medium leading-4 w-full focus:outline-none bg-transparent"
                  placeholder="Type here..."
                  value={messageText}
                  disabled={isChatClosed}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={
                    !socketRef.current ||
                    isChatClosed ||
                    socketRef.current.readyState !== WebSocket.OPEN
                  }
                  onClick={handleSendClick}
                  className="items-center flex px-3 py-2 bg-primary rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoIosSend size={30} color="white" />
                  <h3 className="text-white text-sm font-semibold leading-4 px-2">
                    {t("Send")}
                  </h3>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPage;