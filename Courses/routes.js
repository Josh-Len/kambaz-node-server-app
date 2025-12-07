// Kambaz/Courses/routes.js
import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import PeopleDao from "../People/dao.js";

export default function CourseRoutes(app, db) {
  const coursesDao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const peopleDao = PeopleDao(db);

  // GET /api/courses
  const findAllCourses = async (req, res) => {
    const courses = await coursesDao.findAllCourses();
    res.send(courses);
  };

  // GET /api/users/:userId/courses  (my courses)
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.tabSession?.currentUser || req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  // POST /api/users/current/courses  (create a course as current user)
  const createCourse = async (req, res) => {
    try {
      const newCourse = await coursesDao.createCourse(req.body);
      const currentUser = req.tabSession?.currentUser || req.session["currentUser"];
      if (currentUser) {
        // Optional: auto-enroll creator in the new course
        await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
      }
      res.json(newCourse);
    } catch (err) {
      console.error("Error creating course:", err);
      res.status(500).json({ error: "Failed to create course" });
    }
  };

  // POST /api/users/:uid/courses/:cid   (explicitly enroll user in course)
  const enrollUserInCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;

      if (uid === "current") {
        const currentUser = req.tabSession?.currentUser || req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        uid = currentUser._id;
      }

      const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
      res.send(status);
    } catch (err) {
      console.error("Error enrolling user:", err);
      // If you hit duplicate key, it's because user is already enrolled
      if (err.code === 11000) {
        res.status(409).json({ error: "User already enrolled in this course" });
      } else {
        res.status(500).json({ error: "Failed to enroll user" });
      }
    }
  };

  // DELETE /api/users/:uid/courses/:cid   (unenroll user from course)
  const unenrollUserFromCourse = async (req, res) => {
    try {
      let { uid, cid } = req.params;

      if (uid === "current") {
        const currentUser = req.tabSession?.currentUser || req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        uid = currentUser._id;
      }

      const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
      res.send(status);
    } catch (err) {
      console.error("Error unenrolling user:", err);
      res.status(500).json({ error: "Failed to unenroll user" });
    }
  };

  // DELETE /api/courses/:courseId
  const deleteCourse = async (req, res) => {
    try {
      console.log("HIT deleteCourse with", req.params.courseId);
      const { courseId } = req.params;
      await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
      const status = await coursesDao.deleteCourse(courseId);
      res.send(status);
    } catch (err) {
      console.error("Error deleting course:", err);
      res.status(500).json({ error: "Failed to delete course" });
    }
  };

  // PUT /api/courses/:courseId
  const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const courseUpdates = req.body;
      const status = await coursesDao.updateCourse(courseId, courseUpdates);
      res.send(status);
    } catch (err) {
      console.error("Error updating course:", err);
      res.status(500).json({ error: "Failed to update course" });
    }
  };

  // GET /api/courses/:cid/people
  const findPeopleForCourse = (req, res) => {
    const { cid } = req.params;
    const enrolledUsers = peopleDao.findPeopleForCourse(cid);
    res.json(enrolledUsers);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  }
  app.get("/api/courses/:cid/users", findUsersForCourse);

  // Route bindings
  app.get("/api/courses/:cid/people", findPeopleForCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);

  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // New per assignment:
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

  app.get("/api/courses", findAllCourses);
}
