import { useTranslation } from "react-i18next";
import { Pagination as MuiPagination, PaginationItem } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// eslint-disable-next-line react/prop-types
const RechargeCardsPagination = ({ currentPage, totalPages, onPageChange }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Handle page change
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <div
      className="mt-6 flex lg:gap-4 gap-2 justify-center items-center"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        siblingCount={1} 
        boundaryCount={1} 
        disabled={totalPages === 0}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            components={{
              previous: isRTL ? IoIosArrowForward : IoIosArrowBack,
              next: isRTL ? IoIosArrowBack : IoIosArrowForward,
            }}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#02A09B",
                color: "#fff", // 
                "&:hover": {
                  backgroundColor: "#027F7F",
                },
              },
              "&.MuiPaginationItem-root:not(.Mui-selected)": {
                color: "#02A09B", 
                border: "1px solid #02A09B", 
                backgroundColor: "transparent", 
                margin: "0 4px",
              },
              "&.Mui-disabled": {
                backgroundColor: "#ccc",
                color: "#888",
                border: "1px solid #ccc",
              },
            }}
          />
        )}
      />
    </div>
  );
};

export default RechargeCardsPagination;