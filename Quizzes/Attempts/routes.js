import QuizzesDao from "../dao.js";
import QuizAttemptModel from "./model.js";

export default function QuizAttemptsRoutes(app) {
  const quizzesDao = QuizzesDao();

  const requireStudent = (req, res, next) => {
    const user = req.session?.currentUser;
    if (!user || user.role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can take quizzes" });
    }
    req.user = user;
    next();
  };

  // GET: last attempt + attempts info
  app.get("/api/quizzes/:qid/my-attempt", requireStudent, async (req, res) => {
    const { qid } = req.params;
    const user = req.user;

    const quiz = await quizzesDao.findQuizById(qid);
    if (!quiz) return res.sendStatus(404);

    const lastAttempt = await QuizAttemptModel.findOne({
      quizId: qid,
      studentId: user._id,
    }).sort({ attemptNumber: -1 });

    const attemptsCount = await QuizAttemptModel.countDocuments({
      quizId: qid,
      studentId: user._id,
    });

    const multipleAttempts = quiz.multipleAttempts;
    const maxAttempts = quiz.maxAttempts || 1;
    const allowedAttempts = multipleAttempts ? maxAttempts : 1;

    res.json({
      lastAttempt,
      attemptsCount,
      multipleAttempts,
      maxAttempts: allowedAttempts,
      remainingAttempts: Math.max(0, allowedAttempts - attemptsCount),
    });
  });

  // POST: submit new attempt (grade + store)
  app.post("/api/quizzes/:qid/attempts", requireStudent, async (req, res) => {
    const { qid } = req.params;
    const user = req.user;
    const { answers = [] } = req.body;

    const quiz = await quizzesDao.findQuizById(qid);
    if (!quiz) return res.sendStatus(404);

    const attemptsCount = await QuizAttemptModel.countDocuments({
      quizId: qid,
      studentId: user._id,
    });

    const multipleAttempts = quiz.multipleAttempts;
    const maxAttempts = quiz.maxAttempts || 1;
    const allowedAttempts = multipleAttempts ? maxAttempts : 1;

    if (attemptsCount >= allowedAttempts) {
      return res.status(403).json({ message: "No attempts remaining for this quiz" });
    }

    const questions = quiz.questions || [];
    let score = 0;
    const maxScore = questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0
    );

    const gradedAnswers = questions.map((q, index) => {
      const ans = answers.find((a) => a.questionIndex === index) || {};
      let isCorrect = false;

      if (q.type === "MC") {
        if (typeof ans.selectedChoiceIndex === "number") {
          isCorrect = ans.selectedChoiceIndex === q.correctChoiceIndex;
        }
      } else if (q.type === "TF") {
        if (typeof ans.selectedBoolean === "boolean") {
          isCorrect = ans.selectedBoolean === q.correctBoolean;
        }
      } else if (q.type === "FIB") {
        const userText = (ans.textAnswer || "").trim().toLowerCase();
        if (userText && Array.isArray(q.acceptableAnswers)) {
          isCorrect = q.acceptableAnswers.some(
            (a) => a.trim().toLowerCase() === userText
          );
        }
      }

      if (isCorrect) {
        score += q.points || 0;
      }

      return {
        questionIndex: index,
        selectedChoiceIndex: ans.selectedChoiceIndex,
        selectedBoolean: ans.selectedBoolean,
        textAnswer: ans.textAnswer,
        isCorrect,
      };
    });

    const attemptDoc = await QuizAttemptModel.create({
      quizId: quiz._id,
      studentId: user._id,
      attemptNumber: attemptsCount + 1,
      score,
      maxScore,
      answers: gradedAnswers,
    });

    res.json({
      attempt: attemptDoc,
      remainingAttempts: allowedAttempts - (attemptsCount + 1),
    });
  });
}
