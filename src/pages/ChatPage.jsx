import { IoIosSend } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import { ErrorMessage } from "formik";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { getMessages, getUsers, postMessage } from "../utlis/https";
import { IoPersonCircle } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useUser } from "../chatcontext/UserContext";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
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
    queryKey: ["users-data"],
    queryFn: () => getUsers({ token }),
    enabled: !!token,
  });
  useEffect(() => {
    if (usersData?.length && !selectedUser) {
      const reversedUsers = usersData.slice().reverse();
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
  const { mutate: sendMessage, isLoading: isSendingMessage } = useMutation({
    mutationFn: postMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      setMessageText("");
    },
    onError: (error) => {
      console.error("Message sending failed:", error);
    },
  });

  useEffect(() => {
    if (initialMessages) {
      const messagesArray = Object.values(initialMessages)
        .filter((message) => message.user_id === selectedUser)
        .reverse();
      setMessages(messagesArray);
    }
  }, [initialMessages, selectedUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;

    const pusher = new Pusher("ffe2f6ba2a1c4cca0a31", {
      cluster: "eu",
    });

    const channel = pusher.subscribe(`chat.${selectedUser}`);

    channel.bind("new-message", (event) => {
      if (event && event.data) {
        try {
          const parsedData = JSON.parse(event.data);
          const newMessage = {
            id: parsedData.id,
            user_id: parsedData.user_id,
            message: parsedData.message,
            message_from: parsedData.message_from,
            created_at: parsedData.created_at,
            updated_at: parsedData.updated_at,
          };

          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (msg) => msg.id === newMessage.id
            );
            return isDuplicate ? prevMessages : [...prevMessages, newMessage];
          });
        } catch (error) {
          console.error("Error parsing new message data:", error);
        }
      }
    });

    return () => {
      pusher.unsubscribe(`chat.${selectedUser}`);
    };
  }, [selectedUser]);

  if (isLoading || usersIsLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  const handleSendClick = () => {
    if (messageText.trim()) {
      sendMessage(
        { user_id: selectedUser, message: messageText, token },
        {
          onSuccess: (response) => {
            const newMessage = {
              id: response.data.id,
              user_id: selectedUser,
              user_name: response.data.user_name,
              message: messageText,
              timestamp: new Date().toISOString(),
            };
            const pusher = new Pusher("ffe2f6ba2a1c4cca0a31", {
              cluster: "eu",
            });
            const channel = pusher.subscribe(`chat.${selectedUser}`);
            channel.trigger("new-message", newMessage);
            setMessageText("");
          },
        }
      );
    }
  };
  return (
    <section dir={direction}>
      <div className="w-full mx-auto container  flex flex-col">
        <div className="flex">
          <div className="w-1/4 h-[70vh] overflow-auto">
            <ul className="user-list space-y-8 text-xl text-black ">
              {usersData
                ?.slice()
                .reverse()
                .map((user) => (
                  <li
                    key={user.id}
                    className={`md:text-sm text-xs flex gap-2 cursor-pointer truncate w-auto rounded-2xl shadow-sm bg-secondary md:h-12 h-10 md:p-4 p-2 max-w-64 items-center ${
                      selectedUser === user.id ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <IoPersonCircle
                      size={30}
                      className={`shrink-0 ${
                        selectedUser === user.id
                          ? "bg-primary text-white"
                          : "text-primary"
                      }`}
                    />
                    {user.name}
                  </li>
                ))}
            </ul>
            ;
          </div>
          <div className="w-3/4 relative p-8">
            <div
              ref={chatContainerRef}
              className="flex-grow  h-[70vh] overflow-auto"
            >
              <div className="grid pb-11">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2.5 mb-4 ${
                        message.message_from === "user"
                          ? "justify-end "
                          : "justify-start"
                      }`}
                    >
                      {message.message_from === "admin" && (
                        <img
                          className="w-8 h-8 md:w-10  md:h-10 rounded-full  shrink-0"
                          src={message.admin_image}
                        />
                      )}

                      <div className="grid">
                        <h5
                          className={`text-md font-semibold leading-snug pb-1 ${
                            message.message_from === "user"
                              ? "text-right"
                              : "text-gray-900"
                          }`}
                        >
                          {message.message_from === "admin"
                            ? "admin"
                            : message.user_name}
                        </h5>
                        <div
                          className={`px-3.5 py-2 inline-flex ${
                            message.message_from === "user"
                              ? "bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] md:rounded-tr-full md:rounded-b-full rounded-xl  text-white"
                              : "bg-gradient-to-bl from-[#33A9C7] to-[#3a96ab] text-white md:rounded-tl-full md:rounded-b-full rounded-xl "
                          }`}
                        >
                          <h5 className="md:text-md text-sm font-normal leading-snug">
                            {message.message}
                          </h5>
                        </div>
                        <div
                          className={`inline-flex ${
                            message.message_from === "user"
                              ? "justify-start"
                              : "justify-end"
                          } items-center`}
                        >
                          <h6 className="text-gray-500 md:text-sm text-xs font-normal leading-4 py-1">
                            {message.message_date &&
                            !isNaN(new Date(message.message_date))
                              ? new Intl.DateTimeFormat("ar-eg", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }).format(new Date(message.message_date))
                              : "N/A"}
                          </h6>
                        </div>
                      </div>

                      {message.message_from === "user" && (
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
                  onClick={handleSendClick}
                  disabled={isSendingMessage}
                  className="items-center flex px-3 py-2 bg-primary rounded-full shadow"
                >
                  <IoIosSend size={30} color="white" />
                  <h3 className="text-white text-sm font-semibold leading-4 px-2">
                    Send
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
