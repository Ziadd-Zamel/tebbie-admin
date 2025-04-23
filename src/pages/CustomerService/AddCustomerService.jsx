import { useTranslation } from "react-i18next";
import CustomerServiseForm from "../../components/CustomerServiseForm";

const AddCustomerService = () => {
  const { i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <section dir={direction}>
      <CustomerServiseForm mode="add" isLoading={false} />
    </section>
  );
};

export default AddCustomerService;
