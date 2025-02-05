import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getcities,
  getDoctors,
  getSpecializations,
  getSpecificHospital,
  getstates,
  updateHospital,
} from "../utlis/https";
import { useState, useCallback, useEffect } from "react";
import Loader from "./Loader";
import HospitalMap from "./HospitalMap";
import { ErrorMessage } from "formik";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import { IoMdAdd, IoIosCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const token = localStorage.getItem("authToken");

const UpdateHospital = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { HospitalId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  const {
    data: hospital,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["Hospital-details", HospitalId],
    queryFn: () => getSpecificHospital({ id: HospitalId, token }),
    enabled: !!HospitalId,
  });
  const { data: states, isLoading: stateIsLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => getstates({ token }),
  });

  const { data: doctors, isLoading: doctorsIsLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors({ token }),
  });
  const { data: specializationsData, isLoading: sppecializationsIsLoading } =
    useQuery({
      queryKey: ["specializations"],
      queryFn: () => getSpecializations({ token }),
    });
  const { data: cities, isLoading: citiesIsLoading } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getcities({ token }),
  });
  const [hospitalData, setHospitalData] = useState({
    name: "",
    bio: "",
    email: "",
    address: "",
    description: "",
    open_visits: false,
    state: "",
    city: "",
    doctor_ids: [],
    specialization_id: "",
    media: [],
    old_media: [],
    active: false,
    lat: "",
    long: "",
    start_visit_from: "",
    end_visit_at: "",
    visit_time: "",
    Password: "",
  });

  useEffect(() => {
    if (hospital) {
      const doctorIds = hospital.doctors.data.map((doctor) => doctor.id);
      const specializationIds = hospital.specializations.data.map(
        (spec) => spec.id
      );

      setHospitalData({
        name: hospital.name || "",
        bio: hospital.bio || "",
        email: hospital.email || "",
        address: hospital.address || "",
        description: hospital.description || "",
        state_id: hospital.state_id || "",
        city_id: hospital.city_id || "",
        doctor_ids: doctorIds,
        media: hospital.media_url || [],
        specialization_id: specializationIds || [],
        active: hospital.active,
        lat: hospital.lat || "",
        long: hospital.long || "",
        open_visits: hospital.open_visits,
        end_visit_at: hospital.end_visit_at || "00:00",
        start_visit_from: hospital.start_visit_from || "00:00",
        visit_time: hospital.visit_time ||"",
      });
    }
  }, [hospital]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHospitalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (SpecializationIds) => {
    setHospitalData((prev) => ({
      ...prev,
      specialization_id: SpecializationIds,
    }));
  };

  const handleDoctorChange = (selectedDoctorIds) => {
    setHospitalData((prev) => ({
      ...prev,
      doctor_ids: selectedDoctorIds,
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setHospitalData((prev) => ({
      ...prev,
      media: [...prev.media, ...files],
    }));
  };
  const handleDeleteImage = (index) => {
    setHospitalData((prev) => {
      const updatedMedia = [...prev.media];
      updatedMedia.splice(index, 1);
      return { ...prev, media: updatedMedia };
    });
  };

const mutation = useMutation({
  mutationFn: (userData) => {
    const { email, ...otherData } = userData;
    const payload = {
      ...otherData,
      ...(email !== hospital?.email && { email }),
    };
    return updateHospital({ token, ...payload });
  },
  onSuccess: (data) => {
    toast.success("تم تعديل بيانات المستشفى بنجاح");
    setErrorMessage(""); 
    console.log("hospital data updated successfully", data);
  },
  onError: (error) => {
    toast.error("حدث خطأ أثناء تعديل بيانات المستشفى");
  
    const message = error?.errors
      ? error.errors.map((err, index) => `${index + 1}. ${err}`).join("\n")
      : "حدث خطأ غير معروف";
  
    console.error("Validation Errors:", error.errors);
  
    setErrorMessage(message);
    toast.error(message);
  },
  
});


  const [marker, setMarker] = useState(null);

  const onMapClick = useCallback(
    (event) => {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarker(newMarker);
      setHospitalData({
        ...hospitalData,
        lat: newMarker.lat,
        long: newMarker.lng,
      });
    },
    [hospitalData]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingMedia = hospitalData.media.filter(
      (item) => typeof item === "string"
    );
    const newMediaFiles = hospitalData.media.filter(
      (item) => item instanceof File
    );

    const allMedia = [...existingMedia, ...newMediaFiles];

    mutation.mutate({
      id: HospitalId,
      ...hospitalData,
      media: allMedia,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }
  return (
    <section className="container mx-auto p-4 w-full ">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="w-full rounded-md bg-white p-6 shadow-lg max-w-7xl mx-auto"
      >
        <form onSubmit={handleSubmit}>
          <div className="pt-8 lg:pt-12 pb-8 mb-4 lg:flex flex-col  items-start">
            <div className="lg:flex w-full">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="name"
                >
                  {t("name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={hospitalData.name}
                  onChange={handleChange}
                  id="name"
                  placeholder={t("firstName")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="email"
                >
                  {t("email")}
                </label>
                <input
                  type="text"
                  value={hospitalData.email}
                  onChange={handleChange}
                  id="email"
                  name="email"
                  placeholder={t("email")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
              
            </div>
            <div className="lg:flex mb-6 w-full ">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="address"
                >
                  {t("address")}
                </label>
                <input
                  type="text"
                  value={hospitalData.address}
                  onChange={handleChange}
                  id="address"
                  name="address"
                  placeholder={t("address")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="bio"
                >
                  {t("bio")}
                </label>
                <input
                  type="text"
                  id="bio"
                  value={hospitalData.bio}
                  onChange={handleChange}
                  name="bio"
                  placeholder={t("bio")}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
           
            </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 px-4 w-full">
          <div className="mb-4 relative w-full flex flex-col justify-end items-start  col-span-1">
              <label
                htmlFor="imgs"
                className="block text-md almarai-semibold mb-4"
              >
                {t("password")}
              </label>
              <input
                placeholder="********"
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                className="border border-gray-300 rounded-lg py-4 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute  top-1/2 end-4 transform translate-y-1/2 text-gray-500 text-xl"
              >
                {showPassword ? <FaEyeSlash  /> : <FaEye  />}
              </button>
         </div>
          </div>
            <div className="lg:flex mb-6 w-full">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="specializations"
                >
                  {t("specializations")}
                </label>
                {sppecializationsIsLoading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <MultiSelectDropdown
                    doctors={specializationsData}
                    selectedDoctors={hospitalData.specialization_id}
                    handleDoctorChange={handleSpecializationChange}
                  />
                )}
              </div>
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="doctor_ids"
                >
                  {t("doctors")}
                </label>
                {doctorsIsLoading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : (
                  <MultiSelectDropdown
                    doctors={doctors}
                    selectedDoctors={hospitalData.doctor_ids}
                    handleDoctorChange={handleDoctorChange}
                  />
                )}
              </div>
            </div>
            <div className="lg:flex mb-6 w-full">
            
            <div className="px-3 my-6 md:mb-0 w-full">
              <label
                className="block text-md almarai-semibold mb-4"
                htmlFor="city_id"
              >
                {t("cities")}
              </label>
              {citiesIsLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <select
                  name="city_id"
                  value={hospitalData.city_id}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="px-3 my-6 md:mb-0 w-full">
              <label
                className="block text-md almarai-semibold mb-4"
                htmlFor="state"
              >
                {t("state")}
              </label>
              {stateIsLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <select
                  name="state"
                  value={hospitalData.state_id}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            </div>
            <div className="lg:flex mb-6 w-full">
              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="start_visit_from"
                >
                  start visit from
                </label>
                <input
                  type="time"
                  value={hospitalData.start_visit_from}
                  onChange={handleChange}
                  id="start_visit_from"
                  name="start_visit_from"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>

              <div className="px-3 my-6 md:mb-0 w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="email"
                >
                  end visit at
                </label>
                <input
                  type="time"
                  value={hospitalData.end_visit_at}
                  onChange={handleChange}
                  id="end_visit_at"
                  name="end_visit_at"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>
            </div>
            <div className="lg:flex justify-end gap-4 px-4 items-end mb-6 w-full ">
              <div className="  w-full">
                <label
                  className="block text-md almarai-semibold mb-4"
                  htmlFor="doctor_ids"
                >
                  {t("visit_time")}
                </label>
                <input
                  type="text"
                  value={hospitalData.visit_time}
                  onChange={handleChange}
                  id="visit_time"
                  name="visit_time"
                  className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
                />
              </div>

              <div className="flex justify-center my-3  items-center  w-full">
                <div className="text-xl font-semibold  w-full flex items-center gap-3">
                  <label>{t("active")}</label>
                  <input
                    className="InputPrimary"
                    type="checkbox"
                    checked={hospitalData.active === "1"}
                    onChange={(e) =>
                      setHospitalData({
                        ...hospitalData,
                        active: e.target.checked ? "1" : "0",
                      })
                    }
                  />
                </div>
                <div className="text-xl font-semibold  w-full  flex items-center gap-3">
                  <label> {t("homevisit")}</label>
                  <input
                    className="InputPrimary"
                    type="checkbox"
                    checked={hospitalData.open_visits === 1}
                    onChange={(e) =>
                      setHospitalData({
                        ...hospitalData,
                        open_visits: e.target.checked ? 1 : 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="px-3 my-6 md:mb-0 w-full">
              <label
                className="block text-md almarai-semibold mb-4"
                htmlFor="description"
              >
                {t("description")}
              </label>
              <textarea
                type="text"
                name="description"
                value={hospitalData.description}
                onChange={handleChange}
                id="description"
                placeholder={t("description")}
                className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full min-h-44 "
              />
            </div>
            <div className="w-full">
              <div className="my-6 relative max-w-full ">
                <label htmlFor="imgs" className="text-end md:text-3xl text-2xl">
                  {t("hospitalimages")}
                </label>
                <div className="flex flex-wrap justify-start items-center gap-4 my-4">
                  {hospitalData.media.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-64 h-44 border border-[#9BA2A6] rounded"
                    >
                      <img
                        src={
                          img instanceof File ? URL.createObjectURL(img) : img
                        }
                        alt={`Image ${index + 1}`}
                        className="rounded object-contain w-full h-44"
                      />
                      <button
                        onClick={() => handleDeleteImage(index)}
                        type="button"
                        className="absolute top-1 right-1 text-red-500"
                      >
                        <IoIosCloseCircle size={30} />
                      </button>
                    </div>
                  ))}
                  <span className="relative w-64 h-44 border border-[#9BA2A6] rounded flex justify-center items-center text-[#9BA2A6] hover:text-[#bec7cc] cursor-pointer">
                    <IoMdAdd size={40} />
                    <input
                      type="file"
                      id="imgs"
                      name="imgs"
                      multiple
                      accept="image/*"
                      className="absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleMediaChange}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full my-10">
              <HospitalMap
                hospitalData={hospitalData}
                marker={marker}
                onMapClick={onMapClick}
              />
            </div>
          </div>
          {errorMessage && (
  <ul className=" text-red-700 px-4 py-3 rounded mb-4">
    {errorMessage.split(", ").map((error, index) => (
      <li key={index} className="list-disc ml-4">
        {error}
      </li>
    ))}
  </ul>
)}

          <div className="text-end justify-end py-10 flex w-full">
            <button
              type="submit"
            className="px-6 py-2 hover:bg-[#048c87] w-36 text-white  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UpdateHospital;
