import EnrollmentsDao from "../Enrollments/dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  console.log("EnrollmentsRoutes loaded");

  // POST /api/users/:userId/courses/:courseId/enrollments
  const enrollUserInCourse = (req, res) => {
    let { userId, courseId } = req.params;

    // Support "current" like your other routes
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    dao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };

    const unenrollUserInCourse = (req, res) => {
    let { userId, courseId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    dao.unenrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };

  app.post("/api/users/:userId/courses/:courseId/enrollments", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId/enrollments",unenrollUserInCourse);
}
