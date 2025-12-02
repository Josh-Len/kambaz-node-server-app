export default function PeopleDao(db) {
  const { users, enrollments } = db;

  function findPeopleForCourse(courseId) {
    return users.filter((usr) =>
      enrollments.some(
        (enr) => enr.user === usr._id && enr.course === courseId
      )
    );
  }

  return { findPeopleForCourse };
}