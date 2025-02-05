import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addSlider,
  getDoctors,
  getHospitals,
  getLabs,
  getSpecializations,
  getXrays,
} from "../utlis/https";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

const realtableType = [
  { id: 1, name: "hospital" },
  { id: 2, name: "doctor" },
  { id: 3, name: "xray" },
  { id: 4, name: "lab" },
  { id: 5, name: "specialization" },
];

const AddSlider = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    media: null,
    realtable_type: "",
    realtable_id: "",
  });

  const { mutate: handleAddSlider, isPending } = useMutation({
    mutationFn: (newSlider) => addSlider({ ...newSlider, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["sliderData", token]);
      toast.success("Slider added successfully!");
      navigate("/sliders");
    },
    onError: (error) => {
      toast.error("Failed to add slider. Please try again.");
    },
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctorsData"],
    queryFn: () => getDoctors({ token }),
  });
  const { data: hospitalData } = useQuery({
    queryKey: ["hospitalData", token],
    queryFn: () => getHospitals({ token }),
  });
  const { data: labsData } = useQuery({
    queryKey: ["labsData", token],
    queryFn: () => getLabs({ token }),
  });
  const { data: xraysData } = useQuery({
    queryKey: ["XRayData", token],
    queryFn: () => getXrays({ token }),
  });
  const { data: specializationData } = useQuery({
    queryKey: ["specialization", token],
    queryFn: () => getSpecializations({ token }),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, media: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.media) {
      toast.error("Please provide an image.");
      return;
    }

    handleAddSlider(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto"
      >
        <div className="mb-4">
          <div className="flex justify-center items-center my-6">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Slider Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex justify-center items-center">
                  <FaCamera size={24} className="text-gray-500" />
                </div>
              )}
              <label
                htmlFor="imageUpload"
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
              >
                <FaCamera />
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="px-3 my-6 md:mb-0">
          <select
            name="realtable_type"
            id="realtable_type"
            value={formData.realtable_type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                realtable_type: e.target.value,
                realtable_id: "",
              }))
            }
            className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          >
            <option value="">Select Type</option>
            {realtableType?.map((data) => (
              <option key={data.id} value={data.name}>
                {data.name}
              </option>
            ))}
          </select>
        </div>

        {formData.realtable_type === "doctor" && (
          <div className="px-3 my-6 md:mb-0">
            <select
              name="doctor"
              value={formData.realtable_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  realtable_id: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
            >
              <option value="">Select Doctor</option>
              {doctorsData?.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {formData.realtable_type === "hospital" && (
          <div className="px-3 my-6 md:mb-0">
            <select
              name="hospital"
              value={formData.realtable_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  realtable_id: e.target.value,
                }))
              }
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
        )}
        {formData.realtable_type === "xray" && (
          <div className="px-3 my-6 md:mb-0">
            <select
              name="xray"
              value={formData.realtable_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  realtable_id: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
            >
              <option value="">Select X-ray</option>
              {xraysData?.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {formData.realtable_type === "lab" && (
          <div className="px-3 my-6 md:mb-0">
            <select
              name="lab"
              value={formData.realtable_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  realtable_id: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
            >
              <option value="">Select Lab</option>
              {labsData?.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {formData.realtable_type === "specialization" && (
          <div className="px-3 my-6 md:mb-0">
            <select
              name="lab"
              value={formData.realtable_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  realtable_id: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
            >
              <option value="">Select Lab</option>
              {specializationData?.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-center items-center my-4">
          <button
            type="submit"
            disabled={isPending}
            className=" flex justify-center items-center text-xl gap-2 bg-primary hover:bg-[#5CB2AF] text-white py-2 px-4 rounded-lg w-44  focus:outline-none my-4"
          >
            {isPending ? "Adding Slider..." : "Add Slider"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSlider;
