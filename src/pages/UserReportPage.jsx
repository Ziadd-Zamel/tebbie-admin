/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserReportById } from "../utlis/https";
import ErrorMessage from "./ErrorMessage";
import AllUserReportTable from "../components/AllUserseportTable";

const UserReportPage = () => {
  const token = localStorage.getItem("authToken");
  const { userid } = useParams();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-report", token, userid],
    queryFn: () => getUserReportById({ token, userid }),
    enabled: !!token && !!userid,
  });

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="px-5 pb-5 flex flex-col gap-4 font-sans bg-white rounded-[20px] shadow-sm container mx-auto">
      <AllUserReportTable userData={userData} isLoading={isLoading} />
    </div>
  );
};

export default UserReportPage;
