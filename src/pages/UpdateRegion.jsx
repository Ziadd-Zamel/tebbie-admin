import { useParams } from "react-router-dom";
import { getRegion } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import RegionForm from "./RegionForm";

const UpdateRegion = () => {
  const { regionId } = useParams();
  const token = localStorage.getItem("authToken");

  const { data, isLoading, error } = useQuery({
    queryKey: ["region-data", regionId],
    queryFn: () => getRegion({ id: regionId, token }),
  });

  return (
    <section className="container mx-auto p-4 w-full">
      <RegionForm
        initialData={data}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateRegion;
