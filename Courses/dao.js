// Kambaz/Courses/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  // List all courses (name + description only)
  function findAllCourses() {
    return model.find({}, { name: 1, description: 1, image: 1 });
  }

  // Create a new course with a UUID _id
  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }

  // Delete a course
  function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
  }

  // Update a course
  function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
