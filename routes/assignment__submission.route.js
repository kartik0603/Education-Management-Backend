const express = require("express");
const assignmentSubmissionRouter = express.Router();

const protect = require("../middleware/auth.middleware.js");

const roleCheck = require("../middleware/roleCheck.middleware.js");

const {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAllAssignmentsByTeacher,
    getAllSubmissions,
    getStudentSubmissions,
    getStudentAssignments,
    updateSubmission,
    deleteSubmission,
    setDueDate,
    submitAssignment,
  } =require("../controllers/assin_submi.controler.js");


assignmentSubmissionRouter.use(protect);


// Teacher routes for assignment management
assignmentSubmissionRouter.post("/assignments", roleCheck("Teacher"), createAssignment);
assignmentSubmissionRouter.put("/assignments/:assignmentId", roleCheck("Teacher"), updateAssignment);
assignmentSubmissionRouter.delete("/assignments/:assignmentId", roleCheck("Teacher"), deleteAssignment);
assignmentSubmissionRouter.put("/assignments/:assignmentId/due-date", roleCheck("Teacher"), setDueDate);
// / Assuming you have a role check middleware for the teacher
assignmentSubmissionRouter.get('/get-assignments-by-teacher/:teacherId/', roleCheck('Teacher'), getAllAssignmentsByTeacher);

// Teacher routes for viewing submissions
assignmentSubmissionRouter.get("/submissions", roleCheck("Teacher"), getAllSubmissions);
assignmentSubmissionRouter.get("/submissions/student/:courseId/:studentId", roleCheck("Teacher"), getStudentSubmissions);

// Student routes for assignment and submission
assignmentSubmissionRouter.get("/assignments/:courseId", roleCheck("Teacher", "Student"), getStudentAssignments);
assignmentSubmissionRouter.put("/update-submission/:submissionId", roleCheck("Teacher", "Student"), updateSubmission);
assignmentSubmissionRouter.delete("/submissions/:submissionId", roleCheck("Teacher", "Student"), deleteSubmission);
assignmentSubmissionRouter.post("/submit-assignment", roleCheck("Student"), submitAssignment);

module.exports = assignmentSubmissionRouter;