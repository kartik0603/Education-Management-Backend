const express = require("express");
const courseRouter = express.Router();

const protect = require("../middleware/auth.middleware.js");
const roleCheck = require("../middleware/roleCheck.middleware.js");

const {
  createCourse,
  updateCourse,
  getAllCourses,
  getEnrolledCourses,
  deleteCourse,
} = require("../controllers/course.controle.js");

courseRouter.use(protect);

// Route to create a course (Admin or Teacher)
courseRouter.post("/create-course", roleCheck("Admin", "Teacher"), createCourse);

// Route to update a course (Admin or Teacher)
courseRouter.put("/update-course/:courseId", roleCheck("Admin", "Teacher"), updateCourse);

// Route to get all courses (Admin, Teacher, or Student)
courseRouter.get("/all-courses", roleCheck("Admin", "Teacher", "Student"), getAllCourses);

// Route to get enrolled courses for the student
courseRouter.get("/enrolled-courses", roleCheck("Student"), getEnrolledCourses);

// Route to delete a course (Admin or Teacher)
courseRouter.delete("/delete-course/:courseId", roleCheck("Admin", "Teacher"), deleteCourse);

// Route to enroll in a course (Student only)
courseRouter.post("/enroll/:courseId", roleCheck("Student"), enrollInCourse);

// Route to unenroll from a course (Student only)
courseRouter.post("/unenroll/:courseId", roleCheck("Student"), unenrollFromCourse);

module.exports = courseRouter;
