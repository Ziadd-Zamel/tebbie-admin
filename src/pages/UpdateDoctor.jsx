import { useQuery } from "@tanstack/react-query";

import { getSpecificDoctor } from "../utlis/https";
import DoctorForm from "../components/DoctorForm";
import { useParams } from "react-router-dom";

const UpdateDoctor = () => {
  const { doctorId } = useParams();

  const token = localStorage.getItem("authToken");

  const {
    data: doctor,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["doctor-details", doctorId],
    queryFn: () => getSpecificDoctor({ id: doctorId, token }),
  });

  return (
    <section>
      <DoctorForm
        initialData={doctor}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateDoctor;
