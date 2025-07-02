import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import {
  getTermsAndConditions,
  updatetermsAndConditions,
} from "../utlis/https";
import Loader from "./Loader";

const TermsAndConditions = () => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["terms"],
    queryFn: getTermsAndConditions,
  });

  const mutation = useMutation({
    mutationFn: updatetermsAndConditions,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(["terms"], updatedData);
      toast.success(t("success_message"));
    },
    onError: () => {
      toast.error(t("error_message"));
    },
  });

  const validationSchema = Yup.object({
    term_condition: Yup.string()
      .required(t("required_error"))
      .min(10, t("min_length_error")),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center h-[80vh] flex items-center justify-center">
        {t("error_message")}: {error.message}
      </div>
    );
  }

  return (
    <section
      className="h-[80vh] flex justify-center items-center w-full "
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {t("terms_and_conditions")}
          </h2>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ term_condition: data?.term_condition || "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            mutation.mutate(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="term_condition"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("update_terms")}
                </label>
                <Field
                  as="textarea"
                  id="term_condition"
                  name="term_condition"
                  className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-y p-2"
                  rows="5"
                />
                <ErrorMessage
                  name="term_condition"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="px-6 py-3 bg-gradient-to-br from-[#33A9C7] to-[#3AAB95] text-white rounded-lg hover:from-[#2B8FA7] hover:to-[#2F8F7B] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? t("updating") : t("submit_button")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default TermsAndConditions;
