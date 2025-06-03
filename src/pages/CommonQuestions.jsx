/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { deleteQuestion, getQuestions } from "../utlis/https";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // For animations

const token = localStorage.getItem("authToken");

const CommonQuestions = () => {
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const questionsPerPage = 9;

  const {
    data: questionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["common-questions", token],
    queryFn: () => getQuestions({ token }),
  });

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
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ["common-questions",
        token],
        context.previousQuestions
      );
      toast.error(t("questionDeleteFailed", { error: error.message }));
    },
    onSuccess: () => {
      toast.success(t("questionDeletedSuccess"));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["common-questions", token]);
    },
  });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete({ id: selectedId });
    }
    handleCloseDialog();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredQuestions = useMemo(() => {
    if (!questionsData) return [];
    return questionsData.filter((question) =>
      question.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [questionsData, searchTerm]);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const totalPages =
    filteredQuestions.length > 0
      ? Math.ceil(filteredQuestions.length / questionsPerPage)
      : 0;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={t("errorFetchingQuestions")} />;

  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="md:p-8 p-4 m-4 bg-white rounded-2xl">
        {/* Header with Search and Add Button */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder={t("questionSearchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg bg-white h-[50px] focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <Link
            to="/common-questions/add-question"
            className="px-6 py-2 hover:bg-[#048c87] flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none shadow-md transition-all duration-300"
          >
            {t("addQuestion")}
            <IoMdAddCircle size={24} />
          </Link>
        </div>

        {/* Questions Grid */}
        {currentQuestions.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                handleDeleteClick={handleDeleteClick}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex justify-center items-center h-64 text-2xl text-gray-500">
            {t("noQuestionsAvailable")}
          </div>
        )}

        {/* Pagination and Total */}
        <div className="flex justify-between items-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="text-xl text-gray-500">
            {t("Total")}: {filteredQuestions.length}
          </p>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { borderRadius: "12px", padding: "16px" } }}
        >
          <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {t("confirmDelete")}
          </DialogTitle>
          <DialogContent>
            <p className="text-gray-600">{t("areYouSureDeleteQuestion")}</p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: "16px" }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: "#3AAB95",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#33A9C7" },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: "#DC3545",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#a71d2a" },
              }}
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

const QuestionCard = ({ question, handleDeleteClick }) => {
  const { t } = useTranslation();
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowFullAnswer((prev) => !prev);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <BsFillQuestionCircleFill className="text-gray-500 flex-shrink-0" size={25} />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {question.question}
          </h3>
          <p className="text-gray-600 text-lg">
            {showFullAnswer
              ? question.answer
              : question.answer.length > 200
              ? `${question.answer.slice(0, 200)}...`
              : question.answer}
            {question.answer.length > 200 && (
              <button
                onClick={toggleAnswer}
                className="text-blue-500 hover:text-blue-600 ml-2 font-medium"
              >
                {showFullAnswer ? t("seeLess") : t("seeMore")}
              </button>
            )}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <Link
          to={`/common-questions/${question.id}`}
          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <FaEdit size={28} />
        </Link>
        <button
          onClick={() => handleDeleteClick(question.id)}
          className="text-red-600 hover:text-red-500 transition-colors duration-200"
        >
          <MdDelete size={28} />
        </button>
      </div>
    </motion.div>
  );
};

export default CommonQuestions;