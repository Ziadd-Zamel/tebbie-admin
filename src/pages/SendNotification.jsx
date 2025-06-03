import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { fetchUsers, sendNotification } from "../utlis/https";
import MultiSearchSelectorSelectAll from "./MultiSearchSelectorSelectAll";
import { toast } from "react-toastify";
import Loader from "./Loader";

const token = localStorage.getItem("authToken");

const getNotificationSchema = (t) =>
  yup.object().shape({
    user_ids: yup
      .array()
      .of(yup.number())
      .min(1, t("validation.user_ids_min"))
      .required(t("validation.user_ids_required")),
    title: yup
      .string()
      .min(3, t("validation.title_min"))
      .required(t("validation.title_required")),
    body: yup
      .string()
      .min(10, t("validation.body_min"))
      .required(t("validation.body_required")),
  });

const SendNotification = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Form state
  const [formState, setFormState] = useState({
    user_ids: [],
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState({});

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Users", token],
    queryFn: () => fetchUsers({ token }),
  });

  const { mutate: handleSend, isPending: isSending } = useMutation({
    mutationFn: ({ user_ids, title, body }) =>
      sendNotification({ user_ids, title, body, token }),
    onSuccess: () => {
      setFormState({ user_ids: [], title: "", body: "" });
      setErrors({});
      toast.success(t("successfully_added"));
    },
    onError: (error) => {
      alert(t("notificationSendFailed", { error: error.message }));
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle user selection
  const handleUserSelect = (value) => {
    setFormState((prev) => {
      const newUserIds = prev.user_ids.includes(value)
        ? prev.user_ids.filter((id) => id !== value)
        : [...prev.user_ids, value];
      return { ...prev, user_ids: newUserIds };
    });
  };

  const userOptions =
    users?.map((user) => ({
      value: user.id,
      label: `${user.name}`,
    })) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await getNotificationSchema(t).validate(formState, { abortEarly: false });
      setErrors({});
      handleSend(formState);
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>{t("errorFetchingUsers")}</div>;

  return (
    <section dir={direction} className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {t("sendNotification")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-md almarai-semibold mb-4">
              {t("selectUsers")}
            </label>
            <MultiSearchSelectorSelectAll
              options={userOptions}
              onChange={handleUserSelect}
              selectedValues={formState.user_ids}
              users={users}
              setFormState={setFormState}
              placeholder={t("selectUsers")}
              id="user_ids"
              searchPlaceholder={t("searchUsers")}
              fallbackMessage={t("noUsersFound")}
            />

            {errors.user_ids && (
              <p className="text-red-500 text-sm">{errors.user_ids}</p>
            )}
          </div>

          <div>
            <label className="block text-md almarai-semibold mb-4">
              {t("notificationTitle")}
            </label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              placeholder={t("enterTitle")}
              className={` border border-gray-300 rounded-lg py-4 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full my-4${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-md almarai-semibold mb-4">
              {t("notificationBody")}
            </label>
            <textarea
              name="body"
              value={formState.body}
              onChange={handleInputChange}
              placeholder={t("enterBody")}
              rows="4"
              className={`w-full p-2 min-h-48 border border-gray-300 rounded-lg py-4 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary  ${
                errors.body ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.body && (
              <p className="text-red-500 text-sm">{errors.body}</p>
            )}
          </div>

          <div className="w-full flex justify-center items-center">
            <button
              type="submit"
              disabled={isSending}
              className={`hover:bg-[#048c87] w-44 text-white  bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg py-4 rounded-[8px] focus:outline-none ${
                isSending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSending ? t("sending") : t("sendNotification")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SendNotification;
