import { deleteSliders, getSliders } from "../utlis/https";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { ErrorMessage } from "formik";
import { placeholder } from "../assets";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";

const Sliders = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteSliders({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["sliderData", token]);

      const previousSliders = queryClient.getQueryData(["sliderData", token]);

      queryClient.setQueryData(["sliderData", token], (oldSliders) =>
        oldSliders.filter((slider) => slider.id !== id)
      );

      return { previousSliders };
    },
    onSuccess:()=>{
      toast.success("delete the slider successfully");
    },
    onError: (error, { id }, context) => {
      queryClient.setQueryData(["sliderData", token], context.previousSliders);
      toast.error("Failed to delete the slider. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["sliderData", token]);
    },
  });

  const {
    data: sliderData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sliderData", token],
    queryFn: () => getSliders({ token }),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      handleDelete({ id });
    }
  };

  return (
    <section className="container mx-auto py-8">
      <div className="mx-10 flex justify-start items-center">
        <Link
          to={"/sliders/add-slider"}
          className="flex justify-center items-center text-xl gap-2 bg-primary hover:bg-[#5CB2AF] text-white py-2 px-4 rounded-lg w-44 my-4"
        >
          Add slider
          <IoMdAdd size={30} />
        </Link>
      </div>
      <div className="flex md:gap-4 gap-2  mx-4 flex-wrap">
        {sliderData.length > 0 ? (
          <>
            {sliderData.map((slider) => (
              <div
                key={slider.id}
                className="bg-white md:w-[320px] w-[300px] shadow-md rounded-xl md:p-4 p-3 lg:text-lg md:text-md text-sm"
              >
                <div className="w-full">
                  <img
                    src={slider.media_url || placeholder}
                    alt={slider.id}
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => (e.target.src = placeholder)}

                  />
                </div>

                <div className="mt-4 flex gap-2 items-center">
                  <Link
                    to={`/sliders/${slider.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FaEdit size={30} />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(slider.id)}
                    className="text-red-600 hover:text-red-500"
                  >
                    <MdDelete size={30} />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex justify-center items-center h-full w-full text-2xl">
            <p>Sorry, there are no sliders.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sliders;
