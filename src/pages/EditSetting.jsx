import { useParams } from "react-router-dom";
import SettingsForm from "../components/SettingsForm";
import { getSetting } from "../utlis/https";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const EditSetting = () => {
  const { settingId } = useParams();
  const token = localStorage.getItem("authToken");

  const {
    data: initialData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["setting", settingId],
    queryFn: () => getSetting({ id: settingId, token }),
  });
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <section>
      <SettingsForm mode="update" initialData={initialData}  />
    </section>
  );
};

export default EditSetting;
