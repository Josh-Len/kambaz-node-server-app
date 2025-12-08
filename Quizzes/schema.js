import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionId: String,
    type: { type: String, enum: ["MC", "TF", "FIB"], required: true },
    title: String,
    points: { type: Number, default: 1 },
    text: String,

    choices: [String],
    correctChoiceIndex: Number,

    correctBoolean: Boolean,
    acceptableAnswers: [String],
  },
  { _id: false }
);


const quizSchema = new mongoose.Schema(
  {
    title: { type: String, default: "New Quiz" },
    courseId: { type: String, required: true }, // e.g. "RS101"
    description: String,
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    points: { type: Number, default: 0 },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimitMinutes: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "NEVER" },
    accessCode: String,
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    published: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { collection: "quizzes", timestamps: true }
);

export default quizSchema;
