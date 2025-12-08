import QuizModel from "./model.js";

export default function QuizzesDao() {
  const createQuizForCourse = (courseId) =>
    QuizModel.create({ courseId, title: "New Quiz" });

  const findQuizzesForCourse = (courseId) =>
    QuizModel.find({ courseId });

  const findQuizById = (quizId) =>
    QuizModel.findById(quizId);

  const deleteQuiz = (quizId) =>
    QuizModel.deleteOne({ _id: quizId });

  const updateQuiz = (quizId, quiz) =>
    QuizModel.updateOne({ _id: quizId }, { $set: quiz });

  const togglePublish = async (quizId) => {
    const quiz = await QuizModel.findById(quizId);
    quiz.published = !quiz.published;
    await quiz.save();
    return quiz;
  };

  return {
    createQuizForCourse,
    findQuizzesForCourse,
    findQuizById,
    deleteQuiz,
    updateQuiz,
    togglePublish,
  };
}
