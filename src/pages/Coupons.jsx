import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import {
  deleteCoupon,
  getCoupons,
  UpdateCoupon,
  newCoupon,
} from "../utlis/https";
import { RiCoupon2Fill } from "react-icons/ri";
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const Coupons = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    data: couponData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Coupons"],
    queryFn: () => getCoupons({ token }),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 5;
  const [formState, setFormState] = useState({
    code: "",
    type: "fixed",
    amount: "",
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [updatedCoupon, setUpdatedCoupon] = useState({
    code: "",
    type: "",
    amount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { mutate: handleUpdate } = useMutation({
    mutationFn: ({ id, token, code, type, amount }) =>
      UpdateCoupon({ id, token, code, type, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries(["Coupons"]);
      setEditingCoupon(null);
    },
    onError: (error) => {
      console.error("Failed to update coupon:", error);
      alert("Update failed. Please try again.");
    },
  });
const { mutate: handleAdd } = useMutation({
  mutationFn: ({ code, type, amount }) =>
    newCoupon({ code, type, amount, token }),
  onMutate: async ({ code, type, amount }) => {
    await queryClient.cancelQueries(["Coupons"]);

    const previousCoupons = queryClient.getQueryData(["Coupons"]);

    const newCouponData = { id: `temp-${Date.now()}`, code, type, amount };
    queryClient.setQueryData(["Coupons"], (oldCoupons) => [
      ...(oldCoupons || []),
      newCouponData,
    ]);

    // Clear the form
    setFormState({ code: "", type: "fixed", amount: "" });

    return { previousCoupons };
  },
  onError: (error, _, context) => {
    queryClient.setQueryData(["Coupons"], context.previousCoupons);
      alert(`Failed to add the coupon ${error}`);
  },
  onSuccess: () => {
    alert("Coupon added successfully!");
  },
  onSettled: () => {
    queryClient.invalidateQueries(["Coupons"]);
  },
});
const handleAddClick = () => {
  const { code, type, amount } = formState;
  if (code.trim() && amount) {
    handleAdd({ code, type, amount });
  } else {
    alert("Please fill in all fields for the new coupon.");
  }
};
  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteCoupon({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["Coupons"]);
      const previousCoupons = queryClient.getQueryData(["Coupons"]);
      queryClient.setQueryData(["Coupons"], (oldCoupons) =>
        oldCoupons.filter((coupon) => coupon.id !== id)
      );
      return { previousCoupons };
    },
    onError: (error, { id }, context) => {
      if (context?.previousCoupons) {
        queryClient.setQueryData(["Coupons"], context.previousCoupons);
      }
      alert(`Failed to delete. Please try again ${error}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["Coupons"]);
    },
  });

  const handleDeleteClick = (id) => {
    if (window.confirm(t("confirmDelete"))) {
      handleDelete({ id });
    }
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon.id);
    setUpdatedCoupon({
      code: coupon.code,
      type: coupon.type,
      amount: coupon.amount,
    });
  };

  const handleSaveClick = (id) => {
    handleUpdate({ id, token, ...updatedCoupon });
  };

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = couponData?.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );

  const totalPages = Math.ceil(couponData?.length / couponsPerPage);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <ErrorMessage message="Failed to load Coupons. Please try again later." />
    );

  return (
    <section className="container mx-auto p-6 bg-gray-50">
      <div className="overflow-x-auto md:w-full w-[90vw]">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal text-left">
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Code</th>
              <th className="py-3 px-6">Type</th>
              <th className="py-3 px-6">Amount</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 md:text-xl text-lg font-light">
            {currentCoupons?.map((coupon, index) => (
              <tr
                key={coupon.id}
                className={`border-b ${
                  coupon.id.toString().startsWith("temp-") ? "opacity-50" : ""
                }`}
              >
                <td className="py-3 px-6 text-left flex items-center gap-3">
                  {index + 1 + (currentPage - 1) * couponsPerPage}
                  <RiCoupon2Fill />
                </td>
                <td className="py-3 px-6">
                  {editingCoupon === coupon.id ? (
                    <input
                      type="text"
                      value={updatedCoupon.code}
                      onChange={(e) =>
                        setUpdatedCoupon((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.code
                  )}
                </td>
                <td className="py-3 px-6">
                  {editingCoupon === coupon.id ? (
                    <select
                      onChange={(e) =>
                        setUpdatedCoupon((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  ) : (
                    coupon.type
                  )}
                </td>

                <td className="py-3 px-6">
                  {editingCoupon === coupon.id ? (
                    <input
                      type="number"
                      value={updatedCoupon.amount}
                      onChange={(e) =>
                        setUpdatedCoupon((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    coupon.amount
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex space-x-4">
                    {editingCoupon === coupon.id ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(coupon.id)}
                          className="text-green-500 hover:text-green-700 focus:outline-none"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCoupon(null)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(coupon)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          <AiFillEdit size={28} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <AiFillDelete size={28} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            <tr className="hover:bg-gray-100 text-lg">
              <td className="py-3 px-6 text-left whitespace-nowrap">New</td>
              <td className="py-3 px-6 text-left">
                <input
                  type="text"
                  name="code"
                  placeholder="Enter new code"
                  value={formState.code}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 md:w-full min-w-56"
                />
              </td>
              <td className="py-3 px-6 text-left">
                <select
                  name="type"
                  value={formState.type}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 md:w-full min-w-56"
                >
                  <option value="fixed">Fixed</option>
                  <option value="percentage">Percentage</option>
                </select>
              </td>
              <td className="py-3 px-6 text-left">
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter new amount"
                  value={formState.amount}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 md:w-full min-w-56"
                />
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={handleAddClick}
                  className="text-green-500 hover:text-green-700 focus:outline-none"
                >
                  <AiFillPlusCircle size={28} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-2 justify-center items-center">
        <button
          className={`px-3 py-1 text-white rounded-lg bg-primary ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack size={20} />
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          className={`px-3 py-1 text-white rounded-lg bg-primary ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </section>
  );
};

export default Coupons;
