/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../_auth/authContext/JWTProvider"; // Adjust path as needed
import { IoMdLogOut } from "react-icons/io";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const LogoutDialog = ({ isCollapsed }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      handleClose();
    }
  };

  return (
    <>
        <button
        onClick={handleOpen}
        className={`flex justify-start items-center px-4 py-6 text-xl w-full shrink-0 gap-2 ${
          isCollapsed ? "w-24" : "w-80"
        }`}
      >
        <IoMdLogOut size={22} className="inline-block shrink-0" />
        {!isCollapsed && <span>{t("logout")}</span>}
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        dir={t("direction") === "rtl" ? "rtl" : "ltr"}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            padding: "16px 24px",
          }}
        >
          {t("logout_confirm_title")}
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <DialogContentText
            id="logout-dialog-description"
            sx={{
              color: "#333",
              fontSize: "1.1rem",
            }}
          >
            {t("logout_confirm_message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: "#329683",
              width:"100%",
              border:"1px solid  #329683",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              padding: "6px 16px",
              borderRadius: "8px",
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleLogout}
            sx={{
              background: "linear-gradient(to bottom left, #33A9C7, #3AAB95)",
              width:"100%",
              color: "white",
              "&:hover": {
                background: "linear-gradient(to bottom left, #2B8FAF, #329683)",
              },
              padding: "6px 16px",
              borderRadius: "8px",
            }}
            autoFocus
          >
            {t("logout")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutDialog;