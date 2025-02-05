import { useTranslation } from "react-i18next";
import LabTypesForm from "./LabTypesForm";

const AddLabType = () => {
      const { i18n } = useTranslation();
  
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section dir={direction}>
      <LabTypesForm mode="add" isLoading={false} />
    </section>
  );
};

export default AddLabType;
