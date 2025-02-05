import { useTranslation } from "react-i18next";
import SpecializationsForm from "../components/SpecializationsForm";

const AddSpecial = () => {
      const { i18n } = useTranslation();
  
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section dir={direction}>
      <SpecializationsForm mode="add" isLoading={false} />
    </section>
  );
};

export default AddSpecial;
