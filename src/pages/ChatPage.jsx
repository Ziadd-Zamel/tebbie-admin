import { IoIosSend } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessages, getUsers } from "../utlis/https";
import { useTranslation } from "react-i18next";
import { useUser } from "../chatcontext/UserContext";
import UserList from "../components/UserList";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const token = localStorage.getItem("authToken");
  const wss_token = localStorage.getItem("wss_token");
  const queryClient = useQueryClient();
  const chatContainerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const { selectedUser, setSelectedUser } = useUser();
  const socketRef = useRef(null);

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    queryClient.invalidateQueries(["messages"]);
  };
  const { data: usersData, isLoading: usersIsLoading } = useQuery({
    queryKey: ["users-list"],
    queryFn: () => getUsers({ token }),
    enabled: !!token,
  });
  useEffect(() => {
    if (usersData?.length && !selectedUser) {
      const reversedUsers = usersData.slice();
      setSelectedUser(reversedUsers[0].id);
    }
  }, [usersData, selectedUser]);

  const {
    data: initialMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", selectedUser],
    queryFn: () => getMessages({ token, id: selectedUser }),
    enabled: !!selectedUser,
  });
  useEffect(() => {
    setMessages([]);
  }, [selectedUser]);
  useEffect(() => {
    if (!selectedUser || !wss_token) return;

    const socketUrl = `wss://tabi-chat.evyx.lol/comm/?wss_token=${wss_token}&user_type=customer_service&chat_id=${selectedUser}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected ✅");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newMessage = {
          id: data.id,
          chat_id: parseInt(data.chat_id),
          user_id: data.chat_id,
          type: data.type === 0 ? "text" : data.type,
          content: data.content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          from_me: true, // لأنك إنت الـ sender (الـ admin)
          message_from: "admin", // لأن الرسالة من الـ admin
          user_image: null, // مافيش صورة user
          admin_image: "/default-admin.png", // صورة افتراضية للـ admin
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

    socket.onclose = () => {
      console.log("WebSocket disconnected ❌");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      console.log("WebSocket URL:", socket.url);
      console.log("WebSocket readyState:", socket.readyState);
      console.log("Error details:", error);
    };
  }, [selectedUser, wss_token]);
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
        message_from: message.from_me ? "admin" : "user",
        user_image: message.user_image || "/default-user.png",
        admin_image: message.admin_image || "/default-admin.png",
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

  console.log(messages);

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

  if (isLoading || usersIsLoading) {
    return <Loader />;
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
      <div className="w-full mx-auto container  flex flex-col">
        <div className="flex m-4">
          {usersData && (
            <UserList
              users={usersData}
              selectedUser={selectedUser}
              onSelectUser={handleUserSelect}
            />
          )}
          <div className="w-3/4 relative p-8">
            <div
              ref={chatContainerRef}
              className="flex-grow  h-[80vh] overflow-auto"
            >
              <div className="grid pb-11">
                {messages?.length > 0 ? (
                  messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2.5 mb-4 ${
                        message.from_me ? "justify-start" : "justify-end"
                      }`}
                    >
                      {message.from_me === "admin" && (
                        <img
                          className="w-8 h-8 md:w-10  md:h-10 rounded-full  shrink-0"
                          src={message?.admin_image}
                        />
                      )}

                      <div className="grid">
                        <h5
                          className={`text-md font-semibold leading-snug pb-1 ${
                            message.from_me ? "text-right" : "text-gray-900"
                          }`}
                        >
                          {message.from_me === "true" ? "admin" : "User"}
                        </h5>
                        <div
                          className={`px-3.5 py-2 inline-flex ${
                            message.from_me
                              ? "bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] md:rounded-tl-full md:rounded-b-full rounded-xl  text-white"
                              : "bg-gradient-to-bl from-[#33A9C7] to-[#3a96ab] text-white md:rounded-tr-full md:rounded-b-full rounded-xl "
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

                      {message.from_me && (
                        <img
                          className="w-8 h-8 md:w-10  md:h-10 rounded-full  shrink-0"
                          src={message.user_image}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="h-[70vh] flex justify-center items-center text-red-500">
                    <p>عذرا لا يوجد رسائل لعرضها </p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-white absolute bottom-0 left-0 pl-3 pr-1 py-2 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between">
              <div className="flex items-center gap-2 text-primary w-full">
                <CgProfile size={30} />
                <input
                  className="grow shrink basis-0 text-black text-lg font-medium leading-4 w-full focus:outline-none bg-transparent"
                  placeholder="Type here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={
                    !socketRef.current ||
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
