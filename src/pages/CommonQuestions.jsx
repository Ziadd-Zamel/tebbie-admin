import { useTranslation } from "react-i18next";
import { deleteQuestion, getQuestions } from "../utlis/https";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { ErrorMessage } from "formik";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";

const CommonQuestions = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const token = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => deleteQuestion({ id, token }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["common-questions", token]);

      const previousQuestions = queryClient.getQueryData([
        "common-questions",
        token,
      ]);

      queryClient.setQueryData(["common-questions", token], (oldQuestions) =>
        oldQuestions.filter((question) => question.id !== id)
      );

      return { previousQuestions };
    },
    onError: (error, { id }, context) => {
      queryClient.setQueryData(
        ["common-questions", token],
        context.previousQuestions
      );
      alert("Failed to delete the question. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["common-questions", token]);
    },
  });

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      handleDelete({ id });
    }
  };

  const {
    data: questionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["common-questions", token],
    queryFn: () => getQuestions({ token }),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <section dir={direction} className="container mx-auto py-8 w-full">
      <div className="mx-10 flex justify-start items-center">
      <Link
        to={"/common-questions/add-question"}
        className="px-6 py-2 hover:bg-[#048c87] w-auto flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
        >
        Add question
        <IoMdAddCircle  />
        </Link>
      </div>
     
      {questionsData.length > 0 ? (
        <div className="grid md:grid-cols-12 grid-cols-1">
          {questionsData.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full text-3xl p-6">
          there are no questions to show
        </div>
      )}
    </section>
  );
};

const QuestionCard = ({ question, handleDeleteClick }) => {
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowFullAnswer((prev) => !prev);
  };

  return (
    <div className="py-6 px-4 w-full col-span-6">
      <div className="mx-auto min-h-[300px] py-6 px-6 bg-white rounded-xl">
        <div className="mb-3">
          <h3 className="flex items-center mb-5 text-xl font-medium text-gray-900 dark:text-white">
            <div className="flex-shrink-0 me-2 text-gray-500">
              <BsFillQuestionCircleFill size={25} />
            </div>
            {question.question}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg word-wrap break-words">
            {showFullAnswer
              ? question.answer
              : question.answer.length > 200
              ? `${question.answer.slice(0, 200)}...`
              : question.answer}
            {question.answer.length > 200 && (
              <button
                onClick={toggleAnswer}
                className="text-blue-500 hover:text-blue-600 ml-2"
              >
                {showFullAnswer ? "See Less" : "See More"}
              </button>
            )}
          </p>
        </div>
        <div className="mt-4 flex gap-2 items-center justify-end">
          <Link
            to={`/common-questions/${question.id}`}
            className="text-blue-600 hover:text-blue-700"
          >
            <FaEdit size={30} />
          </Link>
          <button
            onClick={() => handleDeleteClick(question.id)}
            className="text-red-600 hover:text-red-500"
          >
            <MdDelete size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonQuestions;
