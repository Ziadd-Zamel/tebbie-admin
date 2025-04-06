import { useTranslation } from "react-i18next";
import DoctorForm from "../components/DoctorForm";

const AddDoctor = () => {
  const { i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section dir={direction}>
      <DoctorForm mode="add" isLoading={false} />
    </section>
  );
};

export default AddDoctor;
