/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

const realtableType = [
  { id: 1, name: "hospital" },
  { id: 2, name: "doctor" },
  { id: 3, name: "xray" },
  { id: 4, name: "lab" },
];

const SliderForm = ({
  title,
  initialFormData,
  onSubmit,
  fetchDataFunctions,
  isLoading,
  buttonText,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
      setImagePreview(initialFormData.media || null);
    }
  }, [initialFormData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, media: file }));
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.media) {
      toast.error("Please provide an image.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
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

        <div className="px-3 my-6 md:mb-0">
          <select
            name="realtable_type"
            id="realtable_type"
            value={formData.realtable_type}
            onChange={(e) => handleChange("realtable_type", e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
          >
            <option value="">Select Type</option>
            {realtableType.map((data) => (
              <option key={data.id} value={data.name}>
                {data.name}
              </option>
            ))}
          </select>
        </div>

        {fetchDataFunctions.map(({ key, data, label }) => {
          if (formData.realtable_type === key) {
            return (
              <div className="px-3 my-6 md:mb-0" key={key}>
                <select
                  value={formData.realtable_id}
                  onChange={(e) => handleChange("realtable_id", e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                >
                  <option value="">{`Select ${label}`}</option>
                  {data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          return null;
        })}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg my-4"
        >
          {isLoading ? "Processing..." : buttonText}
        </button>
      </form>
    </div>
  );
};

export default SliderForm;
