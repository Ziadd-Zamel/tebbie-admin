import { useParams } from "react-router-dom";
import ServicesForm from "../components/ServicesForm"
import { getService } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";

const UpdateService = () => {
    const { servId } = useParams();
    const token = localStorage.getItem("authToken");
    const {
      data: cityData,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["service-Data", servId],
      queryFn: () => getService({ id: servId, token }),
    })
  return (
    <section className="container mx-auto p-4 w-full">
    <ServicesForm
      initialData={cityData}
      mode="update"
      isLoading={isLoading}
      error={error}
    />
  </section>
  )
}

export default UpdateService
