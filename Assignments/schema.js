// Kanbas/Assignments/schema.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    // Let Mongo generate ObjectId by default; frontend just treats it as string
    title: { type: String, required: true },
    course: { type: String, required: true },

    description: { type: String },
    points: { type: Number, default: 100 },

    // keep dates as strings to match your UI formatting
    availableAt: { type: String },
    dueAt: { type: String },
  },
  {
    collection: "assignments",
    timestamps: true,
  }
);

export default assignmentSchema;
