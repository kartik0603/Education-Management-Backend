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
  enrollInCourse,
  unenrollFromCourse
} = require("../controllers/course.controle.js");

// Apply 'protect' middleware to all routes
courseRouter.use(protect);

// Only allow users with "admin" role to create a course
courseRouter.post("/admin/course", roleCheck(["Admin"]), createCourse);

// Allow both "teacher" and "admin" roles to create a course
courseRouter.post("/create-course", roleCheck(["Teacher", "Admin"]), createCourse);

// Allow "Admin" or "Teacher" to update a course
courseRouter.put("/update-course/:courseId", roleCheck(["Admin", "Teacher"]), updateCourse);

// Allow "Admin", "Teacher", or "Student" to view all courses
courseRouter.get("/all-courses", roleCheck(["Admin", "Teacher", "Student"]), getAllCourses);

// Allow "Student" to view enrolled courses
courseRouter.get("/enrolled-courses", roleCheck(["Student"]), getEnrolledCourses);

// Only allow "Admin" or "Teacher" to delete a course
courseRouter.delete("/delete-course/:courseId", roleCheck(["Admin", "Teacher"]), deleteCourse);

// Allow "Student" to enroll in a course
courseRouter.post("/enroll/:courseId", roleCheck(["Student"]), enrollInCourse);

// Allow "Student" to unenroll from a course
courseRouter.post("/unenroll/:courseId", roleCheck(["Student"]), unenrollFromCourse);

module.exports = courseRouter;
