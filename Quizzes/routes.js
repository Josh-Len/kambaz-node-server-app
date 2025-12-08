import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const user = req.tabSession?.currentUser || req.session?.currentUser;

    let quizzes = await dao.findQuizzesForCourse(cid);

    if (user && user.role === "STUDENT") {
      quizzes = quizzes.filter((q) => q.published);
    }

    res.json(quizzes);
  };

  const createQuizForCourse = async (req, res) => {
    const { cid } = req.params;
    const quiz = await dao.createQuizForCourse(cid);
    res.json(quiz);
  };

  const deleteQuiz = async (req, res) => {
    const { qid } = req.params;
    const status = await dao.deleteQuiz(qid);
    res.json(status);
  };

  const publishQuiz = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.togglePublish(qid);
    res.json(quiz);
  };

  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);
    res.json(quiz);
  };

  const updateQuiz = async (req, res) => {
  const { qid } = req.params;
  const quizUpdates = req.body;

  await dao.updateQuiz(qid, quizUpdates);
  const updatedQuiz = await dao.findQuizById(qid);

  res.json(updatedQuiz);
};

  app.put("/api/quizzes/:qid", updateQuiz);
  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:cid/quizzes", createQuizForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.post("/api/quizzes/:qid/publish", publishQuiz);
}
