// Kanbas/Assignments/routes.js
import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db); // db is unused but kept for compatibility

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Error fetching assignments" });
    }
  };

  const createAssignmentForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = {
        ...req.body,
        course: courseId,
      };
      const newAssignment = await dao.createAssignment(assignment);
      res.status(201).send(newAssignment);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Error creating assignment" });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await dao.deleteAssignment(assignmentId);
      res.send(status);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Error deleting assignment" });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const updated = await dao.updateAssignment(assignmentId, assignmentUpdates);
      res.send(updated);
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Error updating assignment" });
    }
  };

  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
}
