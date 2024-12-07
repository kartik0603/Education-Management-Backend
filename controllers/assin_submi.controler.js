const Assignment = require("../models/assignment.schema.js");
const Submission = require("../models/submission.schema.js");
const Course = require("../models/course.schema.js");
const mongoose = require('mongoose');

//  Create Assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate } = req.body;
    const teacherId = req.user.id;

    
    if (!title || !description || !courseId || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
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

//  Update assignment 
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description, dueDate } = req.body;

    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    
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

//  Delete  assignment 
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    // console.log("Assignment ID:", assignmentId); 

    // Convert  assignmentId to ObjectId 
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid assignment ID format" });
    }

    
    const assignment = await Assignment.findById(assignmentId);
    // console.log("Assignment found:", assignment);  

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    
    await Assignment.findByIdAndDelete(assignmentId);

    res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error: error.message });
  }
};








// get All assignments 
const getAllAssignmentsByTeacher = async (req, res) => {
  // console.log("User from middleware:", req.user);  
  const teacherId = req.user.id;
  
  console.log("Teacher ID from user:", teacherId);  
  
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



//   views all submissions from All Students
const getAllSubmissions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

  
    const assignments = await Assignment.find({
      course: courseId,
      teacher: teacherId,
    });
    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found for this course" });
    }

    
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

//  views submissions Specific Student
const getStudentSubmissions = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    // console.log("Course ID passed:", courseId);
    // console.log("Student ID passed:", studentId);


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








//  Student views their assignments for a course
const getStudentAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    
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

//  Student Update their submitted assignment
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


//  Student delete their submited Assignment
const deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const studentId = req.user.id;

  
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    
    if (submission.student.toString() !== studentId) {
      return res.status(403).json({ message: "You cannot delete another student's submission" });
    }

   
    await submission.remove();

    // Remove the submission from the Assignment's Submitted List
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

//   sets the due date
const setDueDate = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { dueDate } = req.body;


    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

   
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

// 10. Student submits  Assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, courseId, assignmentContent } = req.body;
    const studentId = req.user.id;


    if (!assignmentId || !courseId || !assignmentContent) {
      return res.status(400).json({ message: "All fields are required" });
    }

   
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.students.includes(studentId)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

   
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    
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
