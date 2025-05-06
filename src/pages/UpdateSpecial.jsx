import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSpecificSpecializations } from "../utlis/https";
import SpecializationsForm from "../components/SpecializationsForm";

const token = localStorage.getItem("authToken");

const UpdateSpecial = () => {
  const { clinId } = useParams();

  const {
    data: specializationData,

  } = useQuery({
    queryKey: ["Specialization-details", clinId],
    queryFn: () => getSpecificSpecializations({ id: clinId, token }),
  });

  console.log(specializationData);

  return (
    <section className="container mx-auto p-4">
      <SpecializationsForm mode="update" initialData={specializationData} />
    </section>
  );
};

export default UpdateSpecial;
