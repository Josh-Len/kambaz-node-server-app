import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import PeopleDao from "../People/dao.js";

export default function CourseRoutes(app, db) {
  const coursesDao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const peopleDao = PeopleDao(db);

  // GET /api/courses
  const findAllCourses = (req, res) => {
    const courses = coursesDao.findAllCourses();
    res.send(courses);
  };

  // GET /api/users/:userId/courses
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const courses = coursesDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  // POST /api/users/current/courses
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const newCourse = coursesDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  // DELETE /api/courses/:courseId
  const deleteCourse = (req, res) => {
    console.log("HIT deleteCourse with", req.params.courseId);
    const { courseId } = req.params;
    const status = coursesDao.deleteCourse(courseId);
    res.send(status);
  };

  // PUT /api/courses/:courseId
  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = coursesDao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  // GET /api/courses/:cid/people
  const findPeopleForCourse = (req, res) => {
    const { cid } = req.params;
    const enrolledUsers = peopleDao.findPeopleForCourse(cid);
    res.json(enrolledUsers);
  };

  // Route bindings
  app.get("/api/courses/:cid/people", findPeopleForCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses", findAllCourses);
}
