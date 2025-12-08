import mongoose from "mongoose";

const quizAnswerSchema = new mongoose.Schema(
  {
    questionIndex: Number,
    selectedChoiceIndex: Number,  // MC
    selectedBoolean: Boolean,     // TF
    textAnswer: String,           // FIB
    isCorrect: Boolean,
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    attemptNumber: { type: Number, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    answers: [quizAnswerSchema],
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts", timestamps: true }
);

const QuizAttemptModel = mongoose.model("QuizAttemptModel", quizAttemptSchema);
export default QuizAttemptModel;
