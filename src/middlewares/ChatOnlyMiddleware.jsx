import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// في ملف authMiddleware.js
export const ChatOnlyMiddleware = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const role = +localStorage.getItem("role");
  
    useEffect(() => {
      if (!token || role !== 1) {
        navigate("/", { replace: true });
      }
    }, [token, role, navigate]);
  
    return <Outlet />;
  };
  