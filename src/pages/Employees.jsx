import React, { useState } from "react";
import { placeholder, teamsIcon } from "../assets";
import { useTranslation } from "react-i18next";
import CustomModal from "../components/CustomModal";
import { IoCamera } from "react-icons/io5";
import DropdownMenu from "../components/productsComponents/DropdownMenu";
import { IoMdPersonAdd } from "react-icons/io";
import { toast } from "react-toastify";
import {
  getEmployees,
  deleteEmployee,
  newEmployee,
  getSpecializations,
  getHospitals,
} from "../utlis/https";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const navigate = useNavigate()
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const token = localStorage.getItem("authToken");

  const {
    data: employeesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employeesData", token],
    queryFn: () => getEmployees({ token }),
    retry: false,
  });

  if (error) {
    console.error("Error fetching employees:", error.message);
  }
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const { data: hospitalData } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
    });


    const { data: specializations, isLoading: specializationsisLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    });
    
    const [formData, setFormData] = useState({
    name: "",
    media:  "",
    hospital_ids:[],
    email:"",
    phone:"",
    password:"",
    hospital_id:[],
    specialization_id:"",
    active:"1",
    });
   const mutation = useMutation({
    mutationFn: (userData) => newEmployee({ token, ...userData }),
    onSuccess: () => {
      toast.success("تم اضافة الموظف بنجاح");
      setIsModalOpen(false)
    },
    onError: (error) => {
      toast.error(` ${error}`);
    },
    });
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file)); 
        setFormData((prevData) => ({
          ...prevData,
          media: file, 
        }));
      }
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const dataToSubmit = {
        ...formData,
      };
      mutation.mutate(dataToSubmit);
    };

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => {
      return deleteEmployee({ id, token });
    },
    onMutate: async ({ id }) => {
      toast.success("تم ازالة الموظف بنجاح");
      await queryClient.cancelQueries(["employeesData", token]);
      const previousSliders = queryClient.getQueryData(["employeesData", token]);
      queryClient.setQueryData(
        ["employeesData", token],
        (oldemployeesData) => oldemployeesData.filter((slider) => slider.id !== id)
      );
      return { previousSliders };
    },
    onError: (error, { id }, context) => {
      toast.error(`فشل اثناء ازالة الموظفc${error}`);
      queryClient.setQueryData(
        ["employeesData", token],
        context.previousSliders
      );
      alert("Failed to delete. Please try again.");
    },
    onSettled: () => {
      console.log("Refetching employees data");
      queryClient.invalidateQueries(["employeesData", token]);
    },
  });
  const handleDeleteClick = (id) => {
    console.log("Deleting employee with id:", id); // Debug log
    if (window.confirm("Are you sure you want to delete?")) {
      handleDelete({ id });
    }
  };
  const handleDropdownToggle = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="bg-white rounded-3xl md:p-8 p-4 w-full">
        <div className="md:flex justify-end md:text-xl text-lg space-y-3 py-4">
          <button
            onClick={handleOpenModal}
            className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
            >
            {t("add-employee")}
            <IoMdPersonAdd className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-x-auto md:w-full w-[90vw]">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full  border-spacing-0 text-sm md:text-md lg:text-xl ">
                <thead>
                  <tr className="bg-gray-100">
                    <th className=" p-4">{t("name")}</th>
                    <th className=" p-4">{t("email")}</th>
                    <th className=" p-4">{t("phone")}</th>
                    <th className=" p-4">{t("hospital")}</th>
                    <th className=" p-4">{t("specializations")}</th>
                    <th className=" p-4">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {employeesData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        {t("No Data Available")}
                      </td>
                    </tr>
                  ) : (
                    employeesData.map((employee) => (
                      <tr key={employee.id} className="border-b">
                        <td className="px-4 py-4 flex items-center gap-2">
                          <img
                            src={employee.media_url|| teamsIcon}
                            alt={employee.name || "No Name"}
                            className="w-10 h-10 rounded-full"
                            onError={(e) => (e.target.src = teamsIcon)}

                          />
                          <span>{employee.name || t("No Name")}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {employee.email || t("No Email")}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {employee.phone || t("No Phone")}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {employee.hospital?.name || t("No Hospital")}
                        </td>
                        <td className="px-4 py-4 text-center whitespace-nowrap">
                          {employee.specialization ||
                            t("No Specialization")}
                        </td>
                        <td className="px-4 py-4 text-center flex justify-center space-x-2">
                          <DropdownMenu
                            isOpen={openDropdownId === employee.id}
                            onEdit={()=>navigate(`/employees/${employee.id}`)}
                            onDelete={() => handleDeleteClick(employee.id)}
                            onRestore={() => handleRestore(employee.id)}
                            onToggle={() => handleDropdownToggle(employee.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t("add-employee")}
      >
        <div className="flex justify-center items-center">
          <form
            className="px-3 max-w-lg text-md w-full"
            onSubmit={handleSubmit}
            >
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={imagePreview ||placeholder}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover"
                  onError={(e) => (e.target.src = placeholder)}

                />
                <label className="absolute bottom-[-12px] left-2 bg-white shadow-md p-2 rounded-full cursor-pointer">
                  <IoCamera color="#D9D9D9" size={25} />
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="name">
                {t("name")}
              </label>
              <input
                type="text"
                name="name"
                placeholder={t("name")}
                onChange={handleChange}
                required
                className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
              />
            </div>

            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="email">
                {t("email")}
              </label>
              <input
                type="email"
                name="email"
                placeholder={t("email")}
                onChange={handleChange}
                required
                className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
              />
            </div>

            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="phone">
                {t("phone")}
              </label>
              <input
                type="text"
                name="phone"
                placeholder={t("phone")}
                onChange={handleChange}
                required
                className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
              />
            </div>

            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="password">
                {t("password")}
              </label>
              <input
                type="password"
                name="password"
                placeholder={t("password")}
                onChange={handleChange}
                required
                className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
              />
            </div>

            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="hospital">
                {t("hospital")}
              </label>
              <select
                name="hospital_id"
                id="hospital_id"
                onChange={handleChange}
                className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
              >
                <option value="">Select Hospital</option>
                {hospitalData?.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="my-5">
              <label
                className="block almarai-semibold mb-4"
                htmlFor="specialization"
              >
                {t("specialization")}
              </label>
              {specializationsisLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <select
                  name="specialization_id"
                  id="specialization_id"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
                >
                  <option value="">{t("select_specialization")}</option>
                  {specializations?.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-2 hover:bg-[#048c87] w-32 flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
                >
                {t("save")}
              </button>
            </div>
          </form>
        </div>
      </CustomModal>}
    </section>
  );
};

export default Employees;
