import { useParams } from "react-router-dom";
import HospitalServiceForm from "../components/HospitalServiceForm";
import { getHospitalServices } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";

const UpdateHospitalService = () => {
  const { id } = useParams();
  const token = localStorage.getItem("authToken");

  const { data, isLoading, error } = useQuery({
    queryKey: ["hospital-services", id, token],
    queryFn: async () => {
      const all = await getHospitalServices({ token });
      return all?.find((x) => String(x.id) === String(id));
    },
  });

  return (
    <section className="container mx-auto p-4 w-full">
      <HospitalServiceForm
        initialData={data}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateHospitalService;
