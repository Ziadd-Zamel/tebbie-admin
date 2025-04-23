import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCustomerService } from "../../utlis/https"
import CustomerServiseForm from "../../components/CustomerServiseForm";

const UpdateCustomerService = () => {
  const { customerId } = useParams();

  const token = localStorage.getItem("authToken");

  const {
    data: customer,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["customer-details", customerId],
    queryFn: () => getCustomerService({ id: customerId, token }),
  });

  return (
    <section>
      <CustomerServiseForm
        initialData={customer}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateCustomerService;
