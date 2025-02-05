import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLab, getLabs } from "../utlis/https";
import { Link } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";

const Labs = () => {
  const token = localStorage.getItem("authToken");

  const { data: labData, isLoading, error } = useQuery({
    queryKey: ["labs", token],
    queryFn: () => getLabs({ token }),
  });

  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteLab({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["labs", token]);

      const previousLabs = queryClient.getQueryData(["labs", token]);

      queryClient.setQueryData(["labs", token], (oldLabs) =>
        oldLabs.filter((lab) => lab.id !== id)
      );

      return { previousLabs };
    },
    onError: (error, { id }, context) => {
      queryClient.setQueryData(["labs", token], context.previousLabs);
      alert(`Failed while deleting the lab. Please try again. :${error}`)
    },
    onSettled: () => {
      queryClient.invalidateQueries(["labs", token]);
    },
  });

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      handleDelete({ id });
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={"Failed to load labs. Please try again later."} />;

  return (
    <section className="container mx-auto p-6">
      <div className="flex justify-start items-start mb-4">
        <Link
          className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
          to="/labs/add-lab"
        >
                    <IoMdAddCircle  />

          Add Lab

        </Link>
      </div>

      <div className="overflow-x-auto md:w-full w-[90vw]">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left whitespace-nowrap">Lab Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">phone</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 md:text-lg text-md font-light">
            {labData?.map((lab) => (
              <tr
                key={lab.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{lab.id}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{lab.name}</td>
                <td className="py-3 px-6 text-left">{lab.email}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">{lab.phone}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center gap-3">
                    <Link
                      to={`/labs/${lab.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <AiFillEdit size={28} />
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(lab.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <AiFillDelete size={28} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {labData?.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 text-lg"
                >
                  No labs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Labs;
