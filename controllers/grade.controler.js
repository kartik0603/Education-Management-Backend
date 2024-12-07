const Grade = require("../models/grade.schema.js");
const Course = require("../models/course.schema.js");
const Submission = require("../models/submission.schema.js");

//  Assign Grade to a student
const assignGrade = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, studentId, courseId } = req.body;

    // grade Between 0 and 100
    if (grade < 0 || grade > 100) {
      return res
        .status(400)
        .json({ message: "Grade must be between 0 and 100" });
    }

   
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

 
    if (!course.students.includes(studentId)) {
      return res
        .status(403)
        .json({ message: "Student is not enrolled in this course" });
    }

   
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res
        .status(404)
        .json({ message: "Assignment submission not found" });
    }

   
    const newGrade = new Grade({
      student: studentId,
      course: courseId,
      assignment: submissionId,
      grade,
    });

    await newGrade.save();

    res.status(201).json({ message: "Grade assigned successfully", newGrade });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning grade", error: error.message });
  }
};

//  Get Grades for a student
const getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user.id })
      .populate("course", "title") 
      .populate("assignment", "assignment") 
      .sort("-createdAt"); 

    if (!grades.length) {
      return res
        .status(404)
        .json({ message: "No grades found for this student" });
    }

    res.status(200).json({ grades });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching grades", error: error.message });
  }
};

//  Get all grades for a course 
const getAllGradesForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    
    const course = await Course.findById(courseId).populate("teacher", "role");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = req.user;
    if (
      !(user.role === "Teacher" && user.id === course.teacher.id) &&
      user.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const grades = await Grade.find({ course: courseId })
      .populate("student", "name email") 
      .populate("assignment", "assignment") 
      .sort("-createdAt");

    if (!grades.length) {
      return res
        .status(404)
        .json({ message: "No grades found for this course" });
    }

    res.status(200).json({ grades });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching grades for the course",
        error: error.message,
      });
  }
};

//  Get course statistics 
const getCourseStatistics = async (req, res) => {
  try {
    const { courseId } = req.params;

    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

  
    const grades = await Grade.find({ course: courseId });

    // Calculate Average grade
    const totalGrades = grades.reduce((sum, grade) => sum + grade.grade, 0);
    const averageGrade = grades.length ? totalGrades / grades.length : 0;

    // number of Students enrolled in the course
    const numberOfStudents = course.students.length;

    res.status(200).json({
      course: course.title,
      averageGrade,
      numberOfStudents,
      gradesCount: grades.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating course statistics",
      error: error.message,
    });
  }
};

//  Get student grades details 
const getStudentGradesDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

   
    const course = await Course.findById(courseId).populate("teacher", "role");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = req.user;
    if (
      !(user.role === "Teacher" && user.id === course.teacher.id) &&
      user.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    
    const grades = await Grade.find({ course: courseId })
      .populate("student", "name email") 
      .populate("assignment", "assignment") 
      .sort("student");

    if (!grades.length) {
      return res
        .status(404)
        .json({ message: "No grades found for students in this course" });
    }

    // Group the Grades by student
    const studentGrades = grades.reduce((acc, grade) => {
      if (!acc[grade.student._id]) {
        acc[grade.student._id] = {
          student: grade.student,
          grades: [],
        };
      }
      acc[grade.student._id].grades.push({
        assignment: grade.assignment.assignment,
        grade: grade.grade,
      });

      return acc;
    }, {});

    res.status(200).json({ studentGrades });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching student grades details",
      error: error.message,
    });
  }
};

module.exports = {
  assignGrade,
  getGradesByStudent,
  getAllGradesForCourse,
  getCourseStatistics,
  getStudentGradesDetails,
};
