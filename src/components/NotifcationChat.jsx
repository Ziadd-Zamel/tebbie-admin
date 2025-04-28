import { useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase/config"
import { toast } from "react-toastify";

const NotifcationChat = () => {
  useEffect(() => {
    const messagesRef = ref(rtdb, "messages");

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      console.log(messages)
      if (messages) {
        Object.values(messages).forEach((message) => {
          toast.info(`رسالة جديدة: ${message.content}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default NotifcationChat;
