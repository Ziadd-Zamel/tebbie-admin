import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import NotifcationChat from "./NotifcationChat";
import { toast } from "react-toastify";

const ChatNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("wss_token");
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج. حاول مرة أخرى.");
    }
  };

  return (
    <nav className="font-almarai md:h-[20px] my-5 lg:flex w-full px-4">
      <div className="container py-4 mx-auto flex">
        <div className="flex items-center justify-end gap-6">
          <button
            onClick={handleLogout}
            className="bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] p-2 rounded-xl text-white hover:scale-125 transition-all duration-500"
            aria-label="Logout"
          >
            <IoLogOutOutline size={30} />
          </button>
          <NotifcationChat />
        </div>
      </div>
    </nav>
  );
};

export default ChatNavBar;