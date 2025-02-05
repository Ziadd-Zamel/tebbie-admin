import { useTranslation } from "react-i18next";
import LabForm from "../components/LabForm";

const AddLab = () => {
      const { i18n } = useTranslation();
  
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section dir={direction}>
      <LabForm mode="add" isLoading={false} />
    </section>
  );
};

export default AddLab;
