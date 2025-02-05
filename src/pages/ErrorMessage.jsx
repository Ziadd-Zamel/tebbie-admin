import { useTranslation } from "react-i18next";

const ErrorMessage = () => {
  const { t } = useTranslation();

  return (
      <span className="h-[70vh] w-full flex justify-center items-center text-red-500 text-center py-4 ">
        {t("errorLoadingData")}
      </span>
  );
};

export default ErrorMessage;
