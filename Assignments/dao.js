// Kanbas/Assignments/dao.js
import AssignmentModel from "./model.js";

// keep the db parameter for compatibility, but we don't use it anymore
export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    return AssignmentModel.find({ course: courseId });
  }

  async function createAssignment(assignment) {
    // assignment includes course, title, etc.
    const created = await AssignmentModel.create(assignment);
    return created;
  }

  async function deleteAssignment(assignmentId) {
    const result = await AssignmentModel.deleteOne({ _id: assignmentId });
    // Express doesn't really use the return, but let's return the result anyway
    return result;
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    const updated = await AssignmentModel.findByIdAndUpdate(
      assignmentId,
      { $set: assignmentUpdates },
      { new: true } // return updated document
    );
    return updated;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
