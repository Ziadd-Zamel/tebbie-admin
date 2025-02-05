import { useParams } from "react-router-dom";
import { getSpecificLab } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import LabForm from "../components/LabForm";

const UpdateLab = () => {
  const { labId } = useParams();
  const token = localStorage.getItem("authToken");
  const {
    data: labData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["lab-details", labId],
    queryFn: () => getSpecificLab({ id: labId, token }),
  });
  return (
    <section>
      <LabForm
        initialData={labData}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateLab;
