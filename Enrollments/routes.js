import EnrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  console.log("EnrollmentsRoutes loaded");

  const enrollUserInCourse = async (req, res) => {
    try {
      let { userId, courseId } = req.params;

      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }

      const enrollment = await dao.enrollUserInCourse(userId, courseId);
      res.status(200).json(enrollment);
    } catch (err) {
      console.error("Error enrolling user:", err);
      if (err.code === 11000) {
        // duplicate enrollment
        res.status(409).json({ error: "User already enrolled in this course" });
      } else {
        res.status(500).json({ error: "Failed to enroll user" });
      }
    }
  };

  const unenrollUserInCourse = async (req, res) => {
    try {
      let { userId, courseId } = req.params;

      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }

      const status = await dao.unenrollUserFromCourse(userId, courseId);
      res.status(200).json(status);
    } catch (err) {
      console.error("Error unenrolling user:", err);
      res.status(500).json({ error: "Failed to unenroll user" });
    }
  };

  
  app.post("/api/users/:userId/courses/:courseId/enrollments", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId/enrollments", unenrollUserInCourse);
}
