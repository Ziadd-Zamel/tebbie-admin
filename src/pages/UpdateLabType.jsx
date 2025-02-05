import { useParams } from "react-router-dom";
import LabTypesForm from "./LabTypesForm";
import { useTranslation } from "react-i18next";
import { getSpecificLabType } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";

const UpdateLabType = () => {
  const { labTypeId } = useParams();
  const { i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const token = localStorage.getItem("authToken");

  const {
    data: labestype,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["labstype-details", labTypeId],
    queryFn: () => getSpecificLabType({ id: labTypeId, token }),
  });
  console.log(labestype);

  return (
    <section dir={direction}>
      <LabTypesForm
        initialData={labestype}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateLabType;
