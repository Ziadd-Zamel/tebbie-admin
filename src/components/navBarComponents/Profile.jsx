import React from "react";
import { Link } from "react-router-dom";
import { ashraf } from "../../assets";
import { getUser } from "../../utlis/https";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "formik";

const Profile = ({ direction }) => {
  const token = localStorage.getItem("authToken");

  const {
    data: userdata,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUser({ token }),
  });
  userdata;
  if (isLoading) {
    return <p>loading...</p>
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }

  return (
    <Link to="/profile" className="flex items-center">
      {[userdata]?.map((data) => (
        <div key={data.id} className="flex gap-2">
          <div className="flex items-center border-[3px] border-primary transition-transform transform-gpu duration-300 ease-in-out rounded-full hover:scale-110 hover:shadow-lg delay-75  mx-5">
            <img
              src={data.media_url || ashraf}
              alt={name}
              className="w-14 h-14 rounded-full  object-cover"
            />
          </div>
          <div
            className={`flex flex-col text-black ${
              direction === "rtl" ? "text-right" : "text-left"
            }`}
          >
            <span className="text-lg almarai-semibold">{data.name}</span>
            <span className="text-md">responsible</span>
          </div>
        </div>
      ))}
    </Link>
  );
};

export default Profile;
