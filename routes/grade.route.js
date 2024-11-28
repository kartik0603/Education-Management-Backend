const express = require("express");

const gradeRouter = express.Router();

const protect = require("../middleware/auth.middleware.js");

const roleCheck = require("../middleware/roleCheck.middleware.js");

const {
  assignGrade,
  getGradesByStudent,
  getAllGradesForCourse,
  getCourseStatistics,
  getStudentGradesDetails,
} = require("../controllers/grade.controler.js");


gradeRouter.use(protect);

gradeRouter.post("/assign-grade/:submissionId", roleCheck("Teacher"), assignGrade);

gradeRouter.get("/grades-by-student", roleCheck("Student"), getGradesByStudent);

gradeRouter.get("/all-grades-for-course/:courseId", roleCheck("Teacher"), getAllGradesForCourse);

gradeRouter.get("/course-statistics/:courseId", roleCheck("Teacher"), getCourseStatistics);

gradeRouter.get("/student-grades-details/:courseId", roleCheck("Teacher"), getStudentGradesDetails);

module.exports = gradeRouter;
