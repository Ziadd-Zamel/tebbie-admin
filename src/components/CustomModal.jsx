import { useTranslation } from "react-i18next";
import { IoCloseCircle } from "react-icons/io5";

const CustomModal = ({ isOpen, onClose, title, children }) => {
  const { i18n, t } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const textAlignment = direction === "rtl" ? "text-right" : "text-left";

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300  ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-[#FFFFFF]  rounded-3xl max-w-2xl  w-full transform transition-transform duration-300 h-[80vh] overflow-auto scrollbar-hide  ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
        dir={direction} 
      >
        <div
          className={`flex items-center justify-between text-2xl font-bold mb-4 bg-[#E6F6F5] rounded-t-3xl h-[70px] w-full  ${textAlignment}`}
        >
          <div className="flex justify-between items-center w-full m-8 ">
          <h1 className={`flex items-center`}>
            {t(title)}
          </h1>
        <button  onClick={onClose} className="text-primary"    
        >
        <IoCloseCircle size={35}/>

        </button>
          </div>
        </div>
        <div
          className={`mx-auto container flex justify-center flex-col ${textAlignment}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
