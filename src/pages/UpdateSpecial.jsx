import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSpecificSpecializations } from "../utlis/https";
import SpecializationsForm from "../components/SpecializationsForm";

const token = localStorage.getItem("authToken");

const UpdateSpecial = () => {
  const { spId } = useParams();

  const {
    data: specializationData,

  } = useQuery({
    queryKey: ["Specialization-details", spId],
    queryFn: () => getSpecificSpecializations({ id: spId, token }),
  });

  console.log(specializationData);

  return (
    <section className="container mx-auto p-4">
      <SpecializationsForm mode="update" initialData={specializationData} />
    </section>
  );
};

export default UpdateSpecial;
