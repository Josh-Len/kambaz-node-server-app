// Kambaz/Enrollments/dao.js
import model from "./model.js";

export default function EnrollmentsDao(db) {
  // Return all *course documents* a user is enrolled in
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  // Return all *user documents* enrolled in a course
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  // Create an enrollment linking user + course
  function enrollUserInCourse(userId, courseId) {
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`, // ensures one enrollment per user+course
    });
  }

  // Remove one enrollment
  function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  // Remove all enrollments for a course (used when deleting a course)
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}
