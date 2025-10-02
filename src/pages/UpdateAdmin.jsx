import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAdmins } from "../utlis/https";
import AdminForm from "./AdminForm";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const UpdateAdmin = () => {
  const { adminId } = useParams();
  const token = localStorage.getItem("authToken");

  const {
    data: adminsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admins", token],
    queryFn: () => getAdmins({ token }),
  });

  // Find the specific admin from the list
  const adminData = adminsData?.find((admin) => admin.id == adminId);

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!adminData) return <ErrorMessage message="Admin not found" />;

  return (
    <AdminForm
      mode="update"
      initialData={adminData}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default UpdateAdmin;
