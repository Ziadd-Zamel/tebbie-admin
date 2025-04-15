/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { updateQuestions, addQuestion } from "../utlis/https";
import Loader from "./Loader";
import { toast } from "react-toastify";

const QuestionForm = ({ initialData, mode = "add", isLoading, error }) => {
  const { t } = useTranslation();
  const { questionId } = useParams();
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    answer: "",
    question: "",
    id: questionId,
  });
  useEffect(() => {
    if (initialData) {
      setFormData({
        answer: initialData.answer || "",
        question: initialData.question || "",
      });
    }
  }, [initialData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: (data) => {
      return mode === "add"
        ? addQuestion(data, token)
        : updateQuestions(data, token);
    },
       onSuccess: () => {
        navigate("/common-questions")
      mode === "add"
        ? toast.success(t("successfully_added"))
        : toast.success(t("successfully_updated"));
    },
    onError: (error) => {
      toast.error(t("submission_failed"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      ...(mode === "update" && { id: questionId }),
    };

    mutation.mutate(dataToSubmit);
  };
  if (isLoading) return <Loader />;

  return (
    <section className="flex justify-center items-center min-h-[60vh] p-4 w-full">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg rounded-md bg-white p-6 shadow-lg flex flex-col justify-center items-center"
    >
  
          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="question"
            >
              {t("question")}
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              id="question"
              placeholder={t("question")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
            />
          </div>

          <div className="px-3 my-6 md:mb-0 w-full">
            <label
              className="block text-md almarai-semibold mb-4"
              htmlFor="answer"
            >
              {t("answer")}
            </label>
            <textarea
              type="text"
              id="answer"
              value={formData.answer}
              onChange={handleChange}
              name="answer"
              placeholder={t("answer")}
              className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full  min-h-56"
            />
          </div>
        <div className="text-center py-10 flex justify-center w-full">
          <button
            type="submit"
            className="bg-primary hover:bg-[#048c87] w-40 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg   text-white py-3 rounded-[8px] focus:outline-none"
          >
            {mode === "add" ? "Add " : "Update "}
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuestionForm;
