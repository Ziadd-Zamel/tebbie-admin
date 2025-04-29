import { Link, useNavigate } from "react-router-dom";
import { ashraf } from "../../assets";
import { getUser } from "../../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "formik";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthContext } from "../../_auth/authContext/JWTProvider";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
const Profile = () => {
  const token = localStorage.getItem("authToken");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const {
    data: userdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUser({ token }),
  });
  const [openDialog, setOpenDialog] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Handle opening the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }

  return (
    <div className="flex items-center shrink-0">
      <div
        className="flex items-center border-[3px] border-primary transition-transform transform-gpu duration-300 ease-in-out rounded-full hover:scale-105 hover:shadow-lg delay-75 mx-2 lg:mx-5 shrink-0 cursor-pointer"
        onClick={handleClick}
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <img
          src={userdata?.media_url || ashraf}
          alt={userdata?.name}
          className="w-10 lg:w-14 h-10 lg:h-14 rounded-full object-cover shrink-0"
        />
      </div>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "profile-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          <PersonIcon sx={{ mr: 1 }} /> {t("profile")}
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          <LogoutIcon sx={{ mr: 1 }} /> {t("logout")}
        </MenuItem>
      </Menu>
      <Dialog
        open={openDialog}
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
            onClick={handleCloseDialog}
            sx={{
              color: "#329683",
              width: "100%",
              border: "1px solid  #329683",
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
              width: "100%",
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
    </div>
  );
};

export default Profile;
