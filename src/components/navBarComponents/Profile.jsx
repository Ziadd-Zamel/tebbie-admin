import { Link } from "react-router-dom";
import { ashraf } from "../../assets";
import { getUser } from "../../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "formik";

const Profile = () => {
  const token = localStorage.getItem("authToken");

  const {
    data: userdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUser({ token }),
  });

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }

  return (
    <Link to="/profile" className="flex items-center max-w-[200px] shrink">
      <div className="flex items-center border-[3px] border-primary transition-transform transform-gpu duration-300 ease-in-out rounded-full hover:scale-105 hover:shadow-lg delay-75 mx-2 lg:mx-5 shrink-0">
        <img
          src={userdata?.media_url || ashraf}
          alt={userdata?.name}
          className="w-10 lg:w-14 h-10 lg:h-14 rounded-full object-cover shrink-0"
        />
      </div>
    </Link>
  );
};

export default Profile;
