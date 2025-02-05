import { useParams } from "react-router-dom";
import { getQuestion } from "../utlis/https";
import QuestionForm from "./QuestionForm";
import { useQuery } from "@tanstack/react-query";

const UpdateCommonQuestions = () => {
  const { questionId } = useParams();
  const token = localStorage.getItem("authToken");
  const {
    data: questionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["question-Data", questionId],
    queryFn: () => getQuestion({ id: questionId, token }),
  });

  return (
    <section className="container mx-auto p-4 w-full">
      <QuestionForm
        initialData={questionData}
        mode="update"
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default UpdateCommonQuestions;
