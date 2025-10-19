import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorSliders,
  getHospitals,
  getLabs,
  getSliderById,
  getSpecializations,
  getXrays,
  updateSliders,
} from "../utlis/https";
import { useNavigate, useParams } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";

const realtableType = [
  { id: 1, name: "hospital" },
  { id: 2, name: "doctor" },
  { id: 3, name: "xray" },
  { id: 4, name: "lab" },
  { id: 5, name: "specialization" },
];
const UpdateSlider = () => {
  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("external");

  const { sliderId } = useParams();

  const {
    data: sliderData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["slider-Data", sliderId],
    queryFn: () => getSliderById({ id: sliderId, token }),
  });
  const [formData, setFormData] = useState({
    media: null,
    realtable_type: "",
    realtable_id: "",
    external_link: "",
    id: sliderId,
  });

  const { mutate: handleUpdateSlider, isPending } = useMutation({
    mutationFn: (newSlider) => {
      if (!hasPermission("sliders-update")) {
        throw new Error(
          `You don't have permission to ${getPermissionDisplayName(
            "sliders-update"
          )}`
        );
      }
      return updateSliders({ ...newSlider, token, id: sliderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sliderData", token]);
      toast.success("Slider updated successfully!");
      navigate("/sliders");
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to update slider. Please try again."
      );
    },
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctorsData"],
    queryFn: async () => {
      const first = await getDoctorSliders({
        token,
        page: 1,
        isVisitor: "yes",
      });
      const lastPage = first?.last_page || 1;
      if (lastPage <= 1) {
        const onlyVisitors = (first?.data || []).filter(
          (d) => d?.is_visitor === "yes"
        );
        return { data: onlyVisitors };
      }
      const pages = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, i) =>
          getDoctorSliders({ token, page: i + 2, isVisitor: "yes" })
        )
      );
      const merged = [
        ...(first?.data || []),
        ...pages.flatMap((p) => p?.data || []),
      ];
      const onlyVisitors = merged.filter((d) => d?.is_visitor === "yes");
      return { data: onlyVisitors };
    },
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
  useEffect(() => {
    if (sliderData) {
      const extractedType = sliderData.realtable_type
        ? sliderData.realtable_type.split("\\").pop().toLowerCase()
        : "";

      // Determine tab based on presence of external_link
      const isExternal = Boolean(sliderData.external_link);
      setActiveTab(isExternal ? "external" : "type");

      // Determine selected id depending on type
      let resolvedId = "";
      if (extractedType === "doctor")
        resolvedId = sliderData.doctor?.id || sliderData.realtable_id || "";
      if (extractedType === "hospital")
        resolvedId = sliderData.hospital?.id || sliderData.realtable_id || "";
      if (extractedType === "xray")
        resolvedId = sliderData.xray?.id || sliderData.realtable_id || "";
      if (extractedType === "lab")
        resolvedId = sliderData.lab?.id || sliderData.realtable_id || "";
      if (extractedType === "specialization")
        resolvedId =
          sliderData.specialization?.id || sliderData.realtable_id || "";

      setFormData((prev) => ({
        ...prev,
        media: sliderData.media_url || null,
        realtable_type: extractedType, // keep simple type for selects
        realtable_id: resolvedId,
        external_link: sliderData.external_link || "",
      }));
      setImagePreview(sliderData.media_url || null);
    }
  }, [sliderData]);

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

    // Validate based on active tab similar to Add
    if (activeTab === "external") {
      if (!formData.external_link) {
        toast.error("Please provide external link");
        return;
      }
    } else if (activeTab === "type") {
      if (!formData.realtable_type || !formData.realtable_id) {
        toast.error("Please select type and item");
        return;
      }
    }

    // Map simple type to API expected when needed (API accepts same keys for update)
    const payload = { ...formData };
    if (activeTab === "external") {
      payload.realtable_type = "";
      payload.realtable_id = "";
    } else {
      payload.external_link = "";
    }

    handleUpdateSlider(payload);
  };
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section className="h-full py-8 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto "
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

        {activeTab === "external" && (
          <div className="px-3 my-6 md:mb-0">
            <input
              type="url"
              name="external_link"
              placeholder="https://example.com"
              value={formData.external_link}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  external_link: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
            />
          </div>
        )}

        {activeTab === "type" && (
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
        )}
        {activeTab === "type" && formData.realtable_type === "doctor" && (
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
              {doctorsData?.data?.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {activeTab === "type" && formData.realtable_type === "hospital" && (
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
        {activeTab === "type" && formData.realtable_type === "xray" && (
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
        {activeTab === "type" && formData.realtable_type === "lab" && (
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
        {activeTab === "type" &&
          formData.realtable_type === "specialization" && (
            <div className="px-3 my-6 md:mb-0">
              <select
                name="specialization"
                value={formData.realtable_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    realtable_id: e.target.value,
                  }))
                }
                className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
              >
                <option value="">Select specialization</option>
                {specializationData?.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary   from-[#33A9C7] to-[#3AAB95] text-lg font-medium text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2  my-4"
        >
          {isPending ? "updating Slider..." : "update Slider"}
        </button>
      </form>
    </section>
  );
};

export default UpdateSlider;
