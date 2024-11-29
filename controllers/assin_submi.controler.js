const Assignment = require("../models/assignment.schema.js");
const Submission = require("../models/submission.schema.js");
const Course = require("../models/course.schema.js");
const mongoose = require('mongoose');

// 1. Create an assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate } = req.body;
    const teacherId = req.user.id;

    // Validate input
    if (!title || !description || !courseId || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the course to make sure it's valid
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newAssignment = new Assignment({
      title,
      description,
      course: courseId,
      teacher: teacherId,
      dueDate,
    });

    await newAssignment.save();
    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating assignment", error: error.message });
  }
};

// 2. Update an assignment by a teacher
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate } = req.body;

    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Update the assignment
    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;

    await assignment.save();

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating assignment", error: error.message });
  }
};

// 3. Delete an assignment by a teacher


const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    console.log("Assignment ID:", assignmentId);  // Log assignmentId

    // Convert the assignmentId to ObjectId (if it's a valid string)
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID format" });
    }

    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    console.log("Assignment found:", assignment);  // Log assignment

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Delete the assignment
    await Assignment.findByIdAndDelete(assignmentId);

    res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error: error.message });
  }
};






// Controller to get all assignments by teacher

// Controller to get all assignments by teacher
const getAllAssignmentsByTeacher = async (req, res) => {
  console.log("User from middleware:", req.user);  // Log the entire user object to check
  const teacherId = req.user.id;
  // Get teacherId from the user object
  console.log("Teacher ID from user:", teacherId);  // Check if the teacherId exists
  
  try {
    const assignments = await Assignment.find({ teacher: teacherId })
      .populate('courseId', 'title')
      .exec();

    console.log("Assignments found:", assignments);
    
    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this teacher.' });
    }

    res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// 4. Teacher views all submissions from all students
const getAllSubmissions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    // Get all assignments for the course
    const assignments = await Assignment.find({
      course: courseId,
      teacher: teacherId,
    });
    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found for this course" });
    }

    // Get all submissions for the course
    const submissions = await Submission.find({ course: courseId })
      .populate("student", "name email")
      .populate("assignment", "title description");

    res.status(200).json({
      message: "All submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
};

// 5. Teacher views submissions for a specific student
const getStudentSubmissions = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    // console.log("Course ID passed:", courseId);
    // console.log("Student ID passed:", studentId);

    // Fetch the submissions
    const submissions = await Submission.find({
      course: courseId,
      student: studentId,
    }).populate("assignment", "title description");

    // console.log("Submissions found:", submissions); 

    if (!submissions.length) {
      return res.status(404).json({ message: "No submissions found for this student" });
    }

    res.status(200).json({
      message: "Student submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student submissions",
      error: error.message,
    });
  }
};








// 6. Student views their assignments for a course
const getStudentAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Get all assignments for the course
    const assignments = await Assignment.find({ course: courseId });
    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found for this course" });
    }

    res.status(200).json({
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
};

// 7. Student updates their submitted assignment
const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { assignmentId, grade, status } = req.body;
    const studentId = req.user.id;
    const userRole = req.user.role; 

    // Find the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Allow the student or teacher to update the submission
    if (submission.student.toString() !== studentId && userRole !== 'Teacher') {
      return res.status(403).json({ message: "You cannot update another student's submission" });
    }

    // Update the submission
    submission.grade = grade || submission.grade;
    submission.status = status || submission.status;
    await submission.save();

    res.status(200).json({
      message: "Submission updated successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating submission", error: error.message });
  }
};


// 8. Student deletes their assignment submission
const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const studentId = req.user.id;

    // Find the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Ensure the submission belongs to the authenticated student
    if (submission.student.toString() !== studentId) {
      return res.status(403).json({ message: "You cannot delete another student's submission" });
    }

    // Delete the submission
    await submission.remove();

    // Remove the submission from the assignment's submissions list
    const assignment = await Assignment.findById(submission.assignment);
    assignment.submissions = assignment.submissions.filter(
      (submissionId) => submissionId.toString() !== submissionId
    );
    await assignment.save();

    res.status(200).json({
      message: "Submission deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting submission", error: error.message });
  }
};

// 9. Teacher sets the due date for an assignment
const setDueDate = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { dueDate } = req.body;

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Update the due date
    assignment.dueDate = dueDate;
    await assignment.save();

    res.status(200).json({
      message: "Due date set successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error setting due date", error: error.message });
  }
};

// 10. Student submits an assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, courseId, assignmentContent } = req.body;
    const studentId = req.user.id;

    // Validate input
    if (!assignmentId || !courseId || !assignmentContent) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the course exists and if the student is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.students.includes(studentId)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Create a new submission
    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      course: courseId,
      content: assignmentContent,
      status: "Submitted",
    });

    await submission.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting assignment", error: error.message });
  }
};

module.exports = {
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
};
