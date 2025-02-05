import { useParams } from "react-router-dom";
import { getCity } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import CityForm from "./CityForm";

const UpdateCity = () => {
  const { cityId } = useParams();
  const token = localStorage.getItem("authToken");
  const {
    data: cityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["city-Data", cityId],
    queryFn: () => getCity({ id: cityId, token }),
  });

  return (
    <section className="container mx-auto p-4 w-full">
      <CityForm
        initialData={cityData}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateCity;
