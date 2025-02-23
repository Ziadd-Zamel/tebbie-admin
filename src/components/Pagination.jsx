import { useTranslation } from "react-i18next";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 flex gap-2 justify-center items-center">
      <button
        className={`px-3 py-1 text-white rounded-lg bg-primary ${
          currentPage === 1 || totalPages === 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages === 0}
      >
        <IoIosArrowForward size={20} />
      </button>

      {t("Page")} {currentPage} {t("of")} {totalPages}


      <button
        className={`px-3 py-1 text-white rounded-lg bg-primary ${
          currentPage === totalPages || totalPages === 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        <IoIosArrowBack size={20} />
      </button>
    </div>
  );
};

export default Pagination;
