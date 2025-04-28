import useFirebaseNotifications from "../hooks/useFirebaseNotifications";
import ChatNavBar from "../components/ChatNavBar";
import { Outlet } from "react-router-dom";

const ChatLayout = () => {
    useFirebaseNotifications();
  
  return (
    <div className={`min-h-screen w-full flex bg-[#F9FAFB]`}>
      <div className="flex-1 flex flex-col">
        {/* navbar */}
        <ChatNavBar />
        <main className="flex-1 rounded-t-[20px] ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
