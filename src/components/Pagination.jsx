import { useTranslation } from "react-i18next";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IconButton, Typography } from "@mui/material";

// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; 

  return (
    <div
      className="mt-6 flex gap-4 justify-center items-center"
      style={{ direction: isRTL ? "rtl" : "ltr" }} 
    >
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages === 0}
        sx={{
          backgroundColor: currentPage === 1 || totalPages === 0 ? "#ccc" : "#02A09B",
          color: currentPage === 1 || totalPages === 0 ? "#888" : "#fff",
          '&:hover': {
            backgroundColor: currentPage === 1 || totalPages === 0 ? "#ccc" : "#027F7F",
          },
        }}
      >
        {isRTL ? <IoIosArrowForward size={20} /> : <IoIosArrowBack size={20} />}
      </IconButton>

      <Typography variant="body1" color="text.secondary">
        {t("Page")} {currentPage} {t("of")} {totalPages}
      </Typography>

      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        sx={{
          backgroundColor: currentPage === totalPages || totalPages === 0 ? "#ccc" : "#02A09B",
          color: currentPage === totalPages || totalPages === 0 ? "#888" : "#fff",
          '&:hover': {
            backgroundColor: currentPage === totalPages || totalPages === 0 ? "#ccc" : "#027F7F",
          },
        }}
      >
        {isRTL ? <IoIosArrowBack size={25} /> : <IoIosArrowForward size={25} />}
      </IconButton>
    </div>
  );
};

export default Pagination;
